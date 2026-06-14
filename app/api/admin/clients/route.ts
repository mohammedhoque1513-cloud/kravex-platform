import { crud, prisma } from "@/lib/api";
const h=crud(prisma.client, "ADMIN", "clients"); export const GET=h.GET; export const POST=h.POST;
