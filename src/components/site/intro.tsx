"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "graas-intro";
export const INTRO_DONE_EVENT = "graas:intro-done";
const EASE = [0.76, 0, 0.24, 1] as const;

function subscribe(cb: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, cb);
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
}

/** true cuando la intro ya terminó (o se salteó). Compartido con el hero. */
export function useIntroSeen() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.intro === "seen",
    () => false,
  );
}

function finish() {
  document.documentElement.dataset.intro = "seen";
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.body.style.overflow = "";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

/**
 * Intro de apertura, sobria y corta (≈2 s, una vez por sesión):
 * aparece el logo, se completa una línea de carga y una cortina negra + amarilla sube y revela el sitio.
 */
export function Intro() {
  const seen = useIntroSeen();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "seen") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setLeaving(true), 1500);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (seen) return null;

  return (
    <div id="intro" className="fixed inset-0 z-[100]" aria-hidden>
      {/* franja amarilla que acompaña la cortina */}
      <motion.div
        className="absolute inset-0 bg-brand"
        initial={{ y: 0 }}
        animate={leaving ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
        onAnimationComplete={() => leaving && finish()}
      />
      {/* cortina negra */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-ink"
        initial={{ y: 0 }}
        animate={leaving ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src="/brand/logo-graas.png" alt="" width={64} height={64} className="rounded-full" priority />
          <span className="flex flex-col leading-none">
            <span className="font-display text-5xl tracking-wider text-white">GRAAS</span>
            <span className="mt-1 text-[0.65rem] font-bold tracking-[0.4em] text-brand">CARROCERÍAS</span>
          </span>
        </motion.div>
        <div className="mt-8 h-px w-44 overflow-hidden bg-white/15">
          <motion.div
            className="h-full origin-left bg-brand"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </motion.div>

      {!leaving && (
        <button
          onClick={() => setLeaving(true)}
          className="absolute bottom-6 right-6 z-10 text-xs font-bold tracking-[0.25em] text-dim transition hover:text-white"
        >
          SALTAR ›
        </button>
      )}
    </div>
  );
}

/** Script previo al pintado: si la intro ya se vio en la sesión, no la muestra ni un frame. */
export function IntroGate() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{if(sessionStorage.getItem('${KEY}'))document.documentElement.dataset.intro='seen'}catch(e){}`,
      }}
    />
  );
}
