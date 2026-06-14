import { AlertTriangle, CheckCircle2, Cloud, LockKeyhole, ScanSearch, ShieldCheck, Siren, Workflow } from "lucide-react";
import { Card } from "@/components/shared/ui";
import { SecurityEventsPanel } from "@/components/admin/security-events-panel";

const layers = [
  { title: "Cloudflare edge", status: "Production setup required", body: "DNS, WAF, bot fight mode, DDoS protection and rate limits must be enabled in the Cloudflare account before launch.", icon: Cloud, tone: "amber" },
  { title: "Security headers", status: "Active in code", body: "CSP, HSTS, frame protection, MIME protection, referrer policy and permissions policy are configured in Next.js.", icon: ShieldCheck, tone: "green" },
  { title: "Input checks", status: "Active in code", body: "Public forms use Zod validation, UK phone validation, rate limits, honeypot, reCAPTCHA-ready bot checks, disposable email blocking and scam phrase checks.", icon: ScanSearch, tone: "green" },
  { title: "2FA", status: "Active in code", body: "TOTP setup, QR generation and login enforcement are implemented. Enable it per real database user before production launch.", icon: LockKeyhole, tone: "green" },
  { title: "Stripe Radar", status: "Production setup required", body: "Webhook signature checks, overpayment refunds and failure logging are active. Radar rules still depend on your live Stripe account.", icon: Siren, tone: "amber" },
  { title: "Queues and Redis", status: "Production setup required", body: "Heavy work should run through Redis-backed queues. Local development falls back to direct execution.", icon: Workflow, tone: "amber" },
];

const checks = [
  "No public file uploads, which removes attachment malware risk from enquiry forms.",
  "Payments are tokenised by Stripe; KRAVEX never stores full card numbers.",
  "Client and admin API routes are role protected.",
  "Money vaults are internal ledger buckets, not separate bank accounts.",
  "Owner withdrawals should only be made after cleared Stripe payouts and accountant-approved tax allocation.",
  "Backups and reconciliation are scheduled jobs and need production credentials to run safely.",
];

export default function AdminSecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Security and Scale</p>
        <h1 className="mt-3 font-heading text-5xl">Protection controls</h1>
        <p className="mt-3 max-w-3xl text-kravex-secondary">A plain-English view of what is already active in the application and what must be connected through external production accounts before KRAVEX takes real client payments.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {layers.map(({ title, status, body, icon: Icon, tone }) => (
          <Card key={title}>
            <div className="flex items-center justify-between gap-4">
              <Icon className="text-kravex-gold" />
              <span className={`rounded px-2.5 py-1 text-xs font-bold uppercase ${tone === "green" ? "bg-kravex-success/15 text-kravex-success" : "bg-kravex-warning/15 text-kravex-warning"}`}>{status}</span>
            </div>
            <h2 className="mt-5 font-heading text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-kravex-secondary">{body}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Card>
          <div className="flex items-center gap-3 text-kravex-gold">
            <CheckCircle2 size={20} />
            <h2 className="font-heading text-3xl text-white">Defence checklist</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {checks.map((item) => (
              <p key={item} className="flex gap-3 rounded border border-kravex-border bg-black p-4 text-sm text-kravex-secondary">
                <CheckCircle2 className="mt-0.5 shrink-0 text-kravex-gold" size={16} />
                {item}
              </p>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 text-kravex-warning">
            <AlertTriangle size={20} />
            <h2 className="font-heading text-3xl text-white">Do not go live until</h2>
          </div>
          <div className="mt-6 space-y-3 text-sm leading-6 text-kravex-secondary">
            <p>Cloudflare is active on kravex.co.uk and the app is behind HTTPS only.</p>
            <p>Stripe live keys, Radar, webhook signing and verified payout bank account are configured.</p>
            <p>Railway PostgreSQL, Redis, backup storage, Sentry, uptime monitoring and dependency scanning are connected.</p>
            <p>DMARC, SPF and DKIM pass for all KRAVEX outbound email.</p>
          </div>
        </Card>
      </div>

      <SecurityEventsPanel />
    </div>
  );
}
