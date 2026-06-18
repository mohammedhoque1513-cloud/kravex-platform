"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { BrandLogo, GoldButton } from "@/components/shared/ui";

const links = [
  ["Home", "/"],
  ["How It Works", "/how-it-works"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Results", "/results"],
  ["About", "/about"],
];

export function PublicNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-kravex-gold/70 bg-kravex-black/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-5">
          <Link href="/" className="shrink-0"><BrandLogo /></Link>
          <div className="hidden items-center gap-6 lg:flex">
            {links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-kravex-secondary hover:text-kravex-gold">{label}</Link>)}
          </div>
          <div className="hidden items-center gap-5 lg:flex">
            <GoldButton href="/contact">Book a Call</GoldButton>
            <Link href="/login" className="text-sm font-semibold text-kravex-gold">Login</Link>
          </div>
          <button className="rounded border border-kravex-border p-2 text-kravex-gold lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </nav>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-kravex-black p-6">
          <button className="absolute right-5 top-5 rounded border border-kravex-border p-2 text-kravex-gold" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
          <div className="flex min-h-full flex-col items-center justify-center gap-6 py-16 text-center">
            {links.map(([label, href]) => <Link key={href} href={href} className="font-heading text-3xl sm:text-4xl">{label}</Link>)}
            <GoldButton href="/contact">Book a Call</GoldButton>
            <Link href="/login" className="font-bold text-kravex-gold">Login</Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-kravex-border bg-black px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo />
          <p className="mt-4 text-sm leading-6 text-kravex-secondary">We Fill Your Pipeline. Every Month.</p>
          <p className="mt-4 text-sm text-kravex-gold">LinkedIn / X / Email</p>
        </div>
        <div>
          <h3 className="font-bold">Navigation</h3>
          <div className="mt-4 grid gap-2 text-sm text-kravex-secondary">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        </div>
        <div>
          <h3 className="font-bold">Industries</h3>
          <div className="mt-4 grid gap-2 text-sm text-kravex-secondary">
            <span>Roofing</span>
            <span>Plumbing</span>
            <span>HVAC</span>
            <span>Electrical</span>
            <span>Home Remodelling</span>
            <span>Concrete</span>
            <span>Foundation Repair</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Contact</h3>
          <p className="mt-4 break-words text-sm leading-6 text-kravex-secondary">hello@kravex.co.uk<br />kravex.co.uk<br />United Kingdom</p>
          <div className="mt-5"><GoldButton href="/contact">Book a Call</GoldButton></div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-kravex-border pt-6 text-xs leading-5 text-kravex-muted sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright 2026 KRAVEX. Trading name of Emdadul Hoque. Limited company details will be published once incorporated.</span>
        <span><Link href="/privacy-policy">Privacy</Link> | <Link href="/terms">Terms</Link> | <Link href="/cookie-policy">Cookies</Link></span>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="pt-16 sm:pt-20">{children}</main>
      <PublicFooter />
    </>
  );
}
