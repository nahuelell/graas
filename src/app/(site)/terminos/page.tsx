import type { Metadata } from "next";
import { JsonLd } from "@/components/site/json-ld";
import { LegalPage } from "@/components/site/legal";
import { getSettings } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bases y condiciones",
  description: "Bases y condiciones de uso del sitio de Carrocerías Graas.",
  alternates: { canonical: "/terminos" },
};

export default async function TerminosPage() {
  const s = await getSettings();
  const empresa = s.legal_name || s.company_name;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Bases y condiciones", path: "/terminos" }])} />
      <LegalPage title={["Bases y", "condiciones"]} updated="noviembre de 2026">
        <section>
          <h2>1. Quiénes somos</h2>
          <p>
            Este sitio pertenece a {empresa} («Carrocerías Graas»), con domicilio en {s.address}, {s.city}, República Argentina.
            Al navegarlo y usar sus formularios aceptás estas bases y condiciones.
          </p>
        </section>
        <section>
          <h2>2. Información publicada</h2>
          <p>
            Las descripciones, medidas, fotos y características de carrocerías, furgones térmicos y unidades usadas son orientativas.
            Las fotos pueden mostrar unidades fabricadas para otros clientes o accesorios no incluidos. Las especificaciones finales
            se definen en cada presupuesto.
          </p>
        </section>
        <section>
          <h2>3. Precios y presupuestos</h2>
          <p>
            Los precios publicados, cuando los hay, están expresados en pesos argentinos, son informativos y pueden cambiar sin aviso.
            Una consulta por el sitio o por WhatsApp no constituye una oferta ni una reserva. Un presupuesto solo es válido cuando
            lo emitimos por escrito, por el plazo que figure en él.
          </p>
        </section>
        <section>
          <h2>4. Unidades usadas</h2>
          <p>
            Las unidades usadas se venden en el estado en que se encuentran y están sujetas a disponibilidad. Recomendamos verlas en
            persona antes de concretar la compra. El estado «Disponible», «Reservado» o «Vendido» se actualiza manualmente y puede
            no reflejar cambios recientes.
          </p>
        </section>
        <section>
          <h2>5. Propiedad intelectual</h2>
          <p>
            Las marcas, logos, textos, fotos y diseños del sitio pertenecen a {empresa} o se usan con autorización. No pueden copiarse
            ni usarse con fines comerciales sin permiso por escrito.
          </p>
        </section>
        <section>
          <h2>6. Enlaces a servicios de terceros</h2>
          <p>
            El sitio incluye enlaces y contenidos de terceros, como WhatsApp, Google Maps, Instagram y Facebook. Su uso se rige por
            las condiciones de cada servicio.
          </p>
        </section>
        <section>
          <h2>7. Responsabilidad</h2>
          <p>
            Trabajamos para que la información esté actualizada y el sitio funcione correctamente, pero no garantizamos que esté
            libre de errores o interrupciones. No somos responsables por decisiones tomadas solo en base a la información publicada
            sin confirmarla con nosotros.
          </p>
        </section>
        <section>
          <h2>8. Cambios</h2>
          <p>Podemos modificar estas bases y condiciones en cualquier momento. La versión vigente es la publicada en esta página.</p>
        </section>
        <section>
          <h2>9. Ley aplicable</h2>
          <p>
            Estas condiciones se rigen por las leyes de la República Argentina. Para consumidores, rige la Ley 24.240 de Defensa del
            Consumidor y la jurisdicción que ella establece.
          </p>
        </section>
        <section>
          <h2>10. Contacto</h2>
          <p>
            Por cualquier consulta sobre estas condiciones escribinos a{" "}
            {s.email ? <a href={`mailto:${s.email}`}>{s.email}</a> : "nuestros canales de contacto"}.
          </p>
        </section>
      </LegalPage>
    </>
  );
}
