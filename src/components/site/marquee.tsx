const WORDS = ["Furgones térmicos", "Isotérmicos", "Lácteos", "Frigoríficos", "Reparto refrigerado", "Baranda volcable", "Sider", "Arenado y pintura", "Corte láser", "Suspensión neumática"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-2 py-5" aria-hidden>
      <div className="flex w-max animate-marquee">
        {row.map((w, i) => (
          <span key={i} className="flex items-center font-display text-3xl uppercase text-white/90 sm:text-4xl">
            <span className="px-7">{w}</span>
            <span className="text-brand">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
