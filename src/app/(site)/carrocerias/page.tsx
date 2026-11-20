import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { FilterGrid } from "@/components/site/filter-grid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carrocerías para camión: térmicas, baranda volcable, sider y tolvas",
  description:
    "Catálogo de carrocerías fabricadas a medida en Crespo, Entre Ríos: furgones térmicos, baranda volcable, sider, tolvas, cerealeras y más. Homologadas y certificadas.",
  alternates: { canonical: "/carrocerias" },
};

export default async function CarroceriasPage() {
  const products = await getProducts();
  return (
    <>
      <PageBanner
        kicker="Catálogo"
        title={["Carrocerías", "a medida"]}
        text="Diseñamos y fabricamos cada carrocería según el chasis y el trabajo de tu camión. Todas homologadas y certificadas."
      />
      <section className="container-x py-16 sm:py-20">
        <FilterGrid kind="products" items={products} />
      </section>
    </>
  );
}
