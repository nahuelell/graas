"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Cliente del navegador (clave pública). Solo se usa para subir CVs al bucket privado "cvs". */
export function createBrowserSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
}
