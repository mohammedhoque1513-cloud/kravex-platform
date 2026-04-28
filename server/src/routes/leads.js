import express from "express";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { monthRange } from "../utils/format.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const clientId = reqIsAdmin(req) ? req.query.clientId : req.user.clientId;
  const leads = await prisma.lead.findMany({
    where: { ...(clientId ? { clientId } : {}) },
    include: { client: true },
    orderBy: { deliveredAt: "desc" }
  });
  res.json(leads);
});

router.post("/", requireRole("ADMIN"), async (req, res) => {
  const lead = await prisma.lead.create({ data: { ...req.body, deliveredAt: new Date(req.body.deliveredAt || Date.now()) } });
  res.status(201).json(lead);
});

router.put("/:id", async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  if (!reqIsAdmin(req) && req.user.clientId !== lead.clientId) return res.status(403).json({ message: "Forbidden" });
  const updated = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.get("/client/:clientId/summary", async (req, res) => {
  if (!reqIsAdmin(req) && req.user.clientId !== req.params.clientId) return res.status(403).json({ message: "Forbidden" });
  const { start, end } = monthRange();
  const client = await prisma.client.findUnique({ where: { id: req.params.clientId } });
  const leads = await prisma.lead.findMany({ where: { clientId: req.params.clientId, deliveredAt: { gte: start, lt: end } } });
  const quality = leads.reduce((acc, lead) => ({ ...acc, [lead.quality]: (acc[lead.quality] || 0) + 1 }), {});
  res.json({ delivered: leads.length, target: client?.leadTarget || 0, quality });
});

router.get("/client/:clientId/export.csv", async (req, res) => {
  if (!reqIsAdmin(req) && req.user.clientId !== req.params.clientId) return res.status(403).json({ message: "Forbidden" });
  const leads = await prisma.lead.findMany({ where: { clientId: req.params.clientId }, orderBy: { deliveredAt: "desc" } });
  const rows = [
    ["Lead Name", "Business", "Email", "Phone", "Source", "Quality", "Status", "Delivered", "Notes"],
    ...leads.map((lead) => [lead.leadName, lead.businessName, lead.email, lead.phone || "", lead.source, lead.quality, lead.status, lead.deliveredAt.toLocaleDateString("en-GB"), lead.notes || ""])
  ];
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.send(rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"));
});

export default router;
