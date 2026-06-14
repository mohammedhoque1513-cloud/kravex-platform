import { NextRequest } from "next/server";
import { json, prisma, readJson, requireRole } from "@/lib/api";
import { stripe } from "@/lib/stripe";
import { requiresConfigured } from "@/lib/production";

export async function POST(req: NextRequest) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const body = await readJson(req);
  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount <= 0) return json({ error: "Enter a withdrawal amount in pence." }, 400);
  if (process.env.OWNER_WITHDRAWALS_ENABLED !== "true") {
    return json({ error: "Owner withdrawals are disabled. Enable OWNER_WITHDRAWALS_ENABLED only after bank verification and accountant approval." }, 403);
  }
  if (!requiresConfigured("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY)) {
    return json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY before requesting payouts." }, 503);
  }

  const ownerVault = await prisma.moneyVault.findUnique({ where: { key: "owner" } });
  if (!ownerVault) return json({ error: "Owner Pay vault has not been created yet." }, 400);
  if (ownerVault.balance < amount) return json({ error: "Owner Pay vault does not have enough available balance." }, 400);
  const pendingReconciliation = await prisma.reconciliationRun.findFirst({ where: { status: "FAILED" }, orderBy: { createdAt: "desc" } });
  if (pendingReconciliation) return json({ error: "Resolve failed reconciliation before requesting an owner withdrawal." }, 409);

  const payout = await stripe.payouts.create({
    amount,
    currency: "gbp",
    metadata: {
      vault: "owner",
      requestedBy: auth.user.email || "admin",
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    await tx.moneyVault.update({
      where: { key: "owner" },
      data: { balance: { decrement: amount } },
    });
    return tx.moneyLedgerEntry.create({
      data: {
        vaultKey: "owner",
        type: "OWNER_WITHDRAWAL_REQUEST",
        amount,
        status: "PENDING",
        reference: payout.id,
        notes: "Owner payout requested to verified bank account.",
      },
    });
  });

  return json({ ok: true, payoutId: payout.id, ledgerEntry: result });
}
