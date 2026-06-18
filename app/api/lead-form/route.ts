import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma, json, readJson } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { leadFormSchema } from "@/lib/validations";
import { adminEmail, sendEmail } from "@/lib/resend";
import { appendLocal } from "@/lib/local-store";
import { assessLeadSubmission, clientIp, rateLimit } from "@/lib/security";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { verifyUkCompany } from "@/lib/companies-house";
import { allowLocalFallback, productionDbError } from "@/lib/production";
import { logSecurityEvent } from "@/lib/security-events";

function leadNotes(body: ReturnType<typeof leadFormSchema.parse>) {
  return [
    `Business: ${body.businessName}`,
    `Industry: ${body.service}`,
    body.subService ? `Sub-service: ${body.subService}` : null,
    `City: ${body.city}`,
    body.budget ? `Monthly budget: ${body.budget}` : null,
    body.referralSource ? `Heard from: ${body.referralSource}` : null,
    body.callDuration ? `Call duration: ${body.callDuration}` : null,
    body.leadTemperature ? `Temperature: ${body.leadTemperature}` : null,
    body.message ? `Notes: ${body.message}` : null,
  ].filter(Boolean).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limit = rateLimit(`lead-form:${ip}`, 3, 60 * 60 * 1000);
    if (!limit.ok) {
      await logSecurityEvent({ type: "RATE_LIMIT", severity: "MEDIUM", ipAddress: ip, source: "lead-form", description: "Lead form rate limit exceeded." });
      return json({ error: "Too many enquiries from this connection. Please try again later." }, 429);
    }

    const parsed = leadFormSchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return json({ error: "Invalid form data", details: parsed.error.flatten() }, 400);
    }
    const body = parsed.data;
    const scamReason = assessLeadSubmission(body);
    if (scamReason) {
      await logSecurityEvent({ type: scamReason.includes("business email") ? "DISPOSABLE_EMAIL" : "SCAM_PATTERN", severity: "HIGH", ipAddress: ip, email: body.email, source: body.source, description: scamReason, metadata: body });
      return json({ error: scamReason }, 400);
    }

    const recaptcha = await verifyRecaptcha(body.recaptchaToken, "lead_form");
    if (!recaptcha.ok) {
      await logSecurityEvent({ type: "SCAM_PATTERN", severity: "MEDIUM", ipAddress: ip, email: body.email, source: body.source, description: recaptcha.reason, metadata: { score: recaptcha.score } });
      return json({ error: recaptcha.reason }, 400);
    }

    const companyCheck = await verifyUkCompany(body.businessName);

    if (body.source === "PHONE_CALL") {
      const session = await getServerSession(authOptions);
      const isAdmin = (session?.user as any)?.role === "ADMIN";
      if (!isAdmin) {
        return json({ error: "Admin access is required to save phone leads." }, 403);
      }
    }

    const notes = leadNotes(body);
    const data = {
      name: body.name,
      businessName: body.businessName,
      email: body.email,
      phone: body.phone,
      service: body.service,
      message: notes,
      source: body.source,
      ipAddress: ip,
    };

    let lead;
    let mode = "postgres";
    try {
      await prisma.$queryRaw`SELECT 1`;
      lead = await prisma.$transaction(async (tx) => {
        const saved = await tx.leadForm.create({ data });
        if (body.source === "PHONE_CALL") {
          await tx.prospect.create({
            data: {
              businessName: body.businessName,
              contactName: body.name,
              email: body.email,
              phone: body.phone,
              niche: body.service,
              city: body.city,
              stage: "NEW_LEAD",
              notes,
            },
          });
        }
        return saved;
      });
    } catch (error) {
      console.error("Lead form database operation failed:", error);
      if (!allowLocalFallback()) return productionDbError();
      lead = appendLocal("leadForms", data);
      if (body.source === "PHONE_CALL") {
        appendLocal("prospects", {
          businessName: body.businessName,
          contactName: body.name,
          email: body.email,
          phone: body.phone,
          niche: body.service,
          city: body.city,
          stage: "NEW_LEAD",
          notes,
        });
      }
      mode = "local-json";
    }

    void sendEmail({
      to: adminEmail,
      subject: `${body.source === "PHONE_CALL" ? "Phone Lead Captured" : "New Lead Form Submission"} - ${body.businessName} - KRAVEX`,
      html: `<pre>${JSON.stringify({ ...body, companiesHouse: companyCheck, ipAddress: ip, submittedAt: new Date().toISOString() }, null, 2)}</pre>`,
    }).catch((error) => console.error("Lead notification email failed:", error));

    if (body.source !== "PHONE_CALL") {
      void sendEmail({
        to: body.email,
        subject: "We received your enquiry - KRAVEX",
        html: `<p>Thank you ${body.name}. We will be in touch within 24 hours to arrange your free strategy call.</p>`,
      }).catch((error) => console.error("Lead auto-reply email failed:", error));
    }

    return json({ success: true, id: lead.id, mode });
  } catch (error) {
    console.error("LEAD FORM SUBMISSION ERROR:", error);
    return json({
      error: "Something went wrong. Please try again or call us directly.",
    }, 500);
  }
}
