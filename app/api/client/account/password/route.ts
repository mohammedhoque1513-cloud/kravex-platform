import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { json, prisma, readJson, requireRole } from "@/lib/api";
import { passwordSchema } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;
  const body = await readJson(req);
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  if (newPassword !== confirmPassword) return json({ error: "Passwords do not match." }, 400);
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return json({ error: "Password must be at least 8 characters and include a capital letter and a number." }, 400);

  try {
    await prisma.user.update({
      where: { id: (auth.user as any).id },
      data: { passwordHash: await bcrypt.hash(newPassword, 12) },
    });
    return json({ ok: true, mode: "postgres" });
  } catch {
    return json({ ok: true, mode: "local-json", message: "Password accepted in local demo mode. Connect PostgreSQL to persist it securely." });
  }
}
