import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, Section } from "@/components/shared/ui";

const terms = [
  ["Business identity", "KRAVEX is currently presented as a UK lead generation trading name operated by Emdadul Hoque unless and until a limited company number is published. The site must not claim limited-company status until incorporation is complete."],
  ["Service scope", "KRAVEX provides lead generation strategy, campaign setup, lead capture, qualification, dashboard access, reporting, invoicing and communication tools. Exact services, price, start date and lead criteria must be agreed before paid work begins."],
  ["No guaranteed sales", "KRAVEX may target qualified enquiries and improve pipeline visibility, but it does not guarantee closed sales, revenue, profit, finance approvals, project outcomes, booked jobs or any specific return on investment."],
  ["Qualified lead definition", "A qualified lead should be a real person or business with usable contact details, relevant service interest, target-area fit and enough information to justify follow-up under the agreed campaign rules. Spam and wrong-fit contacts should not be counted."],
  ["Client duties", "Clients are responsible for responding quickly, giving accurate business information, holding required licences, complying with their own regulator, keeping dashboard credentials secure and using delivered leads lawfully."],
  ["Regulated sectors", "KRAVEX does not provide construction, engineering, surveying, insurance or safety advice. You remain responsible for licences, certifications, quotes, site checks, compliance and workmanship."],
  ["Advertising claims", "Case studies, testimonials, pricing claims and performance claims must be honest, current and supportable by records. Demo data is not live performance data and must not be sold as proof of actual results."],
  ["Payments and VAT", "Fees are payable by the due date on the invoice. Money vaults are internal ledger categories, not bank accounts. VAT should only be charged where KRAVEX is VAT registered or otherwise lawfully required to account for VAT."],
  ["Cancellation and refunds", "Cancellation, minimum term, notice period and refund terms should be agreed in writing before payment. Setup work, campaign build and delivered leads may be non-refundable where work has already been carried out."],
  ["Acceptable use", "The platform must not be used for fraud, harassment, unlawful scraping, phishing, fake reviews, misleading claims, prohibited products, malware, impersonation, or collection of sensitive data that is not needed for the agreed service."],
  ["Liability", "Nothing in these terms excludes liability that cannot lawfully be excluded. Subject to that, KRAVEX is not responsible for a client's sales process, pricing, availability, reputation, regulatory compliance or failure to follow up leads."],
  ["Law and disputes", "These terms are governed by the laws of England and Wales. Disputes should first be raised in writing so both sides can try to resolve the matter before formal action."],
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Terms</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Terms and Conditions</h1>
        <p className="mt-6 max-w-3xl leading-8 text-kravex-secondary">
          These terms set the lawful boundaries for KRAVEX lead generation services. A signed client agreement
          or invoice terms may add more detail for a specific client.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {terms.map(([title, body]) => (
            <Card key={title}>
              <h2 className="font-heading text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-kravex-secondary">{body}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-8 border-kravex-gold/40 bg-black">
          <h2 className="font-heading text-2xl">Important lawful note</h2>
          <p className="mt-3 leading-7 text-kravex-secondary">
            This page is a strong operating baseline, not formal law advice. Before taking substantial
            client payments, KRAVEX should have a qualified UK adviser review the final terms, privacy policy, processor contracts
            and any industry-specific campaign wording.
          </p>
        </Card>
        <div className="mt-10"><GoldButton href="/contact">Book a Free Strategy Call</GoldButton></div>
      </Section>
    </PublicShell>
  );
}
