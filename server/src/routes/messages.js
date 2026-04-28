import express from "express";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const clientId = reqIsAdmin(req) ? req.query.clientId : req.user.clientId;
  const messages = await prisma.message.findMany({
    where: { ...(clientId ? { clientId } : {}) },
    include: { creator: { select: { name: true } }, client: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(messages);
});

router.post("/", requireRole("ADMIN"), async (req, res) => {
  const message = await prisma.message.create({ data: { clientId: req.body.clientId, content: req.body.content, createdBy: req.user.id } });
  res.status(201).json(message);
});

export default router;
