"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

export default function Page() {
  const [quantity, setQuantity] = useState(1);
  const [unitAmount, setUnitAmount] = useState(150000);
  const subtotal = quantity * unitAmount;
  const vat = useMemo(() => Math.round(subtotal * 0.2), [subtotal]);
  const total = subtotal + vat;
  return (
    <div className="space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Invoices</p><h1 className="mt-3 font-heading text-5xl">Create invoice</h1></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card><div className="grid gap-4 md:grid-cols-2"><select className="rounded border border-kravex-border bg-black px-4 py-3"><option>Cardiff Heat Pumps</option><option>Metro Roofing</option></select><input type="date" defaultValue="2026-05-31" className="rounded border border-kravex-border bg-black px-4 py-3" /><input type="date" defaultValue="2026-06-07" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="KRX-2026-0004" className="rounded border border-kravex-border bg-black px-4 py-3" /></div><div className="mt-8 grid gap-4 md:grid-cols-[1fr_120px_160px]"><input defaultValue="Growth lead generation retainer" className="rounded border border-kravex-border bg-black px-4 py-3" /><input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="rounded border border-kravex-border bg-black px-4 py-3" /><input type="number" value={unitAmount} onChange={(event) => setUnitAmount(Number(event.target.value))} className="rounded border border-kravex-border bg-black px-4 py-3" /></div><textarea placeholder="Invoice notes" className="mt-4 min-h-28 w-full rounded border border-kravex-border bg-black px-4 py-3" /><div className="mt-6 flex flex-wrap gap-3"><button className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold">Save Draft</button><button className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Save and Send</button></div></Card>
        <Card><h2 className="font-heading text-2xl">PDF preview</h2><div className="mt-6 rounded bg-white p-6 text-black"><p className="font-heading text-3xl">KRAVEX</p><p className="mt-6 font-bold">Invoice KRX-2026-0004</p><div className="mt-6 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div><div className="flex justify-between"><span>VAT 20%</span><span>{formatMoney(vat)}</span></div><div className="flex justify-between border-t border-black pt-3 text-lg font-bold"><span>Total</span><span>{formatMoney(total)}</span></div></div></div></Card>
      </div>
    </div>
  );
}
