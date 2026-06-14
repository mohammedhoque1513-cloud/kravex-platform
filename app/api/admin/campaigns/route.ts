import { crud, prisma } from "@/lib/api";
const h=crud(prisma.campaign, "ADMIN", "campaigns"); export const GET=h.GET; export const POST=h.POST;
