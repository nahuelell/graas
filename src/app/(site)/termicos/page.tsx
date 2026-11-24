import type { Metadata } from "next";
import { ProductCard } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { JsonLd } from "@/components/site/json-ld";
import { MediaImage } from "@/components/site/media-image";
import { Reveal, RevealImage, RevealLines } from "@/components/site/reveal";
import { ThermalCta, ThermalFaq, ThermalFeatures, ThermalProcess, ThermalUses } from "@/components/site/thermal-showcase";
import { config } from "@/lib/config";
import { getProducts, getSettings } from "@/lib/data";
import { TERMICOS_FAQ } from "@/lib/termicos";
import { whatsappLink } from "@/lib/utils";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Furgones térmicos e isotérmicos a medida en Entre Ríos",
  description:
    "Fabricamos furgones térmicos e isotérmicos a medida en Crespo, Entre Ríos: para lácteos, carnes, alimentos y reparto refrigerado. Homologados, listos para equipo de frío.",
  alternates: { canonical: "/termicos" },
  openGraph: {
    title: "Furgones térmicos a medida | Carrocerías Graas",
    description: "Furgones isotérmicos fabricados a medida de tu chasis en Crespo, Entre Ríos.",
    url: "/termicos",
    images: [ogImage("Furgones térmicos a medida", "Lácteos, carnes, alimentos y reparto refrigerado")],
  },
};

export default async function TermicosPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const thermal = products.filter((p) => p.category === "termicas");
  const wa = whatsappLink(settings.whatsapp, "Hola Graas, quiero cotizar un furgón térmico.");
  // Foto principal: la primera foto de un modelo térmico o, si no hay, la primera de la portada.
  const cover = thermal.find((p) => p.images.length)?.images[0] ?? settings.hero_images[0] ?? null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Furgones térmicos", path: "/termicos" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: TERMICOS_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Fabricación de furgones térmicos e isotérmicos",
          serviceType: "Carrocerías térmicas para camiones",
          provider: { "@id": `${config.siteUrl}/#business` },
          areaServed: "Entre Ríos, Argentina",
          url: `${config.siteUrl}/termicos`,
        }}
      />

      <section className="pb-20 pt-36 sm:pt-44">
        <div className="container-x">
          <h1 className="h-display text-4xl sm:text-6xl lg:text-[4.4rem]">
            <RevealLines lines={["Furgones térmicos", "a medida"]} />
          </h1>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <Reveal delay={0.2}>
              <p className="max-w-xl text-lg leading-relaxed text-steel">
                Furgones isotérmicos para lácteos, carnes, alimentos y reparto refrigerado. Diseñados según tu chasis, fabricados en Crespo y entregados homologados.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="flex flex-wrap items-center gap-6">
              <a href={wa} target="_blank" rel="noopener" className="btn-yellow">Cotizar por WhatsApp</a>
              <a href="#consulta" className="link-line text-sm">Dejar una consulta</a>
            </Reveal>
          </div>
        </div>
        {cover && (
          <div className="container-x mt-14">
            <RevealImage className="relative aspect-[16/8] overflow-hidden rounded-[4px] bg-paper-2">
              <MediaImage asset={cover} alt={cover.alt || "Furgón térmico Graas"} fill priority sizes="100vw" className="object-cover" />
            </RevealImage>
          </div>
        )}
      </section>

      <ThermalFeatures />
      <ThermalUses />

      {thermal.length > 0 && (
        <section className="py-24 sm:py-28">
          <div className="container-x">
            <h2 className="h-display text-3xl sm:text-4xl">
              <RevealLines lines={["Modelos"]} />
            </h2>
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {thermal.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ThermalProcess />
      <ThermalFaq />

      <section id="consulta" className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <h2 className="h-display text-3xl sm:text-4xl">
              <RevealLines lines={["Pedí un", "presupuesto"]} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-sm text-steel">Contanos la marca y modelo del chasis y qué vas a transportar.</p>
            </Reveal>
          </div>
          <ContactForm defaultInterest="Carrocería Térmicas" source="termicos" />
        </div>
      </section>

      <ThermalCta whatsapp={wa} />
    </>
  );
}
