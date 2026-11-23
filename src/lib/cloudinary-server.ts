import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { MediaAsset } from "./types";

const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "graas";

export const cloudinaryServerReady = Boolean(apiKey && apiSecret && cloudName);

if (cloudinaryServerReady) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

/** Firma una subida directa desde el navegador (el secreto nunca sale del servidor). */
export function signUpload(folder: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);
  return { timestamp, signature, folder, apiKey, cloudName };
}

/** Borra de Cloudinary los archivos que ya no se usan. Nunca rompe el guardado si falla. */
export async function destroyAssets(assets: MediaAsset[]) {
  if (!cloudinaryServerReady || assets.length === 0) return;
  await Promise.allSettled(
    assets
      .filter((a) => a.public_id && !a.public_id.startsWith("demo/"))
      .map((a) => cloudinary.uploader.destroy(a.public_id, { resource_type: a.resource_type ?? "image", invalidate: true })),
  );
}
