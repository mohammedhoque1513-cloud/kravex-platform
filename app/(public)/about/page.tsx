import { BadgeCheck, Check, Eye, Gauge, LockKeyhole, MessageSquare, Target, UserRound } from "lucide-react";
import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, OutlineButton, Section } from "@/components/shared/ui";

const values = [
  [Eye, "Clarity", "Clients should understand what is being done, what arrived, what it cost and what needs improving."],
  [Gauge, "Speed", "A lead loses value when nobody responds. KRAVEX is designed around fast capture and visible follow-up."],
  [BadgeCheck, "Quality", "A pipeline full of bad-fit contacts is not success. Lead criteria matter."],
  [LockKeyhole, "Discipline", "Customer data, payments, account access and reporting need controlled systems, not loose spreadsheets."],
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">About KRAVEX</p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Premium lead generation, run with discipline.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-kravex-secondary">KRAVEX exists for UK construction trades that are tired of vague marketing retainers, messy lead tracking and not knowing whether their pipeline is actually improving.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href="/contact">Book a Strategy Call</GoldButton>
              <OutlineButton href="/how-it-works">How It Works</OutlineButton>
            </div>
          </div>
          <Card className="h-fit">
            <UserRound className="text-kravex-gold" />
            <h2 className="mt-5 font-heading text-3xl">Led by Emdadul Hoque</h2>
            <p className="mt-4 leading-7 text-kravex-secondary">Emdadul leads KRAVEX strategy and delivery, with the goal of building a serious UK lead generation agency around clear systems, honest reporting and strong client communication.</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">The Story</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Built to replace vague marketing with accountable pipeline delivery.</h2>
          </div>
          <div className="space-y-5 leading-8 text-gray-600">
            <p>Many small and growing UK contractors know they need more enquiries, but the usual options are frustrating: random ads, confusing reports, agencies that talk in jargon, or lead suppliers that provide contacts with no context.</p>
            <p>KRAVEX is being built as a cleaner system. The public site attracts enquiries, the admin dashboard manages prospects, clients, campaigns, invoices and payments, and the client dashboard gives paying clients visibility over their leads.</p>
            <p>The mission is straightforward: help serious construction trades fill their pipeline every month, while keeping the work transparent enough that nobody has to guess what is happening.</p>
          </div>
        </div>
      </Section>

      <Section className="bg-kravex-dark">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Values</p>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl">How KRAVEX should operate.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map(([Icon, title, copy]: any) => (
            <Card key={title}>
              <Icon className="text-kravex-gold" />
              <h3 className="mt-5 font-heading text-3xl">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-kravex-secondary">{copy}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white text-black">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-mutedGold">Why KRAVEX</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">The agency is built around the full client journey.</h2>
            <p className="mt-6 leading-8 text-gray-600">This is not meant to be a simple brochure site. KRAVEX is structured as a working platform: enquiries, prospects, clients, leads, invoices, messages, reports and payment tracking all have a place.</p>
          </div>
          <div className="grid gap-4">
            {[
              [Target, "Public lead capture", "People can request a strategy call without needing an account."],
              [MessageSquare, "Admin control", "Prospects, client records, lead delivery, invoices and messages are managed centrally."],
              [UserRound, "Customer visibility", "Paying clients can see leads, invoices, messages and account details."],
              [LockKeyhole, "Security mindset", "Role protection, 2FA support, payment tokenisation and no public file uploads are part of the system."],
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
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Trust Signals</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Premium does not mean flashy. It means controlled.</h2>
            <p className="mt-6 leading-8 text-kravex-secondary">The KRAVEX standard is black-and-gold on the surface, but the real premium feel comes from discipline: clear data, clean dashboards, honest limits and secure payment handling.</p>
          </div>
          <Card>
            <div className="grid gap-3 text-sm text-kravex-secondary">
              {["UK-focused agency", "Fixed monthly retainer model", "Client dashboard for visibility", "Lead fit checks", "Stripe-based payment handling", "No hidden card storage"].map((item) => (
                <p key={item} className="flex gap-3"><Check className="text-kravex-gold" size={18} />{item}</p>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <section className="bg-kravex-gold px-5 py-20 text-center text-black">
        <h2 className="font-heading text-4xl sm:text-5xl">Want to work with KRAVEX?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7">Book a strategy call and find out whether your business is a fit for monthly lead generation.</p>
        <div className="mt-8"><a href="/contact" className="rounded bg-black px-6 py-3 font-bold text-white">Book a Free Strategy Call</a></div>
      </section>
    </PublicShell>
  );
}
