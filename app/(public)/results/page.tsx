import { BarChart3, Check, ClipboardList, Filter, LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const metrics = [
  ["Lead volume", "How many qualified enquiries were delivered against the monthly target."],
  ["Lead quality", "Hot, warm and cold split based on intent, fit and urgency."],
  ["Lead source", "Where the enquiry came from, so campaigns can be improved."],
  ["Follow-up status", "Whether leads are new, contacted, booked, converted or not interested."],
  ["Billing clarity", "Invoices, payments and monthly retainer visibility."],
];

const examples = [
  {
    title: "Dental clinic campaign",
    industry: "Cosmetic Dentistry",
    location: "Birmingham",
    outcome: "Treatment enquiries organised by lead quality and consultation intent.",
    metrics: ["Implant interest", "Consultation request", "Finance conversation"],
  },
  {
    title: "Roofing lead campaign",
    industry: "Roofing & Trades",
    location: "Manchester",
    outcome: "Quote requests captured with job type, urgency and contact details.",
    metrics: ["Repair enquiry", "Replacement quote", "Inspection request"],
  },
  {
    title: "Aesthetic clinic campaign",
    industry: "Aesthetic Clinics",
    location: "UK local area",
    outcome: "Consultation enquiries segmented by treatment interest and readiness.",
    metrics: ["Injectables", "Skin treatment", "Laser enquiry"],
  },
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Results</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Measured pipeline, not vague marketing noise.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX results are judged by what matters to a service business: qualified enquiries, clear source data, fast follow-up visibility and monthly progress against lead targets.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Book a Strategy Call</GoldButton>
              <OutlineButton href="/how-it-works">See How Delivery Works</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <BarChart3 className="text-kravex-gold" />
            <h2 className="mt-5 font-heading text-3xl">No fake dashboard numbers</h2>
            <p className="mt-4 leading-7 text-kravex-secondary">Real client results should come from real campaigns, real lead records and real invoices. Demo figures are not treated as live performance.</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">What KRAVEX Tracks</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">The numbers behind a healthier pipeline.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {metrics.map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-black/15 p-5">
              <p className="font-bold">{title}</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="grid gap-6 lg:grid-cols-3">
          {examples.map((item) => (
            <Card key={item.title} className="border-l-4 border-l-kravex-gold">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-kravex-gold">{item.industry}</p>
              <h2 className="mt-4 font-heading text-3xl">{item.title}</h2>
              <p className="mt-2 text-sm text-kravex-muted">{item.location}</p>
              <p className="mt-5 leading-7 text-kravex-secondary">{item.outcome}</p>
              <div className="mt-5 grid gap-2">
                {item.metrics.map((metric) => <span key={metric} className="rounded border border-kravex-border bg-black px-3 py-2 text-sm text-white">{metric}</span>)}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Proof Standards</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">What counts as proof?</h2>
            <p className="mt-6 leading-8 text-gray-600">KRAVEX should only call something a result when it can be tied back to the campaign, the lead record, the client portal, or the client’s own conversion feedback.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [ClipboardList, "Lead record exists", "Name, contact details, source, quality and delivery date are stored."],
              [Filter, "Lead fits criteria", "Wrong-fit submissions are filtered out instead of counted."],
              [LineChart, "Month is measurable", "Targets, volume and quality split can be reviewed."],
              [ShieldCheck, "Claims stay honest", "Revenue claims require client confirmation or billing data."],
            ].map(([Icon, title, copy]: any) => (
              <div key={title} className="rounded-lg border border-black/15 p-5">
                <Icon className="text-kravex-gold" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Important</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Lead generation is not the same as sales closing.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">KRAVEX can build and manage the pipeline. Your business still needs to answer quickly, follow up properly, quote clearly and close professionally.</p>
          </div>
          <Card>
            <TrendingUp className="text-kravex-gold" />
            <h3 className="mt-5 font-heading text-3xl">The strongest clients usually have:</h3>
            <div className="mt-5 grid gap-3 text-sm text-kravex-secondary">
              {["Fast response times", "A clear offer", "Good local reputation", "Capacity for new work", "A serious monthly budget"].map((item) => <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>)}
            </div>
          </Card>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-20 text-center text-black">
        <h2 className="font-heading text-4xl sm:text-5xl">Want results you can actually inspect?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7">Book a strategy call and KRAVEX will map what a measurable lead campaign could look like for your business.</p>
        <div className="mt-8"><a href="/contact" className="rounded bg-black px-6 py-3 font-bold text-white">Book a Free Strategy Call</a></div>
      </section>
    </PublicShell>
  );
}
