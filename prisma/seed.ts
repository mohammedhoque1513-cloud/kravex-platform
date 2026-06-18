import fs from "node:fs";
if (fs.existsSync(".env")) for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = line.match(/^([^#=]+)=(.*)$/); if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, ""); }
import bcrypt from "bcryptjs";
import { PrismaClient, Role, ClientStatus, ProspectStage, ActivityType, Platform, CampaignStatus, LeadSource, LeadQuality, LeadStatus, InvoiceStatus, PaymentMethod } from "@prisma/client";
const prisma = new PrismaClient();
function seedPassword(name: "SEED_ADMIN_PASSWORD" | "SEED_CLIENT_PASSWORD") {
  const configured = process.env[name];
  if (configured) return configured;
  throw new Error(`${name} must be configured before seeding the database.`);
}
async function main() {
  const passwordHash = await bcrypt.hash(seedPassword("SEED_ADMIN_PASSWORD"), 12);
  const clientPasswordHash = await bcrypt.hash(seedPassword("SEED_CLIENT_PASSWORD"), 12);
  await prisma.$transaction(async (tx) => {
    await tx.backupRun.deleteMany(); await tx.reconciliationRun.deleteMany(); await tx.moneyLedgerEntry.deleteMany(); await tx.moneyVault.deleteMany(); await tx.payment.deleteMany(); await tx.invoiceLineItem.deleteMany(); await tx.invoice.deleteMany(); await tx.lead.deleteMany(); await tx.campaign.deleteMany(); await tx.message.deleteMany(); await tx.report.deleteMany(); await tx.user.deleteMany(); await tx.client.deleteMany(); await tx.prospectActivity.deleteMany(); await tx.prospect.deleteMany(); await tx.leadForm.deleteMany(); await tx.settings.deleteMany();
    await tx.user.create({ data: { name: "Emdadul Hoque", email: "emdadul.hoque@kravex.co.uk", passwordHash, role: Role.ADMIN } });
    const patel = await tx.client.create({ data: { businessName: "Cardiff Heat Pumps", contactName: "Rhys Morgan", email: "rhys@cardiffheatpumps.co.uk", phone: "02920 555 019", niche: "HVAC", city: "Birmingham", retainerAmount: 150000, leadTarget: 20, contractStart: new Date("2026-01-01"), status: ClientStatus.ACTIVE, users: { create: { name: "Rhys Morgan", email: "rhys@cardiffheatpumps.co.uk", passwordHash: clientPasswordHash, role: Role.CLIENT } } } });
    const metro = await tx.client.create({ data: { businessName: "Metro Roofing", contactName: "Mike Dawson", email: "mike@metroroofing.co.uk", phone: "0161 555 0134", niche: "Roofing", city: "Manchester", retainerAmount: 100000, leadTarget: 15, contractStart: new Date("2026-02-01"), status: ClientStatus.ACTIVE, users: { create: { name: "Mike Dawson", email: "mike@metroroofing.co.uk", passwordHash: clientPasswordHash, role: Role.CLIENT } } } });
    for (const p of [{ businessName:"Harborne Electrical", contactName:"Emily Clarke", niche:"Electrical", city:"Birmingham", stage:ProspectStage.NEW_LEAD, estimatedValue:180000, type:ActivityType.NOTE, note:"Website enquiry received." },{ businessName:"North Leeds Concrete", contactName:"Sam Iqbal", niche:"Concrete", city:"Leeds", stage:ProspectStage.CALL_BOOKED, estimatedValue:220000, type:ActivityType.CALL, note:"Driveway campaign discovery call booked." },{ businessName:"Cotswold Foundations", contactName:"James Pryce", niche:"Foundation Repair", city:"Cheltenham", stage:ProspectStage.PROPOSAL_SENT, estimatedValue:300000, type:ActivityType.PROPOSAL, note:"Foundation repair campaign proposal sent." }]) {
      const { type, note, ...prospect } = p;
      await tx.prospect.create({ data: { ...prospect, activities: { create: { type, note } } } });
    }
    const c1 = await tx.campaign.create({ data: { clientId: patel.id, name: "Heat Pump Installation Enquiries", niche: "HVAC", platform: Platform.GOOGLE_ADS, status: CampaignStatus.ACTIVE, callsBooked: 12, leadsGenerated: 5, monthlyBudget: 180000, amountSpent: 76000 } });
    const c2 = await tx.campaign.create({ data: { clientId: metro.id, name: "Emergency Roofing Leads", niche: "Roofing", platform: Platform.META_ADS, status: CampaignStatus.ACTIVE, callsBooked: 9, leadsGenerated: 3, monthlyBudget: 90000, amountSpent: 42000 } });
    const rows:any[] = [[patel.id,c1.id,"Aisha Khan",LeadQuality.HOT],[patel.id,c1.id,"Ben Morris",LeadQuality.WARM],[patel.id,c1.id,"Claire Evans",LeadQuality.HOT],[patel.id,c1.id,"Daniel Reed",LeadQuality.COLD],[patel.id,c1.id,"Maya Shah",LeadQuality.WARM],[metro.id,c2.id,"Oliver Stone",LeadQuality.HOT],[metro.id,c2.id,"Grace Hall",LeadQuality.WARM],[metro.id,c2.id,"Tom Wilson",LeadQuality.COLD]];
    for (const [clientId,campaignId,leadName,quality] of rows) await tx.lead.create({ data: { clientId, campaignId, leadName, email: `${leadName.toLowerCase().replace(" ", ".")}@example.com`, phone: "07111 000000", source: clientId===patel.id ? LeadSource.GOOGLE_AD : LeadSource.META_AD, quality, status: LeadStatus.NEW, notes: "Qualified by KRAVEX before delivery." } });
    const i1 = await tx.invoice.create({ data: { clientId: patel.id, invoiceNumber: "KRX-2026-0001", invoiceDate: new Date("2026-05-01"), dueDate: new Date("2026-05-08"), subtotal: 150000, vatAmount: 30000, total: 180000, status: InvoiceStatus.PAID, paidAt: new Date("2026-05-04"), lineItems: { create: [{ description: "Growth retainer - May 2026", quantity: 1, unitAmount: 150000, totalAmount: 150000 }] } } });
    await tx.invoice.create({ data: { clientId: metro.id, invoiceNumber: "KRX-2026-0002", invoiceDate: new Date("2026-05-15"), dueDate: new Date("2026-05-22"), subtotal: 100000, vatAmount: 20000, total: 120000, status: InvoiceStatus.SENT, sentAt: new Date("2026-05-15"), lineItems: { create: [{ description: "Starter retainer - May 2026", quantity: 1, unitAmount: 100000, totalAmount: 100000 }] } } });
    await tx.payment.create({ data: { invoiceId: i1.id, clientId: patel.id, amount: 180000, paymentDate: new Date("2026-05-04"), paymentMethod: PaymentMethod.BANK_TRANSFER, reference: "CARDIFF-HVAC-MAY-2026" } });
    await tx.settings.createMany({ data: [{ key:"vat_rate", value:"20", description:"Default UK VAT rate" },{ key:"invoice_prefix", value:"KRX", description:"Invoice number prefix" },{ key:"min_contract_months", value:"3", description:"Minimum contract term" }] });
    await tx.moneyVault.createMany({ data: [
      { key: "tax", name: "Tax Reserve", percentage: 30, description: "HMRC/VAT/corporation-tax reserve. Locked away from owner withdrawals." },
      { key: "insurance", name: "Insurance", percentage: 5, description: "Professional indemnity, cyber, public liability and related cover." },
      { key: "ops", name: "Operations", percentage: 20, description: "Software, ads, contractors, tools and fulfilment costs." },
      { key: "growth", name: "Growth", percentage: 10, description: "Cash buffer, reinvestment and slow-month protection." },
      { key: "owner", name: "Owner Pay", percentage: 35, description: "Emdadul's available pay after reserves have been allocated.", isOwnerPay: true },
    ] });
  }, { timeout: 30000 });
}
main().finally(() => prisma.$disconnect());


