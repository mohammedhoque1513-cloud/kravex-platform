import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { VAULT_POLICY, allocateVaultAmounts } from "@/lib/money";

type LocalDb = Record<string, any[]>;

const dataDir = process.env.NODE_ENV === "production" ? path.join("/tmp", "kravex-local") : path.join(process.cwd(), ".local");
const dataFile = path.join(dataDir, "kravex-data.json");

const emptyDb: LocalDb = {
  leadForms: [],
  contacts: [],
  prospects: [],
  clients: [],
  leads: [],
  campaigns: [],
  invoices: [],
  payments: [],
  settings: [
    { id: "setting-vat-rate", key: "vat_rate", value: "20", description: "Default UK VAT rate", updatedAt: new Date().toISOString() },
    { id: "setting-invoice-prefix", key: "invoice_prefix", value: "KRX", description: "Invoice number prefix", updatedAt: new Date().toISOString() },
    { id: "setting-min-contract", key: "min_contract_months", value: "3", description: "Minimum contract months", updatedAt: new Date().toISOString() },
  ],
  moneyVaults: VAULT_POLICY.map((vault) => ({ ...vault, id: `vault-${vault.key}`, balance: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
  moneyLedgerEntries: [],
  reconciliationRuns: [],
  backupRuns: [],
  messages: [],
  accountProfiles: [],
  notificationSettings: [],
  portalUsers: [],
};

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(emptyDb, null, 2));
}

export function readLocalDb(): LocalDb {
  ensureStore();
  try {
    return { ...emptyDb, ...JSON.parse(fs.readFileSync(dataFile, "utf8")) };
  } catch {
    fs.writeFileSync(dataFile, JSON.stringify(emptyDb, null, 2));
    return { ...emptyDb };
  }
}

export function writeLocalDb(db: LocalDb) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

export function listLocal(collection: string) {
  return readLocalDb()[collection] || [];
}

export function appendLocal(collection: string, data: Record<string, any>) {
  const db = readLocalDb();
  const now = new Date().toISOString();
  const record = { id: data.id || randomUUID(), ...data, createdAt: data.createdAt || now, updatedAt: data.updatedAt || now };
  db[collection] = [record, ...(db[collection] || [])];
  writeLocalDb(db);
  return record;
}

export function updateLocal(collection: string, id: string, data: Record<string, any>) {
  const db = readLocalDb();
  const rows = db[collection] || [];
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return null;
  rows[index] = { ...rows[index], ...data, updatedAt: new Date().toISOString() };
  db[collection] = rows;
  writeLocalDb(db);
  return rows[index];
}

export function softDeleteLocal(collection: string, id: string) {
  return updateLocal(collection, id, { deletedAt: new Date().toISOString() });
}

export function upsertLocalSetting(data: { key: string; value: string; description?: string }) {
  const db = readLocalDb();
  const rows = db.settings || [];
  const existing = rows.find((row) => row.key === data.key);
  if (existing) {
    Object.assign(existing, data, { updatedAt: new Date().toISOString() });
    writeLocalDb(db);
    return existing;
  }
  return appendLocal("settings", data);
}

export function localPaymentOverview() {
  const db = readLocalDb();
  const now = new Date();
  const payments = db.payments || [];
  const invoices = db.invoices || [];
  const collectedThisMonth = payments
    .filter((payment) => {
      const date = new Date(payment.paymentDate || payment.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = invoices.filter((invoice) => !["PAID", "CANCELLED"].includes(invoice.status)).reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
  const overdue = invoices
    .filter((invoice) => !["PAID", "CANCELLED"].includes(invoice.status) && invoice.dueDate && new Date(invoice.dueDate) < now)
    .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  return {
    collectedThisMonth,
    outstanding,
    overdue,
    expectedMrr: 0,
    payments,
    vaults: db.moneyVaults || [],
    ledgerEntries: db.moneyLedgerEntries || [],
    mode: "local-json",
  };
}

export function recordLocalPaymentSplit(input: { invoiceId: string; amount: number; reference: string }) {
  const db = readLocalDb();
  const payment = { id: randomUUID(), invoiceId: input.invoiceId, amount: input.amount, paymentDate: new Date().toISOString(), paymentMethod: "CARD", reference: input.reference, createdAt: new Date().toISOString() };
  db.payments = [payment, ...(db.payments || [])];
  db.moneyLedgerEntries = [
    { id: randomUUID(), invoiceId: input.invoiceId, type: "PAYMENT_RECEIVED", amount: input.amount, status: "AVAILABLE", reference: input.reference, createdAt: new Date().toISOString(), clearedAt: new Date().toISOString() },
    ...(db.moneyLedgerEntries || []),
  ];
  const allocations = allocateVaultAmounts(input.amount);
  for (const allocation of allocations) {
    const vault = (db.moneyVaults || []).find((item) => item.key === allocation.key);
    if (vault) vault.balance = Number(vault.balance || 0) + allocation.amount;
    db.moneyLedgerEntries.unshift({
      id: randomUUID(),
      invoiceId: input.invoiceId,
      vaultKey: allocation.key,
      type: "VAULT_ALLOCATION",
      amount: allocation.amount,
      status: "AVAILABLE",
      reference: input.reference,
      notes: `${allocation.percentage}% allocated to ${allocation.name}.`,
      createdAt: new Date().toISOString(),
      clearedAt: new Date().toISOString(),
    });
  }
  writeLocalDb(db);
  return { payment, allocations };
}

export function recordLocalJob(collection: "reconciliationRuns" | "backupRuns", data: Record<string, any>) {
  return appendLocal(collection, data);
}

export function localBackupSnapshot() {
  const db = readLocalDb();
  return {
    createdAt: new Date().toISOString(),
    counts: {
      clients: (db.clients || []).filter((row) => !row.deletedAt).length,
      invoices: (db.invoices || []).filter((row) => !row.deletedAt).length,
      payments: (db.payments || []).length,
      vaults: (db.moneyVaults || []).length,
      ledgerEntries: (db.moneyLedgerEntries || []).length,
    },
    vaults: db.moneyVaults || [],
    mode: "local-json",
  };
}
