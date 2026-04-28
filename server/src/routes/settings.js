import express from "express";
import bcrypt from "bcryptjs";
import { requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();
router.use(requireRole("ADMIN"));

router.get("/", async (_req, res) => {
  const [agency, niches, templates, admins] = await Promise.all([
    prisma.agencySetting.findFirst(),
    prisma.niche.findMany({ orderBy: { name: "asc" } }),
    prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, name: true, email: true, createdAt: true } })
  ]);
  res.json({ agency, niches, templates, admins });
});

router.put("/agency", async (req, res) => {
  const existing = await prisma.agencySetting.findFirst();
  const agency = existing
    ? await prisma.agencySetting.update({ where: { id: existing.id }, data: req.body })
    : await prisma.agencySetting.create({ data: req.body });
  res.json(agency);
});

router.post("/admins", async (req, res) => {
  const admin = await prisma.user.create({
    data: { name: req.body.name, email: req.body.email, role: "ADMIN", passwordHash: await bcrypt.hash(req.body.password, 12) },
    select: { id: true, name: true, email: true, role: true }
  });
  res.status(201).json(admin);
});

router.post("/niches", async (req, res) => {
  const niche = await prisma.niche.create({ data: { name: req.body.name } });
  res.status(201).json(niche);
});

router.put("/niches/:id", async (req, res) => {
  const niche = await prisma.niche.update({ where: { id: req.params.id }, data: { name: req.body.name } });
  res.json(niche);
});

router.delete("/niches/:id", async (req, res) => {
  await prisma.niche.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

router.post("/email-templates", async (req, res) => {
  const template = await prisma.emailTemplate.create({ data: req.body });
  res.status(201).json(template);
});

router.put("/email-templates/:id", async (req, res) => {
  const template = await prisma.emailTemplate.update({ where: { id: req.params.id }, data: req.body });
  res.json(template);
});

router.delete("/email-templates/:id", async (req, res) => {
  await prisma.emailTemplate.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
