import { EmptyState, ListRow, NewButton, SavedBanner, Thumb } from "@/components/admin/list";
import { RowActions } from "@/components/admin/row-actions";
import { PageTitle } from "@/components/admin/ui";
import { adminList } from "@/lib/admin-data";
import { getCategory } from "@/lib/catalog";
import { formatDate } from "@/lib/utils";

export default async function AdminTrabajosPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [items, sp] = await Promise.all([adminList("trabajos"), searchParams]);
  return (
    <>
      <PageTitle title="Trabajos entregados" description="Cada unidad que sale del taller suma a la galería." action={<NewButton href="/admin/trabajos/nuevo" label="Cargar entrega" />} />
      <SavedBanner show={sp.ok === "1"} />
      {items.length ? (
        <ul className="card divide-y divide-line">
          {items.map((t) => (
            <ListRow
              key={t.id}
              href={`/admin/trabajos/${t.id}`}
              thumb={<Thumb images={t.images} category={t.category} />}
              title={t.title}
              meta={
                <>
                  <span>{getCategory(t.category).name}</span>
                  {t.delivered_at && <span>Entregado {formatDate(t.delivered_at)}</span>}
                  <span>{t.images.length} fotos</span>
                  {!t.published && <span className="text-brand">Oculto</span>}
                </>
              }
            >
              <RowActions table="trabajos" id={t.id} published={t.published} editHref={`/admin/trabajos/${t.id}`} />
            </ListRow>
          ))}
        </ul>
      ) : (
        <EmptyState text="Todavía no cargaste trabajos entregados." href="/admin/trabajos/nuevo" label="Cargar el primero" />
      )}
    </>
  );
}
