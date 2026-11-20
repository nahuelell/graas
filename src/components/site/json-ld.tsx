import { config } from "@/lib/config";
import type { Settings } from "@/lib/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Datos estructurados del negocio para Google (aparece en Maps y resultados locales). */
export function businessJsonLd(s: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${config.siteUrl}/#business`,
    name: s.company_name,
    legalName: s.legal_name ?? undefined,
    url: config.siteUrl,
    logo: `${config.siteUrl}/brand/logo-graas.png`,
    image: `${config.siteUrl}/demo/truck.jpg`,
    telephone: s.phone ? `+54 ${s.phone}` : undefined,
    email: s.email ?? undefined,
    foundingDate: "1985",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address ?? undefined,
      addressLocality: "Crespo",
      addressRegion: "Entre Ríos",
      postalCode: "3116",
      addressCountry: "AR",
    },
    areaServed: ["Crespo", "Paraná", "Diamante", "Viale", "Nogoyá", "Victoria", "Santa Fe", "Entre Ríos"],
    sameAs: [s.instagram, s.facebook].filter(Boolean),
    makesOffer: [
      "Carrocerías térmicas",
      "Carrocerías baranda volcable",
      "Carrocerías sider",
      "Tolvas",
      "Reparación de carrocerías",
      "Arenado y pintura",
      "Corte láser",
      "Servicio de grúa",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  };
}
