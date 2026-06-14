"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={compact ? "flex flex-col items-center gap-1 p-3 text-center text-xs text-kravex-secondary" : "flex w-full items-center justify-center gap-2 rounded border border-kravex-border px-4 py-3 text-sm font-bold text-kravex-secondary hover:border-kravex-gold hover:text-kravex-gold"}
    >
      <LogOut size={compact ? 16 : 18} />
      Logout
    </button>
  );
}
