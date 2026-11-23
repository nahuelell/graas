import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategory, USADO_STATUS } from "@/lib/catalog";
import type { Product, Trabajo, Usado } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { TruckIcon } from "./icons";
import { MediaImage } from "./media-image";
import { RevealLines } from "./reveal";

export function SectionHeading({
  kicker,
  lines,
  text,
  className,
  align = "left",
}: {
  kicker: string;
  lines: string[];
  text?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("kicker mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-brand" />
        {kicker}
      </p>
      <h2 className="h-display text-5xl sm:text-6xl lg:text-7xl">
        <RevealLines lines={lines} accentLast />
      </h2>
      {text && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{text}</p>}
    </div>
  );
}

/** Imagen de portada de un ítem o, si no tiene fotos, la ilustración de su categoría. */
function Cover({ images, category, title, sizes }: { images: { url: string; public_id: string; alt?: string }[]; category: string; title: string; sizes: string }) {
  const cat = getCategory(category);
  const first = images[0];
  if (first) {
    return (
      <MediaImage
        asset={first}
        alt={first.alt || title}
        fill
        sizes={sizes}
        className="object-cover transition duration-700 ease-out group-hover:scale-105"
      />
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#2a2a30,#17171a_70%)]">
      <TruckIcon kind={cat.icon} className="w-1/2 text-brand transition duration-700 group-hover:scale-110" strokeWidth={1.3} />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.category);
  return (
    <Link
      href={`/carrocerias/${product.slug}`}
      className="group card relative flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-brand/70 hover:shadow-[0_20px_60px_-20px_rgba(255,194,26,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Cover images={product.images} category={product.category} title={product.title} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[0.65rem] font-bold tracking-widest text-brand uppercase backdrop-blur">
          {cat.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="h-display text-2xl">{product.title}</h3>
        {product.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{product.summary}</p>}
        <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-bold text-brand">
          Consultar <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function StatusBadge({ status, className }: { status: Usado["status"]; className?: string }) {
  const s = USADO_STATUS[status];
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-widest uppercase",
        s.tone === "ok" && "bg-wa text-white",
        s.tone === "warn" && "bg-brand text-ink",
        s.tone === "off" && "bg-panel-2 text-dim",
        className,
      )}
    >
      {s.label}
    </span>
  );
}

export function UsadoCard({ usado }: { usado: Usado }) {
  const price = usado.show_price ? formatPrice(usado.price) : null;
  return (
    <Link
      href={`/usados/${usado.slug}`}
      className={cn(
        "group card relative flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-brand/70",
        usado.status === "vendido" && "opacity-60",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Cover images={usado.images} category={usado.category} title={usado.title} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
        <StatusBadge status={usado.status} className="absolute left-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold tracking-widest text-dim uppercase">{getCategory(usado.category).name}</p>
        <h3 className="mt-1 text-lg font-bold">{usado.title}</h3>
        {usado.specs.length > 0 && (
          <p className="mt-2 text-sm text-muted">{usado.specs.slice(0, 3).map((s) => s.value).join(" · ")}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-5">
          <span className="font-display text-2xl text-white">{price ?? "Consultar"}</span>
          <ArrowUpRight className="size-5 text-brand transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export function TrabajoCard({ trabajo, className }: { trabajo: Trabajo; className?: string }) {
  const first = trabajo.images[0];
  return (
    <figure className={cn("group relative overflow-hidden rounded-2xl bg-panel", className)}>
      {first ? (
        <MediaImage
          asset={first}
          alt={first.alt || trabajo.title}
          fill
          sizes="(min-width:1024px) 33vw, 80vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <TruckIcon kind={getCategory(trabajo.category).icon} className="w-1/2 text-brand" />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 pt-16 transition duration-500 group-hover:translate-y-0">
        <p className="text-[0.65rem] font-bold tracking-widest text-brand uppercase">Unidad entregada</p>
        <p className="mt-1 text-lg font-bold leading-tight">{trabajo.title}</p>
      </figcaption>
    </figure>
  );
}

export function Specs({ specs }: { specs: { label: string; value: string }[] }) {
  if (!specs.length) return null;
  return (
    <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {specs.map((s, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 bg-panel px-5 py-4 text-sm">
          <dt className="font-semibold text-muted">{s.label}</dt>
          <dd className="font-semibold text-white">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageBanner({ kicker, title, text }: { kicker: string; title: string[]; text?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink-2 pb-16 pt-40 grain">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading kicker={kicker} lines={title} text={text} />
      </div>
    </section>
  );
}
