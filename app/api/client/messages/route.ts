import { json, prisma, readJson, requireRole } from "@/lib/api";
import { appendLocal, listLocal } from "@/lib/local-store";

export async function GET() {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  try {
    return json(await prisma.message.findMany({
      where: { clientId: (auth.user as any).clientId },
      orderBy: { createdAt: "desc" },
    }));
  } catch {
    return json({
      data: listLocal("messages").filter((row: any) => row.clientId === (auth.user as any).clientId),
      mode: "local-json",
    });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  const body = await readJson(req as any);
  const content = typeof body.content === "string" ? body.content : "";
  if (!content) return json({ error: "Message content is required." }, 400);

  const data = {
    clientId: (auth.user as any).clientId,
    senderId: (auth.user as any).id,
    content,
  };

  try {
    return json(await prisma.message.create({ data }), 201);
  } catch {
    return json({ ok: true, mode: "local-json", data: appendLocal("messages", data) }, 201);
  }
}
