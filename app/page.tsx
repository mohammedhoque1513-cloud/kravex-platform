"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  CreditCard,
  Headphones,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";
import { LeadCaptureForm } from "@/components/shared/lead-capture-form";

const industries = [
  {
    icon: Sparkles,
    title: "Roofing",
    copy: "Storm damage, replacements and repairs",
    leadTypes: "Average job GBP5k-GBP20k+",
  },
  {
    icon: BadgeCheck,
    title: "Plumbing",
    copy: "Emergency callouts, leaks and drain work",
    leadTypes: "Fast, high-intent searches",
  },
  {
    icon: BriefcaseBusiness,
    title: "HVAC",
    copy: "AC, furnaces, heat pumps and emergency repairs",
    leadTypes: "Seasonal high-ticket demand",
  },
  {
    icon: ShieldCheck,
    title: "Electrical",
    copy: "EV chargers, rewiring and consumer units",
    leadTypes: "Growing certified trade demand",
  },
  {
    icon: TrendingUp,
    title: "Home Remodelling",
    copy: "Kitchens, bathrooms and full renovations",
    leadTypes: "High project values",
  },
  {
    icon: Check,
    title: "Concrete",
    copy: "Driveways, patios and foundations",
    leadTypes: "Quote-led local work",
  },
  {
    icon: LockKeyhole,
    title: "Foundation Repair",
    copy: "Underpinning, waterproofing and structural work",
    leadTypes: "Urgent high-margin repairs",
  },
];

const deliverySteps = [
  ["01", "Discovery", "You show KRAVEX your offer, area and ideal customer."],
  ["02", "Build", "Your campaign, forms and tracking are set up around that customer."],
  ["03", "Launch", "Your campaign goes live and enquiries start coming in."],
  ["04", "Delivery", "You receive each qualified lead with the details you need to call."],
  ["05", "Review", "You see what worked and what needs improving next month."],
];

const leadDefinition = [
  "You can contact the person",
  "You offer the service requested",
  "You cover the requested area",
  "You know where the enquiry came from",
  "You get notes before you call",
];

const notIncluded = [
  "You will not be promised fake revenue numbers.",
  "You will not be charged for spam or wrong-area enquiries.",
  "You will not be asked for card details on public forms.",
  "You will not be left guessing what arrived.",
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
          <p className="font-heading text-2xl">Lead dashboard</p>
          <p className="text-sm text-kravex-secondary">Your live lead view</p>
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
          ["Storm damage", "Roofing", "HOT", "Needs call today"],
          ["Leak repair", "Plumbing", "HOT", "Emergency callout"],
          ["Heat pump quote", "HVAC", "WARM", "Installation enquiry"],
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
              Qualified construction leads for your next booked job.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-kravex-secondary">
              You get booked enquiries for your trade every month.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white sm:grid-cols-2">
              {["Fixed monthly retainer", "Qualified enquiries", "Your live lead dashboard", "UK-only service areas"].map((item) => (
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
            ["Who", "You rely on word of mouth and need steadier construction work"],
            ["What", "You get qualified enquiries every month"],
            ["How", "Your campaign finds people who need your service"],
            ["Outcome", "More booked jobs. Less time chasing."],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-kravex-gold/50 pl-4">
              <p className="font-mono text-xs uppercase tracking-[.25em] text-kravex-gold">{label}</p>
              <p className="mt-2 leading-6 text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="what-we-do" className="bg-white text-black">
        <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">The service</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">KRAVEX runs your lead pipeline, not just your adverts.</h2>
            <p className="mt-6 leading-8 text-gray-600">
              You need the right enquiries coming in each month. KRAVEX finds them, checks the fit, and gives you the details to call before the lead goes cold.
            </p>
        </div>
      </Section>

      <Section className="bg-kravex-black">
        <div className="grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <Eyebrow>Who It Is For</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Built for you when one good enquiry matters.</h2>
            <p className="mt-6 max-w-2xl leading-8 text-kravex-secondary">
              You get the most from KRAVEX when one good job is worth chasing properly.
            </p>
          </div>
          <div className="rounded-lg border border-kravex-border bg-kravex-card p-6">
            <p className="font-bold text-white">You are a good fit when you have:</p>
            <div className="mt-5 grid gap-3 text-sm text-kravex-secondary">
              {[
                "A defined service area in the UK",
                "A service worth following up properly",
                "Capacity to respond to new enquiries",
                "A monthly budget for steady leads",
                "A need to see exactly what arrived",
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
            You should only spend time on enquiries that match your area and your service.
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
              Your first call checks your area, budget and offer before anything is sold.
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
            <Eyebrow>Lead Dashboard</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">You see every lead in one place.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">
              You can see your leads, invoices, messages and account details in one secure place.
            </p>
            <div className="mt-7 grid gap-3">
              {[
                [Users, "Lead list with quality and source"],
                [ClipboardCheck, "Status updates and your notes"],
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
            [ShieldCheck, "Cleaner enquiries", "Your forms block repeat submissions, throwaway emails, suspicious links and scam phrases."],
            [LockKeyhole, "Secure account", "Your account is role-protected, with 2FA support when you enable it."],
            [TrendingUp, "Steady service", "Your service stays fast as KRAVEX grows."],
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
              You should expect honest lead generation. You should not expect every enquiry to become paid work.
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
              Tell KRAVEX what you do, where you work and what enquiries you want. You do not need an account.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-kravex-secondary">
              {[
                "No commitment",
                "30 minute review",
                "UK service areas only",
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
            <p className="mt-4 max-w-2xl leading-7">Book the strategy call and see whether KRAVEX can bring you better enquiries.</p>
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
