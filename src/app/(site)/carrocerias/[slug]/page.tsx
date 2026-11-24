import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DetailView } from "@/components/site/detail";
import { JsonLd } from "@/components/site/json-ld";
import { getCategory } from "@/lib/catalog";
import { config } from "@/lib/config";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { mediaUrl } from "@/lib/cloudinary";
import { whatsappLink } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "furgon-termico" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Carrocería no encontrada" };
  const title = p.seo_title || `Carrocería ${p.title} a medida en Entre Ríos`;
  const description = p.seo_description || p.summary || `Carrocería ${p.title} fabricada a medida en Crespo, Entre Ríos.`;
  const image = p.images[0] ? mediaUrl(p.images[0], 1200) : "/demo/truck.jpg";
  return {
    title,
    description,
    alternates: { canonical: `/carrocerias/${p.slug}` },
    openGraph: { title, description, images: [{ url: image }] },
  };
}

async function ProductDetail({ params }: Params) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p) notFound();
  const cat = getCategory(p.category);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Carrocería ${p.title}`,
          description: p.summary ?? undefined,
          category: cat.name,
          image: p.images.map((i) => mediaUrl(i, 1200)).map((u) => (u.startsWith("http") ? u : config.siteUrl + u)),
          brand: { "@type": "Brand", name: "Graas" },
          manufacturer: { "@id": `${config.siteUrl}/#business` },
          url: `${config.siteUrl}/carrocerias/${p.slug}`,
        }}
      />
      <DetailView
        back={{ href: "/carrocerias", label: "Todas las carrocerías" }}
        category={p.category}
        title={p.title}
        summary={p.summary}
        description={p.description}
        specs={p.specs}
        images={p.images}
        whatsapp={whatsappLink(settings.whatsapp, `Hola Graas, quiero presupuesto por una carrocería ${p.title}.`)}
        interest={`Carrocería ${cat.name}`}
        source={`carroceria:${p.slug}`}
      />
    </>
  );
}

export default function Page(props: Params) {
  return (
    <Suspense fallback={<div className="container-x min-h-screen pt-40 text-steel">Cargando…</div>}>
      <ProductDetail {...props} />
    </Suspense>
  );
}
