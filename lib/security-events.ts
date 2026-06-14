import { prisma } from "@/lib/db";
import { appendLocal } from "@/lib/local-store";
import { allowLocalFallback } from "@/lib/production";

type EventInput = {
  type: "RATE_LIMIT" | "SCAM_PATTERN" | "DISPOSABLE_EMAIL" | "STRIPE_RISK" | "OVERPAYMENT" | "LOGIN_FAILURE" | "WEBHOOK_FAILURE" | "DEPENDENCY_ALERT" | "OTHER";
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source?: string;
  email?: string;
  ipAddress?: string;
  userId?: string;
  description: string;
  metadata?: unknown;
};

export async function logSecurityEvent(input: EventInput) {
  const data = {
    ...input,
    severity: input.severity || "LOW",
    metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
  };
  try {
    await prisma.securityEvent.create({ data });
  } catch {
    if (allowLocalFallback()) appendLocal("securityEvents", data);
  }
}

