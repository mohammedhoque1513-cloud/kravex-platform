import { Check } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const industries = [
  {
    name: "Roofing",
    problem: "Roofing companies live and die by the weather and word of mouth. Neither is reliable.",
    solution: "KRAVEX runs targeted campaigns that reach homeowners searching for roof repairs and replacements right now, then delivers those enquiries to you.",
    subNiches: ["Storm damage", "Roof replacement", "Roof repair", "Insurance claims"],
    value: "Average job GBP5k-GBP20k+. One converted lead can pay for months of the service.",
  },
  {
    name: "Plumbing",
    problem: "Emergency plumbing calls spike unpredictably and most plumbers have no system to capture them.",
    solution: "KRAVEX puts your business in front of homeowners the moment they search for an emergency plumber, drain clean or leak repair.",
    subNiches: ["Emergency plumbing", "Drain cleaning", "Water heater installation", "Leak repair"],
    value: "High-frequency, high-urgency work. Volume of leads matters more than any other niche.",
  },
  {
    name: "HVAC",
    problem: "HVAC demand is seasonal. You can feast in summer and struggle in the off months.",
    solution: "KRAVEX runs year-round campaigns so your diary has AC, furnace and heat pump enquiries every month.",
    subNiches: ["AC installation", "Furnace replacement", "Heat pump installation", "Emergency repairs"],
    value: "High-ticket jobs. Each conversion can be worth the retainer multiple times over.",
  },
  {
    name: "Electrical",
    problem: "Most electricians get work through referrals and have no predictable way to fill gaps in the diary.",
    solution: "KRAVEX targets homeowners and small businesses searching for certified electricians, EV charger installs, rewires and consumer unit upgrades.",
    subNiches: ["EV charger installation", "Full rewiring", "Consumer unit upgrades", "Commercial electrical work"],
    value: "EV charger demand is growing fast. Early lead capture gives you the pipeline others miss.",
  },
  {
    name: "Home Remodelling",
    problem: "Kitchen and bathroom remodels take months to convert. Without steady enquiries, the diary goes quiet fast.",
    solution: "KRAVEX targets homeowners in the planning stage so your pipeline is always 3-6 months ahead.",
    subNiches: ["Kitchen remodels", "Bathroom remodels", "Whole-home renovations"],
    value: "Very high project values. A single conversion can be worth GBP15k-GBP80k+.",
  },
  {
    name: "Concrete",
    problem: "Concrete contractors get most work through local referrals, which limits how fast they can grow.",
    solution: "KRAVEX reaches homeowners searching for driveways, patios and concrete work in your area before they call someone else.",
    subNiches: ["Driveways", "Patios", "Foundations", "Decorative concrete"],
    value: "Homeowners get multiple quotes. Being the first enquiry received wins most jobs.",
  },
  {
    name: "Foundation Repair",
    problem: "Foundation issues are urgent, but most contractors have no system to capture homeowners the moment they discover a problem.",
    solution: "KRAVEX targets high-intent searches for underpinning, waterproofing and structural repairs, then delivers those enquiries to you.",
    subNiches: ["Underpinning", "Structural repairs", "Basement waterproofing"],
    value: "Huge margins per job. Homeowners rarely shop around. They call whoever shows up first.",
  },
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Industries</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Lead generation for construction trades only.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX focuses on high-intent enquiries for UK construction and home-service contractors.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Check Your Trade</GoldButton>
              <OutlineButton href="/services">View Packages</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <h2 className="font-heading text-3xl">What these trades share</h2>
            <div className="mt-6 grid gap-3 text-sm text-kravex-secondary">
              {["Defined UK service area", "High-value or urgent work", "Need for steady enquiries", "Ability to follow up quickly", "Clear job details"].map((item) => (
                <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Core Construction Niches</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Seven trades. One clear focus.</h2>
        </div>
        <div className="mt-12 grid gap-6">
          {industries.map((item) => (
            <div key={item.name} className="grid gap-6 rounded-lg border border-black/15 p-6 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <h3 className="font-heading text-4xl">{item.name}</h3>
                <p className="mt-4 rounded bg-black px-4 py-3 text-sm font-bold text-kravex-gold">{item.value}</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="font-bold">Problem</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.problem}</p>
                </div>
                <div>
                  <p className="font-bold">KRAVEX solution</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.solution}</p>
                </div>
                <div>
                  <p className="font-bold">Sub-niches we target</p>
                  <div className="mt-2 grid gap-2">
                    {item.subNiches.map((lead) => <span key={lead} className="rounded border border-black/15 px-3 py-2 text-sm text-gray-700">{lead}</span>)}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <a href="/contact" className="inline-flex rounded bg-black px-5 py-3 text-sm font-bold text-white">Get enquiries for your {item.name.toLowerCase()} business</a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
