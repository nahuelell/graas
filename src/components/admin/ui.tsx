"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert, CircleCheck, LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-dim outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-dim">{hint}</span>}
    </label>
  );
}

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-ink p-4 transition hover:border-white/20">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-panel-2 transition peer-checked:bg-brand after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-dim">{hint}</span>}
      </span>
    </label>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="text-base font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-dim">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function SubmitButton({ children = "Guardar", className }: { children?: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("btn-brand py-3.5 disabled:opacity-60", className)}>
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
      {pending ? "Guardando..." : children}
    </button>
  );
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
  return (
    <AnimatePresence>
      {state && (
        <motion.p
          key={state.message}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
            state.ok ? "bg-wa/15 text-wa" : "bg-red-500/15 text-red-300",
          )}
        >
          {state.ok ? <CircleCheck className="size-4" /> : <CircleAlert className="size-4" />}
          {state.message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="h-display text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
