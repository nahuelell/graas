import type { Metadata } from "next";
import { ProductCard } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppIcon } from "@/components/site/icons";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal, RevealLines } from "@/components/site/reveal";
import { ThermalCta, ThermalFaq, ThermalFeatures, ThermalProcess, ThermalUses } from "@/components/site/thermal-showcase";
import { MediaImage } from "@/components/site/media-image";
import { config } from "@/lib/config";
import { getProducts, getSettings } from "@/lib/data";
import { TERMICOS_FAQ } from "@/lib/termicos";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Furgones térmicos e isotérmicos a medida en Entre Ríos",
  description:
    "Fabricamos furgones térmicos e isotérmicos a medida en Crespo, Entre Ríos: para lácteos, carnes, alimentos y reparto refrigerado. Homologados, listos para equipo de frío.",
  alternates: { canonical: "/termicos" },
  openGraph: {
    title: "Furgones térmicos a medida | Carrocerías Graas",
    description: "Furgones isotérmicos fabricados a medida de tu chasis en Crespo, Entre Ríos.",
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

      <section className="relative overflow-hidden border-b border-line bg-ink-2 pb-16 pt-36 grain">
        <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[60vh] w-[60vh] rounded-full bg-frost/10 blur-[120px]" />
        <div className={`container-x relative grid items-center gap-10 ${cover ? "lg:grid-cols-2" : ""}`}>
          <div>
            <p className="kicker mb-4 flex items-center gap-3"><span className="h-px w-8 bg-brand" />Carrocerías térmicas</p>
            <h1 className="h-display text-6xl sm:text-7xl lg:text-8xl">
              <RevealLines lines={["Furgones", "térmicos", "a medida"]} accentLast />
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                Furgones isotérmicos para lácteos, carnes, alimentos y reparto refrigerado. Diseñados según tu chasis, fabricados en Crespo y entregados homologados.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={wa} target="_blank" rel="noopener" className="btn-brand">
                  <WhatsAppIcon className="size-4" /> Cotizá tu furgón térmico
                </a>
                <a href="#consulta" className="btn-ghost">Dejanos tu consulta</a>
              </div>
            </Reveal>
          </div>
          {cover && (
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                <MediaImage asset={cover} alt={cover.alt || "Furgón térmico Graas"} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ThermalFeatures />
      <ThermalUses />

      {thermal.length > 0 && (
        <section className="py-24 sm:py-28">
          <div className="container-x">
            <p className="kicker">Modelos</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {thermal.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ThermalProcess />
      <ThermalFaq />

      <section id="consulta" className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="kicker">Pedí tu presupuesto</p>
            <h2 className="h-display mt-3 text-5xl sm:text-6xl">Contanos qué<br /><span className="text-brand">transportás.</span></h2>
            <p className="mt-4 text-muted">Con la marca y modelo del chasis y las medidas que buscás, te preparamos una propuesta a medida.</p>
          </div>
          <ContactForm defaultInterest="Carrocería Térmicas" source="termicos" />
        </div>
      </section>

      <ThermalCta whatsapp={wa} />
    </>
  );
}
