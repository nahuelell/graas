/**
 * Crea (o actualiza) un usuario administrador del panel.
 *
 * Uso:
 *   npm run create-admin -- <usuario> <contraseña> "<Nombre>"
 * Ejemplo:
 *   npm run create-admin -- graas MiClaveSegura123 "Hugo"
 *
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y ADMIN_USER_DOMAIN.
 */
import { createClient } from "@supabase/supabase-js";

const [username, password, name = ""] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const domain = process.env.ADMIN_USER_DOMAIN || "hugograas.com.ar";

if (!username || !password) {
  console.error('Uso: npm run create-admin -- <usuario> <contraseña> "<Nombre>"');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
if (password.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}

const email = username.includes("@") ? username.toLowerCase() : `${username.toLowerCase()}@${domain}`;
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

let userId;
const { data: created, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  // Si ya existe, le actualizamos la contraseña.
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users.find((u) => u.email === email);
  if (!existing) {
    console.error("No se pudo crear el usuario:", error.message);
    process.exit(1);
  }
  userId = existing.id;
  await supabase.auth.admin.updateUserById(userId, { password });
  console.log("El usuario ya existía: se actualizó la contraseña.");
} else {
  userId = created.user.id;
}

const { error: adminError } = await supabase.from("admins").upsert({ user_id: userId, name: name || username });
if (adminError) {
  console.error("No se pudo dar permisos de administrador:", adminError.message);
  process.exit(1);
}

console.log(`✔ Listo. Ingresá en /admin/login con usuario "${username}" (${email}).`);
