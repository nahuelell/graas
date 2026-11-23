import type { Metadata } from "next";
import { PageBanner } from "@/components/site/blocks";
import { FilterGrid } from "@/components/site/filter-grid";
import { getUsados } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carrocerías usadas en Entre Ríos",
  description:
    "Carrocerías usadas y tomadas en parte de pago, revisadas por Carrocerías Graas en Crespo, Entre Ríos. Sider, baranda volcable, térmicas y más.",
  alternates: { canonical: "/usados" },
};

export default async function UsadosPage() {
  const usados = await getUsados();
  return (
    <>
      <PageBanner
        kicker="Usados"
        title={["Unidades", "usadas"]}
        text="Carrocerías usadas y tomadas en parte de pago, revisadas en nuestro taller y listas para trabajar."
      />
      <section className="container-x py-16 sm:py-20">
        {usados.length ? (
          <FilterGrid kind="usados" items={usados} />
        ) : (
          <p className="text-muted">Por ahora no hay unidades usadas publicadas. Escribinos y te avisamos cuando ingrese una.</p>
        )}
      </section>
    </>
  );
}
