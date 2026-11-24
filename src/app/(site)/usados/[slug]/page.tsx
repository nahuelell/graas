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
import { abs, breadcrumbJsonLd, ogImage } from "@/lib/seo";

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
    openGraph: {
      title,
      description,
      url: `/usados/${u.slug}`,
      images: [u.images[0] ? { url: mediaUrl(u.images[0], 1200), alt: u.title } : ogImage(u.title, "Usado revisado en nuestro taller")],
    },
  };
}

async function UsadoDetail({ params }: Params) {
  const { slug } = await params;
  const [u, settings] = await Promise.all([getUsado(slug), getSettings()]);
  if (!u) notFound();
  const price = u.show_price ? formatPrice(u.price) : null;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Usados", path: "/usados" }, { name: u.title, path: `/usados/${u.slug}` }])} />
      {/* Google pide precio para mostrar un producto: solo se publica como Product si el precio está visible */}
      {u.show_price && u.price ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: u.title,
            description: u.summary ?? u.title,
            itemCondition: "https://schema.org/UsedCondition",
            image: u.images.length ? u.images.map((i) => abs(mediaUrl(i, 1200))) : [abs("/brand/logo-graas.png")],
            brand: { "@type": "Brand", name: "Graas" },
            url: `${config.siteUrl}/usados/${u.slug}`,
            offers: {
              "@type": "Offer",
              price: u.price,
              priceCurrency: "ARS",
              itemCondition: "https://schema.org/UsedCondition",
              availability: u.status === "disponible" ? "https://schema.org/InStock" : u.status === "reservado" ? "https://schema.org/LimitedAvailability" : "https://schema.org/SoldOut",
              seller: { "@id": `${config.siteUrl}/#business` },
            },
          }}
        />
      ) : null}
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
    <Suspense fallback={<div className="container-x min-h-screen pt-40 text-steel">Cargando…</div>}>
      <UsadoDetail {...props} />
    </Suspense>
  );
}
