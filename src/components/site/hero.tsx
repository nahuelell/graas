"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types";
import { useIntroSeen } from "./intro";
import { MediaImage } from "./media-image";

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 6500;

/**
 * Portada: carrusel de hasta 10 fotos (la primera siempre sale primera) y título editable desde el panel.
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
  const show = ready || Boolean(reduce);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const slides = images.slice(0, 10);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setIndex((i) => (i + d + total) % total), [total]);

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

  const lines = title.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-char text-white">
      {/* Fotos */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { y: bgY }}
        initial={{ clipPath: "inset(6% 4% 6% 4% round 6px)" }}
        animate={show ? { clipPath: "inset(0% 0% 0% 0% round 0px)" } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <AnimatePresence initial={false}>
          {total > 0 && (
            <motion.div
              key={slides[index].public_id + index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.06 }}
                animate={show ? { scale: 1 } : undefined}
                transition={{ duration: INTERVAL / 1000 + 1.4, ease: "linear" }}
              >
                <MediaImage asset={slides[index]} alt={slides[index].alt || "Carrocerías Graas"} fill priority={index === 0} sizes="100vw" className="object-cover" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,12,0.88)_0%,rgba(10,11,12,0.35)_45%,rgba(10,11,12,0.15)_70%,rgba(10,11,12,0.45)_100%)]" />
      </motion.div>

      <div className="container-x pb-10 pt-40">
        {kicker && (
          <motion.p
            className="mb-5 text-[0.95rem] text-white/75"
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            {kicker}
          </motion.p>
        )}
        <h1 className="h-display max-w-5xl text-[13vw] sm:text-7xl lg:text-[6.6rem]">
          {lines.map((line, i) => (
            <span key={i} className="-mt-[0.12em] block overflow-hidden pb-[0.04em] pt-[0.12em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={show ? { y: "0%" } : undefined}
                transition={{ duration: 1.2, delay: 0.45 + i * 0.09, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.85, ease: EASE }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10"
          >
            {subtitle && <p className="max-w-md text-base leading-relaxed text-white/80">{subtitle}</p>}
            <div className="flex shrink-0 items-center gap-6">
              <a href={whatsapp} target="_blank" rel="noopener" className="btn-yellow">
                Pedir presupuesto
              </a>
              <Link href="/carrocerias" className="link-line text-sm text-white">
                Ver carrocerías
              </Link>
            </div>
          </motion.div>

          {total > 1 && (
            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0 }}
              animate={show ? { opacity: 1 } : undefined}
              transition={{ duration: 1, delay: 1.1 }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="flex gap-1.5" role="tablist" aria-label="Fotos de portada">
                {slides.map((s, i) => (
                  <button
                    key={s.public_id + i}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Foto ${i + 1} de ${total}`}
                    onClick={() => setIndex(i)}
                    className="relative h-6 w-8"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden bg-white/25">
                      {i === index && (
                        <motion.span
                          key={`${index}-${paused}`}
                          className="absolute inset-y-0 left-0 bg-white"
                          initial={{ width: paused || reduce ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: paused || reduce ? 0 : INTERVAL / 1000, ease: "linear" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-sm tabular-nums text-white/70">
                {index + 1}/{total}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
