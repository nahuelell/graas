"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

export function Stats({ since = 1985 }: { since?: number }) {
  const years = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear() - since,
    () => 2026 - since,
  );
  const items = [
    { value: <Counter to={years} prefix="+" />, label: "años fabricando", sub: "en Crespo, Entre Ríos" },
    { value: <span>Térmicos</span>, label: "y metálicas", sub: "furgones isotérmicos" },
    { value: <span>A medida</span>, label: "de cada chasis", sub: "diseño propio" },
    { value: <span>100%</span>, label: "homologadas", sub: "y certificadas" },
  ];
  return (
    <section className="bg-brand text-ink" aria-label="Por qué Graas">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="border-ink/15 px-2 py-10 text-center even:border-l lg:border-l lg:first:border-l-0">
            <p className="font-display text-4xl uppercase sm:text-5xl">{it.value}</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider">{it.label}</p>
            <p className="text-xs font-medium text-ink/60">{it.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
