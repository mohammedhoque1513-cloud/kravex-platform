-- Add unique Stripe payment reference for idempotent webhook processing.
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_stripeId_key" ON "Payment"("stripeId");

-- Money vault pipeline.
CREATE TYPE "MoneyLedgerType" AS ENUM (
  'PAYMENT_RECEIVED',
  'VAULT_ALLOCATION',
  'OWNER_WITHDRAWAL_REQUEST',
  'BANK_PAYOUT',
  'REFUND',
  'ADJUSTMENT'
);

CREATE TYPE "MoneyMovementStatus" AS ENUM (
  'PENDING',
  'AVAILABLE',
  'PAID_OUT',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE "JobStatus" AS ENUM (
  'SUCCESS',
  'FAILED'
);

CREATE TABLE "MoneyVault" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "percentage" DOUBLE PRECISION NOT NULL,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "isOwnerPay" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MoneyVault_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MoneyVault_key_key" ON "MoneyVault"("key");

CREATE TABLE "MoneyLedgerEntry" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT,
  "invoiceId" TEXT,
  "vaultKey" TEXT,
  "type" "MoneyLedgerType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" "MoneyMovementStatus" NOT NULL DEFAULT 'PENDING',
  "reference" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "clearedAt" TIMESTAMP(3),
  CONSTRAINT "MoneyLedgerEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReconciliationRun" (
  "id" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL,
  "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReconciliationRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BackupRun" (
  "id" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL,
  "target" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BackupRun_pkey" PRIMARY KEY ("id")
);

