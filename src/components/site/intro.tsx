"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Sparks } from "./sparks";

const KEY = "graas-intro";
export const INTRO_DONE_EVENT = "graas:intro-done";
const LETTERS = ["G", "R", "A", "A", "S"];
const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Intro de apertura (una vez por sesión):
 * chispas de soldadura → las letras GRAAS suben → cordón de soldadura amarillo → contador 1985–hoy
 * → el telón se abre en dos y revela el hero.
 */
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

export function Intro() {
  const seen = useIntroSeen();
  const [phase, setPhase] = useState<"play" | "open">("play");
  const [year, setYear] = useState(1985);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "seen") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    const endYear = new Date().getFullYear();
    const start = performance.now();
    let raf = 0;
    const count = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start - 700) / 1300));
      setYear(Math.round(1985 + (endYear - 1985) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(count);
    };
    raf = requestAnimationFrame(count);
    const t1 = setTimeout(() => setPhase("open"), 2500);
    return () => {
      clearTimeout(t1);
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  if (seen) return null;

  return (
    <div id="intro" className="fixed inset-0 z-[100]" aria-hidden>
      {/* Telón superior / inferior */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        animate={phase === "open" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.95, ease: EASE }}
        onAnimationComplete={() => phase === "open" && finish()}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        animate={phase === "open" ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.95, ease: EASE }}
      />

      <AnimatePresence>
        {phase === "play" && (
          <motion.div
            key="content"
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative">
              <Sparks
                className="pointer-events-none absolute left-1/2 top-1/2 h-[140vh] w-[140vw] -translate-x-1/2 -translate-y-1/2"
                origin={{ x: 0.5, y: 0.53 }}
                burst={140}
                rate={4}
                speed={11}
                spread={Math.PI * 1.6}
              />
              <div className="relative flex overflow-hidden font-display text-[26vw] leading-[0.85] text-white sm:text-[19vw]">
                {LETTERS.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
              {/* cordón de soldadura */}
              <motion.div
                className="relative mt-3 h-[6px] origin-left bg-brand shadow-[0_0_24px_6px_rgba(255,194,26,0.55)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.75, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <motion.div
              className="mt-6 flex items-center gap-4 text-xs font-bold tracking-[0.35em] text-muted sm:text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span>CARROCERÍAS</span>
              <span className="h-px w-8 bg-brand" />
              <span className="tabular-nums text-brand">{year}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "play" && (
        <button
          onClick={() => setPhase("open")}
          className="absolute bottom-6 right-6 text-xs font-bold tracking-[0.25em] text-dim transition hover:text-white"
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
