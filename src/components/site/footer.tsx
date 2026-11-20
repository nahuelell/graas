import Link from "next/link";
import type { Settings } from "@/lib/types";
import { telLink } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "./icons";
import { Logo } from "./logo";
import { CurrentYear } from "./current-year";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Fábrica de carrocerías desde 1985 en el Parque Industrial de Crespo, Entre Ríos.
          </p>
          <div className="mt-6 flex gap-3">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-brand hover:text-brand">
                <InstagramIcon className="size-4" />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-brand hover:text-brand">
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>
        <div>
          <p className="kicker mb-4">Sitio</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {[
              ["/carrocerias", "Carrocerías"],
              ["/usados", "Usados"],
              ["/trabajos", "Trabajos entregados"],
              ["/#servicios", "Servicios"],
              ["/#contacto", "Contacto"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker mb-4">Contacto</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {settings.phone && <li><a href={telLink(settings.phone)} className="hover:text-white">{settings.phone}</a></li>}
            {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>}
            {settings.address && <li>{settings.address}</li>}
            {settings.city && <li>{settings.city}</li>}
            {settings.hours && <li>{settings.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-dim sm:flex-row">
          <p>© <CurrentYear /> {settings.legal_name ?? settings.company_name}. Todos los derechos reservados.</p>
          <p>
            Sitio desarrollado por{" "}
            <a href="https://www.lelldigital.com" target="_blank" rel="noopener" className="font-semibold text-muted hover:text-white">
              Lell Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
