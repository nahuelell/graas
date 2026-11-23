import type { Metadata } from "next";
import { PageBanner, TrabajoCard } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
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
      <PageBanner kicker="Trabajos reales" title={["Unidades", "entregadas"]} text="Cada carrocería que sale del taller, lista para trabajar." />
      <section className="container-x py-16 sm:py-20">
        {trabajos.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trabajos.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08}>
                <TrabajoCard trabajo={t} className="aspect-[4/5]" />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-muted">Pronto vas a ver acá las últimas unidades entregadas.</p>
        )}
      </section>
    </>
  );
}
