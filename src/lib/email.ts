import "server-only";

/**
 * Envío de emails con Resend (https://resend.com, plan gratuito: 3.000 por mes).
 * Variables: RESEND_API_KEY y RESEND_FROM (ej: "Web Graas <web@hugograas.com.ar>").
 * Si no están configuradas, no se envía nada y el resto sigue funcionando.
 */
export async function sendEmail({ to, subject, html, replyTo }: { to: string; subject: string; html: string; replyTo?: string | null }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return { sent: false, reason: "no-config" as const };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Web Graas <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject,
        html,
        reply_to: replyTo || undefined,
      }),
    });
    if (!res.ok) {
      console.error("Resend:", res.status, await res.text().catch(() => ""));
      return { sent: false, reason: "error" as const };
    }
    return { sent: true as const };
  } catch (e) {
    console.error("Resend:", e);
    return { sent: false, reason: "error" as const };
  }
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Email simple con la identidad Graas: título, filas de datos y un botón. */
export function emailTemplate({ title, rows, message, button }: { title: string; rows: [string, string | null | undefined][]; message?: string | null; button?: { label: string; href: string } }) {
  const tr = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:8px 0;color:#6b6b73;width:130px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;color:#111113;font-weight:600">${esc(v)}</td></tr>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f3f4f4;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#0d0d0f;padding:20px 28px;border-left:6px solid #ffc21a"><span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:1px">GRAAS</span><br><span style="color:#ffc21a;font-size:11px;letter-spacing:3px">CARROCERÍAS</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:20px;color:#111113">${esc(title)}</h1>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e5e5e5">${tr}</table>
${message ? `<p style="margin:20px 0 0;padding:16px;background:#f3f4f4;border-radius:6px;font-size:14px;color:#111113;white-space:pre-line">${esc(message)}</p>` : ""}
${button ? `<p style="margin:24px 0 0"><a href="${esc(button.href)}" style="display:inline-block;background:#ffc21a;color:#111113;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${esc(button.label)}</a></p>` : ""}
</td></tr></table>
<p style="font-size:11px;color:#6b6b73">Aviso automático de la web de Carrocerías Graas.</p>
</td></tr></table></body></html>`;
}
