import { crud, prisma } from "@/lib/api";
const h=crud(prisma.payment, "ADMIN", "payments"); export const GET=h.GET; export const POST=h.POST;
