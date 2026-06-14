import { json, prisma, requireRole } from "@/lib/api";

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const vaults = await prisma.moneyVault.findMany({
    orderBy: { name: "asc" },
  });

  return json({ data: vaults });
}
