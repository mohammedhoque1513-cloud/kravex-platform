import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BrandLockup } from "../components/Brand";
import { Button } from "../components/UI";

const paymentTimeline = [
  ["Day 8", "Friendly reminder email"],
  ["Day 14", "Firm reminder and campaign paused"],
  ["Day 21", "Final notice and contract termination warning"],
  ["Day 30", "Service suspended and debt recovery considered"]
];

const leadGuaranteeRows = [
  ["You deliver target leads", "Full invoice. No discussion."],
  ["You deliver 80 to 99% of target", "Small credit on next invoice."],
  ["You deliver below 80%", "Proportional discount that month."],
  ["You deliver leads, client does not call them", "Full invoice. Follow-up is their responsibility."],
  ["Client says leads are poor quality", "Review together and adjust targeting."]
];

const refundRows = [
  ["You never started the work", "Full refund"],
  ["You started but delivered nothing", "Partial refund"],
  ["You delivered leads, client unhappy", "No refund, review and adjust"],
  ["Client changed their mind", "No refund, notice period applies"],
  ["Technical error on your side", "Credit on next invoice"]
];

const summary = [
  "Payment due within 7 days of invoice",
  "Minimum 3 month commitment",
  "30 days notice to cancel after minimum term",
  "Ad spend is separate from management fee",
  "We guarantee lead delivery, not conversions",
  "Communication via portal and email, 24 hour response",
  "Scope changes require a new agreement",
  "No refunds on delivered work",
  "Your data is fully confidential",
  "Early exit fee applies before minimum term ends"
];

function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link to="/">
          <BrandLockup subtitle="Lead Generation Operating System" compact />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link to="/" className="hover:text-slate-950">Home</Link>
          <Link to="/#about" className="hover:text-slate-950">About</Link>
          <Link to="/#services" className="hover:text-slate-950">What We Do</Link>
          <Link to="/#process" className="hover:text-slate-950">How It Works</Link>
          <Link to="/policies" className="text-slate-950">Policies</Link>
          <Link to="/#contact" className="hover:text-slate-950">Contact</Link>
        </nav>
        <Link to="/login"><Button>Sign In</Button></Link>
      </div>
    </header>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={row[0]} className="align-top">
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3 text-slate-600">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PolicyCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export default function Policies() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader />

      <section className="bg-[radial-gradient(circle_at_72%_28%,rgba(37,99,235,0.95)_0,rgba(15,23,42,0.98)_34%,rgba(2,6,23,1)_100%)] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-cyan-100">KRAVEX Agency Policies</div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-6xl">Protecting you without scaring clients off.</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200">
            Policies are not about being difficult. They are about being professional.
            A client who respects fair policies is usually a client worth keeping.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="rounded-3xl bg-slate-950 px-8 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)]">
          <h2 className="text-3xl font-black tracking-tight">The Golden Rule</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Always put policies in writing. Always send them before a client signs. Never apologise for having them.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 lg:px-8">
        <PolicyCard title="Policy 1 — Payment Terms">
          <p><span className="font-semibold text-slate-950">The rule:</span> Payment is due before the month begins, not after.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Invoice sent on the 1st of every month</li>
            <li>Payment due within 7 days</li>
            <li>Service starts or continues only when payment is received</li>
          </ul>
          <Table headers={["If they do not pay", "What happens"]} rows={paymentTimeline} />
          <p><span className="font-semibold text-slate-950">What to say:</span> “We invoice on the 1st and ask for payment within 7 days. This keeps campaigns running without interruption for you.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 2 — Minimum Contract Length">
          <p><span className="font-semibold text-slate-950">The rule:</span> Minimum 3 month commitment for all clients.</p>
          <p>Lead generation takes time to optimise. Month 1 is setup and testing. Month 2 is refinement. Month 3 is when results usually peak.</p>
          <p><span className="font-semibold text-slate-950">What to say:</span> “We ask for a minimum 3 month commitment because that is genuinely how long it takes to get campaigns dialled in and delivering consistently.”</p>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            <div className="font-semibold">Early exit fee</div>
            <p className="mt-2 text-sm">If they leave before 3 months, they owe the remaining months at 50% of the retainer.</p>
            <p className="mt-1 text-sm">Example: leaves after month 1 on a £1,500/month deal and owes a £750 exit fee.</p>
          </div>
        </PolicyCard>

        <PolicyCard title="Policy 3 — Lead Delivery Guarantee">
          <p><span className="font-semibold text-slate-950">The rule:</span> You guarantee a minimum number of leads per month. If you miss it, you compensate. If they do not follow up, that is on them.</p>
          <Table headers={["Scenario", "What happens"]} rows={leadGuaranteeRows} />
          <p><span className="font-semibold text-slate-950">What to say:</span> “We guarantee your monthly lead target. If we fall short we will credit you. But once a lead is delivered, following up is your responsibility.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 4 — Scope of Work">
          <p><span className="font-semibold text-slate-950">The rule:</span> You do what is in the agreement. Nothing more without a conversation.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">Included</div>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Campaign setup and management</li>
                <li>Lead generation to agreed monthly target</li>
                <li>Lead logging in the KRAVEX portal</li>
                <li>Monthly performance report</li>
                <li>One strategy call per month</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">Not included without extra charge</div>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Building their website or landing pages</li>
                <li>Managing their social media</li>
                <li>Writing sales scripts</li>
                <li>Calling leads on their behalf</li>
                <li>Running ads outside the agreed platform</li>
              </ul>
            </div>
          </div>
          <p><span className="font-semibold text-slate-950">What to say:</span> “That is outside our current scope but I can put together a small add-on package for that.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 5 — Communication Policy">
          <p><span className="font-semibold text-slate-950">The rule:</span> You are available during business hours. You are not available 24/7.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>All communication via email or KRAVEX portal messages</li>
            <li>Response time within 24 hours Monday to Friday</li>
            <li>No WhatsApp unless you choose to offer it</li>
            <li>Monthly strategy call, 30 minutes, scheduled in advance</li>
            <li>Emergency contact only for campaign technical issues</li>
          </ul>
          <p><span className="font-semibold text-slate-950">What to say:</span> “All updates and lead delivery happen through your KRAVEX portal. For questions, email is best and I respond within 24 hours.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 6 — Ad Spend Policy">
          <p><span className="font-semibold text-slate-950">The rule:</span> Ad spend is separate from your management fee. Always.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your retainer covers time, strategy, setup, management, and reporting</li>
            <li>Ad spend goes directly to Meta or Google, not through you</li>
            <li>Client sets up their own ad account or you manage it with their card</li>
            <li>You never hold client money for ad spend</li>
          </ul>
          <p><span className="font-semibold text-slate-950">What to say:</span> “My fee covers everything I do. Ad spend goes directly to the platform and is completely separate.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 7 — Cancellation Policy">
          <p><span className="font-semibold text-slate-950">The rule:</span> 30 days written notice required to cancel after the minimum term.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Client emails cancellation request</li>
            <li>30 day notice period begins from that date</li>
            <li>Final invoice issued for the notice period</li>
            <li>Portal access ends at the end of the notice period</li>
            <li>All lead data exported and sent to client on exit</li>
          </ul>
          <p><span className="font-semibold text-slate-950">What to say:</span> “After the initial term, either party can cancel with 30 days written notice. We will always send a full export of your leads before we close things out.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 8 — Refund Policy">
          <p><span className="font-semibold text-slate-950">The rule:</span> No refunds on work already delivered.</p>
          <Table headers={["Situation", "Outcome"]} rows={refundRows} />
          <p><span className="font-semibold text-slate-950">What to say:</span> “Because we invest time and resources into your campaign from day one, we do not offer refunds on work in progress. If there is ever an issue we will find a fair resolution.”</p>
        </PolicyCard>

        <PolicyCard title="Policy 9 — Confidentiality">
          <p><span className="font-semibold text-slate-950">The rule:</span> You do not share one client’s data with another. Ever.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Their leads stay in their portal only</li>
            <li>You never share campaign performance with competitors</li>
            <li>You never use their business name in case studies without written permission</li>
            <li>Their retainer amount is never disclosed</li>
          </ul>
        </PolicyCard>

        <PolicyCard title="Policy 10 — Results Disclaimer">
          <p><span className="font-semibold text-slate-950">The rule:</span> You guarantee lead delivery. You do not guarantee conversions.</p>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            <p className="font-semibold">“We are responsible for generating and delivering qualified enquiries. Converting those enquiries into paying customers is the responsibility of your team.”</p>
          </div>
          <p>This protects you from situations where slow follow-up or a weak sales process on the client side hurts conversions.</p>
        </PolicyCard>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black tracking-tight">KRAVEX Client Policies — Summary</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {summary.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="mr-2 font-semibold text-emerald-600">Yes</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight">The one thing to remember</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              Policies said out loud on a call can sound strict. Policies written in a clean document sound professional.
              A client who pushes back hard on fair policies before they have even started is telling you something useful.
            </p>
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
            Sign in to KRAVEX <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
