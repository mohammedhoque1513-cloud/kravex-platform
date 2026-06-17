"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={compact ? "flex flex-col items-center gap-1 p-3 text-center text-xs text-kravex-secondary" : "flex w-full items-center justify-center gap-2 rounded border border-kravex-border px-4 py-3 text-sm font-bold text-kravex-secondary hover:border-kravex-gold hover:text-kravex-gold"}
      >
        <LogOut size={compact ? 16 : 18} />
        Logout
      </button>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
          <div className="w-full max-w-sm rounded-lg border border-kravex-gold/50 bg-kravex-card p-6 text-center shadow-gold">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-kravex-gold/40 bg-black text-kravex-gold">
              <LogOut size={22} />
            </div>
            <h2 id="logout-confirm-title" className="mt-5 font-heading text-2xl text-white">Are you sure you want to log out?</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded border border-kravex-border px-4 py-3 text-sm font-bold text-kravex-secondary transition hover:border-white hover:text-white"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded bg-kravex-gold px-4 py-3 text-sm font-bold text-black transition hover:bg-kravex-lightGold"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
