"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState } from "react";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { sendContact, type ContactState } from "@/app/(site)/actions";
import { CATEGORIES } from "@/lib/catalog";

const field =
  "w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-white placeholder:text-dim outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25";

export function ContactForm({ defaultInterest = "", source = "home" }: { defaultInterest?: string; source?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);

  return (
    <form action={action} className="card relative space-y-4 p-6 sm:p-8">
      <AnimatePresence>
        {state?.ok && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-panel p-8 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CircleCheck className="size-14 text-brand" />
            <p className="mt-4 h-display text-3xl">¡Mensaje enviado!</p>
            <p className="mt-2 text-sm text-muted">{state.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="hidden" name="source" value={source} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Nombre *</span>
          <input name="name" required className={field} placeholder="Tu nombre" autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Teléfono / WhatsApp</span>
          <input name="phone" type="tel" className={field} placeholder="343 ..." autoComplete="tel" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">Email</span>
        <input name="email" type="email" className={field} placeholder="tu@email.com" autoComplete="email" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">¿Qué necesitás?</span>
        <select name="interest" defaultValue={defaultInterest} className={field}>
          <option value="">Elegí una opción</option>
          {CATEGORIES.filter((c) => c.slug !== "otras").map((c) => (
            <option key={c.slug} value={`Carrocería ${c.name}`}>Carrocería {c.name.toLowerCase()}</option>
          ))}
          <option value="Usado">Una unidad usada</option>
          <option value="Reparación / service">Reparación o service</option>
          <option value="Arenado y pintura">Arenado y pintura</option>
          {defaultInterest && !defaultInterest.startsWith("Carrocería ") && <option value={defaultInterest}>{defaultInterest}</option>}
          <option value="Otro">Otro</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">Mensaje</span>
        <textarea name="message" rows={4} className={field} placeholder="Marca y modelo del chasis, medidas, uso..." />
      </label>

      {state && !state.ok && <p className="text-sm font-semibold text-red-400">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-brand w-full py-4 disabled:opacity-60">
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {pending ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
