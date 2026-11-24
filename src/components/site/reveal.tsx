"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Entrada sutil: aparece y sube apenas, al entrar en pantalla. */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Imagen que se descubre de abajo hacia arriba, con un leve acercamiento. */
export function RevealImage({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(18% 0% 0% 0%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, delay, ease: EASE }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Título que entra renglón por renglón (el disparador está en el contenedor, no en los renglones ocultos). */
export function RevealLines({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className ? `block ${className}` : "block"}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="-mt-[0.12em] block overflow-hidden pb-[0.04em] pt-[0.12em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
