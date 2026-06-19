export function BrandLogo() {
  return (
    <span className="inline-flex items-baseline gap-1 font-heading text-2xl font-bold text-white">
      <span>KRAVE</span>
      <span className="text-kravex-gold">X</span>
    </span>
  );
}

export function GoldButton({ children, href = "/contact" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center border border-kravex-lightGold bg-kravex-gold px-5 py-3 text-center text-xs font-extrabold uppercase tracking-[.16em] text-black shadow-[0_0_28px_rgba(201,168,76,.18)] transition hover:bg-kravex-lightGold sm:w-auto"
    >
      {children}
    </a>
  );
}

export function OutlineButton({ children, href = "/how-it-works" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center border border-kravex-gold/70 bg-black/20 px-5 py-3 text-center text-xs font-extrabold uppercase tracking-[.16em] text-kravex-gold transition hover:border-kravex-lightGold hover:bg-kravex-gold hover:text-black sm:w-auto"
    >
      {children}
    </a>
  );
}

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl min-w-0">{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-md border border-kravex-border bg-gradient-to-b from-[#1b1b1b] to-[#101010] p-5 shadow-[0_18px_55px_rgba(0,0,0,.28)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
