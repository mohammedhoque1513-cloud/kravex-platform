"use client";

import { useMemo, useState } from "react";
import { Download, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";

const seedLeads: Array<{ id: string; name: string; phone: string; email: string; quality: "HOT" | "WARM" | "COLD"; source: string; date: string; status: string; notes: string; clientNotes: string }> = [];
const filters = ["All", "HOT", "WARM", "COLD"] as const;

export default function ClientLeads() {
  const [quality, setQuality] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState(seedLeads);
  const filtered = useMemo(() => leads.filter((lead) => (quality === "All" || lead.quality === quality) && `${lead.name} ${lead.phone} ${lead.email}`.toLowerCase().includes(query.toLowerCase())), [leads, quality, query]);

  function updateLead(id: string, data: Partial<(typeof seedLeads)[number]>) {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, ...data } : lead));
    toast.success("Lead updated locally");
  }

  function exportCsv() {
    const csv = ["Name,Phone,Email,Quality,Source,Status", ...filtered.map((lead) => [lead.name, lead.phone, lead.email, lead.quality, lead.source, lead.status].map((value) => JSON.stringify(value)).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "kravex-leads.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client Dashboard</p><h1 className="mt-3 font-heading text-5xl">My Leads</h1><p className="mt-3 text-kravex-secondary">Review, call, email, update and export every lead KRAVEX delivers.</p></div>
        <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black"><Download size={18} />Download CSV</button>
      </div>
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setQuality(item)} className={`rounded border px-4 py-2 text-sm font-bold ${quality === item ? "border-kravex-gold bg-kravex-gold text-black" : "border-kravex-border text-kravex-secondary"}`}>{item}</button>)}</div>
          <div className="relative"><Search className="absolute left-3 top-3 text-kravex-muted" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or phone" className="w-full rounded border border-kravex-border bg-black py-2.5 pl-10 pr-4 text-white gold-focus md:w-80" /></div>
        </div>
      </Card>
      {filtered.length ? <div className="grid gap-4">{filtered.map((lead) => <Card key={lead.id}><div className="grid gap-4 lg:grid-cols-[1fr_220px]"><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-heading text-2xl">{lead.name}</h2><span className="rounded bg-kravex-gold px-2 py-1 text-xs font-bold text-black">{lead.quality}</span></div><div className="mt-4 flex flex-wrap gap-3 text-sm"><a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 text-kravex-gold"><Phone size={16} />{lead.phone}</a><a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-kravex-gold"><Mail size={16} />{lead.email}</a><span className="text-kravex-secondary">{lead.source} · {lead.date}</span></div><p className="mt-4 text-sm text-kravex-secondary">{lead.notes}</p><textarea value={lead.clientNotes} onChange={(e) => updateLead(lead.id, { clientNotes: e.target.value })} placeholder="Your notes" className="mt-4 min-h-24 w-full rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" /></div><div><label className="text-sm font-bold text-kravex-secondary">Status</label><select value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value })} className="mt-2 w-full rounded border border-kravex-border bg-black px-4 py-3 text-white"><option>New</option><option>Called - No Answer</option><option>Contacted</option><option>Meeting Booked</option><option>Converted</option><option>Not Interested</option></select></div></div></Card>)}</div> : <Card><div className="rounded border border-dashed border-kravex-border bg-black p-8 text-center"><p className="font-heading text-3xl">No leads delivered yet</p><p className="mx-auto mt-3 max-w-xl text-kravex-secondary">Once KRAVEX qualifies your first real lead, it will appear here with call, email, notes and status controls.</p></div></Card>}
    </div>
  );
}
