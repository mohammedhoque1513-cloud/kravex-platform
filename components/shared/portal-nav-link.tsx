"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileBarChart,
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  Megaphone,
  ReceiptText,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from "lucide-react";

const icons = {
  BarChart3,
  Building2,
  CreditCard,
  FileBarChart,
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  Megaphone,
  ReceiptText,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  Users,
};

type PortalNavLinkProps = {
  href: string;
  label: string;
  icon: keyof typeof icons;
  variant?: "admin-desktop" | "admin-mobile" | "client-desktop" | "client-mobile";
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalNavLink({ href, label, icon: Icon, variant = "admin-desktop" }: PortalNavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  const IconComponent = icons[Icon];

  const classes = {
    "admin-desktop": active
      ? "group flex items-center gap-3 rounded border-l-2 border-kravex-gold bg-kravex-card px-4 py-3 text-sm font-semibold text-kravex-gold shadow-gold"
      : "group flex items-center gap-3 rounded border-l-2 border-transparent px-4 py-3 text-sm font-semibold text-kravex-secondary transition hover:border-kravex-gold hover:bg-kravex-card hover:text-kravex-gold",
    "admin-mobile": active
      ? "flex min-w-[76px] flex-col items-center gap-1 rounded border border-kravex-gold/60 bg-kravex-card px-2 py-2 text-[11px] font-semibold text-kravex-gold"
      : "flex min-w-[76px] flex-col items-center gap-1 rounded border border-transparent px-2 py-2 text-[11px] font-semibold text-kravex-secondary hover:border-kravex-gold/40 hover:text-kravex-gold",
    "client-desktop": active
      ? "flex items-center gap-3 rounded border-l-2 border-kravex-gold bg-kravex-card px-4 py-3 font-semibold text-kravex-gold shadow-gold"
      : "flex items-center gap-3 rounded border-l-2 border-transparent px-4 py-3 text-kravex-secondary hover:bg-kravex-card hover:text-kravex-gold",
    "client-mobile": active
      ? "flex min-w-0 flex-col items-center gap-1 rounded border border-kravex-gold/60 bg-kravex-card px-1 py-2 text-[10px] font-semibold text-kravex-gold"
      : "flex min-w-0 flex-col items-center gap-1 rounded border border-transparent px-1 py-2 text-[10px] font-semibold text-kravex-secondary hover:text-kravex-gold",
  }[variant];

  const iconClass = active ? "text-kravex-gold" : "text-kravex-muted group-hover:text-kravex-gold";

  return (
    <Link href={href} className={classes} aria-current={active ? "page" : undefined}>
      <IconComponent size={18} className={iconClass} />
      <span className={variant === "client-mobile" ? "truncate" : undefined}>{label}</span>
    </Link>
  );
}
