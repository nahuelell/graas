"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, Inbox, LayoutDashboard, LogOut, Package, Settings, Truck, ExternalLink } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/admin/usados", label: "Usados", icon: Truck },
  { href: "/admin/trabajos", label: "Trabajos entregados", icon: Hammer },
  { href: "/admin/catalogo", label: "Catálogo", icon: Package },
  { href: "/admin/consultas", label: "Consultas", icon: Inbox },
  { href: "/admin/ajustes", label: "Ajustes del sitio", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-ink-2 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <Link href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-graas.png" alt="" className="size-9 rounded-full" />
            <span className="leading-none">
              <span className="block font-display text-lg tracking-wider">GRAAS</span>
              <span className="block text-[0.6rem] font-bold tracking-[0.25em] text-brand">PANEL</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button className="grid size-10 place-items-center rounded-xl border border-line text-muted" aria-label="Cerrar sesión">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0 [scrollbar-width:none]">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  active ? "bg-brand text-ink" : "text-muted hover:bg-panel hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden space-y-1 p-3 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted hover:bg-panel hover:text-white">
            <ExternalLink className="size-4" /> Ver sitio
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted hover:bg-panel hover:text-white">
              <LogOut className="size-4" /> Cerrar sesión
            </button>
          </form>
          <p className="px-4 pt-3 text-[0.65rem] text-dim">
            Desarrollado por <a href="https://www.lelldigital.com" target="_blank" rel="noopener" className="hover:text-white">Lell Digital</a>
          </p>
        </div>
      </div>
    </aside>
  );
}
