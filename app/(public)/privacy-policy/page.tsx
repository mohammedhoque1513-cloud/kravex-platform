import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, Section } from "@/components/shared/ui";

const sections = [
  ["Who controls the data", "KRAVEX is the trading name used for this lead generation platform. Until a limited company is formally incorporated, the business is operated by Emdadul Hoque as the responsible controller for enquiries, client records and platform administration."],
  ["What we collect", "We collect enquiry details, business contact details, phone numbers, email addresses, campaign notes, lead status, invoice records, payment references, portal messages, security logs and form metadata such as source and IP address."],
  ["Why we use it", "Data is used to respond to enquiries, assess whether KRAVEX can help a business, manage client lead campaigns, deliver portal access, issue invoices, detect fraud, protect the platform and meet accounting or legal obligations."],
  ["Lawful bases", "KRAVEX may rely on contract, legitimate interests, consent where required, and legal obligation. Direct marketing will only be sent where there is a lawful basis and, where PECR requires it, consent or a valid soft opt-in."],
  ["Lead and prospect data", "Lead records should only contain information needed to qualify and deliver a genuine business enquiry. KRAVEX does not knowingly collect passwords, bank login details, card numbers, special category data or unnecessary identity documents through public forms."],
  ["Sharing data", "Data may be shared with trusted processors such as hosting, email, payment, CRM, analytics, security and professional-adviser providers. Client lead data is only shown to the relevant client account and authorised KRAVEX administrators."],
  ["Retention", "Enquiries that do not become clients should be reviewed and deleted or anonymised when no longer needed. Client, invoice, payment and accounting records may be retained for longer where required for legal, tax, dispute or audit purposes."],
  ["Your rights", "People may request access, correction, deletion, restriction, portability, objection to processing, or withdrawal of consent where applicable. Requests should be sent to hello@kravex.co.uk."],
  ["Security", "KRAVEX uses role-based access, authentication, rate limits, security logs, encrypted secrets, HTTPS, input validation and restricted admin/client portals. No online platform can be guaranteed risk-free."],
  ["Complaints", "If a privacy concern is not resolved, people can complain to the UK Information Commissioner's Office. KRAVEX will cooperate with lawful regulator requests."],
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">UK GDPR</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Privacy Policy</h1>
        <p className="mt-6 max-w-3xl leading-8 text-kravex-secondary">
          This policy explains how KRAVEX handles personal data for enquiries, lead generation, client portals,
          billing, security and business administration. It is written for a UK business audience.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sections.map(([title, body]) => (
            <Card key={title}>
              <h2 className="font-heading text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-kravex-secondary">{body}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-black">
          <h2 className="font-heading text-2xl">Marketing and outreach rule</h2>
          <p className="mt-3 leading-7 text-kravex-secondary">
            KRAVEX must not scrape or buy personal data and spam people. Outreach needs a lawful basis,
            a clear business reason, honest identity, simple opt-out and records showing where the contact came from.
          </p>
        </Card>
        <div className="mt-10"><GoldButton href="/contact">Book a Free Strategy Call</GoldButton></div>
      </Section>
    </PublicShell>
  );
}
