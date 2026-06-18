"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { constructionNiches, subNichesByTrade } from "@/lib/construction-niches";

const budgets = ["Under £500", "£500 - £1,000", "£1,000 - £2,000", "£2,000+", "Not sure yet"];
const sources = ["Google", "LinkedIn", "Referral", "Cold Email", "Other"];
const temperatures = ["HOT", "WARM", "COLD"];
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

function fieldClass(className = "") {
  return `w-full rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus ${className}`;
}

export function LeadCaptureForm({ mode = "public" }: { mode?: "public" | "admin" }) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [trade, setTrade] = useState<(typeof constructionNiches)[number]>("Roofing");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (recaptchaSiteKey && window.grecaptcha) {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha?.ready(() => {
          window.grecaptcha?.execute(recaptchaSiteKey, { action: "lead_form" }).then(resolve).catch(reject);
        });
      });
      data.recaptchaToken = token;
    }
    if (data.companyWebsite) {
      setStatus("success");
      setMessage("Thanks. We will review this shortly.");
      form.reset();
      return;
    }
    const response = await fetch("/api/lead-form", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(body.error || "Could not submit this lead. Please check the details and try again.");
      return;
    }
    setStatus("success");
    setMessage(mode === "admin" ? "Phone lead saved to the enquiry pipeline." : `Thank you ${data.name || ""}. We will be in touch within 24 hours.`);
    form.reset();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {recaptchaSiteKey ? <Script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} strategy="afterInteractive" /> : null}
      <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input name="source" type="hidden" value={mode === "admin" ? "PHONE_CALL" : "HOME_PAGE"} />
      <input name="email" type="email" required placeholder="Email address" className={fieldClass()} />
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required placeholder="Full name" className={fieldClass()} />
        <input name="businessName" required placeholder="Business name" className={fieldClass()} />
      </div>
      <input name="phone" required placeholder="UK phone number" className={fieldClass()} />
      <div className="grid gap-4 md:grid-cols-2">
        <select name="service" required value={trade} onChange={(event) => setTrade(event.target.value as typeof trade)} className={fieldClass()}>
          {constructionNiches.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select name="subService" required className={fieldClass()}>
          {subNichesByTrade[trade].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="city" required placeholder="City" className={fieldClass()} />
        <select name="budget" className={fieldClass()}>
          {budgets.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <select name="referralSource" className={fieldClass()}>
          {sources.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {mode === "admin" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <input name="callDuration" placeholder="Call duration" className={fieldClass()} />
          <select name="leadTemperature" className={fieldClass()}>
            {temperatures.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input name="takenBy" defaultValue="Emdadul Hoque" className={fieldClass()} />
        </div>
      ) : null}
      <textarea name="message" placeholder={mode === "admin" ? "Call notes and next step" : "Message"} className={fieldClass("min-h-28")} />
      <button disabled={status === "saving"} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black transition hover:bg-kravex-lightGold disabled:cursor-not-allowed disabled:opacity-60">
        {status === "saving" ? "Submitting..." : mode === "admin" ? "Save Phone Lead" : "Request a Free Strategy Call"}
      </button>
      {message ? <p className={`rounded border px-4 py-3 text-sm ${status === "error" ? "border-kravex-error/40 bg-kravex-error/10 text-kravex-error" : "border-kravex-success/30 bg-kravex-success/10 text-kravex-success"}`}>{message}</p> : null}
      <p className="text-xs leading-5 text-kravex-muted">No files or payment details are accepted here. Repeated submissions, disposable emails, suspicious links and scam patterns are blocked before storage.</p>
    </form>
  );
}
