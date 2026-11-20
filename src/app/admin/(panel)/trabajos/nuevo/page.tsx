import { TrabajoForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export default async function NuevoTrabajoPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="Cargar entrega" description="Subí las fotos de la unidad terminada." />
      <TrabajoForm />
    </>
  );
}
