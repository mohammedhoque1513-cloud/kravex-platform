import { ArrowRight, BarChart3, Building2, Mail, Phone, ShieldCheck, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLockup, BrandMark } from "../components/Brand";
import { Button } from "../components/UI";

const features = [
  ["Prospect Pipeline", "Track every business you are chasing from first contact to signed retainer.", Target],
  ["Lead Delivery", "Log each enquiry, source, quality rating, and client outcome in one place.", Users],
  ["Campaign Control", "See what cold email, Google Ads, and Meta campaigns are actually producing.", Mail],
  ["Reporting", "Give clients clean visibility while keeping your internal numbers organised.", BarChart3],
  ["Client Portal", "Clients log in to view only their leads, invoices, and updates.", ShieldCheck],
  ["Operations", "Replace spreadsheets with a system built for a real lead gen agency.", Building2]
];

const steps = [
  "KRAVEX signs a client and sets their niche, retainer, and monthly lead target.",
  "Campaigns run through cold outreach, Meta Ads, Google Ads, or referrals.",
  "Every real lead is logged, delivered, and tracked against that client account.",
  "Invoices, status, and monthly reporting stay visible for both admin and client."
];

const packages = [
  ["Starter", "£750/month", "8 to 10 leads per month, 1 campaign"],
  ["Growth", "£1,500/month", "15 to 20 leads per month, 2 campaigns"],
  ["Premium", "£2,500/month", "30 to 40 leads per month, full management"]
];

const discounts = [
  ["Pay upfront", "10% off to £1,350/month", "Pay 3 months upfront in full, £4,050 instead of £4,500."],
  ["Longer commitment", "15% off to £1,275/month", "Sign a 6 month minimum contract for a lower loyalty rate."],
  ["Starter trial rate", "First month at £750", "Requires a 3 month minimum contract before the trial rate applies."],
  ["Referral reward", "£200/month off", "Applies for every client they refer who signs and pays for at least one month."]
];

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <BrandLockup subtitle="Lead Generation Operating System" compact />
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#about" className="hover:text-slate-950">About</a>
            <a href="#services" className="hover:text-slate-950">What We Do</a>
            <a href="#process" className="hover:text-slate-950">How It Works</a>
            <Link to="/policies" className="hover:text-slate-950">Policies</Link>
            <a href="#contact" className="hover:text-slate-950">Contact</a>
          </nav>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_72%_28%,rgba(37,99,235,0.95)_0,rgba(15,23,42,0.98)_34%,rgba(2,6,23,1)_100%)] px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="absolute inset-y-auto right-[-8rem] top-10 h-[30rem] w-[30rem] rounded-full bg-[conic-gradient(from_180deg,#22d3ee,#a3e635,#2563eb,#22d3ee)] opacity-20 blur-sm" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative z-10">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-cyan-100">UK Lead Generation Agency</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight md:text-6xl">Turn outreach, ads, and enquiries into a reliable client machine.</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-200">KRAVEX gives your agency one place to run prospecting, campaigns, client delivery, invoices, and reporting without losing track of what is actually making money.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact"><Button className="shadow-[0_18px_40px_rgba(37,99,235,0.38)]">Book a Call</Button></a>
              <a href="#process"><Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">How It Works</Button></a>
            </div>
          </div>
          <div className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <BrandMark className="h-12 w-12" />
              <div>
                <div className="font-semibold">KRAVEX OS</div>
                <div className="text-sm text-slate-300">Agency command centre</div>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <div className="font-semibold">Pipeline</div>
                <div className="mt-1 text-sm text-slate-300">Move prospects from first contact to paying client.</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <div className="font-semibold">Lead Delivery</div>
                <div className="mt-1 text-sm text-slate-300">Track source, quality, notes, and client outcomes.</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <div className="font-semibold">Owner Clarity</div>
                <div className="mt-1 text-sm text-slate-300">See what has been billed, paid, and retained after costs.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">About KRAVEX</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Built for agencies delivering real leads to real businesses.</h2>
          </div>
          <div className="grid gap-4 text-slate-600">
            <p>KRAVEX is for lead generation agencies serving UK service businesses like dentists, roofers, solicitors, and aesthetic clinics. It combines internal CRM, client portal, reporting, and commercial tracking in one system.</p>
            <p>The point is not just to store data. The point is to know what is live, what has been delivered, what has been paid, and where the next signed client is coming from.</p>
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">What We Do</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Everything the agency needs to operate without spreadsheet drift.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(([title, text, Icon]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="mb-4 text-blue-600" size={22} />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">How It Works</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">A simple operating flow from signed client to delivered lead.</h2>
        <div className="mt-10 grid gap-4">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 font-bold text-blue-600">{index + 1}</div>
              <p className="pt-2 text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Clear packages with flexible, conditional offers.</h2>
          <p className="mt-4 max-w-3xl text-slate-600">KRAVEX keeps pricing straightforward. Standard growth pricing sits at £1,500/month, and discounts are only used when there is a real condition attached.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {packages.map(([name, price, text]) => (
              <div key={name} className={`rounded-2xl border p-6 shadow-sm ${name === "Growth" ? "border-blue-300 bg-white shadow-[0_20px_48px_rgba(37,99,235,0.12)]" : "border-slate-200 bg-white"}`}>
                {name === "Growth" ? <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Most common</div> : null}
                <h3 className="text-xl font-semibold">{name}</h3>
                <div className="mt-3 text-3xl font-black tracking-tight">{price}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {discounts.map(([title, price, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="mt-3 text-xl font-black tracking-tight text-slate-950">{price}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">What to say on the call</p>
              <p className="mt-4 text-xl font-semibold text-slate-950">“I understand. Can I ask — is it the monthly commitment that’s the concern or the total investment?”</p>
              <p className="mt-4 text-sm leading-6 text-slate-700">Let them answer first. Then offer the option that fits the real objection. Most of the time “it is expensive” actually means “show me why this is worth it.”</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Policy shortcut</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Need the formal version?</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">See the full KRAVEX Agency Policies page for payment terms, minimum contracts, cancellation, confidentiality, refunds, and results disclaimers.</p>
              <Link to="/policies" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">
                Open policies <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-950 px-5 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Contact</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Talk to KRAVEX about lead generation for your business.</h2>
            <p className="mt-4 max-w-xl text-slate-300">Use the portal for operations, and use the public site when a business wants to understand the offer, the process, and how to get in touch.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="grid gap-4 text-sm text-slate-200">
              <div className="flex items-center gap-3"><Mail size={18} className="text-cyan-300" /> hello@kravex.co.uk</div>
              <div className="flex items-center gap-3"><Phone size={18} className="text-cyan-300" /> United Kingdom</div>
              <Link to="/login" className="mt-4 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">Sign in to KRAVEX <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
