import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/site/icons";
import { LeadActions } from "@/components/admin/row-actions";
import { PageTitle } from "@/components/admin/ui";
import { adminLeads } from "@/lib/admin-data";
import { cn, formatDate, whatsappLink } from "@/lib/utils";

export default async function ConsultasPage() {
  const leads = await adminLeads();
  return (
    <>
      <PageTitle title="Consultas" description="Mensajes que llegan desde el formulario de la web." />
      {leads.length ? (
        <ul className="space-y-3">
          {leads.map((l) => (
            <li key={l.id} className={cn("card p-5", !l.is_read && "border-brand/50")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-bold">
                    {!l.is_read && <span className="size-2 rounded-full bg-brand" />}
                    {l.name}
                  </p>
                  <p className="text-xs text-dim">
                    {formatDate(l.created_at)} · {l.interest || "Consulta general"} {l.source ? `· desde ${l.source}` : ""}
                  </p>
                </div>
                <LeadActions id={l.id} isRead={l.is_read} />
              </div>
              {l.message && <p className="mt-3 whitespace-pre-line text-sm text-white/85">{l.message}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {l.phone && (
                  <>
                    <a href={whatsappLink(l.phone.replace(/\D/g, "").replace(/^0/, "549"), `Hola ${l.name}, te escribimos de Carrocerías Graas por tu consulta.`)} target="_blank" rel="noopener" className="btn-wa px-4 py-2 text-xs">
                      <WhatsAppIcon className="size-4" /> Responder
                    </a>
                    <a href={`tel:${l.phone}`} className="btn-ghost px-4 py-2 text-xs"><Phone className="size-3.5" /> {l.phone}</a>
                  </>
                )}
                {l.email && <a href={`mailto:${l.email}`} className="btn-ghost px-4 py-2 text-xs"><Mail className="size-3.5" /> {l.email}</a>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-14 text-center text-muted">Todavía no llegaron consultas.</div>
      )}
    </>
  );
}
