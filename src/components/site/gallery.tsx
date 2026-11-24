"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TruckIcon } from "./icons";
import { MediaImage } from "./media-image";

/** Galería con miniaturas y visor a pantalla completa. */
export function Gallery({ images, title, fallbackKind }: { images: MediaAsset[]; title: string; fallbackKind: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + total) % total), [total]);

  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", on);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  if (!total) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-[4px] bg-paper-2">
        <TruckIcon kind={fallbackKind} className="w-2/5 text-steel/70" strokeWidth={1.2} wheelFill="var(--color-paper-2)" />
      </div>
    );
  }

  const current = images[index];
  return (
    <div>
      <button onClick={() => setOpen(true)} className="relative block aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-paper-2" aria-label="Ver foto en grande">
        <AnimatePresence initial={false}>
          <motion.div key={current.public_id + index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <MediaImage asset={current} alt={current.alt || title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </button>
      {total > 1 && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.public_id + i}
                onClick={() => setIndex(i)}
                className={cn("relative size-16 shrink-0 overflow-hidden rounded-[3px] transition-opacity", i === index ? "opacity-100 ring-2 ring-char ring-offset-2 ring-offset-paper" : "opacity-50 hover:opacity-100")}
                aria-label={`Foto ${i + 1}`}
              >
                <MediaImage asset={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
          <span className="shrink-0 text-sm tabular-nums text-steel">{index + 1}/{total}</span>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-char/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <div className="relative h-[82vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
              <MediaImage asset={current} alt={current.alt || title} fill sizes="92vw" className="object-contain" />
            </div>
            <button className="absolute right-5 top-5 grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <X />
            </button>
            {total > 1 && (
              <>
                <button className="absolute left-4 grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); go(-1); }}>
                  <ChevronLeft />
                </button>
                <button className="absolute right-4 grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); go(1); }}>
                  <ChevronRight />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
