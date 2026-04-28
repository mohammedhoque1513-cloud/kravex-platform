# KRAVEX

Internal CRM, client portal, campaign tracker, outreach manager, invoicing, and reporting platform for a UK lead generation agency.

## Tech Stack

- React, Vite, Tailwind CSS, Recharts, `@hello-pangea/dnd`
- Node.js, Express, JWT auth, bcrypt
- PostgreSQL with Prisma ORM
- PDFKit invoice export

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Copy environment placeholders:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Update `server/.env` with your PostgreSQL connection string and JWT secret.

4. Create the database schema and seed data:

   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` and the web app runs on `http://localhost:5173`.

## Seed Logins

- Admin: `admin@kravex.co.uk` / `Password123!`
- Client: `owner@brightsmile.co.uk` / `Password123!`

## Deployment Notes

The project is structured for a split deployment:

- `client/` as the public website and app frontend
- `server/` as the Express API
- PostgreSQL as the production database

### Render

A starter [`render.yaml`](</C:/Users/emdad/OneDrive/Documents/New project/render.yaml>) is included for:

- `kravex-api` as a Node web service
- `kravex-web` as a static site
- `kravex-db` as a managed Render PostgreSQL database

Render will provision the database connection string and JWT secret from the Blueprint.

Set these environment variables before going live:

- `CLIENT_URL`
- `VITE_API_URL`
- `NODE_ENV=production`
- `KRAVEX_USE_EMBEDDED_DB=false`
- `KRAVEX_SEED_ON_BOOT=false`

After deployment:

1. Point the frontend custom domain to `kravex.co.uk`
2. Point the API to a subdomain such as `api.kravex.co.uk`
3. Set `CLIENT_URL=https://kravex.co.uk`
4. Set `VITE_API_URL=https://api.kravex.co.uk/api`

Production note:

- the embedded Windows database is only for local development
- on Render, use a managed PostgreSQL instance and keep demo seeding disabled

### Railway

Deploy `/server` as the web service, set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, and run Prisma migrations during release. Build `/client` with `npm run build --workspace client` and serve the generated `dist` folder through your preferred static host.

## Money Handling Protocol

For a real production KRAVEX deployment, use this separation:

- Client billing collection:
  - `Stripe` for cards or `GoCardless` for UK bank debit mandates
- Agency payout / owner withdrawal:
  - your verified business bank account only
- Accounting truth:
  - invoices, payments, VAT, and owner withdrawals must all be stored server-side in PostgreSQL

Recommended flow:

1. Client signs mandate or card authorisation
2. Monthly invoice is created automatically
3. Provider collects payment
4. Provider webhook marks invoice as paid
5. VAT and operating costs are separated
6. Only remaining owner funds become withdrawable
7. Owner withdrawal is recorded with audit trail

Do not:

- store raw bank login details
- move live client money directly from frontend code
- rely on browser localStorage as the source of truth for payments
- treat unpaid invoices as owner money

## Backup Protocol

Use at least three layers:

1. Database backups
   - daily encrypted PostgreSQL backups
   - retain at least 30 days
2. File and invoice backups
   - copy generated invoices, exports, and uploads to offsite object storage
3. App-level exports
   - allow admin JSON/CSV export for emergency recovery

Recommended recovery posture:

- nightly automated PostgreSQL dump
- weekly restore test into a staging database
- environment variables stored in the host secret manager
- separate backup location from app host
- audit log for payment, deposit, billing, and account-detail changes

The preview running on `5173` now includes:

- local rolling snapshots
- manual backup download
- manual backup restore
- payout verification flow

Those preview protections are helpful for local resilience, but the real protection comes from provider-backed payments plus encrypted server-side backups on the deployed system.
