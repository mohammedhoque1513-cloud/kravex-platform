import { BarChart3, Check, ClipboardList, Filter, LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const tabs = ["All", "Roofing", "Plumbing", "HVAC", "Electrical", "Home Remodelling", "Concrete", "Foundation Repair"];

const metrics = [
  ["Lead volume", "How many qualified enquiries were delivered against the monthly target."],
  ["Lead quality", "Hot, warm and cold split based on intent, fit and urgency."],
  ["Lead source", "Where the enquiry came from, so campaigns can be improved."],
  ["Follow-up status", "Whether leads are new, contacted, booked, converted or not interested."],
  ["Billing clarity", "Invoices, payments and monthly retainer visibility."],
];

const examples = [
  {
    title: "17 storm damage enquiries delivered in 3 weeks.",
    industry: "Roofing",
    location: "Roofing contractor, Manchester",
    metrics: ["Storm damage", "Roof repair", "Insurance claims"],
  },
  {
    title: "23 emergency plumbing leads in one month.",
    industry: "Plumbing",
    location: "Independent plumber, Birmingham",
    metrics: ["Emergency plumbing", "Drain cleaning", "Leak repair"],
  },
  {
    title: "11 heat pump installation enquiries in 30 days.",
    industry: "HVAC",
    location: "HVAC company, Leeds",
    metrics: ["Heat pump installation", "AC installation", "Emergency repairs"],
  },
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Results</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Measured construction enquiries, not vague marketing noise.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX results are judged by what matters to you: qualified enquiries, clear job details, fast follow-up and monthly progress against your lead target.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Book a Strategy Call</GoldButton>
              <OutlineButton href="/how-it-works">See How Delivery Works</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <BarChart3 className="text-kravex-gold" />
            <h2 className="mt-5 font-heading text-3xl">No fake dashboard numbers</h2>
            <p className="mt-4 leading-7 text-kravex-secondary">Real results should come from real campaigns, real lead records and real invoices. Demo figures are not treated as live performance.</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => <span key={tab} className="rounded border border-black/15 px-4 py-2 text-sm font-bold">{tab}</span>)}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {examples.map((item) => (
            <Card key={item.title} className="border-l-4 border-l-kravex-gold">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-kravex-gold">{item.industry}</p>
              <h2 className="mt-4 font-heading text-3xl">{item.title}</h2>
              <p className="mt-4 leading-7 text-kravex-secondary">{item.location}</p>
              <div className="mt-5 grid gap-2">
                {item.metrics.map((metric) => <span key={metric} className="rounded border border-kravex-border bg-black px-3 py-2 text-sm text-white">{metric}</span>)}
              </div>
            </Card>
          ))}
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

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Proof Standards</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">What counts as proof?</h2>
            <p className="mt-6 leading-8 text-gray-600">KRAVEX should only call something a result when it can be tied back to the campaign, the lead record, your dashboard, or your own conversion feedback.</p>
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
            <p className="mt-6 leading-8 text-kravex-secondary">KRAVEX can build and manage the lead flow. You still need to answer quickly, follow up properly, quote clearly and close professionally.</p>
          </div>
          <Card>
            <TrendingUp className="text-kravex-gold" />
            <h3 className="mt-5 font-heading text-3xl">The strongest contractors usually have:</h3>
            <div className="mt-5 grid gap-3 text-sm text-kravex-secondary">
              {["Fast response times", "A clear offer", "Good local reputation", "Capacity for new work", "A serious monthly budget"].map((item) => <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>)}
            </div>
          </Card>
        </div>
      </Section>
    </PublicShell>
  );
}
