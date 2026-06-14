import { crud, prisma } from "@/lib/api";
const h=crud(prisma.payment, "ADMIN", "payments"); export const GET=h.GET; export const PUT=h.PUT; export const DELETE=h.DELETE;
