"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Star, Trash2, Video } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { mediaUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type Uploading = { key: string; name: string; progress: number; error?: string };

const MAX_SIDE = 2400;

/** Achica fotos muy pesadas en el navegador antes de subirlas (más rápido desde el celular). */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.size < 2_500_000) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.86));
  } catch {
    return file;
  }
}

function upload(file: Blob, sign: { timestamp: number; signature: string; folder: string; apiKey: string; cloudName: string }, onProgress: (p: number) => void) {
  return new Promise<MediaAsset>((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sign.apiKey);
    fd.append("timestamp", String(sign.timestamp));
    fd.append("signature", sign.signature);
    fd.append("folder", sign.folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      const r = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ public_id: r.public_id, url: r.secure_url, width: r.width, height: r.height, resource_type: r.resource_type === "video" ? "video" : "image" });
      } else reject(new Error(r?.error?.message || "Error al subir"));
    };
    xhr.onerror = () => reject(new Error("Sin conexión"));
    xhr.send(fd);
  });
}

/**
 * Subidor de imágenes/videos a Cloudinary.
 * Guarda el resultado en un input oculto (JSON) con el nombre indicado, para enviarlo con el formulario.
 */
export function ImageUploader({
  name,
  initial = [],
  folder,
  multiple = true,
  accept = "image/*",
  max = 20,
  label = "Subir fotos",
}: {
  name: string;
  initial?: MediaAsset[];
  folder: "usados" | "catalogo" | "trabajos" | "sitio";
  multiple?: boolean;
  accept?: string;
  max?: number;
  label?: string;
}) {
  const [items, setItems] = useState<MediaAsset[]>(initial);
  const [uploading, setUploading] = useState<Uploading[]>([]);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const list = Array.from(files).slice(0, multiple ? max - items.length : 1);
      if (!list.length) return;
      const res = await fetch("/api/cloudinary/sign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ folder }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "No se pudo autorizar la subida.");
        return;
      }
      const sign = await res.json();
      await Promise.all(
        list.map(async (file) => {
          const key = `${file.name}-${Math.random()}`;
          setUploading((u) => [...u, { key, name: file.name, progress: 0 }]);
          try {
            const blob = await shrink(file);
            const asset = await upload(blob, sign, (p) => setUploading((u) => u.map((x) => (x.key === key ? { ...x, progress: p } : x))));
            setItems((cur) => (multiple ? [...cur, asset] : [asset]));
            setUploading((u) => u.filter((x) => x.key !== key));
          } catch (e) {
            setUploading((u) => u.map((x) => (x.key === key ? { ...x, error: (e as Error).message } : x)));
          }
        }),
      );
    },
    [folder, items.length, max, multiple],
  );

  const move = (i: number, d: number) =>
    setItems((cur) => {
      const next = [...cur];
      const j = i + d;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const makeCover = (i: number) => setItems((cur) => [cur[i], ...cur.filter((_, k) => k !== i)]);
  const remove = (i: number) => setItems((cur) => cur.filter((_, k) => k !== i));
  const isVideo = accept.startsWith("video");

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.public_id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-ink">
            {it.resource_type === "video" ? (
              <video src={it.url} className="h-full w-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(it, 400)} alt="" className="h-full w-full object-cover" />
            )}
            {multiple && i === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[0.6rem] font-bold text-ink uppercase">Portada</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-ink to-transparent p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              {multiple ? (
                <div className="flex gap-1">
                  <IconBtn label="Mover a la izquierda" onClick={() => move(i, -1)}><ArrowLeft className="size-3.5" /></IconBtn>
                  <IconBtn label="Mover a la derecha" onClick={() => move(i, 1)}><ArrowRight className="size-3.5" /></IconBtn>
                  {i > 0 && <IconBtn label="Usar de portada" onClick={() => makeCover(i)}><Star className="size-3.5" /></IconBtn>}
                </div>
              ) : <span />}
              <IconBtn label="Quitar" danger onClick={() => remove(i)}><Trash2 className="size-3.5" /></IconBtn>
            </div>
          </div>
        ))}

        {uploading.map((u) => (
          <div key={u.key} className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-line bg-ink p-3 text-center">
            {u.error ? (
              <p className="text-xs text-red-300">{u.name}: {u.error}</p>
            ) : (
              <>
                <LoaderCircle className="size-6 animate-spin text-brand" />
                <span className="absolute inset-x-0 bottom-0 h-1 bg-brand transition-all" style={{ width: `${Math.round(u.progress * 100)}%` }} />
                <span className="absolute bottom-3 text-xs font-bold text-muted">{Math.round(u.progress * 100)}%</span>
              </>
            )}
          </div>
        ))}

        {(multiple ? items.length < max : items.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-semibold transition",
              drag ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:border-brand hover:text-brand",
            )}
          >
            {isVideo ? <Video className="size-7" /> : <ImagePlus className="size-7" />}
            <span>{label}</span>
            <span className="text-[0.65rem] font-normal text-dim">o arrastrá acá</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {multiple && items.length > 1 && <p className="mt-3 text-xs text-dim">La primera foto es la portada. Usá las flechas o la estrella para reordenar.</p>}
    </div>
  );
}

function IconBtn({ children, label, onClick, danger }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn("grid size-7 place-items-center rounded-lg bg-ink/90 text-white transition", danger ? "hover:bg-red-500" : "hover:bg-brand hover:text-ink")}
    >
      {children}
    </button>
  );
}
