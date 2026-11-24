import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { FilterGrid } from "@/components/site/filter-grid";
import { JsonLd } from "@/components/site/json-ld";
import { getUsados } from "@/lib/data";
import { breadcrumbJsonLd, itemListJsonLd, ogImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Carrocerías usadas en Entre Ríos",
  description:
    "Carrocerías usadas y tomadas en parte de pago, revisadas por Carrocerías Graas en Crespo, Entre Ríos. Sider, baranda volcable, térmicas y más.",
  alternates: { canonical: "/usados" },
  openGraph: { title: "Carrocerías usadas | Carrocerías Graas", url: "/usados", images: [ogImage("Carrocerías usadas", "Revisadas en nuestro taller de Crespo")] },
};

export default async function UsadosPage() {
  const usados = await getUsados();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Usados", path: "/usados" }])} />
      <JsonLd data={itemListJsonLd("Carrocerías usadas", usados.map((u) => ({ name: u.title, path: `/usados/${u.slug}` })))} />
      <PageBanner
        title={["Usados"]}
        text="Carrocerías usadas y tomadas en parte de pago, revisadas en nuestro taller y listas para trabajar."
      />
      <section className="container-x pb-28">
        {usados.length ? (
          <FilterGrid kind="usados" items={usados} />
        ) : (
          <p className="text-steel">Por ahora no hay unidades usadas publicadas. Escribinos y te avisamos cuando ingrese una.</p>
        )}
      </section>
    </>
  );
}
