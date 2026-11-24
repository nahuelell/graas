import Image from "next/image";
import Link from "next/link";
import { ProductCard, SectionHeading, TrabajoCard, UsadoCard } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { Hero } from "@/components/site/hero";
import { Intro, IntroGate } from "@/components/site/intro";
import { Reveal, RevealImage, RevealLines } from "@/components/site/reveal";
import { ThermalSplit } from "@/components/site/thermal-showcase";
import { SERVICES } from "@/lib/catalog";
import { getProducts, getSettings, getTrabajos, getUsados } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/utils";

export default async function HomePage() {
  const [settings, products, usados, trabajos] = await Promise.all([getSettings(), getProducts(), getUsados(), getTrabajos()]);
  // Térmicos primero, después el resto (respetando destacados y orden del panel)
  const sorted = [...products].sort((x, y) => Number(y.category === "termicas") - Number(x.category === "termicas"));
  const featured = (sorted.some((p) => p.featured) ? sorted.filter((p) => p.featured) : sorted).slice(0, 3);
  const thermalImage =
    products.find((p) => p.category === "termicas" && p.images.length)?.images[0] ?? settings.hero_images[0] ?? null;
  const latestUsados = usados.filter((u) => u.status !== "vendido").slice(0, 3);
  const wa = whatsappLink(settings.whatsapp, "Hola Graas, quiero pedir un presupuesto.");
  const waThermal = whatsappLink(settings.whatsapp, "Hola Graas, quiero cotizar un furgón térmico.");
  const mapQuery = encodeURIComponent(settings.maps_query || `${settings.address}, ${settings.city}`);

  return (
    <>
      <IntroGate />
      <Intro />
      <Hero
        title={settings.hero_title || "Carrocerías\nhechas para\ntrabajar"}
        kicker={settings.hero_kicker || ""}
        subtitle={settings.hero_subtitle || ""}
        images={settings.hero_images}
        whatsapp={wa}
      />

      {/* Presentación */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-24">
          <Reveal>
            <p className="text-2xl font-medium leading-snug sm:text-[2rem] sm:leading-[1.3]">
              Desde 1985 fabricamos carrocerías a medida en el Parque Industrial de Crespo. Furgones térmicos, carrocerías metálicas y reparaciones, con taller propio y trato directo.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="border-t border-rule">
              {[
                ["Fábrica", "Parque Industrial de Crespo, Ruta 12"],
                ["Trayectoria", "Empresa familiar desde 1985"],
                ["Entrega", "Homologadas y certificadas"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-rule py-4">
                  <dt className="text-steel">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Carrocerías */}
      <section id="carrocerias" className="pb-24 sm:pb-32">
        <div className="container-x">
          <SectionHeading title={["Carrocerías"]} action={<Link href="/carrocerias" className="link-line">Ver el catálogo</Link>} />
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <ThermalSplit image={thermalImage} whatsapp={waThermal} />

      {/* Taller y servicios */}
      <section id="taller" className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeading title={["Taller", "y servicios"]} text="Además de fabricar, reparamos y preparamos unidades en nuestro taller." />
          <ul className="border-t border-rule">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 0.04} className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
                <span className="text-lg font-semibold">{s.title}</span>
                <span className="leading-relaxed text-steel">{s.text}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Trabajos entregados */}
      {trabajos.length > 0 && (
        <section className="overflow-hidden bg-surface py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading title={["Unidades entregadas"]} action={<Link href="/trabajos" className="link-line">Ver todas</Link>} />
          </div>
          <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none]" style={{ paddingInline: "max(1.25rem, calc((100vw - 84rem) / 2 + 3rem))", scrollPaddingInline: "max(1.25rem, calc((100vw - 84rem) / 2 + 3rem))" }}>
            {trabajos.slice(0, 8).map((t) => (
              <TrabajoCard key={t.id} trabajo={t} className="w-[75vw] shrink-0 snap-start sm:w-[20rem]" />
            ))}
          </div>
        </section>
      )}

      {/* Usados */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            title={["Usados"]}
            text="Unidades usadas y tomadas en parte de pago, revisadas en nuestro taller."
            action={<Link href="/usados" className="link-line">Ver todos los usados</Link>}
          />
          {latestUsados.length > 0 ? (
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {latestUsados.map((u) => (
                <UsadoCard key={u.id} usado={u} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-steel">Ahora no hay unidades usadas publicadas. Escribinos y te avisamos cuando ingrese una.</p>
          )}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-surface py-24 sm:py-32">
        <div className="container-x grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <RevealImage className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-paper-2">
            <Image src="/demo/taller.jpg" alt="Soldadura en el taller de Carrocerías Graas" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </RevealImage>
          <div className="lg:pt-10">
            <h2 className="h-display text-3xl sm:text-4xl lg:text-[2.9rem]">
              <RevealLines lines={["Una empresa", "familiar"]} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-steel">{settings.about}</p>
            </Reveal>
            <ol className="mt-12 border-t border-rule">
              {[
                ["1985", "Nace como Metalúrgica Santa María, en Crespo."],
                ["1994", "Nos mudamos al Parque Industrial, sobre la Ruta 12."],
                ["Hoy", "Fabricamos, reparamos y homologamos para toda la región."],
              ].map(([y, t], i) => (
                <Reveal key={y} as="li" delay={i * 0.08} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-rule py-4">
                  <span className="wide font-bold">{y}</span>
                  <span className="text-steel">{t}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <h2 className="h-display text-3xl sm:text-4xl lg:text-[2.9rem]">
              <RevealLines lines={["Hablemos de", "tu próxima unidad"]} />
            </h2>
            <Reveal delay={0.15}>
              <dl className="mt-10 border-t border-rule">
                {[
                  settings.whatsapp && ["WhatsApp", <a key="wa" href={wa} target="_blank" rel="noopener" className="hover:underline">Escribinos</a>],
                  settings.phone && ["Teléfono", <a key="tel" href={telLink(settings.phone)} className="hover:underline">{settings.phone}</a>],
                  settings.email && ["Email", <a key="mail" href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>],
                  ["Dirección", `${settings.address}, ${settings.city}`],
                  settings.hours && ["Horario", settings.hours],
                ]
                  .filter(Boolean)
                  .map((row) => {
                    const [k, v] = row as [string, React.ReactNode];
                    return (
                      <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-rule py-4">
                        <dt className="text-steel">{k}</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    );
                  })}
              </dl>
              <div className="mt-8 overflow-hidden rounded-[4px] bg-paper-2">
                <iframe
                  title="Ubicación de Carrocerías Graas"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-64 w-full grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noopener" className="link-line mt-5 text-sm">
                Cómo llegar
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:pt-4">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
