import { UsadoForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export default async function NuevoUsadoPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="Subir usado" description="Cargá las fotos, las medidas y el estado de la unidad." />
      <UsadoForm />
    </>
  );
}
