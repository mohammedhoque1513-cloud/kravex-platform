import { json, prisma, readJson, requireRole } from "@/lib/api";
import { listLocal, upsertLocalSetting } from "@/lib/local-store";

export async function GET(){
  const auth=await requireRole("ADMIN");
  if('error'in auth) return auth.error;
  try {
    return json(await prisma.settings.findMany());
  } catch {
    return json({ data: listLocal("settings"), mode: "local-json" });
  }
}

export async function PUT(req:Request){
  const auth=await requireRole("ADMIN");
  if('error'in auth) return auth.error;
  const b=await readJson(req as any);
  try {
    return json(await prisma.settings.upsert({where:{key:b.key},create:b,update:{value:b.value,description:b.description}}));
  } catch {
    return json({ ok: true, mode: "local-json", data: upsertLocalSetting(b) });
  }
}
