import { NextRequest } from "next/server";
import { json, prisma, readJson, requireRole } from "@/lib/api";
import { listLocal, updateLocal, appendLocal } from "@/lib/local-store";

const defaultNotifications = {
  newLeadEmail: true,
  newLeadSms: false,
  invoiceEmail: true,
  paymentEmail: true,
  messageEmail: true,
};

export async function GET() {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;
  const user = auth.user as any;
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { client: true } });
    return json({
      mode: "postgres",
      profile: {
        name: dbUser?.name || user.name,
        email: dbUser?.email || user.email,
        phone: dbUser?.client?.phone || "",
        businessName: dbUser?.client?.businessName || "Patel Dental",
      },
      paymentMethod: {
        brand: dbUser?.cardBrand || dbUser?.client?.cardBrand || null,
        last4: dbUser?.cardLast4 || dbUser?.client?.cardLast4 || null,
        expiry: dbUser?.cardExpiry || dbUser?.client?.cardExpiry || null,
      },
      notifications: defaultNotifications,
    });
  } catch {
    const profile = listLocal("accountProfiles").find((row: any) => row.userId === user.id) || {
      id: `profile-${user.id}`,
      userId: user.id,
      name: user.name || "Dr. Ravi Patel",
      email: user.email || "patel@pateldental.co.uk",
      phone: "",
      businessName: "Patel Dental",
    };
    const notifications = listLocal("notificationSettings").find((row: any) => row.userId === user.id) || defaultNotifications;
    return json({ mode: "local-json", profile, paymentMethod: { brand: null, last4: null, expiry: null }, notifications });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;
  const user = auth.user as any;
  const body = await readJson(req);

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: body.name, email: body.email },
    });
    if (user.clientId && body.phone) {
      await prisma.client.update({ where: { id: user.clientId }, data: { phone: body.phone } });
    }
    return json({ ok: true, mode: "postgres", profile: updated });
  } catch {
    const rows = listLocal("accountProfiles");
    const existing = rows.find((row: any) => row.userId === user.id);
    const data = {
      userId: user.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      businessName: body.businessName || "Patel Dental",
    };
    const profile = existing ? updateLocal("accountProfiles", existing.id, data) : appendLocal("accountProfiles", data);
    return json({ ok: true, mode: "local-json", profile });
  }
}
