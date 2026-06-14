import { json, prisma, requireRole } from "@/lib/api";
import { listLocal } from "@/lib/local-store";
export async function GET(){const auth=await requireRole("CLIENT"); if('error'in auth) return auth.error; try { return json(await prisma.lead.findMany({where:{clientId:(auth.user as any).clientId,deletedAt:null}})); } catch { return json({ data:listLocal("leads").filter((row:any)=>row.clientId===(auth.user as any).clientId && !row.deletedAt), mode:"local-json" }); }}
