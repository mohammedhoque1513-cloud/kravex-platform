import { Check, CircleDollarSign, FileBarChart, MessageSquare, ShieldCheck, Target, XCircle } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const packages = [
  {
    name: "Starter",
    price: "£750/month",
    bestFor: "Ideal for sole traders: roofers, plumbers and electricians starting to build their pipeline.",
    includes: ["Strategy call and campaign map", "One construction niche", "Lead capture form and fit checks", "Live dashboard access", "Monthly summary report"],
  },
  {
    name: "Growth",
    price: "£1,500/month",
    bestFor: "For established contractors ready to scale enquiries across multiple sub-niches.",
    popular: true,
    includes: ["Everything in Starter", "Multi-angle campaign testing", "Lead quality tracking", "Invoice/payment portal", "Monthly optimisation review", "Priority message support"],
  },
  {
    name: "Premium",
    price: "£2,500/month",
    bestFor: "For larger contractors and remodelling companies with high project values needing consistent volume.",
    includes: ["Everything in Growth", "Multiple service areas or offers", "Advanced reporting", "Higher-touch campaign review", "Priority enquiry handling", "Expansion planning"],
  },
];

const services = [
  [Target, "Lead generation campaign management", "KRAVEX plans and manages acquisition routes designed to capture qualified enquiries."],
  [ShieldCheck, "Lead qualification controls", "Wrong-fit, spam and suspicious enquiries are filtered so reports stay meaningful."],
  [MessageSquare, "Dashboard and messages", "You can see leads, invoices, messages and account details in one place."],
  [FileBarChart, "Monthly reporting", "Lead targets, quality split, status and billing visibility are reviewed each month."],
];

const excluded = [
  "Ad spend is not hidden inside the retainer.",
  "Sales calls are not handled for you unless agreed separately.",
  "KRAVEX does not guarantee closed revenue.",
  "Spam, irrelevant contacts and wrong-area enquiries do not count as qualified leads.",
  "Public forms never accept card details, passwords or file attachments.",
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Services</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Monthly lead generation, priced clearly.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX works on a fixed monthly retainer so construction trades can plan lead generation without vague invoices or mystery activity.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Book a Strategy Call</GoldButton>
              <OutlineButton href="/how-it-works">See the Process</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <CircleDollarSign className="text-kravex-gold" />
            <h2 className="mt-5 font-heading text-3xl">How pricing works</h2>
            <p className="mt-4 leading-7 text-kravex-secondary">The retainer covers campaign management, enquiry capture, fit checks, dashboard access and reporting. Any paid media budget should be agreed separately and visible.</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Packages</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Choose the level that matches your capacity.</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {packages.map((item) => (
            <div key={item.name} className={`relative rounded-lg border p-6 ${item.popular ? "border-kravex-gold bg-black text-white shadow-gold" : "border-black/15 bg-white text-black"}`}>
              {item.popular ? <span className="absolute right-5 top-5 rounded bg-kravex-gold px-3 py-1 text-xs font-bold text-black">MOST POPULAR</span> : null}
              <h3 className="font-heading text-4xl">{item.name}</h3>
              <p className="mt-4 font-mono text-3xl text-kravex-gold">{item.price}</p>
              <p className={`mt-4 min-h-16 leading-7 ${item.popular ? "text-kravex-secondary" : "text-gray-600"}`}>{item.bestFor}</p>
              <div className="mt-6 grid gap-3">
                {item.includes.map((line) => (
                  <p key={line} className={`flex gap-3 text-sm ${item.popular ? "text-white" : "text-gray-700"}`}><Check className="shrink-0 text-kravex-gold" size={18} />{line}</p>
                ))}
              </div>
              <div className="mt-8"><GoldButton href="/contact">Discuss {item.name}</GoldButton></div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map(([Icon, title, copy]: any) => (
            <Card key={title}>
              <Icon className="text-kravex-gold" />
              <h2 className="mt-5 font-heading text-2xl">{title}</h2>
              <p className="mt-4 text-sm leading-6 text-kravex-secondary">{copy}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Never Included</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">No smoke, no magic numbers.</h2>
            <p className="mt-6 leading-8 text-gray-600">The service is built to be clear. That means explaining what KRAVEX does not claim, as well as what it does.</p>
          </div>
          <div className="grid gap-4">
            {excluded.map((line) => (
              <div key={line} className="flex gap-3 rounded-lg border border-black/15 p-5 text-sm leading-6 text-gray-700">
                <XCircle className="shrink-0 text-kravex-mutedGold" size={18} />
                {line}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-20 text-center text-black">
        <h2 className="font-heading text-4xl sm:text-5xl">Not sure which package fits?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7">Book a strategy call. KRAVEX will recommend the right level only after understanding your area, offer and capacity.</p>
        <div className="mt-8"><a href="/contact" className="rounded bg-black px-6 py-3 font-bold text-white">Book a Free Strategy Call</a></div>
      </section>
    </PublicShell>
  );
}
