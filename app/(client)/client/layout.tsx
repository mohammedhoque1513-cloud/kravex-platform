import { BrandLogo } from "@/components/shared/ui";
import { LogoutButton } from "@/components/shared/logout-button";
import { PortalNavLink } from "@/components/shared/portal-nav-link";

const links = [
  { label: "Dashboard", href: "/client/dashboard", icon: "Home" },
  { label: "Leads", href: "/client/leads", icon: "Target" },
  { label: "Invoices", href: "/client/invoices", icon: "ReceiptText" },
  { label: "Messages", href: "/client/messages", icon: "Mail" },
  { label: "Account", href: "/client/account", icon: "UserRound" },
] as const;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kravex-black pb-24 text-white lg:pb-0 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-kravex-border bg-black p-6 lg:block">
        <div className="flex h-full flex-col">
          <div>
            <BrandLogo />
            <p className="mt-3 text-sm text-kravex-secondary">Client Dashboard</p>
            <nav className="mt-10 grid gap-2">
              {links.map(({ label, href, icon }) => (
                <PortalNavLink key={href} href={href} label={label} icon={icon} variant="client-desktop" />
              ))}
            </nav>
          </div>
          <div className="mt-auto"><LogoutButton /></div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-kravex-border bg-kravex-black/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo />
          <span className="rounded border border-kravex-gold/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-kravex-gold">Client</span>
        </div>
      </header>

      <main className="min-w-0 p-4 sm:p-5 lg:p-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-kravex-border bg-black/95 px-2 py-2 backdrop-blur lg:hidden" aria-label="Client mobile navigation">
        <div className="grid grid-cols-6 gap-1">
          {links.map(({ label, href, icon }) => (
            <PortalNavLink key={href} href={href} label={label} icon={icon} variant="client-mobile" />
          ))}
          <div className="flex items-center justify-center"><LogoutButton compact /></div>
        </div>
      </nav>
    </div>
  );
}
