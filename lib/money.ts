import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";

export const VAULT_POLICY = [
  { key: "tax", name: "Tax Reserve", percentage: 30, isOwnerPay: false, description: "HMRC/VAT/corporation-tax reserve. Locked away from owner withdrawals." },
  { key: "insurance", name: "Insurance", percentage: 5, isOwnerPay: false, description: "Professional indemnity, cyber, public liability and related cover." },
  { key: "ops", name: "Operations", percentage: 20, isOwnerPay: false, description: "Software, ads, contractors, tools and fulfilment costs." },
  { key: "growth", name: "Growth", percentage: 10, isOwnerPay: false, description: "Cash buffer, reinvestment and slow-month protection." },
  { key: "owner", name: "Owner Pay", percentage: 35, isOwnerPay: true, description: "Emdadul's available pay after reserves have been allocated." },
] as const;

type Tx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export function allocateVaultAmounts(amount: number) {
  const allocations = VAULT_POLICY.map((vault) => ({
    ...vault,
    amount: Math.floor((amount * vault.percentage) / 100),
  }));
  const allocated = allocations.reduce((sum, vault) => sum + vault.amount, 0);
  const remainder = amount - allocated;
  const owner = allocations.find((vault) => vault.key === "owner");
  if (owner) owner.amount += remainder;
  return allocations;
}

export async function ensureMoneyVaults(client: Tx = prisma) {
  for (const vault of VAULT_POLICY) {
    await client.moneyVault.upsert({
      where: { key: vault.key },
      create: {
        key: vault.key,
        name: vault.name,
        percentage: vault.percentage,
        description: vault.description,
        isOwnerPay: vault.isOwnerPay,
      },
      update: {
        name: vault.name,
        percentage: vault.percentage,
        description: vault.description,
        isOwnerPay: vault.isOwnerPay,
      },
    });
  }
}

export async function recordClearedInvoicePayment(input: {
  invoiceId: string;
  stripePaymentIntentId: string;
  amount: number;
  reference?: string;
}) {
  return prisma.$transaction(async (tx) => {
    await ensureMoneyVaults(tx);

    const existing = await tx.payment.findFirst({ where: { stripeId: input.stripePaymentIntentId } });
    if (existing) return { payment: existing, alreadyProcessed: true };

    const invoice = await tx.invoice.findUnique({
      where: { id: input.invoiceId },
      include: { client: true },
    });
    if (!invoice) throw new Error("Invoice not found for Stripe payment.");
    if (invoice.total !== input.amount) throw new Error("Payment amount does not match invoice total.");

    const payment = await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        amount: input.amount,
        paymentDate: new Date(),
        paymentMethod: "CARD",
        stripeId: input.stripePaymentIntentId,
        reference: input.reference,
        notes: "Recorded automatically by Stripe webhook.",
      },
    });

    await tx.invoice.update({
      where: { id: invoice.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    await tx.moneyLedgerEntry.create({
      data: {
        paymentId: payment.id,
        invoiceId: invoice.id,
        type: "PAYMENT_RECEIVED",
        amount: input.amount,
        status: "AVAILABLE",
        reference: input.stripePaymentIntentId,
        notes: `Client payment received for ${invoice.invoiceNumber}.`,
        clearedAt: new Date(),
      },
    });

    const allocations = allocateVaultAmounts(input.amount);
    for (const allocation of allocations) {
      await tx.moneyVault.update({
        where: { key: allocation.key },
        data: { balance: { increment: allocation.amount } },
      });
      await tx.moneyLedgerEntry.create({
        data: {
          paymentId: payment.id,
          invoiceId: invoice.id,
          vaultKey: allocation.key,
          type: "VAULT_ALLOCATION",
          amount: allocation.amount,
          status: "AVAILABLE",
          reference: input.stripePaymentIntentId,
          notes: `${allocation.percentage}% allocated to ${allocation.name}.`,
          clearedAt: new Date(),
        },
      });
    }

    return { payment, invoice, allocations, alreadyProcessed: false };
  });
}

export async function reconcileMoneyVaults() {
  return prisma.$transaction(async (tx) => {
    await ensureMoneyVaults(tx);
    const vaults = await tx.moneyVault.findMany({ orderBy: { name: "asc" } });
    const rows = [];
    for (const vault of vaults) {
      const aggregate = await tx.moneyLedgerEntry.aggregate({
        where: { vaultKey: vault.key, status: "AVAILABLE", type: "VAULT_ALLOCATION" },
        _sum: { amount: true },
      });
      const ledgerBalance = aggregate._sum.amount || 0;
      const difference = ledgerBalance - vault.balance;
      if (difference !== 0) {
        await tx.moneyVault.update({ where: { key: vault.key }, data: { balance: ledgerBalance } });
        await tx.moneyLedgerEntry.create({
          data: {
            vaultKey: vault.key,
            type: "ADJUSTMENT",
            amount: difference,
            status: "AVAILABLE",
            reference: `reconcile-${new Date().toISOString()}`,
            notes: "Automatic reconciliation adjustment.",
            clearedAt: new Date(),
          },
        });
      }
      rows.push({ vault: vault.key, previousBalance: vault.balance, ledgerBalance, difference });
    }
    return rows;
  });
}
