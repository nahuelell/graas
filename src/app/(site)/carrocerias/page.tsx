import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { FilterGrid } from "@/components/site/filter-grid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carrocerías para camión: furgones térmicos, baranda volcable y sider",
  description:
    "Catálogo de carrocerías fabricadas a medida en Crespo, Entre Ríos: furgones térmicos, baranda volcable, sider, cerealeras y más. Homologadas y certificadas.",
  alternates: { canonical: "/carrocerias" },
};

export default async function CarroceriasPage() {
  const products = await getProducts();
  return (
    <>
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
