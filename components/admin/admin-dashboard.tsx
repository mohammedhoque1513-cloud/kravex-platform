"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Bell,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FileText,
  Plus,
  Search,
  Send,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";
import { LeadCaptureForm } from "@/components/shared/lead-capture-form";
import { formatMoney } from "@/lib/utils";
import { clientLeadChart, demoClients, demoInvoices, demoLeads, demoProspects, mrrTrend, vaultPolicy } from "./demo-data";

function Badge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" | "red" | "amber" | "grey" }) {
  const tones = {
    gold: "bg-kravex-gold text-black",
    green: "bg-kravex-success/15 text-kravex-success border border-kravex-success/30",
    red: "bg-kravex-error/15 text-kravex-error border border-kravex-error/30",
    amber: "bg-kravex-warning/15 text-kravex-warning border border-kravex-warning/30",
    grey: "bg-white/5 text-kravex-secondary border border-kravex-border",
  };
  return <span className={`inline-flex rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

function StatCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: React.ElementType }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-kravex-gold/10" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-kravex-secondary">{label}</p>
          <p className="mt-3 font-mono text-3xl text-kravex-gold">{value}</p>
        </div>
        <div className="rounded border border-kravex-gold/30 bg-kravex-gold/10 p-3 text-kravex-gold">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-kravex-secondary">{delta}</p>
    </Card>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded border border-kravex-gold/50 bg-black px-4 py-3 text-left text-sm font-bold text-kravex-gold transition hover:bg-kravex-gold hover:text-black">
      <Icon size={18} />
      {label}
    </button>
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

export function AdminDashboard() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const mrr = demoClients.reduce((sum, client) => sum + client.retainer, 0);
    const leads = demoLeads.length;
    const pipeline = demoProspects.reduce((sum, prospect) => sum + prospect.value, 0);
    return { mrr, leads, pipeline };
  }, []);

  const alerts: Array<{ id: string; tone: "red" | "amber"; title: string; detail: string }> = [
    { id: "stripe", tone: "amber" as const, title: "Connect Stripe before taking payments", detail: "Client payments must be processed through Stripe and recorded in the ledger before vault allocation." },
    { id: "bank", tone: "amber" as const, title: "Add verified business bank account", detail: "Owner withdrawals should only be requested from the Owner Pay After Tax vault once funds are available." },
    { id: "tax", tone: "amber" as const, title: "Confirm vault percentages with an accountant", detail: "Default tax, insurance and owner-pay percentages are placeholders until confirmed for KRAVEX." },
  ].filter((alert) => !dismissedAlerts.includes(alert.id));

  const filteredLeads = demoLeads.filter((lead) => `${lead.name} ${lead.client} ${lead.quality}`.toLowerCase().includes(query.toLowerCase()));

  function action(label: string) {
    setModal(label);
    toast.success(`${label} opened`);
  }

  async function saveQuickAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modal) return;
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const map: Record<string, { endpoint: string; body: Record<string, unknown> }> = {
      "Add Prospect": { endpoint: "/api/admin/prospects", body: { businessName: name, email, notes, estimatedValue: 0, stage: "NEW_LEAD" } },
      "Add Client": { endpoint: "/api/admin/clients", body: { businessName: name, contactName: name, email, notes, retainerAmount: 0, leadTarget: 0, contractStart: new Date().toISOString(), status: "ACTIVE" } },
      "Log Lead": { endpoint: "/api/admin/leads", body: { leadName: name, email, notes, source: "OTHER", quality: "WARM", status: "NEW" } },
      "Create Invoice": { endpoint: "/api/admin/invoices", body: { invoiceNumber: `KRX-${Date.now()}`, notes, subtotal: 0, vatAmount: 0, total: 0, status: "DRAFT", invoiceDate: new Date().toISOString(), dueDate: new Date(Date.now() + 7 * 86400000).toISOString() } },
    };
    const target = map[modal];
    if (!target || !name) {
      toast.error("Enter a business or lead name first.");
      setSaving(false);
      return;
    }
    const response = await fetch(target.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(target.body),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      toast.error(body.error || "Could not save that record.");
      return;
    }
    toast.success(`${modal} saved`);
    setModal(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Admin Command Centre</p>
          <h1 className="mt-3 font-heading text-5xl">Agency dashboard</h1>
          <p className="mt-3 max-w-2xl text-kravex-secondary">MRR, lead delivery, invoices, prospects and operational alerts in one place.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-3 text-kravex-gold">
            <Banknote size={20} />
            <p className="text-xs font-bold uppercase tracking-[.3em]">Phone Lead Intake</p>
          </div>
          <h2 className="mt-4 font-heading text-3xl">Enter a lead while they are on the phone.</h2>
          <p className="mt-4 leading-7 text-kravex-secondary">If a prospect calls you instead of filling the public form, capture the same details here. It creates the same enquiry record and adds the caller to the prospect pipeline.</p>
          <div className="mt-6 rounded border border-kravex-border bg-black p-4 text-sm text-kravex-secondary">
            <p className="font-bold text-white">Security rule</p>
            <p className="mt-2">Do not accept attachments, card numbers, bank passwords, login codes or remote-access requests through this form.</p>
          </div>
        </Card>
        <Card>
          <LeadCaptureForm mode="admin" />
        </Card>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-muted">Quick actions</p>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <QuickAction icon={Plus} label="Add Prospect" onClick={() => action("Add Prospect")} />
          <QuickAction icon={Users} label="Add Client" onClick={() => action("Add Client")} />
          <QuickAction icon={Target} label="Log Lead" onClick={() => action("Log Lead")} />
          <QuickAction icon={FileText} label="Create Invoice" onClick={() => action("Create Invoice")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total MRR" value={formatMoney(stats.mrr)} delta="No paying clients yet" icon={CircleDollarSign} />
        <StatCard label="Active Clients" value={`${demoClients.length}`} delta="Add your first client to start tracking retainers" icon={Users} />
        <StatCard label="Leads This Month" value={`${stats.leads}`} delta="No leads logged yet" icon={Target} />
        <StatCard label="Pipeline Value" value={formatMoney(stats.pipeline)} delta="No active prospects yet" icon={TrendingUp} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl">MRR last 6 months</h2>
              <p className="text-sm text-kravex-secondary">Retainer revenue trend in pence converted to GBP.</p>
            </div>
            <Badge>Live</Badge>
          </div>
          {mrrTrend.every((item) => item.mrr === 0) ? <EmptyState title="No revenue yet" body="MRR will appear here after you create clients, issue invoices and receive cleared payments." action="Create First Invoice" onAction={() => action("Create Invoice")} /> : <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrTrend}>
                <CartesianGrid stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="month" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" tickFormatter={(value) => `£${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} contentStyle={{ background: "#111", border: "1px solid #2a2a2a" }} />
                <Line type="monotone" dataKey="mrr" stroke="#c9a84c" strokeWidth={3} dot={{ fill: "#c9a84c" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>}
        </Card>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl">Leads by client</h2>
              <p className="text-sm text-kravex-secondary">Delivered against monthly target.</p>
            </div>
            <button onClick={() => toast.success("CSV export prepared")} className="rounded border border-kravex-border p-2 text-kravex-secondary hover:text-kravex-gold" aria-label="Download chart data">
              <Download size={18} />
            </button>
          </div>
          {clientLeadChart.length === 0 ? <EmptyState title="No client targets yet" body="Add a client and set their monthly lead target. Delivery charts will stay empty until real leads are logged." action="Add Client" onAction={() => action("Add Client")} /> : <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientLeadChart}>
                <CartesianGrid stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="client" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #2a2a2a" }} />
                <Bar dataKey="target" fill="#2a2a2a" radius={4} />
                <Bar dataKey="delivered" radius={4}>
                  {clientLeadChart.map((entry) => <Cell key={entry.client} fill={entry.delivered >= entry.target ? "#22c55e" : "#c9a84c"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-2xl">Alerts</h2>
            <Bell className="text-kravex-gold" size={20} />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded border border-kravex-border bg-black p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={alert.tone === "red" ? "text-kravex-error" : "text-kravex-warning"} size={20} />
                  <div className="flex-1">
                    <p className="font-bold">{alert.title}</p>
                    <p className="mt-1 text-sm text-kravex-secondary">{alert.detail}</p>
                  </div>
                  <button onClick={() => setDismissedAlerts((current) => [...current, alert.id])} className="text-kravex-muted hover:text-white" aria-label="Dismiss alert">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            {!alerts.length ? <p className="rounded border border-kravex-border bg-black p-4 text-sm text-kravex-secondary">Setup alerts cleared.</p> : null}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl">Recent leads</h2>
              <p className="text-sm text-kravex-secondary">Search, qualify and follow up from the latest delivery feed.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-kravex-muted" size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" className="w-full rounded border border-kravex-border bg-black py-2 pl-9 pr-3 text-sm text-white gold-focus sm:w-56" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-kravex-border text-xs uppercase tracking-wide text-kravex-muted">
                <tr><th className="py-3">Lead</th><th>Client</th><th>Quality</th><th>Source</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody className="divide-y divide-kravex-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[.02]">
                    <td className="py-4 font-bold">{lead.name}<span className="block font-normal text-kravex-secondary">{lead.phone}</span></td>
                    <td>{lead.client}</td>
                    <td><Badge tone={lead.quality === "HOT" ? "gold" : lead.quality === "WARM" ? "amber" : "grey"}>{lead.quality}</Badge></td>
                    <td>{lead.source}</td>
                    <td><Badge tone="grey">{lead.status}</Badge></td>
                    <td><button onClick={() => toast.success(`Follow-up queued for ${lead.name}`)} className="rounded border border-kravex-gold px-3 py-2 text-xs font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black">Follow up</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredLeads.length ? <EmptyState title="No leads logged yet" body="When a real client lead is qualified and delivered, it will appear here with status, source and follow-up controls." action="Log First Lead" onAction={() => action("Log Lead")} /> : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-heading text-2xl">Invoices</h2>
          <div className="mt-5 space-y-4">
            {demoInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded border border-kravex-border bg-black p-4">
                <div>
                  <p className="font-mono text-sm text-kravex-gold">{invoice.id}</p>
                  <p className="mt-1 text-sm text-kravex-secondary">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{formatMoney(invoice.amount)}</p>
                  <Badge tone={invoice.status === "PAID" ? "green" : invoice.status === "SENT" ? "amber" : "grey"}>{invoice.status}</Badge>
                </div>
              </div>
            ))}
            {!demoInvoices.length ? <EmptyState title="No invoices yet" body="Create an invoice when a client signs. Paid invoices will feed the vault allocation ledger." action="Create Invoice" onAction={() => action("Create Invoice")} /> : null}
          </div>
        </Card>

        <Card>
          <h2 className="font-heading text-2xl">Prospect pipeline</h2>
          <div className="mt-5 space-y-4">
            {demoProspects.slice(0, 3).map((prospect) => (
              <div key={prospect.id} className="rounded border border-kravex-border bg-black p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{prospect.businessName}</p>
                  <p className="font-mono text-kravex-gold">{formatMoney(prospect.value)}</p>
                </div>
                <p className="mt-1 text-sm text-kravex-secondary">{prospect.stage.replaceAll("_", " ")} · {prospect.lastContact}</p>
              </div>
            ))}
            {!demoProspects.length ? <EmptyState title="No prospects yet" body="Add prospects as you start outreach. Pipeline value stays at zero until real opportunities are entered." action="Add Prospect" onAction={() => action("Add Prospect")} /> : null}
          </div>
        </Card>

        <Card>
          <h2 className="font-heading text-2xl">Money vault policy</h2>
          <div className="mt-5 space-y-3">
            {vaultPolicy.map((vault) => (
              <div key={vault.key} className="rounded border border-kravex-border bg-black p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{vault.name}</p>
                  <p className="font-mono text-kravex-gold">{vault.percentage}%</p>
                </div>
                <p className="mt-1 text-xs text-kravex-secondary">{vault.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="w-full max-w-lg rounded-lg border border-kravex-gold/50 bg-kravex-card p-6 shadow-gold">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl">{modal}</h2>
              <button onClick={() => setModal(null)} className="text-kravex-muted hover:text-white" aria-label="Close modal"><X /></button>
            </div>
            <form onSubmit={saveQuickAction} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-kravex-secondary">
                Business or lead name
                <input name="name" required className="rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-kravex-secondary">
                Contact email
                <input name="email" type="email" className="rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-kravex-secondary">
                Notes
                <textarea name="notes" className="min-h-28 rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
              </label>
              <button disabled={saving} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
