import { json, prisma, requireRole } from "@/lib/api";
import { listLocal } from "@/lib/local-store";
import { allowLocalFallback, productionDbError } from "@/lib/production";

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const events = await prisma.securityEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return json({ data: events, mode: "postgres" });
  } catch {
    if (!allowLocalFallback()) return productionDbError();
    return json({ data: listLocal("securityEvents").slice(-100).reverse(), mode: "local-json" });
  }
}
