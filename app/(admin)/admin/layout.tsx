import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/ui";
import { LogoutButton } from "@/components/shared/logout-button";

const links = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Prospects", href: "/admin/prospects", icon: Target },
  { label: "Clients", href: "/admin/clients", icon: Building2 },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Invoices", href: "/admin/invoices", icon: FileText },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
  { label: "Security", href: "/admin/security", icon: ShieldCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kravex-black pb-24 text-white lg:pb-0 lg:pl-72">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-kravex-border bg-black lg:block">
        <div className="flex h-full flex-col p-6">
          <a href="/admin/dashboard" className="flex items-center justify-between">
            <BrandLogo />
            <span className="rounded border border-kravex-gold/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-kravex-gold">Admin</span>
          </a>
          <div className="mt-8 rounded border border-kravex-border bg-kravex-card p-4">
            <p className="text-xs uppercase tracking-[.2em] text-kravex-muted">This Month</p>
            <p className="mt-2 font-mono text-2xl text-kravex-gold">0 / 0</p>
            <p className="mt-1 text-xs text-kravex-secondary">No clients or lead targets yet</p>
            <div className="mt-4 h-2 rounded bg-black"><div className="h-2 w-0 rounded bg-kravex-gold" /></div>
          </div>
          <nav className="mt-8 grid gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <a key={href} href={href} className="group flex items-center gap-3 rounded border-l-2 border-transparent px-4 py-3 text-sm font-semibold text-kravex-secondary transition hover:border-kravex-gold hover:bg-kravex-card hover:text-kravex-gold">
                <Icon size={18} className="text-kravex-muted group-hover:text-kravex-gold" />
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto rounded border border-kravex-border bg-kravex-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-kravex-gold font-bold text-black">EH</div>
              <div>
                <p className="font-bold">Emdadul Hoque</p>
                <p className="text-xs text-kravex-secondary">Founder, KRAVEX</p>
              </div>
            </div>
            <div className="mt-4"><LogoutButton /></div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-kravex-border bg-kravex-black/95 px-4 py-3 backdrop-blur sm:px-5 lg:px-8 lg:py-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a href="/admin/dashboard" className="shrink-0 lg:hidden"><BrandLogo /></a>
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-3 text-kravex-muted" size={16} />
            <input placeholder="Search..." className="w-full rounded border border-kravex-border bg-kravex-card py-2.5 pl-10 pr-3 text-sm text-white gold-focus sm:pr-4" />
          </div>
          <button className="relative shrink-0 rounded border border-kravex-border bg-kravex-card p-2.5 text-kravex-secondary hover:text-kravex-gold" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-kravex-error" />
          </button>
          <a href="/admin/reports" className="hidden items-center gap-2 rounded border border-kravex-gold px-4 py-2.5 text-sm font-bold text-kravex-gold hover:bg-kravex-gold hover:text-black sm:flex">
            <BarChart3 size={16} />
            Reports
          </a>
        </div>
      </header>

      <main className="min-w-0 p-4 sm:p-5 lg:p-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-kravex-border bg-black/95 px-2 py-2 backdrop-blur lg:hidden" aria-label="Admin mobile navigation">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {links.map(({ label, href, icon: Icon }) => (
            <a key={href} href={href} className="flex min-w-[76px] flex-col items-center gap-1 rounded border border-transparent px-2 py-2 text-[11px] font-semibold text-kravex-secondary hover:border-kravex-gold/40 hover:text-kravex-gold">
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ))}
          <div className="flex min-w-[76px] items-center justify-center px-2"><LogoutButton compact /></div>
        </div>
      </nav>
    </div>
  );
}
