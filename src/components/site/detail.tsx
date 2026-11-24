import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory } from "@/lib/catalog";
import type { MediaAsset, Spec } from "@/lib/types";
import { Specs } from "./blocks";
import { ContactForm } from "./contact-form";
import { Gallery } from "./gallery";
import { Reveal, RevealLines } from "./reveal";

/** Ficha de detalle compartida por carrocerías y usados. */
export function DetailView({
  back,
  category,
  title,
  badge,
  price,
  summary,
  description,
  specs,
  images,
  whatsapp,
  interest,
  source,
}: {
  back: { href: string; label: string };
  category: string;
  title: string;
  badge?: ReactNode;
  price?: string | null;
  summary?: string | null;
  description?: string | null;
  specs: Spec[];
  images: MediaAsset[];
  whatsapp: string;
  interest: string;
  source: string;
}) {
  const cat = getCategory(category);
  return (
    <article className="container-x pb-28 pt-32 sm:pt-36">
      <nav aria-label="Ubicación" className="text-sm text-steel">
        <Link href={back.href} className="hover:text-char">{back.label}</Link>
        <span className="mx-2">/</span>
        <span className="text-char">{title}</span>
      </nav>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal>
          <Gallery images={images} title={title} fallbackKind={cat.icon} />
        </Reveal>
        <div>
          <div className="flex flex-wrap items-center gap-4 text-steel">
            <span>{cat.name}</span>
            {badge}
          </div>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">
            <RevealLines lines={[title]} />
          </h1>
          {price !== undefined && <p className="mt-4 text-2xl font-semibold">{price ?? "Precio a consultar"}</p>}
          {summary && (
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-steel">{summary}</p>
            </Reveal>
          )}
          <Reveal delay={0.15} className="mt-8">
            <Specs specs={specs} />
          </Reveal>
          <Reveal delay={0.2}>
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-yellow mt-8">
              Consultar por WhatsApp
            </a>
          </Reveal>
          {description && (
            <div className="mt-10 max-w-prose space-y-4 leading-relaxed text-steel">
              {description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
        </div>
      </div>

      <section className="mt-28 grid gap-12 border-t border-rule pt-16 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <h2 className="h-display text-3xl sm:text-4xl">Pedí un presupuesto</h2>
          <p className="mt-4 max-w-sm text-steel">Contanos el chasis y el uso, y te respondemos con una propuesta a medida.</p>
        </div>
        <ContactForm defaultInterest={interest} source={source} />
      </section>
    </article>
  );
}
