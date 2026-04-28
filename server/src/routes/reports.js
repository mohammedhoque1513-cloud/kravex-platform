import express from "express";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { monthRange } from "../utils/format.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

router.get("/client/:clientId", async (req, res) => {
  if (!reqIsAdmin(req) && req.user.clientId !== req.params.clientId) return res.status(403).json({ message: "Forbidden" });
  const { start, end } = monthRange(req.query.month ? new Date(req.query.month) : new Date());
  const [client, leads, invoices] = await Promise.all([
    prisma.client.findUnique({ where: { id: req.params.clientId } }),
    prisma.lead.findMany({ where: { clientId: req.params.clientId, deliveredAt: { gte: start, lt: end } } }),
    prisma.invoice.findMany({ where: { clientId: req.params.clientId, invoiceDate: { gte: start, lt: end } } })
  ]);
  const qualitySplit = leads.reduce((acc, lead) => ({ ...acc, [lead.quality]: (acc[lead.quality] || 0) + 1 }), {});
  const statusSummary = leads.reduce((acc, lead) => ({ ...acc, [lead.status]: (acc[lead.status] || 0) + 1 }), {});
  res.json({
    client,
    leadsDelivered: leads.length,
    qualitySplit,
    statusSummary,
    revenueBilled: invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0)
  });
});

router.get("/agency", requireRole("ADMIN"), async (_req, res) => {
  const { start, end } = monthRange();
  const [clients, leads, invoices, campaigns] = await Promise.all([
    prisma.client.findMany(),
    prisma.lead.findMany({ where: { deliveredAt: { gte: start, lt: end } } }),
    prisma.invoice.findMany({ where: { invoiceDate: { gte: start, lt: end } }, include: { client: true } }),
    prisma.campaign.findMany({ orderBy: [{ callsBooked: "desc" }, { positiveReplies: "desc" }], take: 5 })
  ]);
  const activeClients = clients.filter((client) => client.status === "ACTIVE");
  const statusSummary = clients.reduce((acc, client) => ({ ...acc, [client.status]: (acc[client.status] || 0) + 1 }), {});
  res.json({
    totalMrr: activeClients.reduce((sum, client) => sum + Number(client.retainerAmount), 0),
    totalLeadsDelivered: leads.length,
    topCampaigns: campaigns,
    clientStatusSummary: statusSummary,
    revenueBilled: invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0)
  });
});

export default router;
