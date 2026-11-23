import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./config";
import { createSessionClient } from "./supabase/server";

export type AdminUser = { id: string; email: string; name: string };

/** Convierte "graas" en "graas@hugograas.com.ar". Si ya es un email, lo deja igual. */
export function usernameToEmail(username: string) {
  const u = username.trim().toLowerCase();
  if (u.includes("@")) return u;
  const domain = process.env.ADMIN_USER_DOMAIN || "hugograas.com.ar";
  return `${u}@${domain}`;
}

/** Devuelve el admin logueado o null (sin redirigir). */
export async function getAdmin(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase.from("admins").select("user_id, name").eq("user_id", user.id).maybeSingle();
  if (!admin) return null;
  return { id: user.id, email: user.email ?? "", name: admin.name || (user.email ?? "").split("@")[0] };
}

/** Exige sesión de administrador. Usar en cada página y acción del panel. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
