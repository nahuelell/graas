"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { mediaUrl, videoPoster, videoUrl } from "@/lib/cloudinary";
import { useIntroSeen } from "./intro";
import { ThermalTruck } from "./thermal-truck";
import { WhatsAppIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Portada enfocada en furgones térmicos.
 * - Si en el panel se sube un video o una foto de portada, se usa de fondo.
 * - Si no, se muestra la ilustración animada del furgón térmico.
 */
export function Hero({
  kicker,
  subtitle,
  video,
  image,
  whatsapp,
}: {
  kicker: string;
  subtitle: string;
  video: MediaAsset | null;
  image: MediaAsset | null;
  whatsapp: string;
}) {
  const reduce = useReducedMotion();
  const ready = useIntroSeen();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = ready || reduce;
  const vSrc = videoUrl(video);
  const hasMedia = Boolean(vSrc || image);
  const lines = ["Furgones", "térmicos", "a medida."];

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink grain">
      {/* Fondo */}
      {hasMedia ? (
        <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: bgY }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={show ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE }}
          >
            {vSrc ? (
              <video className="h-full w-full object-cover" src={vSrc} poster={videoPoster(video)} autoPlay muted loop playsInline preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(image, 1920)} alt="" className="h-full w-full animate-kenburns object-cover" />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 -z-10">
          {/* grilla técnica + resplandor frío */}
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-frost)_1px,transparent_1px),linear-gradient(90deg,var(--color-frost)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
          <div className="absolute right-[-10%] top-1/2 h-[70vh] w-[70vh] -translate-y-1/2 rounded-full bg-frost/10 blur-[120px]" />
        </div>
      )}

      <div className="container-x relative grid items-center gap-10 pb-20 pt-32 lg:grid-cols-[1fr_1.15fr]">
        <motion.div style={reduce ? undefined : { y: textY, opacity: fade }}>
          <motion.p
            className="kicker mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <span className="h-px w-10 bg-brand" />
            {kicker}
          </motion.p>
          <h1 className="h-display text-[17vw] sm:text-8xl lg:text-[7.5rem]">
            {lines.map((line, i) => (
              <span key={line} className="-mt-[0.14em] block overflow-hidden pb-[0.05em] pt-[0.14em]">
                <motion.span
                  className={`block ${i === 1 ? "text-frost" : ""} ${i === 2 ? "text-brand" : ""}`}
                  initial={{ y: "110%" }}
                  animate={show ? { y: "0%" } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          >
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-brand group">
              <WhatsAppIcon className="size-4" />
              Cotizá tu furgón térmico
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </a>
            <Link href="/termicos" className="btn-ghost">
              Conocé los térmicos
            </Link>
          </motion.div>
        </motion.div>

        {!hasMedia && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          >
            <ThermalTruck className="w-full" play={Boolean(show)} />
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute bottom-8 right-8 hidden flex-col items-center gap-3 text-[0.6rem] font-bold tracking-[0.3em] text-white/60 sm:flex"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
      >
        <span className="[writing-mode:vertical-rl]">DESPLAZÁ</span>
        <span className="relative h-10 w-6 rounded-full border border-white/40">
          <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-scroll-dot rounded-full bg-brand" />
        </span>
      </motion.div>
    </section>
  );
}
