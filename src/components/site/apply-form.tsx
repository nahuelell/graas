"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { FileText, LoaderCircle, Paperclip, X } from "lucide-react";
import { sendApplication, type ApplyState } from "@/app/(site)/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const field =
  "w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-base text-char placeholder:text-steel/60 outline-none transition-colors focus:border-brand focus:ring-0 [&>option]:bg-paper [&>option]:text-char";

const TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX = 8 * 1024 * 1024;

const POSITIONS = ["Soldadura y armado", "Pintura y arenado", "Mantenimiento y taller", "Administración y ventas", "Otro puesto"];

const fmtSize = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/** Formulario de postulación con CV (PDF o foto, hasta 8 MB). */
export function ApplyForm({ enabled }: { enabled: boolean }) {
  const [state, action] = useActionState<ApplyState, FormData>(sendApplication, null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (f: File | undefined | null) => {
    setLocalError(null);
    if (!f) return;
    if (!TYPES[f.type]) return setLocalError("El CV tiene que ser PDF o una foto (JPG, PNG o WEBP).");
    if (f.size > MAX) return setLocalError(`El archivo pesa ${fmtSize(f.size)}. El máximo es 8 MB.`);
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    const fd = new FormData(e.currentTarget);
    fd.delete("cv");
    if (enabled) {
      if (!file) return setLocalError("Adjuntá tu CV en PDF o foto.");
      setUploading(true);
      const now = new Date();
      const path = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${TYPES[file.type]}`;
      const { error } = await createBrowserSupabase().storage.from("cvs").upload(path, file, { contentType: file.type, upsert: false });
      setUploading(false);
      if (error) return setLocalError("No pudimos subir el CV. Revisá tu conexión y probá de nuevo.");
      fd.set("cv_path", path);
      fd.set("cv_name", file.name);
      fd.set("cv_type", file.type);
      fd.set("cv_size", String(file.size));
    }
    startTransition(() => action(fd));
  };

  const busy = uploading || pending;
  const error = localError ?? (state && !state.ok ? state.message : null);

  return (
    <div className="relative">
      <AnimatePresence>
        {state?.ok && (
          <motion.div className="absolute inset-0 z-10 flex flex-col justify-center bg-paper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="h-display text-3xl">Postulación enviada</p>
            <p className="mt-3 max-w-sm text-steel">{state.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-steel">Nombre y apellido</span>
            <input name="name" required className={field} autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-sm text-steel">Localidad</span>
            <input name="city" className={field} autoComplete="address-level2" />
          </label>
          <label className="block">
            <span className="text-sm text-steel">Teléfono o WhatsApp</span>
            <input name="phone" type="tel" className={field} autoComplete="tel" />
          </label>
          <label className="block">
            <span className="text-sm text-steel">Email</span>
            <input name="email" type="email" className={field} autoComplete="email" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-steel">Área en la que te gustaría trabajar</span>
          <select name="position" defaultValue="" className={field}>
            <option value="">Elegí una opción</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-steel">Contanos de vos</span>
          <textarea name="message" rows={3} className={field + " resize-none"} placeholder="Experiencia, oficios que manejás, disponibilidad" />
        </label>

        {/* CV */}
        <div>
          <span className="text-sm text-steel">Currículum (PDF o foto, hasta 8 MB)</span>
          <input
            ref={inputRef}
            type="file"
            name="cv"
            accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          {file ? (
            <div className="mt-3 flex items-center gap-4 rounded-[4px] border border-rule px-4 py-3">
              <FileText className="size-5 shrink-0 text-brand" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{file.name}</span>
                <span className="text-sm text-steel">{fmtSize(file.size)}</span>
              </span>
              <button type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }} className="grid size-9 place-items-center rounded-full text-steel hover:text-char" aria-label="Quitar archivo">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-[4px] border border-dashed border-rule px-4 py-6 text-steel transition-colors hover:border-brand hover:text-char"
            >
              <Paperclip className="size-5" />
              Adjuntar CV o arrastrarlo acá
            </button>
          )}
        </div>

        <p className="text-xs leading-relaxed text-steel">
          Al enviar aceptás que guardemos tus datos y tu CV solo para procesos de selección de Carrocerías Graas, según nuestra{" "}
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-brand">política de privacidad</Link>.
        </p>

        {error && <p className="text-sm font-medium text-red-400" role="alert">{error}</p>}

        <button type="submit" disabled={busy} className="btn-yellow disabled:opacity-60">
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          {uploading ? "Subiendo CV" : pending ? "Enviando" : "Enviar postulación"}
        </button>
      </form>
    </div>
  );
}
