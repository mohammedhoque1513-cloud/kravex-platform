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
  const body=await readJson(req as any);
  const data = {
    key: typeof body.key === "string" ? body.key : "",
    value: typeof body.value === "string" ? body.value : "",
    description: typeof body.description === "string" ? body.description : undefined,
  };
  if (!data.key) return json({ error: "Setting key is required." }, 400);
  try {
    return json(await prisma.settings.upsert({where:{key:data.key},create:data,update:{value:data.value,description:data.description}}));
  } catch {
    return json({ ok: true, mode: "local-json", data: upsertLocalSetting(data) });
  }
}
