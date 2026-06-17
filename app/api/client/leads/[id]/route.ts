import { LeadStatus } from "@prisma/client";
import { json, prisma, readJson, requireRole } from "@/lib/api";

const allowedStatuses = new Set(Object.values(LeadStatus));

export async function PUT(req: Request, { params }: any) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  const body = await readJson(req as any);
  const status = typeof body.status === "string" && allowedStatuses.has(body.status as LeadStatus) ? body.status as LeadStatus : undefined;
  const clientNotes = typeof body.clientNotes === "string" ? body.clientNotes : undefined;

  return json(await prisma.lead.update({
    where: { id: params.id },
    data: {
      ...(status ? { status } : {}),
      ...(clientNotes !== undefined ? { clientNotes } : {}),
    },
  }));
}
