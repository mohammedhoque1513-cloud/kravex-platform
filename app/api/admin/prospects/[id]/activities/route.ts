import { ActivityType } from "@prisma/client";
import { json, prisma, readJson, requireRole } from "@/lib/api";

const activityTypes = new Set(Object.values(ActivityType));

export async function POST(req: Request, { params }: any) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const body = await readJson(req as any);
  const type = typeof body.type === "string" && activityTypes.has(body.type as ActivityType) ? body.type as ActivityType : ActivityType.NOTE;
  const note = typeof body.note === "string" && body.note ? body.note : "Activity logged";

  return json(await prisma.prospectActivity.create({
    data: { prospectId: params.id, type, note },
  }), 201);
}
