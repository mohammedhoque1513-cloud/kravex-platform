"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Filter,
  Mail,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";
import { demoCampaigns, demoClients, demoInvoices, demoLeads, demoProspects, moneyLedger, mrrTrend, vaultPolicy } from "./demo-data";

type SectionKind = "prospects" | "clients" | "leads" | "campaigns" | "invoices" | "payments" | "reports" | "settings";

function Badge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" | "red" | "amber" | "grey" | "blue" }) {
  const tones = {
    gold: "bg-kravex-gold text-black",
    green: "bg-kravex-success/15 text-kravex-success border border-kravex-success/30",
    red: "bg-kravex-error/15 text-kravex-error border border-kravex-error/30",
    amber: "bg-kravex-warning/15 text-kravex-warning border border-kravex-warning/30",
    blue: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    grey: "bg-white/5 text-kravex-secondary border border-kravex-border",
  };
  return <span className={`inline-flex rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

function Toolbar({ title, subtitle, action, onAction }: { title: string; subtitle: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Admin</p>
        <h1 className="mt-3 font-heading text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-kravex-secondary">{subtitle}</p>
      </div>
      <button onClick={onAction} className="inline-flex items-center justify-center gap-2 rounded bg-kravex-gold px-5 py-3 text-sm font-bold text-black hover:bg-kravex-lightGold">
        <Plus size={18} />
        {action}
      </button>
    </div>
  );
}

function DemoModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="w-full max-w-xl rounded-lg border border-kravex-gold/50 bg-kravex-card p-6 shadow-gold">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl">{title}</h2>
          <button onClick={onClose} className="text-kravex-muted hover:text-white" aria-label="Close modal"><X /></button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input placeholder="Name" className="rounded border border-kravex-border bg-black px-4 py-3 gold-focus" />
          <input placeholder="Email" className="rounded border border-kravex-border bg-black px-4 py-3 gold-focus" />
          <input placeholder="Phone" className="rounded border border-kravex-border bg-black px-4 py-3 gold-focus" />
          <input placeholder="Value / budget" className="rounded border border-kravex-border bg-black px-4 py-3 gold-focus" />
          <textarea placeholder="Notes" className="min-h-28 rounded border border-kravex-border bg-black px-4 py-3 gold-focus sm:col-span-2" />
          <button onClick={() => { toast.success(`${title} saved in demo mode`); onClose(); }} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black sm:col-span-2">Save</button>
        </div>
      </div>
    </div>
  );
}

function TableShell({ children, query, setQuery, filters }: { children: React.ReactNode; query: string; setQuery: (value: string) => void; filters?: React.ReactNode }) {
  return (
    <Card>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-kravex-muted" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" className="w-full rounded border border-kravex-border bg-black py-2.5 pl-10 pr-4 text-sm gold-focus" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters}
          <button onClick={() => toast.success("CSV export prepared")} className="inline-flex items-center gap-2 rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary hover:border-kravex-gold hover:text-kravex-gold"><Download size={16} /> Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}

function EmptyState({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rounded border border-dashed border-kravex-border bg-black p-8 text-center">
      <p className="font-heading text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-kravex-secondary">{body}</p>
      {action && onAction ? <button onClick={onAction} className="mt-5 rounded border border-kravex-gold px-4 py-2 text-sm font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black">{action}</button> : null}
    </div>
  );
}

export function AdminSectionPage({ kind }: { kind: SectionKind }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const copy = {
    prospects: ["Prospects", "Move prospects from first touch to signed client with clear follow-up discipline.", "Add Prospect"],
    clients: ["Clients", "Manage retainers, lead targets, invoice status and client portal access.", "Add Client"],
    leads: ["Leads", "Log, filter, qualify and export every lead delivered to every client.", "Log Lead"],
    campaigns: ["Campaigns", "Track acquisition platforms, performance, cost per lead and campaign status.", "Add Campaign"],
    invoices: ["Invoices", "Create, send, chase, mark paid and download invoices.", "Create Invoice"],
    payments: ["Payments", "Monitor collected revenue, outstanding invoices and payment history.", "Log Payment"],
    reports: ["Reports", "Review agency performance and generate client reports.", "Generate Report"],
    settings: ["Settings", "Configure agency profile, users, invoicing defaults, templates and niches.", "Save Settings"],
  }[kind];

  const normalized = query.toLowerCase();

  const filteredProspects = demoProspects.filter((item) => `${item.businessName} ${item.contactName} ${item.niche} ${item.stage}`.toLowerCase().includes(normalized));
  const filteredClients = demoClients.filter((item) => `${item.businessName} ${item.contactName} ${item.niche}`.toLowerCase().includes(normalized));
  const filteredLeads = demoLeads.filter((item) => `${item.name} ${item.client} ${item.quality}`.toLowerCase().includes(normalized));
  const filteredCampaigns = demoCampaigns.filter((item) => `${item.name} ${item.client} ${item.platform}`.toLowerCase().includes(normalized));
  const filteredInvoices = demoInvoices.filter((item) => `${item.id} ${item.client} ${item.status}`.toLowerCase().includes(normalized));

  function openAction(title: string) {
    setModal(title);
    toast.success(`${title} opened`);
  }

  return (
    <div className="space-y-8">
      <Toolbar title={copy[0]} subtitle={copy[1]} action={copy[2]} onAction={() => openAction(copy[2])} />

      {kind === "prospects" ? (
        <>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setView("kanban")} className={`rounded border px-4 py-2 text-sm font-bold ${view === "kanban" ? "border-kravex-gold bg-kravex-gold text-black" : "border-kravex-border text-kravex-secondary"}`}>Kanban</button>
            <button onClick={() => setView("list")} className={`rounded border px-4 py-2 text-sm font-bold ${view === "list" ? "border-kravex-gold bg-kravex-gold text-black" : "border-kravex-border text-kravex-secondary"}`}>List</button>
            <button className="inline-flex items-center gap-2 rounded border border-kravex-border px-4 py-2 text-sm text-kravex-secondary"><Filter size={16} /> Stage filter</button>
          </div>
          {view === "kanban" ? <ProspectKanban prospects={filteredProspects} /> : <ProspectsTable prospects={filteredProspects} query={query} setQuery={setQuery} />}
        </>
      ) : null}

      {kind === "clients" ? <ClientsTable clients={filteredClients} query={query} setQuery={setQuery} /> : null}
      {kind === "leads" ? <LeadsTable leads={filteredLeads} query={query} setQuery={setQuery} /> : null}
      {kind === "campaigns" ? <CampaignsGrid campaigns={filteredCampaigns} query={query} setQuery={setQuery} /> : null}
      {kind === "invoices" ? <InvoicesTable invoices={filteredInvoices} query={query} setQuery={setQuery} /> : null}
      {kind === "payments" ? <PaymentsPage onAction={openAction} /> : null}
      {kind === "reports" ? <ReportsPage /> : null}
      {kind === "settings" ? <SettingsPage /> : null}

      {modal ? <DemoModal title={modal} onClose={() => setModal(null)} /> : null}
    </div>
  );
}

function ProspectKanban({ prospects }: { prospects: typeof demoProspects }) {
  const stages = ["NEW_LEAD", "CONTACTED", "CALL_BOOKED", "PROPOSAL_SENT", "NEGOTIATING", "CLOSED_WON", "CLOSED_LOST"];
  return (
    <div className="grid gap-4 overflow-x-auto xl:grid-cols-7">
      {stages.map((stage) => (
        <div key={stage} className="min-w-64 rounded-lg border border-kravex-border bg-kravex-dark p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold">{stage.replaceAll("_", " ")}</h2>
            <Badge tone="grey">{prospects.filter((item) => item.stage === stage).length}</Badge>
          </div>
          <div className="space-y-3">
            {prospects.filter((item) => item.stage === stage).map((item) => (
              <div key={item.id} className="rounded border border-kravex-border bg-black p-4 transition hover:border-kravex-gold">
                <p className="font-bold">{item.businessName}</p>
                <p className="mt-1 text-sm text-kravex-secondary">{item.contactName}</p>
                <p className="mt-3 font-mono text-kravex-gold">{formatMoney(item.value)}</p>
                <p className="mt-2 text-xs text-kravex-muted">{item.niche} · {item.lastContact}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProspectsTable({ prospects, query, setQuery }: { prospects: typeof demoProspects; query: string; setQuery: (value: string) => void }) {
  return (
    <TableShell query={query} setQuery={setQuery}>
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="border-b border-kravex-border text-xs uppercase tracking-wide text-kravex-muted"><tr><th className="py-3">Business</th><th>Contact</th><th>Niche</th><th>City</th><th>Stage</th><th>Value</th><th>Actions</th></tr></thead>
      <tbody className="divide-y divide-kravex-border">{prospects.map((item) => <tr key={item.id}><td className="py-4 font-bold">{item.businessName}</td><td>{item.contactName}</td><td>{item.niche}</td><td>{item.city}</td><td><Badge tone="grey">{item.stage}</Badge></td><td className="font-mono text-kravex-gold">{formatMoney(item.value)}</td><td><RowActions /></td></tr>)}</tbody>
      </table>
      {!prospects.length ? <EmptyState title="No prospects yet" body="Add real prospects as outreach begins. This table stays empty until you enter genuine opportunities." /> : null}
    </TableShell>
  );
}

function ClientsTable({ clients, query, setQuery }: { clients: typeof demoClients; query: string; setQuery: (value: string) => void }) {
  return (
    <TableShell query={query} setQuery={setQuery} filters={<button className="rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary">Status: Active</button>}>
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-kravex-border text-xs uppercase tracking-wide text-kravex-muted"><tr><th className="py-3">Business</th><th>Niche</th><th>Retainer</th><th>Leads</th><th>Invoice</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody className="divide-y divide-kravex-border">{clients.map((client) => <tr key={client.id}><td className="py-4 font-bold">{client.businessName}<span className="block font-normal text-kravex-secondary">{client.contactName} · {client.city}</span></td><td>{client.niche}</td><td className="font-mono text-kravex-gold">{formatMoney(client.retainer)}</td><td><div className="w-40"><div className="mb-1 text-xs text-kravex-secondary">{client.leadsThisMonth}/{client.leadTarget}</div><div className="h-2 rounded bg-black"><div style={{ width: `${Math.min(100, (client.leadsThisMonth / client.leadTarget) * 100)}%` }} className="h-2 rounded bg-kravex-gold" /></div></div></td><td><Badge tone={client.invoiceStatus === "Paid" ? "green" : "amber"}>{client.invoiceStatus}</Badge></td><td><Badge tone="green">{client.status}</Badge></td><td><RowActions /></td></tr>)}</tbody>
      </table>
      {!clients.length ? <EmptyState title="No clients yet" body="When someone signs a retainer, add them here with their lead target, billing details and portal login." /> : null}
    </TableShell>
  );
}

function LeadsTable({ leads, query, setQuery }: { leads: typeof demoLeads; query: string; setQuery: (value: string) => void }) {
  return (
    <TableShell query={query} setQuery={setQuery} filters={<><button className="rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary">Quality</button><button className="rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary">Date range</button></>}>
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-kravex-border text-xs uppercase tracking-wide text-kravex-muted"><tr><th className="py-3">Name</th><th>Client</th><th>Quality</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody className="divide-y divide-kravex-border">{leads.map((lead) => <tr key={lead.id}><td className="py-4 font-bold">{lead.name}<span className="block font-normal text-kravex-secondary">{lead.phone}</span></td><td>{lead.client}</td><td><Badge tone={lead.quality === "HOT" ? "gold" : lead.quality === "WARM" ? "amber" : "grey"}>{lead.quality}</Badge></td><td>{lead.source}</td><td><select defaultValue={lead.status} className="rounded border border-kravex-border bg-black px-3 py-2"><option>NEW</option><option>CONTACTED</option><option>MEETING_BOOKED</option><option>CONVERTED</option><option>NO_RESPONSE</option></select></td><td>{lead.date}</td><td><RowActions /></td></tr>)}</tbody>
      </table>
      {!leads.length ? <EmptyState title="No leads delivered yet" body="Lead records should only be created once a real person or business has been qualified for a paying client." /> : null}
    </TableShell>
  );
}

function CampaignsGrid({ campaigns, query, setQuery }: { campaigns: typeof demoCampaigns; query: string; setQuery: (value: string) => void }) {
  return (
    <>
      <TableShell query={query} setQuery={setQuery} filters={<button className="rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary">Status</button>}>
        <div className="grid gap-5 lg:grid-cols-3">
          {campaigns.map((campaign) => <Card key={campaign.name} className="bg-black"><div className="flex items-start justify-between"><div><h2 className="font-heading text-2xl">{campaign.name}</h2><p className="mt-1 text-sm text-kravex-secondary">{campaign.client}</p></div><Badge tone={campaign.status === "ACTIVE" ? "green" : "grey"}>{campaign.status}</Badge></div><div className="mt-6 grid grid-cols-3 gap-3 text-sm"><div><p className="text-kravex-muted">Leads</p><p className="font-mono text-xl text-kravex-gold">{campaign.leads}</p></div><div><p className="text-kravex-muted">Platform</p><p>{campaign.platform}</p></div><div><p className="text-kravex-muted">CPL</p><p>{formatMoney(campaign.cpl)}</p></div></div><button onClick={() => toast.success(`${campaign.name} opened`)} className="mt-6 w-full rounded border border-kravex-gold px-4 py-2 text-sm font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black">View campaign</button></Card>)}
        </div>
        {!campaigns.length ? <EmptyState title="No campaigns yet" body="Create a campaign after a client is onboarded and budgets are confirmed." /> : null}
      </TableShell>
    </>
  );
}

function InvoicesTable({ invoices, query, setQuery }: { invoices: typeof demoInvoices; query: string; setQuery: (value: string) => void }) {
  return (
    <TableShell query={query} setQuery={setQuery} filters={<button className="rounded border border-kravex-border px-4 py-2.5 text-sm text-kravex-secondary">Status</button>}>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-kravex-border text-xs uppercase tracking-wide text-kravex-muted"><tr><th className="py-3">Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th>Due</th><th>Actions</th></tr></thead>
        <tbody className="divide-y divide-kravex-border">{invoices.map((invoice) => <tr key={invoice.id}><td className="py-4 font-mono text-kravex-gold">{invoice.id}</td><td>{invoice.client}</td><td className="font-mono">{formatMoney(invoice.amount)}</td><td><Badge tone={invoice.status === "PAID" ? "green" : invoice.status === "SENT" ? "blue" : "grey"}>{invoice.status}</Badge></td><td>{invoice.due}</td><td><RowActions extra={<button onClick={() => toast.success(`Chase email sent for ${invoice.id}`)} className="rounded border border-kravex-border p-2 text-kravex-secondary hover:text-kravex-gold"><Mail size={16} /></button>} /></td></tr>)}</tbody>
      </table>
      {!invoices.length ? <EmptyState title="No invoices yet" body="Create your first invoice only after a real client agrees to a retainer. Paid invoices create ledger entries." /> : null}
    </TableShell>
  );
}

function PaymentsPage({ onAction }: { onAction: (title: string) => void }) {
  const outstanding = demoInvoices.filter((invoice) => invoice.status !== "PAID").reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
        {[
          ["Collected this month", formatMoney(0), "green"],
          ["Outstanding", formatMoney(outstanding), "amber"],
          ["Overdue", formatMoney(0), "red"],
          ["Expected MRR", formatMoney(0), "gold"],
        ].map(([label, value, tone]) => <Card key={label}><p className="text-sm text-kravex-secondary">{label}</p><p className="mt-3 font-mono text-3xl text-kravex-gold">{value}</p><Badge tone={tone as "green" | "amber" | "red" | "gold"}>{label}</Badge></Card>)}
      </div>
      <Card>
        <h2 className="font-heading text-2xl">Money vaults</h2>
        <p className="mt-2 text-sm leading-6 text-kravex-secondary">These are internal ledger buckets. They do not hold money themselves. Real money is collected by Stripe, then payout requests move available funds to your verified bank account.</p>
        <div className="mt-5 space-y-4">{vaultPolicy.map((vault) => <div key={vault.key} className="rounded border border-kravex-border bg-black p-4"><div className="flex items-center justify-between"><div><p className="font-bold">{vault.name}</p><p className="mt-1 text-sm text-kravex-secondary">{vault.description}</p></div><div className="text-right"><p className="font-mono text-kravex-gold">{formatMoney(vault.balance)}</p><p className="text-xs text-kravex-muted">{vault.percentage}% allocation</p></div></div>{vault.key === "owner" ? <button onClick={() => onAction("Owner Withdrawal Request")} className="mt-4 rounded border border-kravex-gold px-3 py-2 text-xs font-bold text-kravex-gold disabled:cursor-not-allowed disabled:opacity-50" disabled={vault.balance === 0}>Request payout to bank</button> : null}</div>)}</div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="font-heading text-2xl">Payment ledger</h2>
        {moneyLedger.length ? null : <EmptyState title="No payment ledger entries yet" body="When a client pays by card, the Stripe webhook will create a payment record, allocate it across vaults, and mark the invoice paid. Until then, nothing is shown as received." />}
      </Card>
    </div>
  );
}

function ReportsPage() {
  const chartData = useMemo(() => mrrTrend.map((item) => ({ ...item, mrr: item.mrr / 1000 })), []);
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <Card><h2 className="font-heading text-2xl">Agency report</h2>{chartData.every((item) => item.mrr === 0 && item.leads === 0) ? <EmptyState title="No report data yet" body="Agency reporting starts once real payments, clients and leads are recorded." /> : <div className="mt-6 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid stroke="#2a2a2a" vertical={false} /><XAxis dataKey="month" stroke="#a0a0a0" /><YAxis stroke="#a0a0a0" /><Tooltip contentStyle={{ background: "#111", border: "1px solid #2a2a2a" }} /><Bar dataKey="mrr" fill="#c9a84c" radius={4} /><Bar dataKey="leads" fill="#606060" radius={4} /></BarChart></ResponsiveContainer></div>}</Card>
      <Card><h2 className="font-heading text-2xl">Client report generator</h2><div className="mt-6 grid gap-4"><select className="rounded border border-kravex-border bg-black px-4 py-3"><option>Patel Dental</option><option>Metro Roofing</option></select><input type="month" defaultValue="2026-05" className="rounded border border-kravex-border bg-black px-4 py-3" /><button onClick={() => toast.success("Client report generated")} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Generate report</button><button onClick={() => toast.success("PDF export prepared")} className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold">Download PDF</button></div></Card>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("Agency Profile");
  const tabs = ["Agency Profile", "Users", "Invoicing", "Email Templates", "Niches"];
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <Card className="h-fit"><div className="grid gap-2">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded px-4 py-3 text-left text-sm font-bold ${tab === item ? "bg-kravex-gold text-black" : "text-kravex-secondary hover:bg-black hover:text-kravex-gold"}`}>{item}</button>)}</div></Card>
      <Card><h2 className="font-heading text-3xl">{tab}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input defaultValue="KRAVEX" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="hello@kravex.co.uk" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="KRX" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="20" className="rounded border border-kravex-border bg-black px-4 py-3" /><textarea defaultValue="Premium UK lead generation agency." className="min-h-32 rounded border border-kravex-border bg-black px-4 py-3 sm:col-span-2" /><button onClick={() => toast.success(`${tab} saved`)} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black sm:col-span-2">Save changes</button></div></Card>
    </div>
  );
}

function RowActions({ extra }: { extra?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => toast.success("Record opened")} className="rounded border border-kravex-border p-2 text-kravex-secondary hover:text-kravex-gold"><Eye size={16} /></button>
      <button onClick={() => toast.success("Edit mode opened")} className="rounded border border-kravex-border p-2 text-kravex-secondary hover:text-kravex-gold"><Edit3 size={16} /></button>
      {extra}
      <button onClick={() => toast.error("Delete confirmation required")} className="rounded border border-kravex-border p-2 text-kravex-secondary hover:text-kravex-error"><Trash2 size={16} /></button>
    </div>
  );
}
