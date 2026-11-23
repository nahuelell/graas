import { notFound } from "next/navigation";
import { TrabajoForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { adminGet } from "@/lib/admin-data";

export default async function EditTrabajoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trabajo = await adminGet("trabajos", id);
  if (!trabajo) notFound();
  return (
    <>
      <PageTitle title="Editar entrega" description={trabajo.title} />
      <TrabajoForm trabajo={trabajo} />
    </>
  );
}
