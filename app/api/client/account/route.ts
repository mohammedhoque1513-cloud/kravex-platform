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
        businessName: dbUser?.client?.businessName || "Cardiff Heat Pumps",
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
      name: user.name || "Rhys Morgan",
      email: user.email || "rhys@cardiffheatpumps.co.uk",
      phone: "",
      businessName: "Cardiff Heat Pumps",
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
  const data = {
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email.toLowerCase() : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    businessName: typeof body.businessName === "string" ? body.businessName : "Cardiff Heat Pumps",
  };
  if (!data.name || !data.email) return json({ error: "Name and email are required." }, 400);

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: data.name, email: data.email },
    });
    if (user.clientId && data.phone) {
      await prisma.client.update({ where: { id: user.clientId }, data: { phone: data.phone } });
    }
    return json({ ok: true, mode: "postgres", profile: updated });
  } catch {
    const rows = listLocal("accountProfiles");
    const existing = rows.find((row: any) => row.userId === user.id);
    const profileData = { userId: user.id, ...data };
    const profile = existing ? updateLocal("accountProfiles", existing.id, profileData) : appendLocal("accountProfiles", profileData);
    return json({ ok: true, mode: "local-json", profile });
  }
}
