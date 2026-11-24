"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV = [
  { href: "/carrocerias", label: "Carrocerías" },
  { href: "/termicos", label: "Térmicos" },
  { href: "/usados", label: "Usados" },
  { href: "/trabajos", label: "Trabajos" },
  { href: "/#taller", label: "Taller" },
  { href: "/#contacto", label: "Contacto" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500",
          overHero ? "border-b border-transparent py-6" : "border-b border-rule/80 bg-paper/90 py-3.5 backdrop-blur-md",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Logo size={overHero ? 40 : 34} />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {NAV.map((item) => {
              const active = !item.href.includes("#") && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative text-[0.92rem] font-medium transition-colors duration-500",
                    overHero ? "text-white/85 hover:text-white" : "text-char/70 hover:text-char",
                    active && (overHero ? "text-white" : "text-char"),
                    "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-brand after:transition-transform after:duration-500",
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-yellow hidden px-5 py-2.5 sm:inline-flex">
              Pedir presupuesto
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className={cn("relative grid size-11 place-items-center rounded-full transition-colors lg:hidden", overHero ? "text-white" : "text-char")}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              <span className={cn("absolute h-[2px] w-5 bg-current transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={cn("absolute h-[2px] w-5 bg-current transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pb-10 pt-28 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="flex flex-col" aria-label="Menú móvil">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.6, ease: EASE }}
                  className="border-b border-rule"
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="h-display block py-4 text-3xl">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-yellow mt-auto w-full py-4">
              Pedir presupuesto por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
