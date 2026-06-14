import { ArrowRight, CheckCircle2, Clock, FileBarChart, MessageSquare, PhoneCall, Rocket, Search, Target } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const timeline = [
  ["Step 1", "Strategy call", "KRAVEX checks your market, location, offer, budget and target lead type. If the numbers do not make sense, we say so before you pay."],
  ["Step 2", "Campaign map", "We define the niche, lead criteria, intake path, tracking, qualification rules and follow-up expectations."],
  ["Step 3", "Build and launch", "Forms, landing flow, campaign targeting and portal setup are prepared. The first version is designed to go live quickly and improve with data."],
  ["Step 4", "Lead qualification", "Submissions and calls are checked against your agreed criteria before they are counted as qualified leads."],
  ["Step 5", "Delivery and reporting", "Leads appear in your client portal with source, quality, notes and status. Monthly reports show what arrived and what needs improving."],
];

const faqs = [
  ["How fast can KRAVEX launch?", "A simple campaign can be prepared quickly once the offer, service area and lead criteria are clear. More complex campaigns may need extra setup."],
  ["Do you guarantee sales?", "No. KRAVEX focuses on qualified lead flow, transparency and pipeline quality. Sales depend on your follow-up, pricing, reputation and close rate."],
  ["What counts as a qualified lead?", "A real person or business with contact details, in your target area, looking for a service that matches the agreed campaign criteria."],
  ["Can I see every lead?", "Yes. Leads are delivered into the client portal with quality, source, notes and status controls."],
  ["What if a lead is spam?", "Spam, disposable emails, suspicious submissions and wrong-fit enquiries should not be counted as qualified leads."],
  ["Who follows up the lead?", "Your business follows up the lead. KRAVEX delivers and organises the opportunity; your team handles the sales conversation."],
  ["Do clients need an account?", "Paying clients get portal access. Public enquiries can submit the strategy-call form without an account."],
  ["Can leads come by phone?", "Yes. If someone calls KRAVEX, Emdadul can enter the lead from the admin dashboard so it enters the same pipeline."],
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">How It Works</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">A clear route from empty pipeline to organised lead delivery.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX is built around a simple operating rhythm: define the right lead, launch the right acquisition path, qualify what comes in, and give clients visibility every month.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Book a Strategy Call</GoldButton>
              <OutlineButton href="/services">View Services</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <div className="grid gap-4">
              {[[PhoneCall, "Discovery"], [Target, "Lead criteria"], [Rocket, "Campaign launch"], [FileBarChart, "Monthly report"]].map(([Icon, label]: any) => (
                <div key={label} className="flex items-center gap-4 rounded border border-kravex-border bg-black p-4">
                  <Icon className="text-kravex-gold" />
                  <span className="font-bold">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">The Operating System</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Five steps. No mystery.</h2>
        </div>
        <div className="mt-12 grid gap-5">
          {timeline.map(([step, title, copy], index) => (
            <div key={step} className="grid gap-5 rounded-lg border border-black/15 p-6 md:grid-cols-[120px_1fr_48px] md:items-center">
              <p className="font-mono text-sm font-bold text-kravex-mutedGold">{step}</p>
              <div>
                <h3 className="font-heading text-3xl">{title}</h3>
                <p className="mt-2 leading-7 text-gray-600">{copy}</p>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-black text-kravex-gold md:flex">{index + 1}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [Search, "Before launch", "Market, niche, location and offer are checked so the campaign has a real target."],
            [MessageSquare, "During delivery", "Lead notes, source, quality and client messages stay organised in the portal."],
            [Clock, "Every month", "Targets, invoice status, lead quality and follow-up gaps are reviewed with discipline."],
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
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">FAQ</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Questions before the call.</h2>
            <p className="mt-6 leading-8 text-gray-600">Lead generation is only useful when expectations are clear. These are the questions most business owners should ask before starting.</p>
          </div>
          <div className="grid gap-4">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-lg border border-black/15 p-5">
                <summary className="cursor-pointer font-bold">{q}</summary>
                <p className="mt-3 leading-7 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-18 text-black sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-4xl sm:text-5xl">Want to see if your market fits?</h2>
            <p className="mt-3">Book the strategy call and KRAVEX will assess the opportunity honestly.</p>
          </div>
          <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded bg-black px-6 py-4 font-bold text-white">Book a Free Strategy Call <ArrowRight size={18} /></a>
        </div>
      </section>
    </PublicShell>
  );
}
