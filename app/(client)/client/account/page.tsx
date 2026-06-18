"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Bell, CreditCard, LockKeyhole, MonitorCheck, Save, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";

const tabs = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "payment", label: "Payment Method", icon: CreditCard },
  { key: "security", label: "Security", icon: LockKeyhole },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;

type Tab = (typeof tabs)[number]["key"];

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-kravex-secondary">
      {label}
      <input {...props} className="rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
    </label>
  );
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center justify-between gap-4 rounded border border-kravex-border bg-black p-4 text-left">
      <span>
        <span className="block font-bold">{label}</span>
        <span className="mt-1 block text-sm text-kravex-secondary">{detail}</span>
      </span>
      <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-kravex-gold" : "bg-kravex-border"}`}>
        <span className={`h-5 w-5 rounded-full bg-black transition ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "Rhys Morgan", email: "rhys@cardiffheatpumps.co.uk", phone: "", businessName: "Cardiff Heat Pumps" });
  const [payment, setPayment] = useState<{ brand: string | null; last4: string | null; expiry: string | null }>({ brand: null, last4: null, expiry: null });
  const [notifications, setNotifications] = useState({
    newLeadEmail: true,
    newLeadSms: false,
    invoiceEmail: true,
    paymentEmail: true,
    messageEmail: true,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState<{ enabled?: boolean; qrCodeDataUrl?: string; secret?: string }>({});
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const passwordStrength = useMemo(() => strength(newPassword), [newPassword]);

  useEffect(() => {
    fetch("/api/client/account")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setProfile((current) => ({ ...current, ...data.profile }));
        if (data.paymentMethod) setPayment(data.paymentMethod);
        if (data.notifications) setNotifications((current) => ({ ...current, ...data.notifications }));
      })
      .catch(() => toast.error("Could not load account details."))
      .finally(() => setLoading(false));
    fetch("/api/auth/2fa").then((res) => res.json()).then((data) => setTwoFactor(data)).catch(() => {});
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/client/account", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      toast.error("Could not save your profile.");
      return;
    }
    toast.success("Profile saved");
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/client/account/password", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ newPassword, confirmPassword }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(body.error || "Could not change password.");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    toast.success(body.message || "Password updated");
  }

  function saveNotifications() {
    localStorage.setItem("kravex-client-notifications", JSON.stringify(notifications));
    toast.success("Notification preferences saved");
  }

  async function startTwoFactor() {
    const response = await fetch("/api/auth/2fa");
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(body.error || "Could not start 2FA setup.");
      return;
    }
    setTwoFactor(body);
  }

  async function confirmTwoFactor() {
    const response = await fetch("/api/auth/2fa", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: twoFactorCode }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(body.error || "Could not enable 2FA.");
      return;
    }
    setTwoFactor(body);
    setTwoFactorCode("");
    toast.success("2FA enabled");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client Dashboard</p>
          <h1 className="mt-3 font-heading text-5xl">My Account</h1>
          <p className="mt-3 max-w-2xl text-kravex-secondary">Manage your profile, payment readiness, password and communication preferences.</p>
        </div>
        <div className="rounded border border-kravex-border bg-kravex-card px-4 py-3 text-sm text-kravex-secondary">
          {loading ? "Loading account..." : `${profile.businessName} account`}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <div className="grid gap-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-3 rounded px-4 py-3 text-left text-sm font-bold ${tab === key ? "bg-kravex-gold text-black" : "text-kravex-secondary hover:bg-black hover:text-kravex-gold"}`}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </Card>

        {tab === "profile" ? (
          <Card>
            <h2 className="font-heading text-3xl">Profile</h2>
            <p className="mt-2 text-sm text-kravex-secondary">These details are used for lead notifications, invoices and messages.</p>
            <form onSubmit={saveProfile} className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              <Field label="Business name" value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} />
              <Field label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Field label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <button className="inline-flex items-center justify-center gap-2 rounded bg-kravex-gold px-5 py-3 font-bold text-black md:col-span-2"><Save size={18} />Save profile</button>
            </form>
          </Card>
        ) : null}

        {tab === "payment" ? (
          <Card>
            <h2 className="font-heading text-3xl">Payment Method</h2>
            <div className="mt-6 rounded border border-kravex-border bg-black p-5">
              {payment.last4 ? (
                <div className="flex items-center justify-between gap-4">
                  <div><p className="font-bold">{payment.brand} ending {payment.last4}</p><p className="mt-1 text-sm text-kravex-secondary">Expires {payment.expiry}</p></div>
                  <CreditCard className="text-kravex-gold" />
                </div>
              ) : (
                <div>
                  <p className="font-bold">No saved card yet</p>
                  <p className="mt-2 text-sm leading-6 text-kravex-secondary">Card collection must happen through Stripe Elements. KRAVEX should never store raw card numbers.</p>
                </div>
              )}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => toast.error("Stripe is not configured yet. Add Stripe keys before saving cards.")} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Update Card</button>
              <button onClick={() => { setPayment({ brand: null, last4: null, expiry: null }); toast.success("Local card display removed"); }} className="rounded border border-kravex-border px-5 py-3 font-bold text-kravex-secondary hover:border-kravex-gold hover:text-kravex-gold">Remove Card</button>
            </div>
            <p className="mt-4 text-xs leading-5 text-kravex-muted">Security: payment details are tokenised by Stripe. Only brand, last four digits and expiry should ever be displayed here.</p>
          </Card>
        ) : null}

        {tab === "security" ? (
          <Card>
            <h2 className="font-heading text-3xl">Security</h2>
            <form onSubmit={savePassword} className="mt-6 grid gap-4">
              <Field label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div className="h-2 rounded bg-black"><div style={{ width: `${passwordStrength * 25}%` }} className={`h-2 rounded ${passwordStrength < 2 ? "bg-kravex-error" : passwordStrength < 4 ? "bg-kravex-warning" : "bg-kravex-gold"}`} /></div>
              <Field label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Change password</button>
            </form>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded border border-kravex-border bg-black p-4"><MonitorCheck className="text-kravex-gold" /><p className="mt-3 font-bold">Current session</p><p className="mt-1 text-sm text-kravex-secondary">This browser, active now</p></div>
              <div className="rounded border border-kravex-border bg-black p-4"><ShieldCheck className="text-kravex-gold" /><p className="mt-3 font-bold">Protected account</p><p className="mt-1 text-sm text-kravex-secondary">Role-based access, secure password hashing and optional 2FA</p></div>
            </div>
            <div className="mt-6 rounded border border-kravex-border bg-black p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold">Two-factor authentication</p>
                  <p className="mt-1 text-sm text-kravex-secondary">{twoFactor.enabled ? "Enabled for this account." : "Use an authenticator app for one-time login codes."}</p>
                </div>
                {!twoFactor.enabled ? <button type="button" onClick={startTwoFactor} className="rounded border border-kravex-gold px-4 py-2 text-sm font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black">Set up 2FA</button> : null}
              </div>
              {!twoFactor.enabled && twoFactor.qrCodeDataUrl ? (
                <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
                  <Image src={twoFactor.qrCodeDataUrl} alt="2FA QR code" width={160} height={160} className="rounded bg-white p-2" unoptimized />
                  <div className="grid gap-3">
                    <p className="text-xs text-kravex-muted">Manual secret: <span className="font-mono text-kravex-secondary">{twoFactor.secret}</span></p>
                    <Field label="Authenticator code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} inputMode="numeric" />
                    <button type="button" onClick={confirmTwoFactor} className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Enable 2FA</button>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {tab === "notifications" ? (
          <Card>
            <h2 className="font-heading text-3xl">Notifications</h2>
            <div className="mt-6 grid gap-3">
              <Toggle label="New lead delivered by email" detail="Receive every new lead as soon as KRAVEX delivers it." checked={notifications.newLeadEmail} onChange={(value) => setNotifications({ ...notifications, newLeadEmail: value })} />
              <Toggle label="New lead delivered by SMS" detail="Optional SMS alert for urgent lead follow-up." checked={notifications.newLeadSms} onChange={(value) => setNotifications({ ...notifications, newLeadSms: value })} />
              <Toggle label="Invoice ready" detail="Email when a new invoice is issued." checked={notifications.invoiceEmail} onChange={(value) => setNotifications({ ...notifications, invoiceEmail: value })} />
              <Toggle label="Payment confirmed" detail="Email after a successful invoice payment." checked={notifications.paymentEmail} onChange={(value) => setNotifications({ ...notifications, paymentEmail: value })} />
              <Toggle label="New message from KRAVEX" detail="Email when Emdadul sends an update." checked={notifications.messageEmail} onChange={(value) => setNotifications({ ...notifications, messageEmail: value })} />
            </div>
            <button onClick={saveNotifications} className="mt-6 inline-flex items-center gap-2 rounded bg-kravex-gold px-5 py-3 font-bold text-black"><Smartphone size={18} />Save notifications</button>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
