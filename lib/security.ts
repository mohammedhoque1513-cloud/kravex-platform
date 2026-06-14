import { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (existing.count >= limit) return { ok: false, remaining: 0 };
  existing.count += 1;
  return { ok: true, remaining: limit - existing.count };
}

export function assessLeadSubmission(body: Record<string, unknown>) {
  const text = Object.values(body).join(" ").toLowerCase();
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  const email = String(body.email || "").toLowerCase();
  const disposableDomains = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "yopmail.com"];
  const blockedPatterns = [
    "crypto recovery",
    "investment guaranteed",
    "wire transfer",
    "seed phrase",
    "password reset code",
    "urgent payment",
    "kindly send",
    "seo backlinks",
    "telegram",
    "whatsapp only",
  ];
  if (disposableDomains.some((domain) => email.endsWith(`@${domain}`))) return "Use a real business email address.";
  if (linkCount > 2) return "Too many links in the enquiry.";
  if (blockedPatterns.some((pattern) => text.includes(pattern))) return "This submission looks like spam or a scam attempt.";
  if (String(body.phone || "").replace(/\D/g, "").length < 7) return "Enter a real phone number.";
  return null;
}
