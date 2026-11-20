import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { getCategory } from "@/lib/catalog";
import type { MediaAsset, Spec } from "@/lib/types";
import { ContactForm } from "./contact-form";
import { Gallery } from "./gallery";
import { WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";
import { Specs } from "./blocks";

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
    <article className="container-x pb-24 pt-32">
      <Link href={back.href} className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand">
        <ArrowLeft className="size-4" /> {back.label}
      </Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <Gallery images={images} title={title} fallbackKind={cat.icon} />
        </Reveal>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">{cat.name}</span>
            {badge}
          </div>
          <h1 className="h-display mt-3 text-5xl sm:text-6xl">{title}</h1>
          {price !== undefined && <p className="mt-4 font-display text-4xl text-brand">{price ?? "Consultar precio"}</p>}
          {summary && <p className="mt-5 text-lg leading-relaxed text-white/80">{summary}</p>}
          <div className="mt-8">
            <Specs specs={specs} />
          </div>
          <a href={whatsapp} target="_blank" rel="noopener" className="btn-wa mt-8 w-full py-4">
            <WhatsAppIcon className="size-5" /> Consultar por WhatsApp
          </a>
          {description && (
            <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted">
              {description.split(/\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      <section className="mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="kicker">Pedí tu presupuesto</p>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">¿Te interesa?<br /><span className="text-brand">Escribinos.</span></h2>
          <p className="mt-4 text-muted">Contanos el chasis y el uso, y te respondemos con una propuesta a medida.</p>
        </div>
        <ContactForm defaultInterest={interest} source={source} />
      </section>
    </article>
  );
}
