"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { mediaUrl, videoPoster, videoUrl } from "@/lib/cloudinary";
import { useIntroSeen } from "./intro";
import { Sparks } from "./sparks";
import { WhatsAppIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = ready || reduce;
  const vSrc = videoUrl(video);
  const lines = ["Carrocerías", "hechas para", "trabajar."];

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink grain">
      {/* Fondo: video (si está cargado en el panel) o imagen con zoom lento */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: bgY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25, opacity: 0 }}
          animate={show ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 2.2, ease: EASE }}
        >
          {vSrc ? (
            <video
              className="h-full w-full object-cover"
              src={vSrc}
              poster={videoPoster(video)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(image, 1920)} alt="" className="h-full w-full animate-kenburns object-cover object-[70%_50%]" />
          ) : null}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </motion.div>

      {/* Chispas de soldadura */}
      <Sparks
        className="pointer-events-none absolute inset-0 -z-0 h-full w-full"
        origin={{ x: 0.82, y: 0.58 }}
        rate={show ? 1.1 : 0}
        speed={8}
        spread={Math.PI * 1.3}
      />

      <motion.div className="container-x relative pb-24 pt-40 sm:pb-28" style={reduce ? undefined : { y: textY, opacity: fade }}>
        <motion.p
          className="kicker mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={show ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          <span className="h-px w-10 bg-brand" />
          {kicker}
        </motion.p>
        <h1 className="h-display text-[17vw] sm:text-8xl lg:text-[8.5rem]">
          {lines.map((line, i) => (
            <span key={line} className="-mt-[0.14em] block overflow-hidden pb-[0.05em] pt-[0.14em]">
              <motion.span
                className={`block ${i === lines.length - 1 ? "text-brand" : ""}`}
                initial={{ y: "110%" }}
                animate={show ? { y: "0%" } : {}}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.12, ease: EASE }}
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
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          {subtitle}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          <a href={whatsapp} target="_blank" rel="noopener" className="btn-brand group">
            <WhatsAppIcon className="size-4" />
            Pedí tu presupuesto
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </a>
          <Link href="/carrocerias" className="btn-ghost">
            Ver modelos
          </Link>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
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
