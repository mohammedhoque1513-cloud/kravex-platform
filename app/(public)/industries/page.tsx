import { BadgeCheck, BriefcaseBusiness, Building2, Check, Landmark, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const industries = [
  {
    icon: Sparkles,
    name: "Cosmetic Dentistry",
    problem: "Private clinics often rely on referrals or inconsistent ads, even when one implant or Invisalign case can be valuable.",
    solution: "KRAVEX focuses the campaign around treatment intent, local area, consultation requests and fast follow-up.",
    leads: ["Dental implants", "Veneers", "Invisalign", "Smile makeover consultations"],
    value: "High-value patient enquiries",
  },
  {
    icon: BadgeCheck,
    name: "Aesthetic Clinics",
    problem: "Aesthetic enquiries can be high-volume but low-quality if the campaign attracts bargain hunters or wrong-fit prospects.",
    solution: "The intake process filters for treatment interest, location, contact details and appointment readiness.",
    leads: ["Injectables", "Skin treatments", "Laser enquiries", "Consultation requests"],
    value: "Repeat-care and treatment-plan potential",
  },
  {
    icon: Building2,
    name: "Roofing & Trades",
    problem: "Trades businesses lose money when quote requests are missed, untracked or buried in calls and messages.",
    solution: "KRAVEX helps capture quote requests, classify urgency and keep homeowner details organised for fast response.",
    leads: ["Roof repairs", "Replacements", "Inspections", "Commercial work"],
    value: "Project-based enquiries with clear need",
  },
  {
    icon: Landmark,
    name: "Legal & Solicitors",
    problem: "Legal enquiries need clarity. A vague lead is hard to assess and can waste time quickly.",
    solution: "Campaigns are structured around practice area, location, case type and call-back intent.",
    leads: ["Initial case enquiries", "Consultation requests", "Practice-area leads", "Local service searches"],
    value: "Clearer enquiry triage",
  },
  {
    icon: BriefcaseBusiness,
    name: "Mortgage Brokers",
    problem: "Brokers need people with real intent, not broad finance traffic with no timeline.",
    solution: "Lead criteria can focus on property plans, remortgage needs, first-time buyer status or specialist cases.",
    leads: ["First-time buyers", "Remortgage", "Buy-to-let", "Specialist mortgage enquiries"],
    value: "Intent-led finance conversations",
  },
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Industries</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Lead generation for UK service businesses where quality matters.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX works best when a lead has meaningful value and fast follow-up can turn pipeline into booked calls, quotes, consultations or cases.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Check Your Industry</GoldButton>
              <OutlineButton href="/services">View Packages</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <h2 className="font-heading text-3xl">What all KRAVEX industries share</h2>
            <div className="mt-6 grid gap-3 text-sm text-kravex-secondary">
              {["Defined UK service area", "High enough lead value", "Need for consistent monthly enquiries", "Ability to follow up quickly", "Clear qualification rules"].map((item) => (
                <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Core Markets</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Industry pages with actual lead context.</h2>
        </div>
        <div className="mt-12 grid gap-6">
          {industries.map(({ icon: Icon, name, problem, solution, leads, value }) => (
            <div key={name} className="grid gap-6 rounded-lg border border-black/15 p-6 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <Icon className="text-kravex-gold" size={28} />
                <h3 className="mt-5 font-heading text-4xl">{name}</h3>
                <p className="mt-4 rounded bg-black px-4 py-3 text-sm font-bold text-kravex-gold">{value}</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="font-bold">Problem</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{problem}</p>
                </div>
                <div>
                  <p className="font-bold">KRAVEX solution</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{solution}</p>
                </div>
                <div>
                  <p className="font-bold">Lead types</p>
                  <div className="mt-2 grid gap-2">
                    {leads.map((lead) => <span key={lead} className="rounded border border-black/15 px-3 py-2 text-sm text-gray-700">{lead}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Your Industry</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Not listed? It may still fit.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">KRAVEX can assess other UK service businesses if the offer is clear, the location is defined, and a lead is valuable enough to justify consistent acquisition.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {["Clear target customer", "Trackable enquiry type", "Real budget for lead generation", "Capacity to answer calls", "Defined service area", "Offer strong enough to convert"].map((item) => (
              <Card key={item}><p className="flex gap-3"><Check className="text-kravex-gold" />{item}</p></Card>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-20 text-center text-black">
        <h2 className="font-heading text-4xl sm:text-5xl">Want to know if KRAVEX can work for your niche?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7">Book the strategy call and KRAVEX will assess your industry, area and lead economics.</p>
        <div className="mt-8"><a href="/contact" className="rounded bg-black px-6 py-3 font-bold text-white">Book a Free Strategy Call</a></div>
      </section>
    </PublicShell>
  );
}
