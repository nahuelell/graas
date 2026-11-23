"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteItem, deleteLead, markLead, setUsadoStatus, togglePublished } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Table = "usados" | "products" | "trabajos";

export function RowActions({ table, id, published, editHref }: { table: Table; id: string; published: boolean; editHref: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className={cn("flex items-center gap-1.5", pending && "pointer-events-none opacity-50")}>
      <button
        title={published ? "Ocultar de la web" : "Publicar en la web"}
        onClick={() => start(async () => { await togglePublished(table, id, !published); router.refresh(); })}
        className={cn("grid size-9 place-items-center rounded-lg border transition", published ? "border-wa/40 text-wa hover:bg-wa/10" : "border-line text-dim hover:text-white")}
      >
        {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
      <Link href={editHref} title="Editar" className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand">
        <Pencil className="size-4" />
      </Link>
      <button
        title="Eliminar"
        onClick={() => {
          if (confirm("¿Eliminar definitivamente? También se borran sus fotos.")) start(() => deleteItem(table, id));
        }}
        className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-red-400 hover:text-red-300"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        start(async () => { await setUsadoStatus(id, v); router.refresh(); });
      }}
      className={cn(
        "rounded-lg border bg-ink px-2.5 py-1.5 text-xs font-bold uppercase outline-none",
        status === "disponible" && "border-wa/50 text-wa",
        status === "reservado" && "border-brand/50 text-brand",
        status === "vendido" && "border-line text-dim",
      )}
    >
      <option value="disponible">Disponible</option>
      <option value="reservado">Reservado</option>
      <option value="vendido">Vendido</option>
    </select>
  );
}

export function LeadActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className={cn("flex gap-2", pending && "opacity-50")}>
      <button
        onClick={() => start(async () => { await markLead(id, !isRead); router.refresh(); })}
        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-white"
      >
        {isRead ? "Marcar como nueva" : "Marcar como leída"}
      </button>
      <button
        onClick={() => {
          if (confirm("¿Eliminar esta consulta?")) start(async () => { await deleteLead(id); router.refresh(); });
        }}
        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-red-400 hover:text-red-300"
      >
        Eliminar
      </button>
    </div>
  );
}
