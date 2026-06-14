"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/ui";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const code = String(form.get("code") || "");
    try {
      const result = await Promise.race([
        signIn("credentials", { email, password, code, redirect: false }),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error("LOGIN_TIMEOUT")), 8000);
        }),
      ]);

      if (result?.error || !result?.ok) {
        setError("Invalid email or password");
        return;
      }

      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      router.push(role === "ADMIN" ? "/admin/dashboard" : "/client/dashboard");
      router.refresh();
    } catch (loginError) {
      console.error("Login failed:", loginError);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-kravex-black p-5">
      <form method="post" action="/api/auth/noop" onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-kravex-gold/60 bg-kravex-card p-8 shadow-gold">
        <BrandLogo />
        <h1 className="mt-8 font-heading text-4xl">Sign in</h1>
        <p className="mt-2 text-sm text-kravex-secondary">Access the KRAVEX admin or client portal.</p>
        <input name="email" type="email" autoComplete="email" placeholder="Email" required className="mt-6 w-full rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
        <input name="password" type="password" autoComplete="current-password" placeholder="Password" required className="mt-4 w-full rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
        <input name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="2FA code if enabled" className="mt-4 w-full rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
        {error ? <p className="mt-4 rounded border border-kravex-error/40 bg-kravex-error/10 px-4 py-3 text-sm text-kravex-error">{error}</p> : null}
        <button type="submit" disabled={!mounted || loading} className="mt-6 w-full rounded bg-kravex-gold px-4 py-3 font-bold text-black transition hover:bg-kravex-lightGold disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <a href="/forgot-password" className="text-kravex-gold">Forgot Password?</a>
          <a href="/signup" className="font-bold text-kravex-gold">Sign up</a>
        </div>
      </form>
    </main>
  );
}
