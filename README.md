# KRAVEX Platform

KRAVEX is a Next.js 14 lead generation platform with a public marketing site, admin portal, client portal, PostgreSQL schema, Stripe payments, Resend email, PDF/storage hooks, scheduled jobs, money-vault ledger logic and local fallbacks for development.

## Local Access

Demo accounts are enabled only in development and are not shown on the login screen or public pages. Use the local seed/auth files when working on this machine, and remove development fallback accounts before production launch.

## Lead Intake

- Home page lead form: public, no account needed, source `HOME_PAGE`.
- Admin dashboard phone form: used by Emdadul during calls, source `PHONE_CALL`.
- Both forms use the same `/api/lead-form` route.
- Public submissions email KRAVEX and send an auto-reply.
- Phone-call submissions create a prospect and notify KRAVEX only.
- Protections: Zod validation, UK phone validation, honeypot, 3/hour/IP rate limit, disposable email blocking, suspicious link blocking and scam phrase blocking.

## Scaling

- Vercel region: London `lhr1`.
- PostgreSQL indexes are added for client/date/status-heavy tables.
- Redis support is available through `REDIS_URL`.
- BullMQ queues are available for emails, PDFs, reconciliation and backups.
- Local development uses in-memory/local fallbacks when Redis/PostgreSQL are not connected.

## Security

Active in code:

- Role-based admin/client route protection.
- Protected API routes.
- Security headers and CSP in `next.config.mjs`.
- HSTS enabled for HTTPS production.
- Stripe tokenisation model: no full card numbers stored.
- No public file uploads.
- Security event table for rate limits, scam patterns, Stripe risk and operational alerts.

Production services that must be connected outside this repository:

- Cloudflare DNS, WAF, bot protection, DDoS protection and edge rate limits.
- Stripe live keys, Radar rules, webhook signing and verified payout bank account.
- Railway PostgreSQL.
- Redis provider for caching and queues.
- Resend verified domain with SPF, DKIM and DMARC.
- Companies House API for business verification.
- Sentry and uptime monitoring.
- Snyk or audit-ci in CI for dependency scanning.
- reCAPTCHA v3 keys if you want Google-backed bot scoring in addition to local controls.

## Money Handling

Client payments are processed by Stripe. KRAVEX records internal ledger allocations:

- 30% tax reserve
- 5% insurance
- 20% operations
- 10% growth
- 35% owner pay

These are accounting buckets, not separate protected bank accounts. Real transfers happen from Stripe to the verified business bank account, then owner withdrawals should only be made after cleared funds and accountant-approved tax allocation.

## Commands

```bash
npm run dev
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
npm audit
```
