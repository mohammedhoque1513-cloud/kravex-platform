import { crud, prisma } from "@/lib/api";
const h=crud(prisma.lead, "ADMIN", "leads"); export const GET=h.GET; export const POST=h.POST;
