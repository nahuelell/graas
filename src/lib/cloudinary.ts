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

/** Poster (primer frame en JPG) de un video de Cloudinary. */
export function videoPoster(asset: MediaAsset | null | undefined) {
  if (!asset?.url?.includes("res.cloudinary.com")) return undefined;
  return asset.url.replace("/upload/", "/upload/so_0,f_jpg,q_auto,w_1600/").replace(/\.[a-z0-9]+$/i, ".jpg");
}

export function videoUrl(asset: MediaAsset | null | undefined) {
  if (!asset?.url) return undefined;
  if (!asset.url.includes("res.cloudinary.com")) return asset.url;
  return asset.url.replace("/upload/", "/upload/q_auto,vc_auto,w_1920/");
}
