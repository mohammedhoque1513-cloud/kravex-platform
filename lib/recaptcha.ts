import { requiresConfigured } from "@/lib/production";

export async function verifyRecaptcha(token: unknown, action: string) {
  if (!requiresConfigured("RECAPTCHA_SECRET_KEY", process.env.RECAPTCHA_SECRET_KEY)) {
    console.warn("reCAPTCHA verification skipped because RECAPTCHA_SECRET_KEY is not configured.");
    return { ok: true, score: null, reason: "reCAPTCHA is not configured." };
  }
  if (!token || typeof token !== "string") return { ok: false, score: null, reason: "Missing bot protection token." };

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY || "", response: token }),
  });
  const body = await response.json();
  const score = typeof body.score === "number" ? body.score : null;
  const actionMatches = !body.action || body.action === action;
  return {
    ok: Boolean(body.success && actionMatches && (score === null || score >= 0.5)),
    score,
    reason: body.success ? "Bot score too low." : "Bot protection failed.",
  };
}
