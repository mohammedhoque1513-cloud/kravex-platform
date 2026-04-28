CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CHURNED', 'ARCHIVED');
CREATE TYPE "ProspectStage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'CALL_BOOKED', 'PROPOSAL_SENT', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST');
CREATE TYPE "ActivityType" AS ENUM ('NOTE', 'CALL', 'EMAIL');
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "LeadSource" AS ENUM ('COLD_EMAIL', 'META_AD', 'GOOGLE_AD', 'REFERRAL');
CREATE TYPE "LeadQuality" AS ENUM ('HOT', 'WARM', 'COLD');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED_BY_CLIENT', 'CONVERTED', 'NOT_INTERESTED');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE');

CREATE TABLE "clients" (
  "id" TEXT NOT NULL,
  "business_name" TEXT NOT NULL,
  "contact_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "niche" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "website" TEXT,
  "retainer_amount" DECIMAL(10,2) NOT NULL,
  "lead_target" INTEGER NOT NULL,
  "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
  "contract_start" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
  "client_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prospects" (
  "id" TEXT NOT NULL,
  "business_name" TEXT NOT NULL,
  "contact_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "niche" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "website" TEXT,
  "linkedin" TEXT,
  "stage" "ProspectStage" NOT NULL DEFAULT 'NEW_LEAD',
  "estimated_value" DECIMAL(10,2) NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prospect_activities" (
  "id" TEXT NOT NULL,
  "prospect_id" TEXT NOT NULL,
  "type" "ActivityType" NOT NULL DEFAULT 'NOTE',
  "note" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prospect_activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaigns" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "niche" TEXT NOT NULL,
  "prospects_count" INTEGER NOT NULL DEFAULT 0,
  "emails_sent" INTEGER NOT NULL DEFAULT 0,
  "open_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "reply_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "positive_replies" INTEGER NOT NULL DEFAULT 0,
  "calls_booked" INTEGER NOT NULL DEFAULT 0,
  "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
  "notes" TEXT,
  "client_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaign_prospects" (
  "id" TEXT NOT NULL,
  "campaign_id" TEXT NOT NULL,
  "prospect_id" TEXT NOT NULL,
  CONSTRAINT "campaign_prospects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "leads" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "lead_name" TEXT NOT NULL,
  "business_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "source" "LeadSource" NOT NULL,
  "quality" "LeadQuality" NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "notes" TEXT,
  "delivered_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invoices" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "invoice_number" TEXT NOT NULL,
  "invoice_date" TIMESTAMP(3) NOT NULL,
  "due_date" TIMESTAMP(3) NOT NULL,
  "line_items" JSONB NOT NULL,
  "subtotal" DECIMAL(10,2) NOT NULL,
  "vat_amount" DECIMAL(10,2) NOT NULL,
  "total" DECIMAL(10,2) NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "email_templates" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" TEXT NOT NULL,
  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agency_settings" (
  "id" TEXT NOT NULL,
  "agency_name" TEXT NOT NULL DEFAULT 'KRAVEX',
  "logo_url" TEXT,
  "address" TEXT,
  "vat_number" TEXT,
  "notification_preferences" JSONB NOT NULL DEFAULT '{"overdueInvoices":true,"leadTargets":true}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "agency_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "niches" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "niches_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "campaign_prospects_campaign_id_prospect_id_key" ON "campaign_prospects"("campaign_id", "prospect_id");
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
CREATE UNIQUE INDEX "niches_name_key" ON "niches"("name");

ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "prospect_activities" ADD CONSTRAINT "prospect_activities_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "campaign_prospects" ADD CONSTRAINT "campaign_prospects_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_prospects" ADD CONSTRAINT "campaign_prospects_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
