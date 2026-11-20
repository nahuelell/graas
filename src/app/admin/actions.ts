"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, usernameToEmail } from "@/lib/auth";
import { destroyAssets } from "@/lib/cloudinary-server";
import { isSupabaseConfigured } from "@/lib/config";
import { TAGS } from "@/lib/data";
import { createSessionClient } from "@/lib/supabase/server";
import type { MediaAsset, Spec } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type FormState = { ok: boolean; message: string } | null;

// ── helpers ──────────────────────────────────────────────────────────────────
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const strOrNull = (f: FormData, k: string) => str(f, k) || null;
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
const int = (f: FormData, k: string) => {
  const n = parseInt(str(f, k), 10);
  return Number.isFinite(n) ? n : null;
};
const num = (f: FormData, k: string) => {
  const raw = str(f, k).replace(/\./g, "").replace(",", ".");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
};
function json<T>(f: FormData, k: string, fallback: T): T {
  try {
    return JSON.parse(str(f, k) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
const cleanSpecs = (specs: Spec[]) => specs.filter((s) => s.label?.trim() && s.value?.trim()).map((s) => ({ label: s.label.trim(), value: s.value.trim() }));
const cleanMedia = (items: MediaAsset[]) => items.filter((m) => m?.url && m?.public_id);

function removedAssets(before: MediaAsset[] = [], after: MediaAsset[] = []) {
  const keep = new Set(after.map((a) => a.public_id));
  return before.filter((a) => !keep.has(a.public_id));
}

type Table = "usados" | "products" | "trabajos";
const TABLE_TAG: Record<Table, string> = { usados: TAGS.usados, products: TAGS.products, trabajos: TAGS.trabajos };
const TABLE_PATH: Record<Table, string> = { usados: "/admin/usados", products: "/admin/catalogo", trabajos: "/admin/trabajos" };

/** Inserta o actualiza. Si el slug ya existe, le agrega un sufijo. */
async function upsert(table: Table, id: string | null, payload: Record<string, unknown>) {
  const supabase = await createSessionClient();
  let before: MediaAsset[] = [];
  if (id) {
    const { data } = await supabase.from(table).select("images").eq("id", id).maybeSingle();
    before = (data?.images as MediaAsset[]) ?? [];
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const query = id
      ? supabase.from(table).update(payload).eq("id", id).select("id").single()
      : supabase.from(table).insert(payload).select("id").single();
    const { data, error } = await query;
    if (!error) {
      await destroyAssets(removedAssets(before, payload.images as MediaAsset[]));
      updateTag(TABLE_TAG[table]);
      return { id: data.id as string, error: null };
    }
    if (error.code === "23505" && "slug" in payload) {
      payload.slug = `${payload.slug}-${Math.random().toString(36).slice(2, 6)}`;
      continue;
    }
    return { id: null, error: error.message };
  }
  return { id: null, error: "No se pudo generar una URL única." };
}

// ── Sesión ───────────────────────────────────────────────────────────────────
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { ok: false, message: "Falta configurar Supabase (ver README)." };
  const username = str(formData, "username");
  const password = str(formData, "password");
  if (!username || !password) return { ok: false, message: "Completá usuario y contraseña." };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
  if (error || !data.user) return { ok: false, message: "Usuario o contraseña incorrectos." };

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: "Este usuario no tiene permisos de administrador." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Usados ───────────────────────────────────────────────────────────────────
export async function saveUsado(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = strOrNull(f, "id");
  const title = str(f, "title");
  if (!title) return { ok: false, message: "El título es obligatorio." };
  const payload = {
    title,
    slug: slugify(str(f, "slug") || title),
    category: str(f, "category") || "otras",
    status: str(f, "status") || "disponible",
    year: int(f, "year"),
    price: num(f, "price"),
    show_price: bool(f, "show_price"),
    summary: strOrNull(f, "summary"),
    description: strOrNull(f, "description"),
    specs: cleanSpecs(json<Spec[]>(f, "specs", [])),
    images: cleanMedia(json<MediaAsset[]>(f, "images", [])),
    featured: bool(f, "featured"),
    published: bool(f, "published"),
    sort: int(f, "sort") ?? 0,
  };
  const res = await upsert("usados", id, payload);
  if (res.error) return { ok: false, message: res.error };
  if (!id) redirect(`${TABLE_PATH.usados}?ok=1`);
  return { ok: true, message: "Cambios guardados. Ya se ven en la web." };
}

// ── Catálogo ─────────────────────────────────────────────────────────────────
export async function saveProduct(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = strOrNull(f, "id");
  const title = str(f, "title");
  if (!title) return { ok: false, message: "El título es obligatorio." };
  const payload = {
    title,
    slug: slugify(str(f, "slug") || title),
    category: str(f, "category") || "otras",
    summary: strOrNull(f, "summary"),
    description: strOrNull(f, "description"),
    specs: cleanSpecs(json<Spec[]>(f, "specs", [])),
    images: cleanMedia(json<MediaAsset[]>(f, "images", [])),
    featured: bool(f, "featured"),
    published: bool(f, "published"),
    sort: int(f, "sort") ?? 0,
    seo_title: strOrNull(f, "seo_title"),
    seo_description: strOrNull(f, "seo_description"),
  };
  const res = await upsert("products", id, payload);
  if (res.error) return { ok: false, message: res.error };
  if (!id) redirect(`${TABLE_PATH.products}?ok=1`);
  return { ok: true, message: "Cambios guardados. Ya se ven en la web." };
}

// ── Trabajos entregados ──────────────────────────────────────────────────────
export async function saveTrabajo(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = strOrNull(f, "id");
  const title = str(f, "title");
  if (!title) return { ok: false, message: "El título es obligatorio." };
  const payload = {
    title,
    client: strOrNull(f, "client"),
    category: str(f, "category") || "otras",
    description: strOrNull(f, "description"),
    images: cleanMedia(json<MediaAsset[]>(f, "images", [])),
    delivered_at: strOrNull(f, "delivered_at"),
    published: bool(f, "published"),
    sort: int(f, "sort") ?? 0,
  };
  const res = await upsert("trabajos", id, payload);
  if (res.error) return { ok: false, message: res.error };
  if (!id) redirect(`${TABLE_PATH.trabajos}?ok=1`);
  return { ok: true, message: "Cambios guardados. Ya se ven en la web." };
}

// ── Acciones de lista ────────────────────────────────────────────────────────
export async function deleteItem(table: Table, id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from(table).select("images").eq("id", id).maybeSingle();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (!error) {
    await destroyAssets((data?.images as MediaAsset[]) ?? []);
    updateTag(TABLE_TAG[table]);
  }
  redirect(TABLE_PATH[table]);
}

export async function togglePublished(table: Table, id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createSessionClient();
  await supabase.from(table).update({ published }).eq("id", id);
  updateTag(TABLE_TAG[table]);
}

export async function setUsadoStatus(id: string, status: string) {
  await requireAdmin();
  if (!["disponible", "reservado", "vendido"].includes(status)) return;
  const supabase = await createSessionClient();
  await supabase.from("usados").update({ status }).eq("id", id);
  updateTag(TAGS.usados);
}

// ── Ajustes ──────────────────────────────────────────────────────────────────
export async function saveSettings(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data: before } = await supabase.from("settings").select("hero_video, hero_image").eq("id", 1).maybeSingle();
  const heroVideo = cleanMedia(json<MediaAsset[]>(f, "hero_video", []))[0] ?? null;
  const heroImage = cleanMedia(json<MediaAsset[]>(f, "hero_image", []))[0] ?? null;
  const payload = {
    id: 1,
    company_name: str(f, "company_name") || "Carrocerías Graas",
    legal_name: strOrNull(f, "legal_name"),
    phone: strOrNull(f, "phone"),
    whatsapp: str(f, "whatsapp").replace(/\D/g, "") || null,
    email: strOrNull(f, "email"),
    address: strOrNull(f, "address"),
    city: strOrNull(f, "city"),
    hours: strOrNull(f, "hours"),
    instagram: strOrNull(f, "instagram"),
    facebook: strOrNull(f, "facebook"),
    maps_query: strOrNull(f, "maps_query"),
    hero_kicker: strOrNull(f, "hero_kicker"),
    hero_subtitle: strOrNull(f, "hero_subtitle"),
    about: strOrNull(f, "about"),
    hero_video: heroVideo,
    hero_image: heroImage,
  };
  const { error } = await supabase.from("settings").upsert(payload);
  if (error) return { ok: false, message: error.message };
  const old = [before?.hero_video, before?.hero_image].filter(Boolean) as MediaAsset[];
  await destroyAssets(removedAssets(old, [heroVideo, heroImage].filter(Boolean) as MediaAsset[]));
  updateTag(TAGS.settings);
  return { ok: true, message: "Ajustes guardados. Ya se ven en la web." };
}

// ── Consultas ────────────────────────────────────────────────────────────────
export async function markLead(id: string, is_read: boolean) {
  await requireAdmin();
  const supabase = await createSessionClient();
  await supabase.from("leads").update({ is_read }).eq("id", id);
}

export async function deleteLead(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  await supabase.from("leads").delete().eq("id", id);
}
