import Link from "next/link";
import { ArrowRight, Briefcase, Hammer, Inbox, Package, Plus, Truck } from "lucide-react";
import { PageTitle } from "@/components/admin/ui";
import { adminCounts, adminLeads } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [counts, leads] = await Promise.all([adminCounts(), adminLeads(5)]);

  const cards = [
    { label: "Usados publicados", value: counts.usados, sub: `${counts.disponibles} disponibles`, href: "/admin/usados", icon: Truck },
    { label: "Trabajos entregados", value: counts.trabajos, sub: "en la galería", href: "/admin/trabajos", icon: Hammer },
    { label: "Modelos en catálogo", value: counts.products, sub: "carrocerías nuevas", href: "/admin/catalogo", icon: Package },
    { label: "Consultas nuevas", value: counts.leadsNew, sub: "sin leer", href: "/admin/consultas", icon: Inbox },
    { label: "Postulaciones nuevas", value: counts.appsNew, sub: "CV sin revisar", href: "/admin/postulaciones", icon: Briefcase },
  ];

  return (
    <>
      <PageTitle title={`Hola, ${admin.name}`} description="¿Qué querés actualizar hoy?" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/usados/nuevo" className="group flex items-center justify-between rounded-2xl bg-brand p-6 text-ink transition hover:brightness-105">
          <span>
            <span className="block text-xs font-bold tracking-widest uppercase opacity-70">Acción rápida</span>
            <span className="h-display mt-1 block text-3xl">Subir un usado</span>
          </span>
          <span className="grid size-12 place-items-center rounded-full bg-ink text-brand transition group-hover:rotate-90"><Plus /></span>
        </Link>
        <Link href="/admin/trabajos/nuevo" className="group flex items-center justify-between rounded-2xl border border-brand/40 bg-panel p-6 transition hover:border-brand">
          <span>
            <span className="block text-xs font-bold tracking-widest text-muted uppercase">Acción rápida</span>
            <span className="h-display mt-1 block text-3xl">Cargar una entrega</span>
          </span>
          <span className="grid size-12 place-items-center rounded-full bg-brand text-ink transition group-hover:rotate-90"><Plus /></span>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ label, value, sub, href, icon: Icon }) => (
          <Link key={href} href={href} className="card group p-5 transition hover:border-brand/60">
            <Icon className="size-5 text-brand" />
            <p className="mt-4 font-display text-4xl">{value}</p>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-dim">{sub}</p>
          </Link>
        ))}
      </div>

      <section className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Últimas consultas</h2>
          <Link href="/admin/consultas" className="flex items-center gap-1 text-sm font-semibold text-brand">Ver todas <ArrowRight className="size-4" /></Link>
        </div>
        {leads.length ? (
          <ul className="mt-4 divide-y divide-line">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="flex items-center gap-2">
                  {!l.is_read && <span className="size-2 rounded-full bg-brand" />}
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-dim">· {l.interest || "Consulta general"}</span>
                </span>
                <span className="text-xs text-dim">{formatDate(l.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-dim">Todavía no hay consultas desde el formulario.</p>
        )}
      </section>
    </>
  );
}
