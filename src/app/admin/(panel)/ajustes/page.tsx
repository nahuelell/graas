import { SettingsForm } from "@/components/admin/forms";
import { PageTitle } from "@/components/admin/ui";
import { adminSettings } from "@/lib/admin-data";

export default async function AjustesPage() {
  const settings = await adminSettings();
  return (
    <>
      <PageTitle title="Ajustes del sitio" description="Video e imagen de portada, textos, teléfonos y redes." />
      <SettingsForm settings={settings} />
    </>
  );
}
