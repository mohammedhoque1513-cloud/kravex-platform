import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { json, prisma, readJson, requireRole } from "@/lib/api";
import { appendLocal, listLocal } from "@/lib/local-store";

function temporaryPassword() {
  return `Client${Math.floor(100000 + Math.random() * 900000)}!`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const body = await readJson(req);
  const password = body.password || temporaryPassword();

  try {
    const client = await prisma.client.findUnique({ where: { id }, include: { users: true } });
    if (!client) return json({ error: "Client not found." }, 404);
    const existing = client.users.find((user) => user.role === "CLIENT" && !user.deletedAt);
    if (existing) {
      return json({ ok: true, alreadyExists: true, user: { id: existing.id, name: existing.name, email: existing.email }, message: "This client already has a portal login." });
    }
    const user = await prisma.user.create({
      data: {
        name: client.contactName,
        email: client.email.toLowerCase(),
        passwordHash: await bcrypt.hash(password, 12),
        role: "CLIENT",
        clientId: client.id,
      },
    });
    return json({ ok: true, mode: "postgres", user: { id: user.id, name: user.name, email: user.email }, temporaryPassword: password });
  } catch {
    const clients = listLocal("clients");
    const client = clients.find((item: any) => item.id === id) || {
      id,
      businessName: body.businessName || "Client",
      contactName: body.contactName || body.name || "Client User",
      email: body.email,
    };
    if (!client.email) return json({ error: "Client email is required before creating a portal login." }, 400);
    const existing = listLocal("portalUsers").find((user: any) => user.clientId === client.id || user.email === String(client.email).toLowerCase());
    if (existing) {
      return json({ ok: true, mode: "local-json", alreadyExists: true, user: { id: existing.id, name: existing.name, email: existing.email }, message: "This client already has a portal login." });
    }
    const user = appendLocal("portalUsers", {
      name: client.contactName || client.businessName,
      email: String(client.email).toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: "CLIENT",
      clientId: client.id,
      isActive: true,
    }) as any;
    return json({ ok: true, mode: "local-json", user: { id: user.id, name: user.name, email: user.email }, temporaryPassword: password });
  }
}
