import { NextRequest } from "next/server";
import { prisma, json, readJson } from "@/lib/api";
import { contactSchema } from "@/lib/validations";
import { adminEmail, sendEmail } from "@/lib/resend";
import { appendLocal } from "@/lib/local-store";
import { assessLeadSubmission, clientIp, rateLimit } from "@/lib/security";
import { allowLocalFallback, productionDbError } from "@/lib/production";
import { logSecurityEvent } from "@/lib/security-events";
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    await logSecurityEvent({ type: "RATE_LIMIT", severity: "MEDIUM", ipAddress: ip, source: "contact", description: "Contact form rate limit exceeded." });
    return json({ error: "Too many enquiries from this connection. Please try again later." }, 429);
  }
  const body=contactSchema.parse(await readJson(req));
  const scamReason = assessLeadSubmission(body);
  if (scamReason) {
    await logSecurityEvent({ type: scamReason.includes("business email") ? "DISPOSABLE_EMAIL" : "SCAM_PATTERN", severity: "HIGH", ipAddress: ip, email: body.email, source: "contact", description: scamReason, metadata: body });
    return json({ error: scamReason }, 400);
  }
  const data={ name:body.name, businessName:body.businessName, email:body.email, phone:body.phone, service:body.industry, message:body.message, source:"contact", ipAddress: ip };
  let lead;
  let mode = "postgres";
  try {
    lead=await prisma.leadForm.create({ data });
  } catch {
    if (!allowLocalFallback()) return productionDbError();
    lead=appendLocal("leadForms", data);
    mode = "local-json";
  }
  await sendEmail({ to: adminEmail, subject:"New Contact Submission - KRAVEX", html:`<pre>${JSON.stringify(body,null,2)}</pre>` });
  await sendEmail({ to: body.email, subject:"We received your enquiry - KRAVEX", html:`<p>Thank you ${body.name}. We will be in touch within 24 hours.</p>` });
  return json({ ok:true, mode, lead });
}
