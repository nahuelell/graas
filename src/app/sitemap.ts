import type { MetadataRoute } from "next";
import { mediaUrl } from "@/lib/cloudinary";
import { getProducts, getUsados } from "@/lib/data";
import { abs } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, usados] = await Promise.all([getProducts(), getUsados()]);
  const imgs = (list: { url: string }[]) => list.slice(0, 10).map((i) => abs(mediaUrl(i, 1600)));
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    { url: abs("/carrocerias"), changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/termicos"), changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/usados"), changeFrequency: "daily", priority: 0.8 },
    { url: abs("/trabajos"), changeFrequency: "weekly", priority: 0.6 },
    { url: abs("/trabaja-con-nosotros"), changeFrequency: "monthly", priority: 0.4 },
    { url: abs("/terminos"), changeFrequency: "yearly", priority: 0.1 },
    { url: abs("/privacidad"), changeFrequency: "yearly", priority: 0.1 },
    ...products.map((p) => ({
      url: abs(`/carrocerias/${p.slug}`),
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: imgs(p.images),
    })),
    ...usados.map((u) => ({
      url: abs(`/usados/${u.slug}`),
      lastModified: u.updated_at,
      changeFrequency: "weekly" as const,
      priority: u.status === "vendido" ? 0.3 : 0.7,
      images: imgs(u.images),
    })),
  ];
}
