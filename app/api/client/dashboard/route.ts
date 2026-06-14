import { json, prisma, requireRole } from "@/lib/api";
import { listLocal } from "@/lib/local-store";
export async function GET(){
  const auth=await requireRole("CLIENT");
  if('error'in auth) return auth.error;
  const clientId=(auth.user as any).clientId;
  try {
    return json({leads:await prisma.lead.findMany({where:{clientId},take:5}),invoices:await prisma.invoice.findMany({where:{clientId},take:3}),messages:await prisma.message.findMany({where:{clientId},take:3,orderBy:{createdAt:"desc"}}), mode:"postgres"});
  } catch {
    return json({ leads:listLocal("leads").filter((row:any)=>row.clientId===clientId).slice(0,5), invoices:listLocal("invoices").filter((row:any)=>row.clientId===clientId).slice(0,3), messages:listLocal("messages").filter((row:any)=>row.clientId===clientId).slice(0,3), mode:"local-json" });
  }
}
