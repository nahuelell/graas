import type { MediaAsset } from "./types";

/**
 * Devuelve la URL optimizada de una imagen.
 * - Imágenes de Cloudinary: agrega formato/calidad automáticos y ancho.
 * - Imágenes locales (/demo/...): las devuelve tal cual.
 */
export function mediaUrl(asset: Pick<MediaAsset, "url"> | null | undefined, width?: number) {
  if (!asset?.url) return "";
  const url = asset.url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const t = ["f_auto", "q_auto", width ? `w_${width}` : null, "c_limit"].filter(Boolean).join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}
