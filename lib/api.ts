import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { appendLocal, listLocal, softDeleteLocal, updateLocal } from "@/lib/local-store";
import { allowLocalFallback, productionDbError } from "@/lib/production";
export function json(data: unknown, status = 200) { return NextResponse.json(data, { status }); }
export async function requireRole(role: "ADMIN" | "CLIENT") { const session = await getServerSession(authOptions); const user = session?.user as any; if (!user) return { error: json({ error: "Please sign in to continue." }, 401) }; if (user.role !== role) return { error: json({ error: "You do not have permission to do that." }, 403) }; return { session, user }; }
function cleanInput(value: unknown, depth = 0): unknown {
  if (depth > 8) return undefined;
  if (typeof value === "string") return value.replace(/\u0000/g, "").trim().slice(0, 5000);
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => cleanInput(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !["__proto__", "prototype", "constructor"].includes(key))
      .map(([key, item]) => [key, cleanInput(item, depth + 1)]));
  }
  return value;
}
export async function readJson(req: NextRequest) {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > 1024 * 1024) return {};
  try { return cleanInput(await req.json()) as Record<string, unknown>; } catch { return {}; }
}
export function crud(model: any, role: "ADMIN" | "CLIENT" = "ADMIN", localCollection?: string) { return {
  async GET(req: NextRequest, ctx?: any) { const auth=await requireRole(role); if('error'in auth) return auth.error; const id=ctx?.params?.id; try { if(id) return json(await model.findFirst({ where:{ id, deletedAt:null } }).catch(()=>model.findUnique({where:{id}}))); return json(await model.findMany({ where:{ deletedAt:null }, take:100 }).catch(()=>model.findMany({take:100}))); } catch (error) { if (!localCollection) throw error; if (!allowLocalFallback()) return productionDbError(); const rows=listLocal(localCollection).filter((row:any)=>!row.deletedAt); return json(id ? rows.find((row:any)=>row.id===id) || null : { data: rows, mode: "local-json" }); } },
  async POST(req: NextRequest) { const auth=await requireRole(role); if('error'in auth) return auth.error; const body=await readJson(req); try { return json(await model.create({ data: body }), 201); } catch (error) { if (!localCollection) throw error; if (!allowLocalFallback()) return productionDbError(); return json({ ok:true, mode:"local-json", data: appendLocal(localCollection, body as any) }, 201); } },
  async PUT(req: NextRequest, ctx: any) { const auth=await requireRole(role); if('error'in auth) return auth.error; const body=await readJson(req); try { return json(await model.update({ where:{ id:ctx.params.id }, data: body })); } catch (error) { if (!localCollection) throw error; if (!allowLocalFallback()) return productionDbError(); const record=updateLocal(localCollection, ctx.params.id, body as any); return record ? json({ ok:true, mode:"local-json", data: record }) : json({ error:"Record not found." }, 404); } },
  async DELETE(_req: NextRequest, ctx: any) { const auth=await requireRole(role); if('error'in auth) return auth.error; try { return json(await model.update({ where:{ id:ctx.params.id }, data:{ deletedAt:new Date() } }).catch(()=>model.delete({ where:{ id:ctx.params.id } }))); } catch (error) { if (!localCollection) throw error; if (!allowLocalFallback()) return productionDbError(); const record=softDeleteLocal(localCollection, ctx.params.id); return record ? json({ ok:true, mode:"local-json", data: record }) : json({ error:"Record not found." }, 404); } }
}}
function safeCsvCell(value: unknown) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function csv(rows: any[], filename: string) { const cols = Object.keys(rows[0] || { empty: "" }); const body = [cols.join(","), ...rows.map(r => cols.map(c => JSON.stringify(safeCsvCell(r[c]))).join(","))].join("\n"); return new NextResponse(body, { headers: { "content-type": "text/csv", "content-disposition": `attachment; filename=${filename.replace(/[^a-z0-9_.-]/gi, "")}` } }); }
export { prisma };
