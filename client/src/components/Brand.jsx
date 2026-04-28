export function BrandMark({ className = "h-12 w-12", compact = false }) {
  return (
    <div className={`relative grid place-items-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#2563eb_48%,#111827)] text-white shadow-[0_16px_36px_rgba(37,99,235,0.35)] ${className}`}>
      <div className="absolute inset-[6px] rounded-xl border border-white/35 skew-x-[-10deg]" />
      <div className="absolute right-2 top-2 h-8 w-4 bg-[linear-gradient(#a3e635,#22d3ee)] opacity-90 [clip-path:polygon(45%_0,100%_0,58%_43%,100%_43%,20%_100%,45%_55%,0_55%)]" />
      <span className={`relative z-10 font-black text-white drop-shadow ${compact ? "text-base" : "text-lg"}`}>K</span>
    </div>
  );
}

export function BrandLockup({ subtitle, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark className={compact ? "h-10 w-10" : "h-12 w-12"} compact={compact} />
      <div>
        <div className={`font-black tracking-[0.08em] text-slate-950 ${compact ? "text-base" : "text-lg"}`}>KRAVEX</div>
        {subtitle ? <div className={`text-slate-400 ${compact ? "text-[11px]" : "text-xs"}`}>{subtitle}</div> : null}
      </div>
    </div>
  );
}
