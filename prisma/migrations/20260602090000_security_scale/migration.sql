ALTER TABLE "LeadForm" ADD COLUMN IF NOT EXISTS "businessName" TEXT;

CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_clientId_idx" ON "User"("clientId");
CREATE INDEX IF NOT EXISTS "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX IF NOT EXISTS "Prospect_stage_idx" ON "Prospect"("stage");
CREATE INDEX IF NOT EXISTS "Prospect_city_idx" ON "Prospect"("city");
CREATE INDEX IF NOT EXISTS "Prospect_niche_idx" ON "Prospect"("niche");
CREATE INDEX IF NOT EXISTS "Prospect_followUpDate_idx" ON "Prospect"("followUpDate");
CREATE INDEX IF NOT EXISTS "Prospect_deletedAt_idx" ON "Prospect"("deletedAt");
CREATE INDEX IF NOT EXISTS "Client_status_idx" ON "Client"("status");
CREATE INDEX IF NOT EXISTS "Client_city_idx" ON "Client"("city");
CREATE INDEX IF NOT EXISTS "Client_niche_idx" ON "Client"("niche");
CREATE INDEX IF NOT EXISTS "Client_deletedAt_idx" ON "Client"("deletedAt");
CREATE INDEX IF NOT EXISTS "Campaign_clientId_idx" ON "Campaign"("clientId");
CREATE INDEX IF NOT EXISTS "Campaign_status_idx" ON "Campaign"("status");
CREATE INDEX IF NOT EXISTS "Campaign_platform_idx" ON "Campaign"("platform");
CREATE INDEX IF NOT EXISTS "Campaign_deletedAt_idx" ON "Campaign"("deletedAt");
CREATE INDEX IF NOT EXISTS "Lead_clientId_deliveredAt_idx" ON "Lead"("clientId", "deliveredAt");
CREATE INDEX IF NOT EXISTS "Lead_campaignId_idx" ON "Lead"("campaignId");
CREATE INDEX IF NOT EXISTS "Lead_quality_idx" ON "Lead"("quality");
CREATE INDEX IF NOT EXISTS "Lead_source_idx" ON "Lead"("source");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_deletedAt_idx" ON "Lead"("deletedAt");
CREATE INDEX IF NOT EXISTS "Invoice_clientId_idx" ON "Invoice"("clientId");
CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX IF NOT EXISTS "Invoice_dueDate_idx" ON "Invoice"("dueDate");
CREATE INDEX IF NOT EXISTS "Invoice_deletedAt_idx" ON "Invoice"("deletedAt");
CREATE INDEX IF NOT EXISTS "Payment_clientId_idx" ON "Payment"("clientId");
CREATE INDEX IF NOT EXISTS "Payment_invoiceId_idx" ON "Payment"("invoiceId");
CREATE INDEX IF NOT EXISTS "Payment_paymentDate_idx" ON "Payment"("paymentDate");
CREATE INDEX IF NOT EXISTS "Message_clientId_createdAt_idx" ON "Message"("clientId", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_isRead_idx" ON "Message"("isRead");
CREATE INDEX IF NOT EXISTS "LeadForm_source_idx" ON "LeadForm"("source");
CREATE INDEX IF NOT EXISTS "LeadForm_createdAt_idx" ON "LeadForm"("createdAt");
CREATE INDEX IF NOT EXISTS "LeadForm_isContacted_idx" ON "LeadForm"("isContacted");

DO $$ BEGIN
  CREATE TYPE "SecurityEventType" AS ENUM (
    'RATE_LIMIT',
    'SCAM_PATTERN',
    'DISPOSABLE_EMAIL',
    'STRIPE_RISK',
    'OVERPAYMENT',
    'LOGIN_FAILURE',
    'WEBHOOK_FAILURE',
    'DEPENDENCY_ALERT',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SecuritySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "SecurityEvent" (
  "id" TEXT NOT NULL,
  "type" "SecurityEventType" NOT NULL,
  "severity" "SecuritySeverity" NOT NULL DEFAULT 'LOW',
  "source" TEXT,
  "email" TEXT,
  "ipAddress" TEXT,
  "userId" TEXT,
  "description" TEXT NOT NULL,
  "metadata" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SecurityEvent_type_idx" ON "SecurityEvent"("type");
CREATE INDEX IF NOT EXISTS "SecurityEvent_severity_idx" ON "SecurityEvent"("severity");
CREATE INDEX IF NOT EXISTS "SecurityEvent_ipAddress_idx" ON "SecurityEvent"("ipAddress");
CREATE INDEX IF NOT EXISTS "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecurityEvent" ENABLE ROW LEVEL SECURITY;
