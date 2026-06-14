import { Resend } from "resend";

let resend: Resend | null = null;

export const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@kravex.co.uk";
export const adminEmail = process.env.ADMIN_EMAIL || "emdadul.hoque@kravex.co.uk";

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes("...")) return { skipped: true };

  resend ??= new Resend(apiKey);
  return resend.emails.send({ from: `KRAVEX <${fromEmail}>`, ...input });
}
