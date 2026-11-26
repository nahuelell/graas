import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { ApplicationActions } from "@/components/admin/application-actions";
import { PageTitle } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/site/icons";
import { adminApplications } from "@/lib/admin-data";
import { cn, formatDate, whatsappLink } from "@/lib/utils";

const size = (n: number | null) => (n ? (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`) : "");

export default async function PostulacionesPage() {
  const apps = await adminApplications();
  return (
    <>
      <PageTitle title="Postulaciones" description="CVs que llegan desde “Trabajá con nosotros”. Los archivos son privados: solo se ven desde acá." />
      {apps.length ? (
        <ul className="space-y-3">
          {apps.map((a) => (
            <li key={a.id} className={cn("card p-5", !a.is_read && "border-brand/50")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-bold">
                    {!a.is_read && <span className="size-2 rounded-full bg-brand" />}
                    {a.name}
                  </p>
                  <p className="text-xs text-dim">
                    {formatDate(a.created_at)}
                    {a.position ? ` · ${a.position}` : ""}
                  </p>
                </div>
                <ApplicationActions id={a.id} cvPath={a.cv_path} isRead={a.is_read} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                {a.city && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{a.city}</span>}
                {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 hover:text-white"><Phone className="size-3.5" />{a.phone}</a>}
                {a.email && <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" />{a.email}</a>}
                {a.cv_name && <span className="flex items-center gap-1.5"><FileText className="size-3.5" />{a.cv_name} {size(a.cv_size)}</span>}
              </div>
              {a.message && <p className="mt-3 whitespace-pre-line text-sm text-white/85">{a.message}</p>}
              {a.phone && (
                <a
                  href={whatsappLink(a.phone.replace(/\D/g, "").replace(/^0/, "549"), `Hola ${a.name}, te escribimos de Carrocerías Graas por tu postulación.`)}
                  target="_blank"
                  rel="noopener"
                  className="btn-wa mt-4 px-4 py-2 text-xs"
                >
                  <WhatsAppIcon className="size-4" /> Escribir por WhatsApp
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-14 text-center text-muted">Todavía no llegaron postulaciones.</div>
      )}
    </>
  );
}
