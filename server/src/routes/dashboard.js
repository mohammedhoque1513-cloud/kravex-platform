import express from "express";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { monthRange } from "../utils/format.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();
router.use(requireRole("ADMIN"));

router.get("/", async (_req, res) => {
  const { start, end } = monthRange();
  const [activeClients, prospectsInPipeline, leadsThisMonth, campaigns, upcomingInvoices, clients, invoices] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.prospect.count({ where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
    prisma.lead.count({ where: { deliveredAt: { gte: start, lt: end } } }),
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.invoice.findMany({ where: { status: { in: ["SENT", "OVERDUE"] } }, include: { client: true }, orderBy: { dueDate: "asc" }, take: 6 }),
    prisma.client.findMany({ where: { status: "ACTIVE" }, select: { retainerAmount: true, createdAt: true } }),
    prisma.invoice.findMany({ where: { invoiceDate: { gte: new Date(start.getFullYear(), 0, 1) } } })
  ]);

  const mrr = clients.reduce((sum, client) => sum + Number(client.retainerAmount), 0);
  const chartMonths = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const label = date.toLocaleString("en-GB", { month: "short" });
    return {
      label,
      revenue: invoices.filter((invoice) => invoice.invoiceDate.getMonth() === date.getMonth()).reduce((sum, invoice) => sum + Number(invoice.total), 0)
    };
  });

  const leadChart = await Promise.all(chartMonths.map(async (month, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const range = monthRange(date);
    return { label: month.label, leads: await prisma.lead.count({ where: { deliveredAt: { gte: range.start, lt: range.end } } }) };
  }));

  const openRate = campaigns.length ? campaigns.reduce((sum, item) => sum + Number(item.openRate), 0) / campaigns.length : 0;
  const replyRate = campaigns.length ? campaigns.reduce((sum, item) => sum + Number(item.replyRate), 0) / campaigns.length : 0;

  res.json({
    stats: { activeClients, mrr, leadsThisMonth, prospectsInPipeline },
    upcomingInvoices,
    campaignHealth: { openRate, replyRate, activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length },
    revenueChart: chartMonths,
    leadChart
  });
});

export default router;
