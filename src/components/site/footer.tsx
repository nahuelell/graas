import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/types";
import { telLink } from "@/lib/utils";
import { CurrentYear } from "./current-year";
import { FacebookIcon, InstagramIcon } from "./icons";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-rule bg-ink-2 text-white">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-graas.png" alt="" width={40} height={40} className="rounded-full" />
            <span className="leading-tight"><span className="wide block text-lg font-bold uppercase">Graas</span><span className="label block">Carrocerías</span></span>
          </div>
          <p className="mt-5 max-w-sm leading-relaxed text-white/60">
            Fábrica de carrocerías y furgones térmicos desde 1985, en el Parque Industrial de Crespo, Entre Ríos.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
            Trabajamos para Crespo, Paraná, Diamante, Viale, Nogoyá, Victoria, Santa Fe y toda la región.
          </p>
          <div className="mt-6 flex gap-2">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white">
                <InstagramIcon className="size-4" />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white">
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>
        <nav aria-label="Secciones">
          <p className="mb-4 text-sm text-white/45">Secciones</p>
          <ul className="space-y-2.5 text-white/80">
            {[
              ["/carrocerias", "Carrocerías"],
              ["/termicos", "Furgones térmicos"],
              ["/usados", "Usados"],
              ["/trabajos", "Trabajos entregados"],
              ["/#contacto", "Contacto"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-brand">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-sm text-white/45">Contacto</p>
          <ul className="space-y-2.5 text-white/80">
            {settings.phone && <li><a href={telLink(settings.phone)} className="hover:text-brand">{settings.phone}</a></li>}
            {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-brand">{settings.email}</a></li>}
            {settings.address && <li>{settings.address}</li>}
            {settings.city && <li>{settings.city}</li>}
            {settings.hours && <li>{settings.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-sm text-white/45 md:flex-row md:items-center">
          <p>© <CurrentYear /> {settings.legal_name ?? settings.company_name}. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/terminos" className="hover:text-white">Bases y condiciones</Link>
            <Link href="/privacidad" className="hover:text-white">Política de privacidad</Link>
            <span>
              Desarrollado por{" "}
              <a href="https://www.lelldigital.com" target="_blank" rel="noopener" className="font-semibold text-white/75 hover:text-brand">
                Lell Digital
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
