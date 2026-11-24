import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory, USADO_STATUS } from "@/lib/catalog";
import type { MediaAsset, Product, Trabajo, Usado } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { TruckIcon } from "./icons";
import { MediaImage } from "./media-image";
import { Reveal, RevealImage, RevealLines } from "./reveal";

/** Encabezado de sección: título + bajada opcional + acción a la derecha. */
export function SectionHeading({
  title,
  text,
  action,
  className,
}: {
  title: string[];
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap content-start items-end justify-between gap-x-10 gap-y-6 self-start", className)}>
      <div className="max-w-2xl">
        <h2 className="h-display text-4xl sm:text-5xl lg:text-[3.6rem]">
          <RevealLines lines={title} />
        </h2>
        {text && (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-steel">{text}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  );
}

/** Foto de un ítem o, si todavía no tiene, un recuadro neutro con el dibujo de su tipo. */
export function Cover({ images, category, title, sizes, className }: { images: MediaAsset[]; category: string; title: string; sizes: string; className?: string }) {
  const first = images[0];
  return (
    <RevealImage className={cn("relative overflow-hidden rounded-[4px] bg-paper-2", className)}>
      {first ? (
        <MediaImage asset={first} alt={first.alt || title} fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <TruckIcon kind={getCategory(category).icon} className="w-2/5 text-steel/70" strokeWidth={1.2} wheelFill="var(--color-paper-2)" />
        </div>
      )}
    </RevealImage>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/carrocerias/${product.slug}`} className="group block">
      <Cover images={product.images} category={product.category} title={product.title} sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="aspect-[4/3]" />
      <Reveal className="mt-4">
        <p className="text-sm text-steel">{getCategory(product.category).name}</p>
        <h3 className="mt-0.5 text-xl font-semibold">
          <span className="bg-[linear-gradient(var(--color-brand),var(--color-brand))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
            {product.title}
          </span>
        </h3>
        {product.summary && <p className="mt-1.5 max-w-sm text-[0.95rem] leading-relaxed text-steel">{product.summary}</p>}
      </Reveal>
    </Link>
  );
}

export function StatusBadge({ status, className }: { status: Usado["status"]; className?: string }) {
  const s = USADO_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className={cn("size-2 rounded-full", s.tone === "ok" && "bg-wa", s.tone === "warn" && "bg-brand", s.tone === "off" && "bg-steel/50")} />
      {s.label}
    </span>
  );
}

export function UsadoCard({ usado }: { usado: Usado }) {
  const price = usado.show_price ? formatPrice(usado.price) : null;
  return (
    <Link href={`/usados/${usado.slug}`} className={cn("group block", usado.status === "vendido" && "opacity-55")}>
      <Cover images={usado.images} category={usado.category} title={usado.title} sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="aspect-[4/3]" />
      <Reveal className="mt-4">
        <div className="flex items-center justify-between gap-4 text-steel">
          <StatusBadge status={usado.status} />
          <span className="text-sm">{price ?? "Precio a consultar"}</span>
        </div>
        <h3 className="mt-1.5 text-xl font-semibold">
          <span className="bg-[linear-gradient(var(--color-brand),var(--color-brand))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
            {usado.title}
          </span>
        </h3>
        {usado.specs.length > 0 && <p className="mt-1.5 text-[0.95rem] text-steel">{usado.specs.slice(0, 3).map((s) => s.value).join(", ")}</p>}
      </Reveal>
    </Link>
  );
}

export function TrabajoCard({ trabajo, className }: { trabajo: Trabajo; className?: string }) {
  return (
    <figure className={cn("group", className)}>
      <Cover images={trabajo.images} category={trabajo.category} title={trabajo.title} sizes="(min-width:1024px) 30vw, 80vw" className="aspect-[4/5]" />
      <figcaption className="mt-3 text-[0.95rem]">
        <span className="font-semibold">{trabajo.title}</span>
        {trabajo.client && <span className="text-steel">, {trabajo.client}</span>}
      </figcaption>
    </figure>
  );
}

export function Specs({ specs }: { specs: { label: string; value: string }[] }) {
  if (!specs.length) return null;
  return (
    <dl className="border-t border-rule">
      {specs.map((s, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-rule py-3.5 text-[0.95rem]">
          <dt className="text-steel">{s.label}</dt>
          <dd className="font-medium">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageBanner({ title, text }: { title: string[]; text?: string }) {
  return (
    <section className="pb-14 pt-36 sm:pt-44">
      <div className="container-x">
        <h1 className="h-display text-5xl sm:text-7xl lg:text-[5.5rem]">
          <RevealLines lines={title} />
        </h1>
        {text && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">{text}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
