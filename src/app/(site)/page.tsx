import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Fuel, Layers, Mail, MapPin, Phone, SprayCan, Wrench, Zap, Gauge } from "lucide-react";
import { ProductCard, SectionHeading, TrabajoCard, UsadoCard } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { Hero } from "@/components/site/hero";
import { WhatsAppIcon } from "@/components/site/icons";
import { Intro, IntroGate } from "@/components/site/intro";
import { Marquee } from "@/components/site/marquee";
import { Reveal } from "@/components/site/reveal";
import { ThermalCta, ThermalFeatures, ThermalUses } from "@/components/site/thermal-showcase";
import { Stats } from "@/components/site/stats";
import { SERVICES } from "@/lib/catalog";
import { getProducts, getSettings, getTrabajos, getUsados } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/utils";

const SERVICE_ICONS = { wrench: Wrench, spray: SprayCan, laser: Zap, fold: Layers, suspension: Gauge, tank: Fuel } as const;

export default async function HomePage() {
  const [settings, products, usados, trabajos] = await Promise.all([getSettings(), getProducts(), getUsados(), getTrabajos()]);
  const thermal = products.filter((p) => p.category === "termicas");
  const others = products.filter((p) => p.category !== "termicas");
  const waThermal = whatsappLink(settings.whatsapp, "Hola Graas, quiero cotizar un furgón térmico.");
  const latestUsados = usados.filter((u) => u.status !== "vendido").slice(0, 3);
  const wa = whatsappLink(settings.whatsapp, "Hola Graas, quiero cotizar un furgón térmico.");
  const mapQuery = encodeURIComponent(settings.maps_query || `${settings.address}, ${settings.city}`);

  return (
    <>
      <IntroGate />
      <Intro />
      <Hero
        kicker={settings.hero_kicker || "Carrocerías térmicas · Crespo, Entre Ríos"}
        subtitle={settings.hero_subtitle || ""}
        video={settings.hero_video}
        image={settings.hero_image}
        whatsapp={wa}
      />
      <Marquee />
      <Stats />

      {/* ── Térmicos (foco) ───────────────────────── */}
      <ThermalFeatures showLink />
      <ThermalUses />
      {thermal.length > 0 && (
        <section className="py-24 sm:py-28">
          <div className="container-x">
            <SectionHeading kicker="Modelos térmicos" lines={["Elegí tu", "furgón térmico"]} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {thermal.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <ThermalCta whatsapp={waThermal} />

      {/* ── También fabricamos ──────────────────────── */}
      {others.length > 0 && (
        <section id="carrocerias" className="py-24 sm:py-32">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SectionHeading kicker="También fabricamos" lines={["Carrocerías", "metálicas"]} />
              <Reveal>
                <Link href="/carrocerias" className="btn-ghost group">
                  Ver catálogo completo <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {others.slice(0, 4).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Servicios ───────────────────────────────── */}
      <section id="servicios" className="relative border-y border-line bg-ink-2 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              kicker="Además de fabricar"
              lines={["Todo para", "tu unidad,", "en un lugar."]}
              text="Taller propio con equipamiento pesado en el Parque Industrial de Crespo, sobre la Ruta Nacional 12."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.icon];
              return (
                <Reveal key={s.title} delay={(i % 2) * 0.08}>
                  <div className="group card h-full p-7 transition duration-500 hover:border-brand/60 hover:bg-panel-2">
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition duration-500 group-hover:rotate-6 group-hover:bg-brand group-hover:text-ink">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-6 text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trabajos entregados ─────────────────────── */}
      {trabajos.length > 0 && (
        <section id="trabajos" className="overflow-hidden py-24 sm:py-32">
          <div className="container-x flex flex-wrap items-end justify-between gap-8">
            <SectionHeading kicker="Trabajos reales" lines={["Unidades", "entregadas"]} />
            <Link href="/trabajos" className="btn-ghost group">
              Ver todos <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [scrollbar-width:none]">
            {trabajos.slice(0, 8).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.06} className="shrink-0 snap-start">
                <TrabajoCard trabajo={t} className="aspect-[4/5] w-[78vw] sm:w-[22rem]" />
              </Reveal>
            ))}
          </div>
          {settings.instagram && (
            <div className="container-x mt-6">
              <a href={settings.instagram} target="_blank" rel="noopener" className="text-sm font-bold text-brand hover:underline">
                Seguinos en Instagram @carrocerias.graas ›
              </a>
            </div>
          )}
        </section>
      )}

      {/* ── Usados ─────────────────────────────────── */}
      <section className="bg-brand py-20 text-ink">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase">Oportunidades</p>
              <h2 className="h-display mt-3 text-5xl sm:text-7xl">¿Buscás un usado?</h2>
              <p className="mt-3 max-w-xl font-medium text-ink/70">Carrocerías usadas y tomadas en parte de pago, revisadas por nosotros.</p>
            </div>
            <Link href="/usados" className="btn bg-ink text-brand hover:bg-white hover:text-ink">
              Ver todos los usados <ArrowRight className="size-4" />
            </Link>
          </div>
          {latestUsados.length > 0 && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestUsados.map((u, i) => (
                <Reveal key={u.id} delay={i * 0.08} className="h-full text-white">
                  <UsadoCard usado={u} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Nosotros ───────────────────────────────── */}
      <section id="nosotros" className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
              <Image src="/demo/taller.jpg" alt="Soldadura en el taller de Carrocerías Graas" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-brand px-7 py-5 text-ink shadow-2xl sm:-right-8">
              <p className="font-display text-5xl">1985</p>
              <p className="text-xs font-bold tracking-widest uppercase">Empresa familiar</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading kicker="Nosotros" lines={["Una familia", "de metalúrgicos"]} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted">{settings.about}</p>
            </Reveal>
            <ol className="mt-10 space-y-6 border-l border-line pl-8">
              {[
                ["1985", "Nace como Metalúrgica Santa María en Crespo."],
                ["1994", "Nos mudamos al Parque Industrial, sobre la Ruta 12."],
                ["Hoy", "Fabricamos, reparamos y homologamos para toda la región."],
              ].map(([y, t], i) => (
                <Reveal key={y} as="li" delay={i * 0.1} className="relative">
                  <span className="absolute -left-[2.45rem] top-1 size-3 rounded-full bg-brand ring-4 ring-ink" />
                  <p className="font-display text-2xl text-brand">{y}</p>
                  <p className="text-sm text-white/80">{t}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Contacto ───────────────────────────────── */}
      <section id="contacto" className="border-t border-line bg-ink-2 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Contacto" lines={["Hablemos de tu", "próxima unidad."]} />
            <ul className="mt-10 space-y-5">
              {settings.whatsapp && (
                <li>
                  <a href={wa} target="_blank" rel="noopener" className="group flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-wa/15 text-wa"><WhatsAppIcon className="size-5" /></span>
                    <span><span className="block text-xs text-dim">WhatsApp</span><span className="font-semibold group-hover:text-brand">Escribinos ahora</span></span>
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={telLink(settings.phone)} className="group flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand"><Phone className="size-5" /></span>
                    <span><span className="block text-xs text-dim">Teléfono</span><span className="font-semibold group-hover:text-brand">{settings.phone}</span></span>
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="group flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand"><Mail className="size-5" /></span>
                    <span><span className="block text-xs text-dim">Email</span><span className="font-semibold group-hover:text-brand">{settings.email}</span></span>
                  </a>
                </li>
              )}
              <li className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand"><MapPin className="size-5" /></span>
                <span><span className="block text-xs text-dim">Dirección</span><span className="font-semibold">{settings.address}, {settings.city}</span></span>
              </li>
              {settings.hours && (
                <li className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand"><Clock className="size-5" /></span>
                  <span><span className="block text-xs text-dim">Horario</span><span className="font-semibold">{settings.hours}</span></span>
                </li>
              )}
            </ul>
            <div className="mt-10 overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Ubicación de Carrocerías Graas"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-72 w-full grayscale invert-[0.92] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-bold text-brand hover:underline">
              Cómo llegar ›
            </a>
          </div>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
