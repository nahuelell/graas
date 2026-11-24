/** Configuración leída de variables de entorno, con detección de "modo demo". */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// URL pública: NEXT_PUBLIC_SITE_URL > dominio de producción de Vercel > dominio definitivo.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const config = {
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelProduction ? `https://${vercelProduction}` : "https://hugograas.com.ar")
  ).replace(/\/$/, ""),
  supabaseUrl,
  supabaseAnonKey,
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
};

/** true cuando hay credenciales reales de Supabase. Sin ellas el sitio corre con datos de ejemplo. */
export const isSupabaseConfigured =
  supabaseUrl.startsWith("https://") && !supabaseUrl.includes("xxxx") && supabaseAnonKey.length > 40;

export const isCloudinaryConfigured = config.cloudName.length > 0;
