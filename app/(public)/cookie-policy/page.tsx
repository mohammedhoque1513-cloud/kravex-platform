import { PublicShell } from "@/components/public/shell";
import { Card, GoldButton, Section } from "@/components/shared/ui";

const cookies = [
  ["Strictly necessary cookies", "These keep the site secure, remember authentication state, protect forms and allow the client/admin portals to work. They are required for the service."],
  ["Analytics cookies", "Analytics may be used to understand page performance, enquiries and campaign quality. Non-essential analytics should only run where legally permitted and configured with appropriate consent controls."],
  ["Marketing cookies", "Marketing cookies, pixels and remarketing tags should only be used where consent is required and has been given. Users must be able to refuse them without losing access to essential site functions."],
  ["Third-party services", "KRAVEX may use providers such as Vercel, Stripe, Resend, Calendly, Google reCAPTCHA and analytics tools. These providers may set cookies or similar technologies when their features are used."],
  ["Changing preferences", "Users can clear cookies in their browser. A full consent preference centre should be enabled before non-essential analytics or advertising pixels are used in production."],
  ["No hidden tracking promise", "KRAVEX should not run hidden retargeting, fingerprinting or advertising pixels without a lawful basis and clear user information."],
];

export default function Page() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Cookies</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl sm:text-5xl lg:text-6xl">Cookie Policy</h1>
        <p className="mt-6 max-w-3xl leading-8 text-kravex-secondary">
          KRAVEX uses cookies and similar technologies for security, login, forms, performance and, where enabled,
          analytics or marketing measurement.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cookies.map(([title, body]) => (
            <Card key={title}>
              <h2 className="font-heading text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-kravex-secondary">{body}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-black">
          <h2 className="font-heading text-2xl">Production requirement</h2>
          <p className="mt-3 leading-7 text-kravex-secondary">
            Before adding ad pixels or detailed analytics, KRAVEX should install a real consent banner that blocks
            non-essential cookies until the visitor has made a choice.
          </p>
        </Card>
        <div className="mt-10"><GoldButton href="/contact">Book a Free Strategy Call</GoldButton></div>
      </Section>
    </PublicShell>
  );
}
