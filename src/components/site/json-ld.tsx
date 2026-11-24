import { config } from "@/lib/config";
import { AREAS } from "@/lib/seo";
import type { Settings } from "@/lib/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const phoneE164 = (p: string | null) => (p ? `+54${p.replace(/\D/g, "").replace(/^0/, "")}` : undefined);

/** Datos estructurados del negocio y del sitio (Google: ficha local, logo, buscador). */
export function businessJsonLd(s: Settings) {
  const id = `${config.siteUrl}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoBodyShop",
        "@id": id,
        name: s.company_name,
        legalName: s.legal_name ?? undefined,
        description:
          "Fábrica de carrocerías para camiones desde 1985 en el Parque Industrial de Crespo, Entre Ríos. Furgones térmicos e isotérmicos, carrocerías metálicas, usados y reparaciones.",
        url: config.siteUrl,
        logo: `${config.siteUrl}/brand/logo-graas.png`,
        image: `${config.siteUrl}/og?title=${encodeURIComponent("Carrocerías hechas para trabajar")}`,
        telephone: phoneE164(s.phone),
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
        hasMap: s.maps_query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.maps_query)}` : undefined,
        areaServed: AREAS.map((name) => ({ "@type": "City", name })),
        contactPoint: s.whatsapp
          ? [{ "@type": "ContactPoint", contactType: "sales", telephone: `+${s.whatsapp}`, areaServed: "AR", availableLanguage: "es" }]
          : undefined,
        sameAs: [s.instagram, s.facebook].filter(Boolean),
        knowsAbout: ["Carrocerías para camiones", "Furgones térmicos", "Furgones isotérmicos", "Carrocerías baranda volcable", "Carrocerías sider", "Reparación de carrocerías"],
        makesOffer: [
          "Fabricación de furgones térmicos e isotérmicos",
          "Fabricación de carrocerías baranda volcable",
          "Fabricación de carrocerías sider",
          "Reparación de carrocerías y furgones térmicos",
          "Arenado y pintura",
          "Corte láser y plegado de chapa",
        ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": id } } })),
      },
      {
        "@type": "WebSite",
        "@id": `${config.siteUrl}/#website`,
        url: config.siteUrl,
        name: s.company_name,
        inLanguage: "es-AR",
        publisher: { "@id": id },
      },
    ],
  };
}
