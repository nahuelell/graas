import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusBadge } from "@/components/site/blocks";
import { DetailView } from "@/components/site/detail";
import { JsonLd } from "@/components/site/json-ld";
import { config } from "@/lib/config";
import { getSettings, getUsado, getUsados } from "@/lib/data";
import { mediaUrl } from "@/lib/cloudinary";
import { formatPrice, whatsappLink } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const usados = await getUsados();
  return usados.length ? usados.map((u) => ({ slug: u.slug })) : [{ slug: "sin-unidades" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const u = await getUsado(slug);
  if (!u) return { title: "Unidad no encontrada" };
  const title = `${u.title} usada`;
  const description = u.summary || `${u.title} usada, revisada por Carrocerías Graas en Crespo, Entre Ríos.`;
  return {
    title,
    description,
    alternates: { canonical: `/usados/${u.slug}` },
    openGraph: { title, description, images: u.images[0] ? [{ url: mediaUrl(u.images[0], 1200) }] : undefined },
  };
}

async function UsadoDetail({ params }: Params) {
  const { slug } = await params;
  const [u, settings] = await Promise.all([getUsado(slug), getSettings()]);
  if (!u) notFound();
  const price = u.show_price ? formatPrice(u.price) : null;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: u.title,
          description: u.summary ?? undefined,
          itemCondition: "https://schema.org/UsedCondition",
          image: u.images.map((i) => mediaUrl(i, 1200)).map((x) => (x.startsWith("http") ? x : config.siteUrl + x)),
          url: `${config.siteUrl}/usados/${u.slug}`,
          offers:
            u.show_price && u.price
              ? {
                  "@type": "Offer",
                  price: u.price,
                  priceCurrency: "ARS",
                  availability: u.status === "disponible" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                }
              : undefined,
        }}
      />
      <DetailView
        back={{ href: "/usados", label: "Todos los usados" }}
        category={u.category}
        title={u.title}
        badge={<StatusBadge status={u.status} />}
        price={price}
        summary={u.summary}
        description={u.description}
        specs={[...(u.year ? [{ label: "Año", value: String(u.year) }] : []), ...u.specs]}
        images={u.images}
        whatsapp={whatsappLink(settings.whatsapp, `Hola Graas, me interesa el usado: ${u.title}.`)}
        interest="Usado"
        source={`usado:${u.slug}`}
      />
    </>
  );
}

export default function Page(props: Params) {
  return (
    <Suspense fallback={<div className="container-x min-h-screen pt-40 text-muted">Cargando…</div>}>
      <UsadoDetail {...props} />
    </Suspense>
  );
}
