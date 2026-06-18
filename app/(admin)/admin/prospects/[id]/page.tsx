export const dynamic = "force-dynamic";

import { CalendarClock, CheckCircle2, FileText, Mail, Phone } from "lucide-react";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Prospect profile</p>
          <h1 className="mt-3 font-heading text-5xl">Harborne Electrical</h1>
          <p className="mt-3 text-kravex-secondary">Electrical contractor Â· Birmingham Â· Proposal value {formatMoney(180000)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded bg-kravex-success px-5 py-3 font-bold text-black">Convert to Client</button>
          <button className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold">Edit Prospect</button>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Card>
          <h2 className="font-heading text-2xl">Profile</h2>
          <div className="mt-6 grid gap-4 text-sm">
            <p className="flex items-center gap-3"><Mail className="text-kravex-gold" size={18} /> hello@harborneelectrical.co.uk</p>
            <p className="flex items-center gap-3"><Phone className="text-kravex-gold" size={18} /> 0121 555 0100</p>
            <p className="flex items-center gap-3"><CalendarClock className="text-kravex-gold" size={18} /> Follow up tomorrow</p>
          </div>
          <label className="mt-6 block text-sm text-kravex-secondary">Stage</label>
          <select className="mt-2 w-full rounded border border-kravex-border bg-black px-4 py-3">
            <option>NEW_LEAD</option><option>CONTACTED</option><option>CALL_BOOKED</option><option>PROPOSAL_SENT</option><option>NEGOTIATING</option>
          </select>
          <button className="mt-6 w-full rounded border border-kravex-error px-5 py-3 font-bold text-kravex-error">Delete Prospect</button>
        </Card>
        <Card>
          <h2 className="font-heading text-2xl">Activity log</h2>
          <div className="mt-6 space-y-5">
            {[
              ["Website enquiry received", "Today"],
              ["Discovery call booked", "Yesterday"],
              ["Proposal draft prepared", "2 days ago"],
            ].map(([item, time]) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-1 text-kravex-gold" size={18} /><div><p className="font-bold">{item}</p><p className="text-sm text-kravex-muted">{time}</p></div></div>)}
          </div>
          <div className="mt-8 grid gap-4">
            <textarea placeholder="Add activity note" className="min-h-28 rounded border border-kravex-border bg-black px-4 py-3" />
            <button className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Add Activity</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
