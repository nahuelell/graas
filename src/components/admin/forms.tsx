"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ExternalLink } from "lucide-react";
import { saveProduct, saveSettings, saveTrabajo, saveUsado, type FormState } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/catalog";
import type { Product, Settings, Trabajo, Usado } from "@/lib/types";
import { ImageUploader } from "./image-uploader";
import { SpecsEditor } from "./specs-editor";
import { Field, FormMessage, inputCls, Section, SubmitButton, Toggle } from "./ui";

function CategorySelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select name="category" defaultValue={defaultValue ?? "baranda-volcable"} className={inputCls}>
      {CATEGORIES.map((c) => (
        <option key={c.slug} value={c.slug}>{c.name}</option>
      ))}
    </select>
  );
}

function FormFooter({ state, viewHref }: { state: FormState; viewHref?: string }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-t border-line bg-ink/90 px-1 py-4 backdrop-blur">
      <SubmitButton />
      {viewHref && (
        <Link href={viewHref} target="_blank" className="btn-ghost py-3.5">
          Ver en la web <ExternalLink className="size-4" />
        </Link>
      )}
      <div className="w-full sm:w-auto sm:flex-1">
        <FormMessage state={state} />
      </div>
    </div>
  );
}

// ── Usado ────────────────────────────────────────────────────────────────────
export function UsadoForm({ usado }: { usado?: Usado | null }) {
  const [state, action] = useActionState(saveUsado, null);
  return (
    <form action={action} className="space-y-6">
      {usado && <input type="hidden" name="id" value={usado.id} />}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Section title="Fotos" description="Subí varias fotos. La primera es la portada.">
            <ImageUploader name="images" folder="usados" initial={usado?.images ?? []} />
          </Section>
          <Section title="Datos de la unidad">
            <Field label="Título *"><input name="title" required defaultValue={usado?.title} placeholder="Ej: Baranda volcable 5,40 m" className={inputCls} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo"><CategorySelect defaultValue={usado?.category} /></Field>
              <Field label="Año"><input name="year" type="number" min={1950} max={2100} defaultValue={usado?.year ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Resumen" hint="Una línea que aparece en la tarjeta."><input name="summary" defaultValue={usado?.summary ?? ""} className={inputCls} /></Field>
            <Field label="Descripción"><textarea name="description" rows={5} defaultValue={usado?.description ?? ""} className={inputCls} /></Field>
          </Section>
          <Section title="Características" description="Medidas, chasis, estado, accesorios...">
            <SpecsEditor name="specs" initial={usado?.specs} />
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Estado y precio">
            <Field label="Estado">
              <select name="status" defaultValue={usado?.status ?? "disponible"} className={inputCls}>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </Field>
            <Field label="Precio (ARS)" hint="Opcional. Si no se muestra, dice “Consultar”.">
              <input name="price" inputMode="numeric" defaultValue={usado?.price ?? ""} placeholder="Ej: 8500000" className={inputCls} />
            </Field>
            <Toggle name="show_price" defaultChecked={usado?.show_price ?? false} label="Mostrar precio en la web" />
          </Section>
          <Section title="Publicación">
            <Toggle name="published" defaultChecked={usado?.published ?? true} label="Publicado" hint="Si lo apagás, no se ve en la web." />
            <Toggle name="featured" defaultChecked={usado?.featured ?? false} label="Destacado" hint="Aparece primero en el inicio." />
            <Field label="Orden" hint="Menor número = aparece antes."><input name="sort" type="number" defaultValue={usado?.sort ?? 0} className={inputCls} /></Field>
            <Field label="URL" hint="Se genera sola a partir del título."><input name="slug" defaultValue={usado?.slug ?? ""} placeholder="baranda-volcable-5-40" className={inputCls} /></Field>
          </Section>
        </div>
      </div>
      <FormFooter state={state} viewHref={usado ? `/usados/${usado.slug}` : undefined} />
    </form>
  );
}

// ── Producto del catálogo ────────────────────────────────────────────────────
export function ProductForm({ product }: { product?: Product | null }) {
  const [state, action] = useActionState(saveProduct, null);
  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Section title="Fotos">
            <ImageUploader name="images" folder="catalogo" initial={product?.images ?? []} />
          </Section>
          <Section title="Contenido">
            <Field label="Nombre *"><input name="title" required defaultValue={product?.title} placeholder="Ej: Furgón térmico" className={inputCls} /></Field>
            <Field label="Tipo"><CategorySelect defaultValue={product?.category} /></Field>
            <Field label="Resumen"><input name="summary" defaultValue={product?.summary ?? ""} className={inputCls} /></Field>
            <Field label="Descripción"><textarea name="description" rows={6} defaultValue={product?.description ?? ""} className={inputCls} /></Field>
          </Section>
          <Section title="Características">
            <SpecsEditor name="specs" initial={product?.specs} />
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Publicación">
            <Toggle name="published" defaultChecked={product?.published ?? true} label="Publicado" />
            <Toggle name="featured" defaultChecked={product?.featured ?? false} label="Destacado en el inicio" />
            <Field label="Orden"><input name="sort" type="number" defaultValue={product?.sort ?? 0} className={inputCls} /></Field>
            <Field label="URL"><input name="slug" defaultValue={product?.slug ?? ""} className={inputCls} /></Field>
          </Section>
          <Section title="Google (SEO)" description="Opcional. Si lo dejás vacío se arma solo.">
            <Field label="Título para Google"><input name="seo_title" maxLength={70} defaultValue={product?.seo_title ?? ""} className={inputCls} /></Field>
            <Field label="Descripción para Google"><textarea name="seo_description" maxLength={160} rows={3} defaultValue={product?.seo_description ?? ""} className={inputCls} /></Field>
          </Section>
        </div>
      </div>
      <FormFooter state={state} viewHref={product ? `/carrocerias/${product.slug}` : undefined} />
    </form>
  );
}

// ── Trabajo entregado ────────────────────────────────────────────────────────
export function TrabajoForm({ trabajo }: { trabajo?: Trabajo | null }) {
  const [state, action] = useActionState(saveTrabajo, null);
  return (
    <form action={action} className="space-y-6">
      {trabajo && <input type="hidden" name="id" value={trabajo.id} />}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Section title="Fotos de la entrega">
            <ImageUploader name="images" folder="trabajos" initial={trabajo?.images ?? []} />
          </Section>
          <Section title="Datos">
            <Field label="Título *"><input name="title" required defaultValue={trabajo?.title} placeholder="Ej: Furgón térmico para lácteos" className={inputCls} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo"><CategorySelect defaultValue={trabajo?.category} /></Field>
              <Field label="Fecha de entrega"><input name="delivered_at" type="date" defaultValue={trabajo?.delivered_at ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Cliente" hint="Opcional. Solo si el cliente está de acuerdo."><input name="client" defaultValue={trabajo?.client ?? ""} className={inputCls} /></Field>
            <Field label="Descripción"><textarea name="description" rows={4} defaultValue={trabajo?.description ?? ""} className={inputCls} /></Field>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Publicación">
            <Toggle name="published" defaultChecked={trabajo?.published ?? true} label="Publicado" />
            <Field label="Orden"><input name="sort" type="number" defaultValue={trabajo?.sort ?? 0} className={inputCls} /></Field>
          </Section>
        </div>
      </div>
      <FormFooter state={state} viewHref={trabajo ? "/trabajos" : undefined} />
    </form>
  );
}

// ── Ajustes del sitio ────────────────────────────────────────────────────────
export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [state, action] = useActionState(saveSettings, null);
  const s = settings;
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Portada (hero)" description="El video se reproduce de fondo, sin sonido. Si no hay video, se usa la imagen.">
          <Field label="Video de fondo" hint="MP4 horizontal, 10 a 20 segundos, idealmente menos de 30 MB.">
            <ImageUploader name="hero_video" folder="sitio" multiple={false} accept="video/*" label="Subir video" initial={s?.hero_video ? [s.hero_video] : []} />
          </Field>
          <Field label="Imagen de fondo">
            <ImageUploader name="hero_image" folder="sitio" multiple={false} label="Subir imagen" initial={s?.hero_image ? [s.hero_image] : []} />
          </Field>
          <Field label="Texto superior"><input name="hero_kicker" defaultValue={s?.hero_kicker ?? ""} className={inputCls} /></Field>
          <Field label="Bajada"><textarea name="hero_subtitle" rows={3} defaultValue={s?.hero_subtitle ?? ""} className={inputCls} /></Field>
        </Section>
        <div className="space-y-6">
          <Section title="Contacto">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Teléfono"><input name="phone" defaultValue={s?.phone ?? ""} className={inputCls} /></Field>
              <Field label="WhatsApp" hint="Con 549 + característica. Ej: 5493434157700"><input name="whatsapp" defaultValue={s?.whatsapp ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Email"><input name="email" type="email" defaultValue={s?.email ?? ""} className={inputCls} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dirección"><input name="address" defaultValue={s?.address ?? ""} className={inputCls} /></Field>
              <Field label="Ciudad"><input name="city" defaultValue={s?.city ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Horario"><input name="hours" defaultValue={s?.hours ?? ""} className={inputCls} /></Field>
            <Field label="Búsqueda para el mapa" hint="Como lo escribirías en Google Maps."><input name="maps_query" defaultValue={s?.maps_query ?? ""} className={inputCls} /></Field>
          </Section>
          <Section title="Redes y empresa">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Instagram (URL)"><input name="instagram" defaultValue={s?.instagram ?? ""} className={inputCls} /></Field>
              <Field label="Facebook (URL)"><input name="facebook" defaultValue={s?.facebook ?? ""} className={inputCls} /></Field>
              <Field label="Nombre comercial"><input name="company_name" defaultValue={s?.company_name ?? "Carrocerías Graas"} className={inputCls} /></Field>
              <Field label="Razón social"><input name="legal_name" defaultValue={s?.legal_name ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Texto “Nosotros”"><textarea name="about" rows={5} defaultValue={s?.about ?? ""} className={inputCls} /></Field>
          </Section>
        </div>
      </div>
      <FormFooter state={state} viewHref="/" />
    </form>
  );
}
