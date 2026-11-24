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

/** true cuando la intro ya terminó (o se salteó). Compartido con la portada. */
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

/** Apertura breve (≈1,4 s, una vez por sesión): aparece el logo y la pantalla se levanta. */
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
    const t = setTimeout(() => setLeaving(true), 1100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (seen) return null;

  return (
    <motion.div
      id="intro"
      className="fixed inset-0 z-[100] grid place-items-center bg-paper"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={leaving ? { clipPath: "inset(0% 0% 100% 0%)" } : undefined}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={() => leaving && finish()}
      onClick={() => setLeaving(true)}
      aria-hidden
    >
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={leaving ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: leaving ? 0.35 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src="/brand/logo-graas.png" alt="" width={56} height={56} className="rounded-full" priority />
        <span className="leading-tight">
          <span className="wide block text-2xl font-bold text-char">Graas</span>
          <span className="block text-sm text-steel">Carrocerías desde 1985</span>
        </span>
      </motion.div>
    </motion.div>
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
