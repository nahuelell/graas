"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { useIntroSeen } from "./intro";
import { WhatsAppIcon } from "./icons";
import { MediaImage } from "./media-image";

const EASE = [0.16, 1, 0.3, 1] as const;
const INTERVAL = 6000;

/**
 * Portada con carrusel de fotos (hasta 10, gestionadas desde Ajustes del sitio).
 * La primera foto es siempre la que aparece al entrar. El título se edita desde el panel:
 * una línea por renglón y el último renglón va en amarillo.
 */
export function Hero({
  title,
  kicker,
  subtitle,
  images,
  whatsapp,
}: {
  title: string;
  kicker: string;
  subtitle: string;
  images: MediaAsset[];
  whatsapp: string;
}) {
  const reduce = useReducedMotion();
  const ready = useIntroSeen();
  const show = ready || reduce;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const slides = images.slice(0, 10);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setIndex((i) => (i + d + total) % total), [total]);

  // Avance automático (se pausa con el mouse encima o con la pestaña oculta)
  useEffect(() => {
    if (total < 2 || paused || !show || reduce) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, total, paused, show, reduce, go]);

  useEffect(() => {
    const on = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const lines = title
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink grain"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fondo: carrusel */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: bgY }}>
        {total > 0 ? (
          <AnimatePresence initial={false}>
            <motion.div
              key={slides[index].public_id + index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.12 }}
                animate={show ? { scale: 1 } : {}}
                transition={{ duration: INTERVAL / 1000 + 1.5, ease: "linear" }}
              >
                <MediaImage
                  asset={slides[index]}
                  alt={slides[index].alt || "Carrocerías Graas"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-frost)_1px,transparent_1px),linear-gradient(90deg,var(--color-frost)_1px,transparent_1px)] [background-size:56px_56px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
      </motion.div>

      <motion.div className="container-x relative pb-28 pt-40" style={reduce ? undefined : { y: textY, opacity: fade }}>
        <motion.p
          className="kicker mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={show ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <span className="h-px w-10 bg-brand" />
          {kicker}
        </motion.p>
        <h1 className="h-display text-[15vw] sm:text-8xl lg:text-[8rem]">
          {lines.map((line, i) => (
            <span key={i} className="-mt-[0.14em] block overflow-hidden pb-[0.05em] pt-[0.14em]">
              <motion.span
                className={`block ${i === lines.length - 1 && lines.length > 1 ? "text-brand" : ""}`}
                initial={{ y: "110%" }}
                animate={show ? { y: "0%" } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        {subtitle && (
          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          <a href={whatsapp} target="_blank" rel="noopener" className="btn-brand group">
            <WhatsAppIcon className="size-4" />
            Pedí tu presupuesto
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </a>
          <Link href="/carrocerias" className="btn-ghost">
            Ver carrocerías
          </Link>
        </motion.div>
      </motion.div>

      {/* Controles del carrusel */}
      {total > 1 && (
        <motion.div
          className="absolute inset-x-0 bottom-8"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <div className="container-x flex items-center justify-between gap-6 pr-24">
            <div className="flex flex-1 gap-2" role="tablist" aria-label="Fotos de portada">
              {slides.map((s, i) => (
                <button
                  key={s.public_id + i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="group relative h-6 max-w-16 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                    {i === index ? (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-brand"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: paused || reduce ? 0 : INTERVAL / 1000, ease: "linear" }}
                      />
                    ) : (
                      <span className={`absolute inset-0 ${i < index ? "bg-white/60" : ""}`} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-lg tabular-nums text-white/80">
                {String(index + 1).padStart(2, "0")}
                <span className="text-white/35"> / {String(total).padStart(2, "0")}</span>
              </span>
              <button onClick={() => go(-1)} aria-label="Foto anterior" className="grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-brand hover:bg-brand hover:text-ink">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Foto siguiente" className="grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-brand hover:bg-brand hover:text-ink">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
