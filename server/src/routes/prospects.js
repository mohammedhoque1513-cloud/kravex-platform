import express from "express";
import { requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();
router.use(requireRole("ADMIN"));

router.get("/", async (req, res) => {
  const { niche = "", stage = "", location = "" } = req.query;
  const prospects = await prisma.prospect.findMany({
    where: { ...(niche ? { niche } : {}), ...(stage ? { stage } : {}), ...(location ? { location: { contains: location, mode: "insensitive" } } : {}) },
    include: { activities: { orderBy: { createdAt: "desc" } }, campaigns: { include: { campaign: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(prospects);
});

router.post("/", async (req, res) => {
  const prospect = await prisma.prospect.create({ data: { ...req.body, estimatedValue: Number(req.body.estimatedValue || 0) } });
  res.status(201).json(prospect);
});

router.put("/:id", async (req, res) => {
  const prospect = await prisma.prospect.update({ where: { id: req.params.id }, data: { ...req.body, estimatedValue: req.body.estimatedValue ? Number(req.body.estimatedValue) : undefined } });
  res.json(prospect);
});

router.post("/:id/activities", async (req, res) => {
  const activity = await prisma.prospectActivity.create({ data: { prospectId: req.params.id, type: req.body.type || "NOTE", note: req.body.note } });
  res.status(201).json(activity);
});

router.post("/:id/convert", async (req, res) => {
  const prospect = await prisma.prospect.findUnique({ where: { id: req.params.id } });
  if (!prospect) return res.status(404).json({ message: "Prospect not found" });
  const client = await prisma.client.create({
    data: {
      businessName: prospect.businessName,
      contactName: prospect.contactName,
      email: prospect.email,
      phone: prospect.phone,
      niche: prospect.niche,
      location: prospect.location,
      website: prospect.website,
      retainerAmount: Number(req.body.retainerAmount || prospect.estimatedValue),
      leadTarget: Number(req.body.leadTarget || 20),
      status: "ACTIVE",
      contractStart: new Date()
    }
  });
  await prisma.prospect.update({ where: { id: req.params.id }, data: { stage: "CLOSED_WON" } });
  res.status(201).json(client);
});

export default router;
