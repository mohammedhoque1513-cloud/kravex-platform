"use client";

import { useMemo } from "react";
import { Bell, FileText, MessageSquare, Target, ThermometerSun } from "lucide-react";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

const leads: any[] = [];

export default function ClientDashboard() {
  const target = 0;
  const delivered = leads.length;
  const progress = useMemo(() => (target ? Math.min(100, (delivered / target) * 100) : 0), [delivered, target]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client Dashboard</p>
        <h1 className="mt-3 font-heading text-5xl">{greeting}</h1>
        <p className="mt-3 text-kravex-secondary">Here is your KRAVEX overview.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-kravex-secondary">Leads this month</p><p className="mt-2 font-mono text-5xl text-kravex-gold">{delivered}</p></div>
            <Target className="text-kravex-gold" size={32} />
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-kravex-secondary"><span>{delivered} delivered</span><span>{target || "No target set"} target</span></div>
          <div className="mt-3 h-3 rounded bg-black"><div style={{ width: `${progress}%` }} className="h-3 rounded bg-kravex-gold" /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[["Hot", 0], ["Warm", 0], ["Cold", 0]].map(([label, value]) => <div key={label} className="rounded border border-kravex-border bg-black p-4"><p className="text-sm text-kravex-secondary">{label}</p><p className="mt-2 font-mono text-2xl text-kravex-gold">{value}</p></div>)}
          </div>
        </Card>

        <Card>
          <h2 className="font-heading text-2xl">Latest lead</h2>
          <div className="mt-5 rounded border border-dashed border-kravex-border bg-black p-6 text-center">
            <ThermometerSun className="mx-auto text-kravex-gold" />
            <p className="mt-3 font-bold">No leads delivered yet</p>
            <p className="mt-2 text-sm leading-6 text-kravex-secondary">When KRAVEX qualifies a lead for you, it appears here with phone, email, quality, source and status controls.</p>
            <a href="/client/leads" className="mt-5 inline-flex rounded border border-kravex-gold px-4 py-2 text-sm font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black">View all leads</a>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card><FileText className="text-kravex-gold" /><h2 className="mt-4 font-heading text-2xl">Invoice status</h2><p className="mt-3 text-kravex-secondary">No outstanding invoice.</p><p className="mt-4 font-mono text-2xl text-kravex-gold">{formatMoney(0)}</p></Card>
        <Card><MessageSquare className="text-kravex-gold" /><h2 className="mt-4 font-heading text-2xl">Latest update</h2><p className="mt-3 text-kravex-secondary">No messages yet. KRAVEX updates will appear here.</p><a href="/client/messages" className="mt-5 inline-block text-sm font-bold text-kravex-gold">View messages</a></Card>
        <Card><Bell className="text-kravex-gold" /><h2 className="mt-4 font-heading text-2xl">Notifications</h2><p className="mt-3 text-kravex-secondary">Email alerts are enabled for leads, invoices and messages.</p><a href="/client/account" className="mt-5 inline-block text-sm font-bold text-kravex-gold">Manage account</a></Card>
      </div>
    </div>
  );
}
