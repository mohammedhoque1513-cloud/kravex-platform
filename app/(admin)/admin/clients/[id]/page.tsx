"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";
import { formatMoney } from "@/lib/utils";

export default function Page() {
  const params = useParams<{ id: string }>();
  const tabs = ["Overview", "Leads", "Invoices", "Campaigns", "Messages", "Notes"];
  const [portalLogin, setPortalLogin] = useState<{ email: string; password?: string; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  async function createPortalLogin() {
    setCreating(true);
    const response = await fetch(`/api/admin/clients/${params.id}/portal-login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessName: "Patel Dental",
        contactName: "Dr. Ravi Patel",
        email: "patel@pateldental.co.uk",
      }),
    });
    setCreating(false);
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(body.error || "Could not create portal login.");
      return;
    }
    setPortalLogin({
      email: body.user.email,
      password: body.temporaryPassword,
      message: body.alreadyExists ? body.message : "Portal login created. Give these details to the client securely.",
    });
    toast.success(body.alreadyExists ? "Portal login already exists" : "Portal login created");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client profile</p>
          <h1 className="mt-3 font-heading text-5xl">Patel Dental</h1>
          <p className="mt-3 text-kravex-secondary">Cosmetic Dentistry · Birmingham · {formatMoney(150000)} monthly retainer</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded bg-kravex-gold px-5 py-3 font-bold text-black">Create Invoice</button>
          <button onClick={createPortalLogin} disabled={creating} className="rounded border border-kravex-gold px-5 py-3 font-bold text-kravex-gold disabled:cursor-not-allowed disabled:opacity-60">
            {creating ? "Creating..." : "Create Portal Login"}
          </button>
        </div>
      </div>

      {portalLogin ? (
        <Card className="border-kravex-gold/60 bg-black">
          <p className="font-bold text-kravex-gold">{portalLogin.message}</p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded border border-kravex-border p-4">
              <p className="text-kravex-secondary">Email</p>
              <p className="mt-1 font-mono text-white">{portalLogin.email}</p>
            </div>
            <div className="rounded border border-kravex-border p-4">
              <p className="text-kravex-secondary">Temporary password</p>
              <p className="mt-1 font-mono text-white">{portalLogin.password || "Already created"}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-kravex-muted">Ask the client to change this password after first login. Do not send passwords in public channels.</p>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} className="rounded border border-kravex-border px-4 py-2 text-sm text-kravex-secondary hover:border-kravex-gold hover:text-kravex-gold">{tab}</button>)}</div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><p className="text-sm text-kravex-secondary">MRR</p><p className="mt-3 font-mono text-4xl text-kravex-gold">{formatMoney(150000)}</p></Card>
        <Card><p className="text-sm text-kravex-secondary">Lead target</p><p className="mt-3 font-mono text-4xl text-kravex-gold">0 / 20</p><div className="mt-4 h-2 rounded bg-black"><div className="h-2 w-0 rounded bg-kravex-gold" /></div></Card>
        <Card><p className="text-sm text-kravex-secondary">Invoice status</p><p className="mt-3 font-mono text-4xl text-kravex-secondary">None</p></Card>
      </div>
      <Card><h2 className="font-heading text-2xl">Client information</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><input defaultValue="Patel Dental" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="Dr. Ravi Patel" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="patel@pateldental.co.uk" className="rounded border border-kravex-border bg-black px-4 py-3" /><input defaultValue="Cosmetic Dentistry" className="rounded border border-kravex-border bg-black px-4 py-3" /><textarea defaultValue="Priority client. Focus on implant enquiries and private consultations." className="min-h-32 rounded border border-kravex-border bg-black px-4 py-3 md:col-span-2" /></div></Card>
    </div>
  );
}
