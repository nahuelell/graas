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

      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid size-13 place-items-center rounded-full bg-wa text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </>
  );
}
