import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { adminGet } from "@/lib/admin-data";

export default async function EditProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await adminGet("products", id);
  if (!product) notFound();
  return (
    <>
      <PageTitle title="Editar modelo" description={product.title} />
      <ProductForm product={product} />
    </>
  );
}
