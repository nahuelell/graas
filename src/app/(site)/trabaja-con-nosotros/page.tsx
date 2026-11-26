import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { ApplyForm } from "@/components/site/apply-form";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { isSupabaseConfigured } from "@/lib/config";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Trabajá con nosotros",
  description: "Sumate a Carrocerías Graas en Crespo, Entre Ríos. Dejanos tus datos y tu CV para próximas búsquedas en taller, pintura y administración.",
  alternates: { canonical: "/trabaja-con-nosotros" },
  openGraph: { title: "Trabajá con nosotros | Carrocerías Graas", url: "/trabaja-con-nosotros", images: [ogImage("Trabajá con nosotros", "Dejanos tu CV")] },
};

export default function TrabajaPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trabajá con nosotros", path: "/trabaja-con-nosotros" }])} />
      <PageBanner
        title={["Trabajá", "con nosotros"]}
        text="Si te interesa trabajar en Graas, dejanos tus datos y tu CV. Lo revisamos y te contactamos cuando haya una búsqueda que coincida con tu perfil."
      />
      <section className="container-x grid gap-14 pb-28 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <Reveal>
          <dl className="border-t border-rule">
            {[
              ["Dónde", "Parque Industrial de Crespo, Entre Ríos"],
              ["Áreas", "Soldadura y armado, pintura y arenado, taller y administración"],
              ["CV", "PDF o foto, hasta 8 MB"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-rule py-4">
                <dt className="text-steel">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <ApplyForm enabled={isSupabaseConfigured} />
        </Reveal>
      </section>
    </>
  );
}
