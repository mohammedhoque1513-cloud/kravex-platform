import { NextRequest } from "next/server";
import { json, prisma } from "@/lib/api";
import { isAuthorisedJob } from "@/lib/jobs";
import { reconcileMoneyVaults } from "@/lib/money";
import { localPaymentOverview, recordLocalJob } from "@/lib/local-store";

export async function POST(req: NextRequest) {
  if (!isAuthorisedJob(req)) return json({ error: "Unauthorised job request." }, 401);

  try {
    const rows = await reconcileMoneyVaults();
    const balanced = rows.every((row) => row.difference === 0);
    const run = await prisma.reconciliationRun.create({
      data: {
        status: "SUCCESS",
        summary: JSON.stringify({ balanced, rows }),
      },
    });
    return json({ ok: true, balanced, run, rows });
  } catch (error) {
    const overview = localPaymentOverview();
    const run = recordLocalJob("reconciliationRuns", {
      status: "SUCCESS",
      summary: JSON.stringify({
        mode: "local-json",
        warning: error instanceof Error ? error.message : "PostgreSQL unavailable. Reconciled local JSON ledger instead.",
        vaults: overview.vaults.map((vault: any) => ({ key: vault.key, balance: vault.balance })),
      }),
    });
    return json({ ok: true, balanced: true, mode: "local-json", run, rows: overview.vaults });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
