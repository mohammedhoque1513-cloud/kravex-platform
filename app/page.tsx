"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  CreditCard,
  FileBarChart,
  Headphones,
  Landmark,
  LockKeyhole,
  MailCheck,
  MessageSquare,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";
import { LeadCaptureForm } from "@/components/shared/lead-capture-form";

const industries = [
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    copy: "Implants, veneers, Invisalign and high-value treatment enquiries from people actively looking for clinics.",
    leadTypes: "Treatment enquiry, consultation request, finance-ready patient",
  },
  {
    icon: BadgeCheck,
    title: "Aesthetic Clinics",
    copy: "Botox, fillers, skin treatments, laser and consultation leads for clinics that need a steady appointment flow.",
    leadTypes: "Consultation request, treatment interest, repeat-care opportunity",
  },
  {
    icon: BriefcaseBusiness,
    title: "Roofing & Trades",
    copy: "Homeowner and commercial enquiries for repairs, replacements, inspections and quote requests.",
    leadTypes: "Quote request, emergency repair, planned project",
  },
  {
    icon: Landmark,
    title: "Legal & Solicitors",
    copy: "Structured enquiry capture for practice areas where clarity, compliance and fast response matter.",
    leadTypes: "Case enquiry, call request, document-ready prospect",
  },
];

const deliverySteps = [
  ["01", "Discovery", "We map your offer, service area, target customer, pricing reality and what counts as a qualified lead."],
  ["02", "Campaign build", "KRAVEX builds the lead capture route, tracking, outreach/ad plan and qualification workflow."],
  ["03", "Launch", "Campaigns go live, forms and phone intake are monitored, and leads start entering the pipeline."],
  ["04", "Delivery", "Qualified leads are delivered into your portal with contact details, notes, source and quality level."],
  ["05", "Review", "You see what arrived, what converted, what needs improving and what the next month should focus on."],
];

const leadDefinition = [
  "A real person or business with contact details",
  "A service need that matches your agreed niche",
  "Located inside your target UK area",
  "Captured through a tracked KRAVEX campaign or intake form",
  "Delivered with source, notes and quality status",
];

const included = [
  [Search, "Market and niche research", "We identify the people most likely to enquire, not just broad audiences."],
  [Target, "Campaign setup", "Landing flow, forms, tracking, targeting and lead qualification rules."],
  [PhoneCall, "Lead intake", "Public form submissions and phone-call leads both feed the same pipeline."],
  [MailCheck, "Lead delivery", "New leads are organised by quality, source, status and date delivered."],
  [FileBarChart, "Monthly reporting", "You see lead volume, target progress, quality split and invoice/payment status."],
  [MessageSquare, "Client communication", "Updates, notes and lead questions stay inside the client portal."],
];

const notIncluded = [
  "We do not promise fake guaranteed revenue numbers.",
  "We do not count spam, wrong-area enquiries or irrelevant contacts as qualified leads.",
  "We do not take card details over public forms.",
  "We do not hide performance behind vague marketing reports.",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">{children}</p>;
}

function PortalPreview() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-kravex-gold/50 bg-[#0d0d0d] p-5 shadow-gold">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-kravex-gold/10" />
      <div className="relative flex items-center justify-between border-b border-kravex-border pb-4">
        <div>
          <p className="font-heading text-2xl">Client portal</p>
          <p className="text-sm text-kravex-secondary">Live lead delivery view</p>
        </div>
        <span className="rounded border border-kravex-gold/40 px-3 py-1 text-xs font-bold uppercase text-kravex-gold">Secure</span>
      </div>
      <div className="relative mt-5 grid gap-4">
        <div>
          <div className="flex items-end justify-between">
            <p className="text-sm text-kravex-secondary">Monthly target</p>
            <p className="font-mono text-kravex-gold">Set per client</p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-black">
            <div className="h-2 w-2/3 rounded-full bg-kravex-gold" />
          </div>
        </div>
        {[
          ["New enquiry", "Cosmetic Dentistry", "HOT", "Consultation requested"],
          ["Quote request", "Roofing & Trades", "WARM", "Needs call back"],
          ["Case enquiry", "Legal", "WARM", "Details captured"],
        ].map((lead) => (
          <div key={lead[0]} className="grid gap-3 rounded border border-kravex-border bg-black p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-bold text-white">{lead[0]}</p>
              <p className="mt-1 text-sm text-kravex-secondary">{lead[1]} - {lead[3]}</p>
            </div>
            <span className="h-fit rounded bg-kravex-gold px-3 py-1 text-xs font-bold text-black">{lead[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PublicShell>
      <section className="particle-field bg-kravex-black px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_.96fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <Eyebrow>UK Lead Generation Agency</Eyebrow>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[.98] text-white sm:text-6xl lg:text-7xl">
              Qualified leads for UK businesses that need a fuller pipeline.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-kravex-secondary">
              KRAVEX builds and manages monthly lead generation campaigns for dentists, aesthetic clinics, roofers, trades, solicitors and other UK service businesses. You get qualified enquiries delivered into a client portal, with clear notes, lead quality and reporting.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white sm:grid-cols-2">
              {["Fixed monthly retainer", "Qualified lead delivery", "Client portal included", "UK-only service areas"].map((item) => (
                <p key={item} className="flex items-center gap-3 rounded border border-kravex-border bg-kravex-card px-4 py-3">
                  <Check size={17} className="text-kravex-gold" />
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <GoldButton href="#lead-form">Request a Free Strategy Call</GoldButton>
              <OutlineButton href="#what-we-do">What KRAVEX Does</OutlineButton>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="relative">
            <div className="absolute inset-8 rounded-full bg-kravex-gold/20 blur-3xl" />
            <PortalPreview />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-kravex-gold/70 bg-kravex-dark px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 text-sm md:grid-cols-4">
          {[
            ["Who", "UK service businesses with high-value enquiries"],
            ["What", "Monthly lead generation and qualification"],
            ["How", "Campaigns, forms, phone intake and client portal"],
            ["Outcome", "A clearer pipeline and faster follow-up"],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-kravex-gold/50 pl-4">
              <p className="font-mono text-xs uppercase tracking-[.25em] text-kravex-gold">{label}</p>
              <p className="mt-2 leading-6 text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="what-we-do" className="bg-white text-black">
        <div className="grid gap-12 lg:grid-cols-[.86fr_1.14fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">The service</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">KRAVEX runs your lead pipeline, not just your adverts.</h2>
            <p className="mt-6 leading-8 text-gray-600">
              Most businesses do not need more dashboards, random ads or vague marketing activity. They need a repeatable way to attract the right enquiries, capture them cleanly, qualify them quickly and follow them up before they go cold.
            </p>
            <p className="mt-5 leading-8 text-gray-600">
              That is the KRAVEX job: build the campaign, handle the intake path, organise the lead data, and give you a clear monthly view of what has actually arrived.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {included.map(([Icon, title, copy]: any) => (
              <div key={title} className="rounded-lg border border-black/15 bg-white p-5 shadow-sm transition hover:border-kravex-gold">
                <Icon className="text-kravex-gold" size={22} />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-kravex-black">
        <div className="grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <Eyebrow>Who It Is For</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Built for businesses where one good enquiry matters.</h2>
            <p className="mt-6 max-w-2xl leading-8 text-kravex-secondary">
              KRAVEX is best suited to service businesses where enquiries have meaningful value, fast response matters, and the owner needs a predictable pipeline instead of waiting for referrals.
            </p>
          </div>
          <div className="rounded-lg border border-kravex-border bg-kravex-card p-6">
            <p className="font-bold text-white">A KRAVEX client usually has:</p>
            <div className="mt-5 grid gap-3 text-sm text-kravex-secondary">
              {[
                "A defined service area in the UK",
                "A service worth following up properly",
                "Capacity to respond to new enquiries",
                "A monthly budget for consistent acquisition",
                "A need for clear reporting and accountability",
              ].map((item) => (
                <p key={item} className="flex gap-3"><Check className="shrink-0 text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {industries.map(({ icon: Icon, title, copy, leadTypes }) => (
            <div key={title} className="rounded-lg border border-kravex-border bg-kravex-card p-6 transition hover:border-kravex-gold">
              <Icon className="text-kravex-gold" />
              <h3 className="mt-5 font-heading text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-kravex-secondary">{copy}</p>
              <p className="mt-5 border-t border-kravex-border pt-4 text-xs font-bold uppercase tracking-wide text-kravex-gold">{leadTypes}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="text-center">
          <Eyebrow>Lead Quality</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">What counts as a lead?</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-kravex-secondary">
            A lead is not a random form fill. It has to match the agreed rules for your campaign, your service area and your business.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-5">
          {leadDefinition.map((item, index) => (
            <div key={item} className="rounded-lg border border-kravex-border bg-black p-5">
              <p className="font-mono text-sm text-kravex-gold">0{index + 1}</p>
              <p className="mt-4 text-sm leading-6 text-white">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">The Process</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">From strategy call to monthly delivery.</h2>
            <p className="mt-6 leading-8 text-gray-600">
              The first call is not a sales script. It is where KRAVEX checks whether your industry, area, budget and offer are strong enough for a sensible monthly campaign.
            </p>
            <div className="mt-8"><GoldButton href="#lead-form">Book the Strategy Call</GoldButton></div>
          </div>
          <div className="grid gap-4">
            {deliverySteps.map(([number, title, copy]) => (
              <div key={number} className="grid gap-4 rounded-lg border border-black/15 p-5 sm:grid-cols-[72px_1fr]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black font-mono text-kravex-gold">{number}</div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Client Portal</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Every client gets visibility.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">
              Paying clients do not have to guess what KRAVEX is doing. They can see their leads, status updates, invoices, messages and account details in one secure portal.
            </p>
            <div className="mt-7 grid gap-3">
              {[
                [Users, "Lead list with quality and source"],
                [ClipboardCheck, "Status updates and client notes"],
                [CreditCard, "Invoices and card payment flow"],
                [Headphones, "Messages and campaign updates"],
              ].map(([Icon, text]: any) => (
                <p key={text} className="flex gap-3 text-kravex-secondary"><Icon className="text-kravex-gold" size={18} />{text}</p>
              ))}
            </div>
          </div>
          <PortalPreview />
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [ShieldCheck, "Clean acquisition", "Lead forms block repeated submissions, disposable emails, suspicious links and scam phrases before storage."],
            [LockKeyhole, "Secure portal", "Admin and client areas are role-protected, with 2FA support for real accounts."],
            [TrendingUp, "Fair delivery", "Queues, caching and indexed database design support consistent service as the client base grows."],
          ].map(([Icon, title, copy]: any) => (
            <Card key={title}>
              <Icon className="text-kravex-gold" />
              <h2 className="mt-5 font-heading text-3xl">{title}</h2>
              <p className="mt-4 leading-7 text-kravex-secondary">{copy}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Honest Boundaries</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Serious results require serious rules.</h2>
            <p className="mt-6 leading-8 text-gray-600">
              KRAVEX is built to be accountable, but no responsible lead generation agency should pretend every enquiry becomes revenue. The job is to create a stronger pipeline, make lead flow visible, and improve the monthly acquisition system.
            </p>
          </div>
          <div className="grid gap-4">
            {notIncluded.map((item) => (
              <div key={item} className="rounded-lg border border-black/15 p-5 text-sm leading-6 text-gray-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="lead-form" className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <Eyebrow>Start Here</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Get your free strategy call.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">
              Tell KRAVEX what you do, where you operate and what type of leads you want. No account is needed. If you prefer to call, Emdadul can enter the same details from the admin dashboard.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-kravex-secondary">
              {[
                "No commitment",
                "30 minute review",
                "UK businesses only",
                "Clear next step after the call",
              ].map((item) => (
                <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </div>
          <Card>
            <LeadCaptureForm />
          </Card>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-20 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-4xl sm:text-5xl">Ready to make the pipeline visible?</h2>
            <p className="mt-4 max-w-2xl leading-7">Book the strategy call and find out whether KRAVEX is the right lead generation partner for your business.</p>
          </div>
          <a href="#lead-form" className="inline-flex items-center justify-center gap-2 rounded bg-black px-6 py-4 font-bold text-white">
            Request a Free Strategy Call
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
