"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { sendContact, type ContactState } from "@/app/(site)/actions";
import { CATEGORIES } from "@/lib/catalog";

const field =
  "w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-base text-char placeholder:text-steel/60 outline-none transition-colors focus:border-char focus:ring-0";

export function ContactForm({ defaultInterest = "", source = "home" }: { defaultInterest?: string; source?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);

  return (
    <div className="relative">
      <AnimatePresence>
        {state?.ok && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col justify-center bg-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="h-display text-3xl">Consulta enviada</p>
            <p className="mt-3 max-w-sm text-steel">{state.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={action} className="space-y-6">
        <input type="hidden" name="source" value={source} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-steel">Nombre</span>
            <input name="name" required className={field} autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-sm text-steel">Teléfono o WhatsApp</span>
            <input name="phone" type="tel" className={field} autoComplete="tel" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-steel">Email</span>
          <input name="email" type="email" className={field} autoComplete="email" />
        </label>
        <label className="block">
          <span className="text-sm text-steel">Qué necesitás</span>
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
          <span className="text-sm text-steel">Mensaje</span>
          <textarea name="message" rows={3} className={field + " resize-none"} placeholder="Marca y modelo del chasis, medidas, uso" />
        </label>

        {state && !state.ok && <p className="text-sm font-medium text-red-400">{state.message}</p>}

        <p className="text-xs leading-relaxed text-steel">
          Al enviar aceptás que usemos tus datos solo para responder tu consulta, según nuestra{" "}
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-brand">política de privacidad</Link>.
        </p>

        <button type="submit" disabled={pending} className="btn-dark disabled:opacity-60">
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {pending ? "Enviando" : "Enviar consulta"}
        </button>
      </form>
    </div>
  );
}
