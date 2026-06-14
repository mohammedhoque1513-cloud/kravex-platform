import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { json, prisma } from "@/lib/api";
import { isAuthorisedJob } from "@/lib/jobs";
import { localBackupSnapshot, recordLocalJob } from "@/lib/local-store";

export async function POST(req: NextRequest) {
  if (!isAuthorisedJob(req)) return json({ error: "Unauthorised job request." }, 401);

  try {
    const snapshot = {
      createdAt: new Date().toISOString(),
      counts: {
        clients: await prisma.client.count(),
        invoices: await prisma.invoice.count(),
        payments: await prisma.payment.count(),
        vaults: await prisma.moneyVault.count(),
        ledgerEntries: await prisma.moneyLedgerEntry.count(),
      },
      vaults: await prisma.moneyVault.findMany({ orderBy: { name: "asc" } }),
    };

    let target = "local-log";
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes("...")) {
      const blob = await put(`backups/kravex-${snapshot.createdAt}.json`, JSON.stringify(snapshot, null, 2), {
        access: "private",
        contentType: "application/json",
      });
      target = blob.url;
    }

    const run = await prisma.backupRun.create({
      data: {
        status: "SUCCESS",
        target,
        summary: JSON.stringify(snapshot.counts),
      },
    });

    return json({ ok: true, run, snapshot });
  } catch (error) {
    const snapshot = localBackupSnapshot();
    const run = recordLocalJob("backupRuns", {
      status: "SUCCESS",
      target: "local-json",
      summary: JSON.stringify({
        mode: "local-json",
        warning: error instanceof Error ? error.message : "PostgreSQL unavailable. Backed up local JSON store instead.",
        counts: snapshot.counts,
      }),
    });
    return json({ ok: true, mode: "local-json", run, snapshot });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
