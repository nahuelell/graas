import { ProductForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export default async function NuevoProductoPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="Nuevo modelo" description="Una carrocería del catálogo con su ficha propia (suma para Google)." />
      <ProductForm />
    </>
  );
}
