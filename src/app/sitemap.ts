import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getProducts, getUsados } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, usados] = await Promise.all([getProducts(), getUsados()]);
  const base = config.siteUrl;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/termicos`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/carrocerias`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/usados`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/trabajos`, changeFrequency: "weekly", priority: 0.6 },
    ...products.map((p) => ({ url: `${base}/carrocerias/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...usados.map((u) => ({ url: `${base}/usados/${u.slug}`, lastModified: u.updated_at, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
