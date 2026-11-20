import { notFound } from "next/navigation";
import { UsadoForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { adminGet } from "@/lib/admin-data";

export default async function EditUsadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usado = await adminGet("usados", id);
  if (!usado) notFound();
  return (
    <>
      <PageTitle title="Editar usado" description={usado.title} />
      <UsadoForm usado={usado} />
    </>
  );
}
