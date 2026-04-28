import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash("Password123!", 12);

async function main() {
  await prisma.agencySetting.upsert({
    where: { id: "seed-agency" },
    update: {},
    create: {
      id: "seed-agency",
      agencyName: "KRAVEX",
      address: "123 Growth Street, London, EC1A 1AA",
      vatNumber: "GB123456789"
    }
  });

  for (const name of ["Dentists", "Solicitors", "Roofers", "Aesthetic Clinics"]) {
    await prisma.niche.upsert({ where: { name }, update: {}, create: { name } });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@kravex.co.uk" },
    update: {},
    create: { name: "KRAVEX Admin", email: "admin@kravex.co.uk", role: "ADMIN", passwordHash }
  });

  const brightSmile = await prisma.client.upsert({
    where: { email: "owner@brightsmile.co.uk" },
    update: {},
    create: {
      businessName: "Bright Smile Dental",
      contactName: "Amelia Hughes",
      email: "owner@brightsmile.co.uk",
      phone: "020 7946 0958",
      niche: "Dentists",
      location: "London",
      website: "https://brightsmile.example",
      retainerAmount: 1800,
      leadTarget: 30,
      status: "ACTIVE",
      contractStart: new Date("2025-05-01")
    }
  });

  const skyline = await prisma.client.upsert({
    where: { email: "hello@skylineroofing.co.uk" },
    update: {},
    create: {
      businessName: "Skyline Roofing",
      contactName: "Jack Turner",
      email: "hello@skylineroofing.co.uk",
      phone: "0161 555 0198",
      niche: "Roofers",
      location: "Manchester",
      website: "https://skylineroofing.example",
      retainerAmount: 1250,
      leadTarget: 18,
      status: "ACTIVE",
      contractStart: new Date("2025-06-15")
    }
  });

  await prisma.user.upsert({
    where: { email: "owner@brightsmile.co.uk" },
    update: { clientId: brightSmile.id },
    create: { name: "Amelia Hughes", email: "owner@brightsmile.co.uk", role: "CLIENT", clientId: brightSmile.id, passwordHash }
  });

  const prospects = [
    ["North Leeds Aesthetics", "Dr Sophie Khan", "hello@northleedsaesthetics.co.uk", "Aesthetic Clinics", "Leeds", "CALL_BOOKED", 2200],
    ["Carter & Blake Solicitors", "Ben Carter", "ben@carterblake.co.uk", "Solicitors", "Bristol", "PROPOSAL_SENT", 2500],
    ["Edinburgh Dental Studio", "Mairi Scott", "mairi@edinburghdental.example", "Dentists", "Edinburgh", "CONTACTED", 1800]
  ];
  for (const [businessName, contactName, email, niche, location, stage, estimatedValue] of prospects) {
    const prospect = await prisma.prospect.upsert({
      where: { id: `seed-${email}` },
      update: {},
      create: { id: `seed-${email}`, businessName, contactName, email, niche, location, stage, estimatedValue, phone: "07000 000000", website: "https://example.co.uk", linkedin: "https://linkedin.com", notes: "Seed prospect" }
    });
    await prisma.prospectActivity.create({ data: { prospectId: prospect.id, type: "NOTE", note: "Initial research completed." } });
  }

  await prisma.campaign.create({
    data: { name: "UK Dental Growth Sequence", niche: "Dentists", prospectsCount: 450, emailsSent: 1200, openRate: 54.2, replyRate: 8.7, positiveReplies: 31, callsBooked: 12, status: "ACTIVE", notes: "Strong response to whitening offer.", clientId: brightSmile.id }
  });
  await prisma.campaign.create({
    data: { name: "Roofing Spring Demand", niche: "Roofers", prospectsCount: 280, emailsSent: 760, openRate: 48.5, replyRate: 6.1, positiveReplies: 18, callsBooked: 7, status: "PAUSED", notes: "Refresh subject lines before next batch.", clientId: skyline.id }
  });

  const leads = [
    [brightSmile.id, "Priya Mehta", "Mehta Family", "priya@example.com", "META_AD", "HOT", "NEW"],
    [brightSmile.id, "Oliver Smith", "Smith Household", "oliver@example.com", "GOOGLE_AD", "WARM", "CONTACTED_BY_CLIENT"],
    [brightSmile.id, "Hannah Brooks", "Brooks Ltd", "hannah@example.com", "COLD_EMAIL", "COLD", "NOT_INTERESTED"],
    [skyline.id, "Tom Wilson", "Wilson Properties", "tom@example.com", "REFERRAL", "HOT", "CONVERTED"],
    [skyline.id, "Nadia Ali", "Ali Homes", "nadia@example.com", "GOOGLE_AD", "WARM", "NEW"]
  ];
  for (const [clientId, leadName, businessName, email, source, quality, status] of leads) {
    await prisma.lead.create({ data: { clientId, leadName, businessName, email, phone: "07123 456789", source, quality, status, deliveredAt: new Date(), notes: "Seed lead" } });
  }

  await prisma.invoice.create({
    data: { clientId: brightSmile.id, invoiceNumber: "KRX-2026-0001", invoiceDate: new Date(), dueDate: new Date(Date.now() + 7 * 86400000), lineItems: [{ description: "Lead Generation Retainer", amount: 1800 }], subtotal: 1800, vatAmount: 360, total: 2160, status: "SENT" }
  });
  await prisma.invoice.create({
    data: { clientId: skyline.id, invoiceNumber: "KRX-2026-0002", invoiceDate: new Date(), dueDate: new Date(Date.now() - 3 * 86400000), lineItems: [{ description: "Lead Generation Retainer", amount: 1250 }], subtotal: 1250, vatAmount: 250, total: 1500, status: "OVERDUE" }
  });

  await prisma.emailTemplate.create({ data: { name: "Problem Aware Opener", subject: "More {niche} enquiries in {city}", body: "Hi {first_name}, noticed {business_name} is active in {city}. We help UK SMEs add qualified enquiries without hiring an in-house marketing team." } });
  await prisma.message.create({ data: { clientId: brightSmile.id, createdBy: admin.id, content: "This month's campaign is pacing ahead of target. Expect another lead batch on Friday." } });
}

main().finally(async () => prisma.$disconnect());
