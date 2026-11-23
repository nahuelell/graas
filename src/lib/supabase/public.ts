import "server-only";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

/**
 * Cliente de solo lectura pública (sin cookies).
 * Se usa dentro de funciones con "use cache" para que las páginas públicas sean estáticas y rápidas.
 */
export function createPublicClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
