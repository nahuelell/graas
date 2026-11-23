"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TruckIcon } from "./icons";
import { MediaImage } from "./media-image";

/** Galería de fotos con miniaturas y visor a pantalla completa. */
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
      <div className="card grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_50%_40%,#2a2a30,#17171a_70%)]">
        <TruckIcon kind={fallbackKind} className="w-1/2 text-brand" strokeWidth={1.2} />
      </div>
    );
  }

  const current = images[index];
  return (
    <div>
      <button onClick={() => setOpen(true)} className="group card relative block aspect-[4/3] w-full overflow-hidden" aria-label="Ver foto en grande">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={current.public_id + index} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <MediaImage asset={current} alt={current.alt || title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        {total > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold backdrop-blur">
            {index + 1} / {total}
          </span>
        )}
      </button>
      {total > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.public_id + i}
              onClick={() => setIndex(i)}
              className={cn("relative aspect-square overflow-hidden rounded-lg border-2 transition", i === index ? "border-brand" : "border-transparent opacity-60 hover:opacity-100")}
              aria-label={`Foto ${i + 1}`}
            >
              <MediaImage asset={img} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <div className="relative h-[80vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
              <MediaImage asset={current} alt={current.alt || title} fill sizes="92vw" className="object-contain" />
            </div>
            <button className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-panel" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <X />
            </button>
            {total > 1 && (
              <>
                <button className="absolute left-4 grid size-12 place-items-center rounded-full bg-panel hover:bg-brand hover:text-ink" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); go(-1); }}>
                  <ChevronLeft />
                </button>
                <button className="absolute right-4 grid size-12 place-items-center rounded-full bg-panel hover:bg-brand hover:text-ink" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); go(1); }}>
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
