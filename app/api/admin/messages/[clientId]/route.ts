import { json, prisma, readJson, requireRole } from "@/lib/api";

export async function GET(_: Request, { params }: any) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  return json(await prisma.message.findMany({
    where: { clientId: params.clientId },
    orderBy: { createdAt: "desc" },
  }));
}

export async function POST(req: Request, { params }: any) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const body = await readJson(req as any);
  const content = typeof body.content === "string" ? body.content : "";
  if (!content) return json({ error: "Message content is required." }, 400);

  return json(await prisma.message.create({
    data: {
      clientId: params.clientId,
      senderId: (auth.user as any).id || "admin",
      content,
    },
  }), 201);
}
