import Link from "next/link";
import {
  ArrowRight,
  Beef,
  DoorOpen,
  Droplets,
  Fan,
  Milk,
  Ruler,
  ShieldCheck,
  ShoppingBasket,
  Snowflake,
  Truck,
} from "lucide-react";
import { TERMICOS_FAQ, TERMICOS_FEATURES, TERMICOS_PROCESO, TERMICOS_USOS } from "@/lib/termicos";
import { SectionHeading } from "./blocks";
import { WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";

const ICONS = {
  snowflake: Snowflake,
  droplets: Droplets,
  fan: Fan,
  door: DoorOpen,
  ruler: Ruler,
  shield: ShieldCheck,
  milk: Milk,
  beef: Beef,
  basket: ShoppingBasket,
  truck: Truck,
} as const;

/** Características de los furgones térmicos. */
export function ThermalFeatures({ showLink = false }: { showLink?: boolean }) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-frost/10 blur-[120px]" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            kicker="Especialistas en frío"
            lines={["Carrocerías", "térmicas Graas"]}
            text="Furgones isotérmicos pensados para el trabajo diario: aislación, higiene y resistencia, fabricados a medida en Crespo."
          />
          {showLink && (
            <Reveal>
              <Link href="/termicos" className="btn-ghost group">
                Todo sobre térmicos <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          )}
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TERMICOS_FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="group card relative h-full overflow-hidden p-7 transition duration-500 hover:border-frost/60">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-frost/0 blur-2xl transition duration-500 group-hover:bg-frost/20" />
                  <span className="grid size-12 place-items-center rounded-xl bg-frost/10 text-frost transition duration-500 group-hover:bg-frost group-hover:text-ink">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Rubros donde se usan. */
export function ThermalUses() {
  return (
    <section className="border-y border-line bg-ink-2 py-20">
      <div className="container-x">
        <p className="kicker">Para cada rubro</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TERMICOS_USOS.map((u, i) => {
            const Icon = ICONS[u.icon];
            return (
              <Reveal key={u.title} delay={i * 0.06} className="bg-ink-2 p-7">
                <Icon className="size-8 text-brand" strokeWidth={1.5} />
                <h3 className="h-display mt-5 text-2xl">{u.title}</h3>
                <p className="mt-2 text-sm text-muted">{u.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Cómo trabajamos, en 4 pasos. */
export function ThermalProcess() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading kicker="Cómo trabajamos" lines={["De tu chasis", "a la ruta"]} />
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TERMICOS_PROCESO.map((p, i) => (
            <Reveal key={p.title} as="li" delay={i * 0.08} className="relative">
              <div className="card h-full p-7">
                <span className="font-display text-6xl text-white/10">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
              {i < TERMICOS_PROCESO.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-brand lg:block" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Preguntas frecuentes (también se publican como datos estructurados para Google). */
export function ThermalFaq() {
  return (
    <section className="border-t border-line bg-ink-2 py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker="Preguntas frecuentes" lines={["Lo que más", "nos consultan"]} />
        <div className="divide-y divide-line border-y border-line">
          {TERMICOS_FAQ.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold transition hover:text-brand [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Banda final de llamado a la acción. */
export function ThermalCta({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="relative overflow-hidden bg-brand py-20 text-ink">
      <Snowflake className="pointer-events-none absolute -right-16 -top-16 size-80 text-ink/10" strokeWidth={1} />
      <div className="container-x relative flex flex-wrap items-center justify-between gap-8">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase">Presupuesto a medida</p>
          <h2 className="h-display mt-3 text-5xl sm:text-7xl">Cotizá tu furgón térmico</h2>
          <p className="mt-3 max-w-xl font-medium text-ink/70">Contanos el chasis, las medidas y qué vas a transportar. Te respondemos con una propuesta a medida.</p>
        </div>
        <a href={whatsapp} target="_blank" rel="noopener" className="btn bg-ink py-4 text-brand hover:bg-white hover:text-ink">
          <WhatsAppIcon className="size-5" /> Escribinos por WhatsApp
        </a>
      </div>
    </section>
  );
}

/** Banda compacta para el inicio que lleva a /termicos. */
export function ThermalBand({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2 py-16">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-frost/15 blur-[100px]" />
      <Snowflake className="pointer-events-none absolute -right-10 top-1/2 size-64 -translate-y-1/2 text-frost/10" strokeWidth={1} />
      <div className="container-x relative flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-frost uppercase">Carrocerías térmicas</p>
          <h2 className="h-display mt-3 text-4xl sm:text-6xl">
            ¿Necesitás un <span className="text-frost">furgón térmico</span>?
          </h2>
          <p className="mt-3 text-muted">Furgones isotérmicos a medida para lácteos, carnes, alimentos y reparto refrigerado.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/termicos" className="btn-brand group">
            Conocé los térmicos <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
          <a href={whatsapp} target="_blank" rel="noopener" className="btn-ghost">
            <WhatsAppIcon className="size-4" /> Cotizar
          </a>
        </div>
      </div>
    </section>
  );
}
