"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Ilustración lineal animada de un furgón térmico: se dibuja trazo a trazo,
 * con el emblema de frío girando y el aire frío saliendo del equipo.
 */
export function ThermalTruck({ className, play = true }: { className?: string; play?: boolean }) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration = 1.2) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.2 } },
  });

  return (
    <svg viewBox="0 0 640 340" fill="none" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <radialGradient id="tt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-frost)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-frost)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* halo frío detrás de la caja */}
      <motion.ellipse
        cx="250" cy="150" rx="260" ry="150" fill="url(#tt-glow)"
        initial={reduce ? false : { opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1.2, duration: 1.4 }}
      />

      <g stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" className="text-white/85">
        {/* piso / ruta */}
        <motion.path d="M10 300H630" {...draw(0, 1)} className="text-white/25" stroke="currentColor" />
        {/* caja térmica */}
        <motion.path d="M40 60H420V262H40Z" {...draw(0.15, 1.4)} />
        {/* juntas de paneles */}
        <motion.path d="M135 66V256M230 66V256M325 66V256" {...draw(0.7, 0.9)} className="text-white/30" stroke="currentColor" strokeWidth="1.4" />
        {/* puerta trasera */}
        <motion.path d="M52 76V246M52 120h10M52 200h10" {...draw(0.9, 0.7)} className="text-white/45" stroke="currentColor" strokeWidth="1.6" />
        {/* chasis */}
        <motion.path d="M30 262H600" {...draw(0.4, 1)} />
        {/* cabina */}
        <motion.path d="M438 262V118H530L592 194V262" {...draw(0.55, 1.1)} />
        <motion.path d="M454 134h66l42 54h-108z" {...draw(0.9, 0.8)} className="text-white/60" stroke="currentColor" />
        <motion.path d="M592 236h14v26h-14" {...draw(1.1, 0.5)} />
      </g>

      {/* equipo de frío sobre el frente de la caja */}
      <motion.path
        d="M346 60V30h74v30"
        stroke="var(--color-brand)" strokeWidth="2.4" strokeLinejoin="round"
        {...draw(1.1, 0.6)}
      />
      <motion.path d="M360 45h46" stroke="var(--color-brand)" strokeWidth="1.6" strokeLinecap="round" {...draw(1.4, 0.4)} />

      {/* aire frío */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${330 - i * 4} ${26 + i * 12} C ${290 - i * 10} ${18 + i * 12}, ${250 - i * 14} ${34 + i * 12}, ${200 - i * 20} ${26 + i * 12}`}
          stroke="var(--color-frost)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="10 14"
          initial={reduce ? false : { opacity: 0 }}
          animate={play ? { opacity: [0, 0.9, 0.9], strokeDashoffset: [0, -96] } : undefined}
          transition={{ opacity: { delay: 1.8 + i * 0.15, duration: 0.6 }, strokeDashoffset: { delay: 1.8, duration: 2.4, repeat: Infinity, ease: "linear" } }}
        />
      ))}

      {/* emblema copo de nieve (dibujado alrededor de 0,0 y ubicado con translate) */}
      <g transform="translate(230 160)">
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -60 }}
          animate={play ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.g
            animate={reduce || !play ? undefined : { rotate: 360 }}
            transition={{ delay: 2.5, duration: 40, repeat: Infinity, ease: "linear" }}
            stroke="var(--color-frost)" strokeWidth="2.6" strokeLinecap="round"
          >
            {[0, 60, 120].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 -42V42" />
                <path d="M-11 -32l11 10 11-10M-11 32l11-10 11 10" />
              </g>
            ))}
          </motion.g>
        </motion.g>
      </g>

      {/* ruedas */}
      {[110, 170, 540].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} 282)`}>
          <motion.g
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            animate={play ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 0.9 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <circle r="22" fill="var(--color-ink)" stroke="currentColor" strokeWidth="2.4" className="text-white/85" />
            <circle r="8" stroke="var(--color-brand)" strokeWidth="2.4" />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}
