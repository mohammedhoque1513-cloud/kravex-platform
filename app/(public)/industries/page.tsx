import { BadgeCheck, BriefcaseBusiness, Building2, Check, ShieldCheck, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const industries = [
  {
    icon: Sparkles,
    name: "Roof Repairs",
    problem: "You miss urgent repair jobs when calls, messages and quote requests are scattered.",
    solution: "KRAVEX helps you capture the job type, location, urgency and contact details fast.",
    leads: ["Leak repairs", "Storm damage", "Emergency callouts", "Tile and slate fixes"],
    value: "Urgent jobs with clear need",
  },
  {
    icon: BadgeCheck,
    name: "Roof Replacements",
    problem: "You need larger quote requests without waiting for word of mouth to fill the diary.",
    solution: "KRAVEX focuses your campaign around homeowners ready to inspect, compare and book.",
    leads: ["Full replacements", "Reroof quotes", "Inspection requests", "Planned projects"],
    value: "Higher-value quote enquiries",
  },
  {
    icon: Building2,
    name: "Guttering & Fascias",
    problem: "You can lose smaller jobs when follow-up is slow or the enquiry details are incomplete.",
    solution: "KRAVEX keeps these enquiries clean so you know who to call and what they need.",
    leads: ["Gutter repairs", "Fascia quotes", "Soffit work", "Roofline enquiries"],
    value: "Steady work between larger jobs",
  },
  {
    icon: ShieldCheck,
    name: "Flat Roofing",
    problem: "You need the right flat roof enquiries, not vague messages with no job detail.",
    solution: "KRAVEX captures the roof type, site details and urgency before you follow up.",
    leads: ["Felt roofing", "GRP roofing", "Commercial repairs", "Flat roof quotes"],
    value: "Specific flat roof demand",
  },
  {
    icon: BriefcaseBusiness,
    name: "Chimneys & Leadwork",
    problem: "You need specialist enquiries that fit your skills and service area.",
    solution: "KRAVEX helps you attract homeowners who need targeted roofline or chimney work.",
    leads: ["Chimney repairs", "Lead flashing", "Pointing", "Roofline inspections"],
    value: "Specialist repair enquiries",
  },
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Industries</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Lead generation for roofing and exterior trades.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX works best when you can turn clear local enquiries into booked inspections, quotes and paid work.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Check Your Industry</GoldButton>
              <OutlineButton href="/services">View Packages</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <h2 className="font-heading text-3xl">What these jobs share</h2>
            <div className="mt-6 grid gap-3 text-sm text-kravex-secondary">
              {["Defined UK service area", "A real quote request", "Need for steady enquiries", "Ability to follow up quickly", "Clear job details"].map((item) => (
                <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Core Markets</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Related roofing work with real lead context.</h2>
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
            <p className="mt-6 leading-8 text-kravex-secondary">KRAVEX can assess other roofing or exterior trade work if your area is clear and the enquiry is worth chasing.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {["Clear target customer", "Trackable job type", "Real budget for lead generation", "Capacity to answer calls", "Defined service area", "Offer strong enough to convert"].map((item) => (
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
