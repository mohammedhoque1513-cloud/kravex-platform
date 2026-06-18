"use client";

import { PublicShell } from "@/components/public/shell";
import { Card, Section } from "@/components/shared/ui";
import { LeadCaptureForm } from "@/components/shared/lead-capture-form";

export default function SignupPage() {
  return (
    <PublicShell>
      <Section className="bg-kravex-black">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Sign Up</p>
            <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl">Request access to KRAVEX.</h1>
            <p className="mt-6 leading-7 text-kravex-secondary">Tell us about your business. You do not need an account yet. Once KRAVEX approves you as a client, Emdadul will create your secure dashboard login.</p>
            <div className="mt-6 rounded border border-kravex-border bg-black p-4 text-sm text-kravex-secondary">
              <p className="font-bold text-white">How sign-up works</p>
              <p className="mt-2">Submit the form, we review fit, then you receive a client dashboard login only after onboarding.</p>
            </div>
          </div>
          <Card>
            <LeadCaptureForm />
          </Card>
        </div>
      </Section>
    </PublicShell>
  );
}
