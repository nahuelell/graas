"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { WhatsAppIcon } from "./icons";

const NAV = [
  { href: "/carrocerias", label: "Carrocerías" },
  { href: "/termicos", label: "Térmicos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/trabajos", label: "Trabajos" },
  { href: "/usados", label: "Usados" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || open ? "border-b border-line/70 bg-ink/85 py-3 backdrop-blur-xl" : "py-5",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Logo size={scrolled ? 36 : 42} />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {NAV.map((item) => {
              const active = !item.href.includes("#") && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-semibold text-white/80 transition hover:text-white",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition after:duration-300 hover:after:scale-x-100",
                    active && "text-white after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-wa hidden px-5 py-2.5 text-xs sm:inline-flex">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-line text-white lg:hidden"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-1" aria-label="Menú móvil">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="h-display block py-2 text-5xl text-white transition hover:text-brand">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-wa mt-auto w-full py-4">
              <WhatsAppIcon className="size-5" /> Escribinos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
