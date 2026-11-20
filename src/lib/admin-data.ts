import "server-only";
import { requireAdmin } from "./auth";
import { createSessionClient } from "./supabase/server";
import type { Lead, Product, Settings, Trabajo, Usado } from "./types";

/** Lecturas del panel: siempre frescas, siempre con sesión de administrador. */

export async function adminList<T extends "usados" | "products" | "trabajos">(table: T) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from(table).select("*").order("sort").order("created_at", { ascending: false });
  return (data ?? []) as T extends "usados" ? Usado[] : T extends "products" ? Product[] : Trabajo[];
}

export async function adminGet<T extends "usados" | "products" | "trabajos">(table: T, id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  return data as (T extends "usados" ? Usado : T extends "products" ? Product : Trabajo) | null;
}

export async function adminSettings() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  return data as Settings | null;
}

export async function adminLeads(limit = 200) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as Lead[];
}

export async function adminCounts() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const head = { count: "exact" as const, head: true };
  const [usados, disponibles, products, trabajos, leadsNew] = await Promise.all([
    supabase.from("usados").select("id", head),
    supabase.from("usados").select("id", head).eq("status", "disponible"),
    supabase.from("products").select("id", head),
    supabase.from("trabajos").select("id", head),
    supabase.from("leads").select("id", head).eq("is_read", false),
  ]);
  return {
    usados: usados.count ?? 0,
    disponibles: disponibles.count ?? 0,
    products: products.count ?? 0,
    trabajos: trabajos.count ?? 0,
    leadsNew: leadsNew.count ?? 0,
  };
}
