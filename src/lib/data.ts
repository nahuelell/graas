import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "./config";
import { createPublicClient } from "./supabase/public";
import { demoProducts, demoSettings, demoTrabajos, demoUsados } from "./demo";
import type { Product, Settings, Trabajo, Usado } from "./types";

/**
 * Lecturas públicas cacheadas. Cada una tiene un "tag":
 * cuando el panel guarda cambios, se invalida ese tag y la web se actualiza al instante.
 */
export const TAGS = {
  settings: "settings",
  products: "products",
  usados: "usados",
  trabajos: "trabajos",
} as const;

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoSettings;
  const { data } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  const merged = { ...demoSettings, ...(data ?? {}) } as Settings;
  return merged;
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoProducts;
  const { data } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort")
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoProducts.find((p) => p.slug === slug) ?? null;
  const { data } = await createPublicClient().from("products").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Product) ?? null;
}

export async function getUsados(): Promise<Usado[]> {
  "use cache";
  cacheTag(TAGS.usados);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoUsados;
  const { data } = await createPublicClient()
    .from("usados")
    .select("*")
    .eq("published", true)
    .order("sort")
    .order("created_at", { ascending: false });
  return (data ?? []) as Usado[];
}

export async function getUsado(slug: string): Promise<Usado | null> {
  "use cache";
  cacheTag(TAGS.usados);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoUsados.find((u) => u.slug === slug) ?? null;
  const { data } = await createPublicClient().from("usados").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Usado) ?? null;
}

export async function getTrabajos(): Promise<Trabajo[]> {
  "use cache";
  cacheTag(TAGS.trabajos);
  cacheLife("hours");
  if (!isSupabaseConfigured) return demoTrabajos;
  const { data } = await createPublicClient()
    .from("trabajos")
    .select("*")
    .eq("published", true)
    .order("sort")
    .order("delivered_at", { ascending: false, nullsFirst: false });
  return (data ?? []) as Trabajo[];
}
