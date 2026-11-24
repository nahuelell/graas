"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { getCategory } from "@/lib/catalog";
import type { Product, Usado } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard, UsadoCard } from "./blocks";

type Props = { kind: "products"; items: Product[] } | { kind: "usados"; items: Usado[] };

/** Grilla con filtro por tipo (y "solo disponibles" en usados). */
export function FilterGrid(props: Props) {
  const [cat, setCat] = useState("todas");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const cats = useMemo(() => ["todas", ...new Set(props.items.map((i) => i.category))], [props.items]);

  const filtered = useMemo(() => {
    let list = props.items as (Product | Usado)[];
    if (cat !== "todas") list = list.filter((i) => i.category === cat);
    if (props.kind === "usados" && onlyAvailable) list = (list as Usado[]).filter((u) => u.status === "disponible");
    return list;
  }, [props.items, props.kind, cat, onlyAvailable]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-rule pb-4">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "relative text-[0.95rem] transition-colors",
              cat === c ? "font-semibold text-char" : "text-steel hover:text-char",
            )}
          >
            {c === "todas" ? "Todas" : getCategory(c).name}
            {cat === c && <motion.span layoutId={`filter-${props.kind}`} className="absolute -bottom-[17px] left-0 h-[2px] w-full bg-brand" />}
          </button>
        ))}
        {props.kind === "usados" && (
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-[0.95rem] text-steel">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="size-4 accent-[var(--color-char)]" />
            Solo disponibles
          </label>
        )}
      </div>

      <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {props.kind === "products" ? <ProductCard product={item as Product} /> : <UsadoCard usado={item as Usado} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="mt-10 text-steel">No hay unidades de este tipo por ahora.</p>}
    </div>
  );
}
