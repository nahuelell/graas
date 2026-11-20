import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { WhatsAppIcon } from "@/components/site/icons";
import { JsonLd, businessJsonLd } from "@/components/site/json-ld";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsapp, "Hola Graas, quiero hacer una consulta.");

  return (
    <>
      <JsonLd data={businessJsonLd(settings)} />
      <Header whatsapp={wa} />
      <main>{children}</main>
      <Footer settings={settings} />

      {/* Botón flotante de WhatsApp */}
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition hover:scale-110"
      >
        <span className="absolute inset-0 animate-ring rounded-full bg-wa" />
        <WhatsAppIcon className="relative size-7" />
      </a>
    </>
  );
}
