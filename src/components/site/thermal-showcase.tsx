import Link from "next/link";
import { TERMICOS_FAQ, TERMICOS_FEATURES, TERMICOS_PROCESO, TERMICOS_USOS } from "@/lib/termicos";
import type { MediaAsset } from "@/lib/types";
import { SectionHeading } from "./blocks";
import { MediaImage } from "./media-image";
import { Reveal, RevealImage, RevealLines } from "./reveal";

/** Bloque del inicio: foto + texto que lleva a /termicos. */
export function ThermalSplit({ image, whatsapp }: { image: MediaAsset | null; whatsapp: string }) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {image ? (
          <RevealImage className="relative aspect-[5/4] overflow-hidden rounded-[4px] bg-paper-2">
            <MediaImage asset={image} alt={image.alt || "Furgón térmico Graas"} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </RevealImage>
        ) : (
          <div className="aspect-[5/4] rounded-[4px] bg-paper-2" />
        )}
        <div>
          <h2 className="h-display text-4xl sm:text-5xl lg:text-[3.4rem]">
            <RevealLines lines={["Furgones térmicos", "a medida"]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-steel">
              Carrocerías isotérmicas para lácteos, carnes, alimentos y reparto refrigerado. Las diseñamos según tu chasis y lo que vas a transportar.
            </p>
            <ul className="mt-8 max-w-md border-t border-rule">
              {TERMICOS_FEATURES.slice(0, 3).map((f) => (
                <li key={f.title} className="border-b border-rule py-3.5">{f.title}</li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link href="/termicos" className="btn-dark">Ver furgones térmicos</Link>
              <a href={whatsapp} target="_blank" rel="noopener" className="link-line text-sm">Cotizar por WhatsApp</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Características: lista en dos columnas. */
export function ThermalFeatures() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading title={["Cómo son", "nuestros térmicos"]} />
        <dl className="grid gap-x-10 sm:grid-cols-2">
          {TERMICOS_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.08} className="border-t border-rule py-6">
              <dt className="text-lg font-semibold">{f.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-steel">{f.text}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Rubros. */
export function ThermalUses() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading title={["Para cada rubro"]} />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {TERMICOS_USOS.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.06}>
              <h3 className="wide text-xl font-bold">{u.title}</h3>
              <p className="mt-2 leading-relaxed text-steel">{u.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Proceso de trabajo (es una secuencia, por eso va numerado). */
export function ThermalProcess() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading title={["De tu chasis", "a la ruta"]} />
        <ol className="mt-12 grid gap-x-8 gap-y-10 border-t border-rule pt-10 md:grid-cols-2 lg:grid-cols-4">
          {TERMICOS_PROCESO.map((p, i) => (
            <Reveal key={p.title} as="li" delay={i * 0.08}>
              <span className="text-sm tabular-nums text-steel">Paso {i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 leading-relaxed text-steel">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Preguntas frecuentes (también van como datos estructurados para Google). */
export function ThermalFaq() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading title={["Preguntas", "frecuentes"]} />
        <div className="border-t border-rule">
          {TERMICOS_FAQ.map((f) => (
            <details key={f.q} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative size-4 shrink-0" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-char" />
                  <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-char transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-steel">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Cierre con llamado a la acción. */
export function ThermalCta({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="bg-char py-24 text-white">
      <div className="container-x flex flex-wrap items-end justify-between gap-10">
        <div className="max-w-2xl">
          <h2 className="h-display text-4xl sm:text-6xl">
            <RevealLines lines={["Contanos qué", "transportás"]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-md text-white/65">Con la marca y modelo del chasis y las medidas que buscás, te preparamos una propuesta a medida.</p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <a href={whatsapp} target="_blank" rel="noopener" className="btn-yellow">Cotizar por WhatsApp</a>
        </Reveal>
      </div>
    </section>
  );
}
