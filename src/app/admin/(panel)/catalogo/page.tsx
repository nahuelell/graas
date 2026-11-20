import { EmptyState, ListRow, NewButton, SavedBanner, Thumb } from "@/components/admin/list";
import { RowActions } from "@/components/admin/row-actions";
import { PageTitle } from "@/components/admin/ui";
import { adminList } from "@/lib/admin-data";
import { getCategory } from "@/lib/catalog";

export default async function AdminCatalogoPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [items, sp] = await Promise.all([adminList("products"), searchParams]);
  return (
    <>
      <PageTitle title="Catálogo" description="Los modelos de carrocerías nuevas que fabrican." action={<NewButton href="/admin/catalogo/nuevo" label="Nuevo modelo" />} />
      <SavedBanner show={sp.ok === "1"} />
      {items.length ? (
        <ul className="card divide-y divide-line">
          {items.map((p) => (
            <ListRow
              key={p.id}
              href={`/admin/catalogo/${p.id}`}
              thumb={<Thumb images={p.images} category={p.category} />}
              title={p.title}
              meta={
                <>
                  <span>{getCategory(p.category).name}</span>
                  <span>{p.images.length} fotos</span>
                  {p.featured && <span className="text-brand">Destacado</span>}
                  {!p.published && <span className="text-brand">Oculto</span>}
                </>
              }
            >
              <RowActions table="products" id={p.id} published={p.published} editHref={`/admin/catalogo/${p.id}`} />
            </ListRow>
          ))}
        </ul>
      ) : (
        <EmptyState text="No hay modelos en el catálogo." href="/admin/catalogo/nuevo" label="Crear modelo" />
      )}
    </>
  );
}
