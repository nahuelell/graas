"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { getCategory } from "@/lib/catalog";
import type { Product, Usado } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard, UsadoCard } from "./blocks";

type Props =
  | { kind: "products"; items: Product[] }
  | { kind: "usados"; items: Usado[] };

/** Grilla con filtros por categoría (y estado, en usados), animada. */
export function FilterGrid(props: Props) {
  const [cat, setCat] = useState("todas");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const cats = useMemo(() => {
    const set = new Set(props.items.map((i) => i.category));
    return ["todas", ...set];
  }, [props.items]);

  const filtered = useMemo(() => {
    let list = props.items as (Product | Usado)[];
    if (cat !== "todas") list = list.filter((i) => i.category === cat);
    if (props.kind === "usados" && onlyAvailable) list = (list as Usado[]).filter((u) => u.status === "disponible");
    return list;
  }, [props.items, props.kind, cat, onlyAvailable]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === c ? "border-brand bg-brand text-ink" : "border-line text-muted hover:border-white/40 hover:text-white",
            )}
          >
            {c === "todas" ? "Todas" : getCategory(c).name}
          </button>
        ))}
        {props.kind === "usados" && (
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="size-4 accent-[var(--color-brand)]" />
            Solo disponibles
          </label>
        )}
      </div>

      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              {props.kind === "products" ? <ProductCard product={item as Product} /> : <UsadoCard usado={item as Usado} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="mt-10 text-muted">No hay unidades en esta categoría por ahora.</p>}
    </div>
  );
}
