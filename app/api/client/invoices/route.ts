import { json, prisma, requireRole } from "@/lib/api";
import { listLocal } from "@/lib/local-store";
export async function GET(){const auth=await requireRole("CLIENT"); if('error'in auth) return auth.error; try { return json(await prisma.invoice.findMany({where:{clientId:(auth.user as any).clientId}})); } catch { return json({ data:listLocal("invoices").filter((row:any)=>row.clientId===(auth.user as any).clientId && !row.deletedAt), mode:"local-json" }); }}
