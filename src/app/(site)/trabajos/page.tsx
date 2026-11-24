import type { Metadata } from "next";
import { PageBanner, TrabajoCard } from "@/components/site/blocks";
import { getTrabajos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trabajos entregados",
  description: "Carrocerías fabricadas y entregadas por Carrocerías Graas a transportistas y productores de la región.",
  alternates: { canonical: "/trabajos" },
};

export default async function TrabajosPage() {
  const trabajos = await getTrabajos();
  return (
    <>
      <PageBanner title={["Unidades", "entregadas"]} text="Carrocerías que salieron de nuestro taller, listas para trabajar." />
      <section className="container-x pb-28">
        {trabajos.length ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {trabajos.map((t) => (
              <TrabajoCard key={t.id} trabajo={t} />
            ))}
          </div>
        ) : (
          <p className="text-steel">Pronto vas a ver acá las últimas unidades entregadas.</p>
        )}
      </section>
    </>
  );
}
