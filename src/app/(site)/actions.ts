"use server";

import { config, isSupabaseConfigured } from "@/lib/config";
import { getSettings } from "@/lib/data";
import { emailTemplate, sendEmail } from "@/lib/email";
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

  const settings = await getSettings();
  if (settings.notify_email) {
    await sendEmail({
      to: settings.notify_email,
      replyTo: email || null,
      subject: `Nueva consulta web: ${name}${interest ? ` (${interest})` : ""}`,
      html: emailTemplate({
        title: "Nueva consulta desde la web",
        rows: [["Nombre", name], ["Teléfono", phone], ["Email", email], ["Interés", interest], ["Desde", source]],
        message,
        button: { label: "Ver en el panel", href: `${config.siteUrl}/admin/consultas` },
      }),
    });
  }
  return { ok: true, message: "¡Gracias! Recibimos tu consulta y te respondemos a la brevedad." };
}

// ── Trabajá con nosotros ─────────────────────────────────────────────────────
export type ApplyState = { ok: boolean; message: string } | null;

const CV_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const CV_MAX = 8 * 1024 * 1024;

/**
 * Recibe la postulación. El CV ya fue subido por el navegador al bucket privado "cvs"
 * (así no pasa por el servidor, que en Vercel limita los envíos a 4,5 MB); acá llega solo su ruta.
 */
export async function sendApplication(_prev: ApplyState, f: FormData): Promise<ApplyState> {
  if (String(f.get("website") ?? "").length > 0) return { ok: true, message: "¡Gracias por postularte!" };

  const name = String(f.get("name") ?? "").trim();
  const phone = String(f.get("phone") ?? "").trim();
  const email = String(f.get("email") ?? "").trim();
  const city = String(f.get("city") ?? "").trim();
  const position = String(f.get("position") ?? "").trim();
  const message = String(f.get("message") ?? "").trim().slice(0, 3000);
  const cvPath = String(f.get("cv_path") ?? "").trim();
  const cvName = String(f.get("cv_name") ?? "").trim().slice(0, 200);
  const cvType = String(f.get("cv_type") ?? "").trim();
  const cvSize = Number(f.get("cv_size") ?? 0);

  if (name.length < 2) return { ok: false, message: "Ingresá tu nombre y apellido." };
  if (!phone && !email) return { ok: false, message: "Dejanos un teléfono o un email para contactarte." };
  if (!isSupabaseConfigured) {
    return { ok: true, message: "¡Gracias! (Modo demo: la postulación no se guardó porque falta configurar la base de datos.)" };
  }
  if (!cvPath) return { ok: false, message: "Adjuntá tu CV en PDF o foto." };
  if (!/^\d{4}-\d{2}\/[a-z0-9-]+\.(pdf|jpg|jpeg|png|webp)$/i.test(cvPath)) return { ok: false, message: "El archivo del CV no es válido." };
  if (!CV_TYPES.includes(cvType) || cvSize > CV_MAX) return { ok: false, message: "El CV tiene que ser PDF o imagen de hasta 8 MB." };

  const { error } = await createPublicClient().from("applications").insert({
    name,
    phone: phone || null,
    email: email || null,
    city: city || null,
    position: position || null,
    message: message || null,
    cv_path: cvPath,
    cv_name: cvName || null,
    cv_size: cvSize || null,
    cv_type: cvType,
  });
  if (error) return { ok: false, message: "No pudimos enviar tu postulación. Probá de nuevo en unos minutos." };

  const settings = await getSettings();
  if (settings.notify_email) {
    await sendEmail({
      to: settings.notify_email,
      replyTo: email || null,
      subject: `Nueva postulación: ${name}${position ? ` (${position})` : ""}`,
      html: emailTemplate({
        title: "Nueva postulación en “Trabajá con nosotros”",
        rows: [["Nombre", name], ["Teléfono", phone], ["Email", email], ["Localidad", city], ["Puesto", position], ["CV", cvName]],
        message,
        button: { label: "Ver postulación y descargar CV", href: `${config.siteUrl}/admin/postulaciones` },
      }),
    });
  }
  return { ok: true, message: "Recibimos tu postulación. Si tu perfil coincide con una búsqueda, te vamos a contactar." };
}
