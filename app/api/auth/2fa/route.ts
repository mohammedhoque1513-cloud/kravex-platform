import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";
import { authOptions } from "@/lib/auth";
import { json, prisma, readJson } from "@/lib/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id) return json({ error: "Please sign in to continue." }, 401);

  const account = await prisma.user.findUnique({ where: { id: user.id } });
  if (!account) return json({ error: "Account not found." }, 404);
  if (account.twoFactorEnabled) return json({ enabled: true });

  const secret = account.twoFactorSecret || generateSecret();
  if (!account.twoFactorSecret) {
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorSecret: secret } });
  }
  const otpauth = generateURI({ issuer: "KRAVEX", label: account.email, secret });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
  return json({ enabled: false, secret, qrCodeDataUrl, otpauth });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id) return json({ error: "Please sign in to continue." }, 401);

  const { code } = await readJson(req);
  const account = await prisma.user.findUnique({ where: { id: user.id } });
  if (!account?.twoFactorSecret) return json({ error: "Start 2FA setup first." }, 400);
  if (!code || !verify({ token: String(code), secret: account.twoFactorSecret })) return json({ error: "Enter a valid 2FA code." }, 400);

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
  return json({ ok: true, enabled: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id) return json({ error: "Please sign in to continue." }, 401);

  const { code } = await readJson(req);
  const account = await prisma.user.findUnique({ where: { id: user.id } });
  if (!account?.twoFactorEnabled || !account.twoFactorSecret) return json({ ok: true, enabled: false });
  if (!code || !verify({ token: String(code), secret: account.twoFactorSecret })) return json({ error: "Enter a valid 2FA code." }, 400);

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
  return json({ ok: true, enabled: false });
}
