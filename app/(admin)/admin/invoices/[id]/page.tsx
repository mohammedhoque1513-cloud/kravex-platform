export const dynamic = "force-dynamic";

import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Invoice</p><h1 className="mt-3 font-heading text-5xl">KRX-2026-0002</h1><p className="mt-3 text-kravex-secondary">Metro Roofing Â· Due 22/05/2026</p></div><div className="flex flex-wrap gap-3"><button className="rounded bg-kravex-success px-5 py-3 font-bold text-black">Mark as Paid</button><button className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold">Download PDF</button><button className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold">Resend</button></div></div>
      <Card><div className="rounded bg-white p-8 text-black"><div className="flex justify-between"><div><p className="font-heading text-4xl">KRAVEX</p><p className="mt-2 text-sm">We Fill Your Pipeline. Every Month.</p></div><div className="text-right"><p className="font-bold">INVOICE</p><p>KRX-2026-0002</p><p className="mt-2 rounded bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">SENT</p></div></div><div className="mt-10 grid gap-8 md:grid-cols-2"><div><p className="text-xs uppercase text-gray-500">Bill to</p><p className="mt-2 font-bold">Metro Roofing</p><p>Mike Dawson</p><p>Manchester</p></div><div className="md:text-right"><p>Invoice date: 15/05/2026</p><p>Due date: 22/05/2026</p></div></div><table className="mt-10 w-full text-left text-sm"><thead><tr className="border-b border-gray-300"><th className="py-3">Description</th><th>Qty</th><th>Unit</th><th className="text-right">Total</th></tr></thead><tbody><tr className="border-b border-gray-200"><td className="py-4">Starter lead generation retainer - May 2026</td><td>1</td><td>{formatMoney(100000)}</td><td className="text-right">{formatMoney(100000)}</td></tr></tbody></table><div className="ml-auto mt-8 max-w-sm space-y-2"><div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(100000)}</span></div><div className="flex justify-between"><span>VAT 20%</span><span>{formatMoney(20000)}</span></div><div className="flex justify-between border-t border-black pt-3 text-xl font-bold"><span>Total</span><span>{formatMoney(120000)}</span></div></div></div></Card>
    </div>
  );
}
