"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Download, Eye, LoaderCircle } from "lucide-react";
import { deleteApplication, getCvUrl, markApplication } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/** Botones para ver/descargar el CV (link temporal) y gestionar la postulación. */
export function ApplicationActions({ id, cvPath, isRead }: { id: string; cvPath: string | null; isRead: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const open = (download: boolean) =>
    start(async () => {
      if (!cvPath) return;
      // Se abre la pestaña antes de esperar al servidor para que el navegador no la bloquee.
      const tab = download ? null : window.open("", "_blank");
      const url = await getCvUrl(cvPath, download);
      if (!url) {
        tab?.close();
        alert("No se pudo abrir el CV. Probá de nuevo.");
        return;
      }
      if (tab) tab.location.href = url;
      else window.location.href = url;
      if (!isRead) {
        await markApplication(id, true);
        router.refresh();
      }
    });

  return (
    <div className={cn("flex flex-wrap gap-2", pending && "opacity-60")}>
      {cvPath && (
        <>
          <button onClick={() => open(false)} className="btn-brand px-4 py-2 text-xs">
            {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : <Eye className="size-3.5" />} Ver CV
          </button>
          <button onClick={() => open(true)} className="btn-ghost px-4 py-2 text-xs">
            <Download className="size-3.5" /> Descargar
          </button>
        </>
      )}
      <button
        onClick={() => start(async () => { await markApplication(id, !isRead); router.refresh(); })}
        className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:text-white"
      >
        {isRead ? "Marcar como nueva" : "Marcar como revisada"}
      </button>
      <button
        onClick={() => {
          if (confirm("¿Eliminar esta postulación? También se borra el CV.")) start(async () => { await deleteApplication(id); router.refresh(); });
        }}
        className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:border-red-400 hover:text-red-300"
      >
        Eliminar
      </button>
    </div>
  );
}
