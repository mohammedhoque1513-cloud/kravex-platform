import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);
export const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@kravex.co.uk";
export const adminEmail = process.env.ADMIN_EMAIL || "emdadul.hoque@kravex.co.uk";
export async function sendEmail(input: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("...")) return { skipped: true };
  return resend.emails.send({ from: `KRAVEX <${fromEmail}>`, ...input });
}
