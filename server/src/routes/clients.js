import express from "express";
import bcrypt from "bcryptjs";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!reqIsAdmin(req)) {
    const client = await prisma.client.findUnique({ where: { id: req.user.clientId }, include: { leads: true, invoices: true, messages: true } });
    return res.json(client ? [client] : []);
  }
  const { search = "", status = "", niche = "" } = req.query;
  const clients = await prisma.client.findMany({
    where: {
      businessName: { contains: search, mode: "insensitive" },
      ...(status ? { status } : {}),
      ...(niche ? { niche } : {})
    },
    include: { users: { select: { id: true, name: true, email: true, role: true } }, campaigns: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(clients);
});

router.post("/", requireRole("ADMIN"), async (req, res) => {
  const { portalPassword, ...data } = req.body;
  const client = await prisma.client.create({ data: { ...data, retainerAmount: Number(data.retainerAmount), contractStart: new Date(data.contractStart) } });
  if (portalPassword) {
    await prisma.user.create({
      data: {
        name: data.contactName,
        email: data.email,
        role: "CLIENT",
        clientId: client.id,
        passwordHash: await bcrypt.hash(portalPassword, 12)
      }
    });
  }
  res.status(201).json(client);
});

router.get("/:id", async (req, res) => {
  if (!reqIsAdmin(req) && req.user.clientId !== req.params.id) return res.status(403).json({ message: "Forbidden" });
  const client = await prisma.client.findUnique({
    where: { id: req.params.id },
    include: { leads: { orderBy: { deliveredAt: "desc" } }, invoices: { orderBy: { dueDate: "desc" } }, messages: { orderBy: { createdAt: "desc" } }, campaigns: true, users: true }
  });
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
});

router.put("/:id", requireRole("ADMIN"), async (req, res) => {
  const data = { ...req.body };
  if (data.retainerAmount) data.retainerAmount = Number(data.retainerAmount);
  if (data.contractStart) data.contractStart = new Date(data.contractStart);
  delete data.users;
  delete data.leads;
  delete data.invoices;
  const client = await prisma.client.update({ where: { id: req.params.id }, data });
  res.json(client);
});

router.post("/:id/archive", requireRole("ADMIN"), async (req, res) => {
  const client = await prisma.client.update({ where: { id: req.params.id }, data: { status: "ARCHIVED" } });
  res.json(client);
});

export default router;
