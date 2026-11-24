import { config } from "./config";

/** Zona de influencia que se declara en el sitio y en los datos estructurados. */
export const AREAS = ["Crespo", "Paraná", "Diamante", "Viale", "Nogoyá", "Victoria", "Santa Fe", "Entre Ríos"];

export const abs = (path: string) => (path.startsWith("http") ? path : `${config.siteUrl}${path.startsWith("/") ? "" : "/"}${path}`);

/** Imagen para compartir (Open Graph) generada con el título de cada página. */
export function ogImage(title: string, subtitle?: string) {
  const q = new URLSearchParams({ title });
  if (subtitle) q.set("sub", subtitle);
  return { url: `/og?${q.toString()}`, width: 1200, height: 630, alt: title };
}

/** Migas de pan para Google (Inicio > Sección > Página). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** Lista de ítems (catálogo, usados) para Google. */
export function itemListJsonLd(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
  };
}
