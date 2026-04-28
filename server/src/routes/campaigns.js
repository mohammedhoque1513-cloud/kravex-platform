import express from "express";
import { requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();
router.use(requireRole("ADMIN"));

router.get("/", async (_req, res) => {
  const campaigns = await prisma.campaign.findMany({
    include: { client: true, prospects: { include: { prospect: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(campaigns);
});

router.post("/", async (req, res) => {
  const { prospectIds = [], ...data } = req.body;
  const campaign = await prisma.campaign.create({
    data: {
      ...data,
      prospectsCount: Number(data.prospectsCount || prospectIds.length || 0),
      emailsSent: Number(data.emailsSent || 0),
      openRate: Number(data.openRate || 0),
      replyRate: Number(data.replyRate || 0),
      positiveReplies: Number(data.positiveReplies || 0),
      callsBooked: Number(data.callsBooked || 0),
      prospects: { create: prospectIds.map((prospectId) => ({ prospectId })) }
    },
    include: { prospects: true }
  });
  res.status(201).json(campaign);
});

router.get("/:id", async (req, res) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { client: true, prospects: { include: { prospect: true } } } });
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json(campaign);
});

router.put("/:id", async (req, res) => {
  const { prospectIds, ...data } = req.body;
  const campaign = await prisma.campaign.update({
    where: { id: req.params.id },
    data: {
      ...data,
      prospectsCount: data.prospectsCount === undefined ? undefined : Number(data.prospectsCount),
      emailsSent: data.emailsSent === undefined ? undefined : Number(data.emailsSent),
      openRate: data.openRate === undefined ? undefined : Number(data.openRate),
      replyRate: data.replyRate === undefined ? undefined : Number(data.replyRate),
      positiveReplies: data.positiveReplies === undefined ? undefined : Number(data.positiveReplies),
      callsBooked: data.callsBooked === undefined ? undefined : Number(data.callsBooked)
    }
  });
  if (Array.isArray(prospectIds)) {
    await prisma.campaignProspect.deleteMany({ where: { campaignId: req.params.id } });
    await prisma.campaignProspect.createMany({ data: prospectIds.map((prospectId) => ({ campaignId: req.params.id, prospectId })), skipDuplicates: true });
  }
  res.json(campaign);
});

export default router;
