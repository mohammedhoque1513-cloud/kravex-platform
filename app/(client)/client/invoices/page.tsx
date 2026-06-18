"use client";

import { useState } from "react";
import { CreditCard, Download, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

const invoices: Array<{ id: string; number: string; amount: number; status: "SENT" | "PAID" | "OVERDUE"; due: string }> = [];

export default function ClientInvoices() {
  const [selected, setSelected] = useState<string | null>(null);
  const invoice = invoices.find((item) => item.id === selected);

  function payNow() {
    toast.error("Stripe is not configured yet. Add Stripe keys before taking client card payments.");
  }

  return (
    <div className="space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client Dashboard</p><h1 className="mt-3 font-heading text-5xl">Invoices</h1><p className="mt-3 text-kravex-secondary">View invoices, download PDFs and pay outstanding balances securely through Stripe.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <h2 className="font-heading text-2xl">Invoice list</h2>
          {invoices.length ? <div className="mt-5 divide-y divide-kravex-border">{invoices.map((item) => <button key={item.id} onClick={() => setSelected(item.id)} className="grid w-full gap-3 py-4 text-left md:grid-cols-[1fr_120px_100px_120px]"><span className="font-mono text-kravex-gold">{item.number}</span><span>{formatMoney(item.amount)}</span><span className="text-kravex-secondary">{item.due}</span><span className={`rounded px-2 py-1 text-center text-xs font-bold ${item.status === "PAID" ? "bg-kravex-success text-black" : item.status === "OVERDUE" ? "bg-kravex-error text-white" : "bg-kravex-gold text-black"}`}>{item.status}</span></button>)}</div> : <div className="mt-5 rounded border border-dashed border-kravex-border bg-black p-8 text-center"><FileText className="mx-auto text-kravex-gold" /><p className="mt-3 font-heading text-3xl">No invoices yet</p><p className="mx-auto mt-3 max-w-xl text-kravex-secondary">When KRAVEX issues your first invoice, it will appear here with payment and download actions.</p></div>}
        </Card>
        <Card>
          <h2 className="font-heading text-2xl">Payment panel</h2>
          {invoice ? <div className="mt-5 space-y-4"><p className="font-mono text-kravex-gold">{invoice.number}</p><p className="font-heading text-4xl">{formatMoney(invoice.amount)}</p><button onClick={payNow} className="flex w-full items-center justify-center gap-2 rounded bg-kravex-gold px-5 py-3 font-bold text-black"><CreditCard size={18} />Pay Now</button><button onClick={() => toast.success("PDF download will be available when invoice PDF generation is connected.")} className="flex w-full items-center justify-center gap-2 rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold"><Download size={18} />Download PDF</button></div> : <div className="mt-5 rounded border border-kravex-border bg-black p-5"><ShieldCheck className="text-kravex-gold" /><p className="mt-3 font-bold">Secure payment flow</p><p className="mt-2 text-sm leading-6 text-kravex-secondary">Select an invoice to pay. Card details are handled by Stripe Elements, never stored directly by KRAVEX.</p></div>}
        </Card>
      </div>
    </div>
  );
}
