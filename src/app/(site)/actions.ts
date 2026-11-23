"use server";

import { isSupabaseConfigured } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/public";

export type ContactState = { ok: boolean; message: string } | null;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Campo trampa anti-spam: los humanos no lo ven, los bots lo completan.
  if (String(formData.get("website") ?? "").length > 0) return { ok: true, message: "¡Gracias! Te respondemos a la brevedad." };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = String(formData.get("source") ?? "web").slice(0, 120);

  if (name.length < 2) return { ok: false, message: "Ingresá tu nombre." };
  if (!phone && !email) return { ok: false, message: "Dejanos un teléfono o un email para responderte." };
  if (message.length > 3000) return { ok: false, message: "El mensaje es demasiado largo." };

  if (!isSupabaseConfigured) {
    return { ok: true, message: "¡Gracias! (Modo demo: la consulta no se guardó porque falta configurar la base de datos.)" };
  }

  const { error } = await createPublicClient()
    .from("leads")
    .insert({ name, phone: phone || null, email: email || null, interest: interest || null, message: message || null, source });

  if (error) return { ok: false, message: "No pudimos enviar la consulta. Probá por WhatsApp." };
  return { ok: true, message: "¡Gracias! Recibimos tu consulta y te respondemos a la brevedad." };
}
