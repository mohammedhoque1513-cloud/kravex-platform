import { crud, prisma } from "@/lib/api";
const h=crud(prisma.prospect, "ADMIN", "prospects"); export const GET=h.GET; export const POST=h.POST;
