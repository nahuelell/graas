import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { FilterGrid } from "@/components/site/filter-grid";
import { JsonLd } from "@/components/site/json-ld";
import { getProducts } from "@/lib/data";
import { breadcrumbJsonLd, itemListJsonLd, ogImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Carrocerías para camión: furgones térmicos, baranda volcable y sider",
  description:
    "Catálogo de carrocerías fabricadas a medida en Crespo, Entre Ríos: furgones térmicos, baranda volcable, sider, cerealeras y más. Homologadas y certificadas.",
  alternates: { canonical: "/carrocerias" },
  openGraph: { title: "Carrocerías a medida | Carrocerías Graas", url: "/carrocerias", images: [ogImage("Carrocerías a medida", "Furgones térmicos, baranda volcable, sider y más")] },
};

export default async function CarroceriasPage() {
  const products = await getProducts();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Carrocerías", path: "/carrocerias" }])} />
      <JsonLd data={itemListJsonLd("Carrocerías Graas", products.map((p) => ({ name: p.title, path: `/carrocerias/${p.slug}` })))} />
      <PageBanner
        title={["Carrocerías", "a medida"]}
        text="Diseñamos y fabricamos cada carrocería según el chasis y el trabajo de tu camión. Todas homologadas y certificadas."
      />
      <section className="container-x pb-28">
        <FilterGrid kind="products" items={products} />
      </section>
    </>
  );
}
