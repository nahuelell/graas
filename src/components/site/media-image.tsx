"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import type { MediaAsset } from "@/lib/types";

function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const t = ["f_auto", `q_${quality ?? "auto"}`, `w_${width}`, "c_limit"].join(",");
  return src.replace("/upload/", `/upload/${t}/`);
}

type Props = Omit<ImageProps, "src" | "alt"> & { asset: MediaAsset; alt?: string };

/** Imagen optimizada: usa el CDN de Cloudinary cuando corresponde y next/image para el resto. */
export function MediaImage({ asset, alt, ...rest }: Props) {
  const isCloudinary = asset.url.includes("res.cloudinary.com") && asset.url.includes("/upload/");
  return (
    <Image
      src={asset.url}
      alt={alt ?? asset.alt ?? ""}
      loader={isCloudinary ? cloudinaryLoader : undefined}
      {...rest}
    />
  );
}
