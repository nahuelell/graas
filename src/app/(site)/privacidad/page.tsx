import type { Metadata } from "next";
import { JsonLd } from "@/components/site/json-ld";
import { LegalPage } from "@/components/site/legal";
import { getSettings } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata Carrocerías Graas los datos personales que nos dejás en el sitio.",
  alternates: { canonical: "/privacidad" },
};

export default async function PrivacidadPage() {
  const s = await getSettings();
  const empresa = s.legal_name || s.company_name;
  const mail = s.email ? <a href={`mailto:${s.email}`}>{s.email}</a> : "nuestros canales de contacto";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Política de privacidad", path: "/privacidad" }])} />
      <LegalPage title={["Política de", "privacidad"]} updated="noviembre de 2026">
        <section>
          <h2>Responsable de los datos</h2>
          <p>
            {empresa}, con domicilio en {s.address}, {s.city}, es responsable de los datos personales que se recogen en este sitio,
            conforme a la Ley 25.326 de Protección de Datos Personales.
          </p>
        </section>
        <section>
          <h2>Qué datos recogemos</h2>
          <ul>
            <li>Los que completás en el formulario de contacto: nombre, teléfono, email, el tipo de consulta y tu mensaje.</li>
            <li>Los que enviás en «Trabajá con nosotros»: nombre, localidad, teléfono, email, área de interés, tu mensaje y tu currículum.</li>
            <li>Datos técnicos de navegación (por ejemplo, páginas visitadas), solo si está activa la medición de visitas.</li>
          </ul>
        </section>
        <section>
          <h2>Para qué los usamos</h2>
          <p>
            Usamos tus datos únicamente para responder tu consulta, enviarte presupuestos y hacer el seguimiento comercial que pediste.
            Los currículums se usan solo para procesos de selección de personal de la empresa y se guardan con acceso restringido.
            No los vendemos ni los cedemos a terceros con fines publicitarios.
          </p>
        </section>
        <section>
          <h2>Dónde se guardan</h2>
          <p>
            Las consultas se almacenan en servicios de infraestructura en la nube contratados por la empresa, con acceso restringido
            al personal autorizado. Las conservamos mientras sean necesarias para la relación comercial.
          </p>
        </section>
        <section>
          <h2>Cookies y medición</h2>
          <p>
            El sitio no usa cookies publicitarias. Si está activa la medición de visitas (Google Analytics), se usan cookies para
            contar visitas de forma agregada. Podés bloquearlas desde la configuración de tu navegador.
          </p>
        </section>
        <section>
          <h2>Tus derechos</h2>
          <p>
            Podés pedir acceso, rectificación, actualización o eliminación de tus datos en cualquier momento escribiendo a {mail}.
            Respondemos en los plazos que fija la Ley 25.326.
          </p>
          <p>
            La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución
            de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de
            datos personales.
          </p>
        </section>
      </LegalPage>
    </>
  );
}
