import { json, prisma, requireRole } from "@/lib/api";
import { ensureMoneyVaults } from "@/lib/money";
import { localPaymentOverview } from "@/lib/local-store";

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    await ensureMoneyVaults();

    const [invoices, payments, vaults, ledgerEntries] = await Promise.all([
      prisma.invoice.findMany({ where: { deletedAt: null } }),
      prisma.payment.findMany({ orderBy: { paymentDate: "desc" }, take: 50, include: { client: true, invoice: true } }),
      prisma.moneyVault.findMany({ orderBy: { name: "asc" } }),
      prisma.moneyLedgerEntry.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    ]);

    const now = new Date();
    const collectedThisMonth = payments
      .filter((payment) => payment.paymentDate.getMonth() === now.getMonth() && payment.paymentDate.getFullYear() === now.getFullYear())
      .reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = invoices.filter((invoice) => invoice.status !== "PAID" && invoice.status !== "CANCELLED").reduce((sum, invoice) => sum + invoice.total, 0);
    const overdue = invoices
      .filter((invoice) => invoice.status !== "PAID" && invoice.status !== "CANCELLED" && invoice.dueDate < now)
      .reduce((sum, invoice) => sum + invoice.total, 0);

    return json({
      collectedThisMonth,
      outstanding,
      overdue,
      expectedMrr: 0,
      payments,
      vaults,
      ledgerEntries,
      mode: "postgres",
    });
  } catch {
    return json(localPaymentOverview());
  }
}
