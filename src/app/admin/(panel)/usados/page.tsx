import { EmptyState, ListRow, NewButton, SavedBanner, Thumb } from "@/components/admin/list";
import { RowActions, StatusSelect } from "@/components/admin/row-actions";
import { PageTitle } from "@/components/admin/ui";
import { adminList } from "@/lib/admin-data";
import { getCategory } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export default async function AdminUsadosPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [items, sp] = await Promise.all([adminList("usados"), searchParams]);
  return (
    <>
      <PageTitle title="Usados" description="Subí, editá y marcá como vendidas las unidades usadas." action={<NewButton href="/admin/usados/nuevo" label="Subir usado" />} />
      <SavedBanner show={sp.ok === "1"} />
      {items.length ? (
        <ul className="card divide-y divide-line">
          {items.map((u) => (
            <ListRow
              key={u.id}
              href={`/admin/usados/${u.id}`}
              thumb={<Thumb images={u.images} category={u.category} />}
              title={u.title}
              meta={
                <>
                  <span>{getCategory(u.category).name}</span>
                  <span>{u.images.length} fotos</span>
                  <span>{u.show_price && u.price ? formatPrice(u.price) : "Precio: consultar"}</span>
                  {!u.published && <span className="text-brand">Oculto</span>}
                </>
              }
            >
              <StatusSelect id={u.id} status={u.status} />
              <RowActions table="usados" id={u.id} published={u.published} editHref={`/admin/usados/${u.id}`} />
            </ListRow>
          ))}
        </ul>
      ) : (
        <EmptyState text="Todavía no cargaste ningún usado." href="/admin/usados/nuevo" label="Subir el primero" />
      )}
    </>
  );
}
