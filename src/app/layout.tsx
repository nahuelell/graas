import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { config } from "@/lib/config";
import "./globals.css";

const archivo = localFont({
  src: "../fonts/Archivo-Variable.ttf",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Carrocerías Graas | Carrocerías y furgones térmicos en Crespo, Entre Ríos",
    template: "%s | Carrocerías Graas",
  },
  description:
    "Fábrica de carrocerías desde 1985 en el Parque Industrial de Crespo, Entre Ríos. Furgones térmicos, baranda volcable, sider y más, a medida de tu chasis. Usados, reparaciones y service.",
  keywords: [
    "carrocerías Entre Ríos",
    "carrocerías Crespo",
    "furgón térmico",
    "carrocería baranda volcable",
    "carrocería sider",
    "carrocería térmica",
    "furgón isotérmico",
    "furgón térmico Entre Ríos",
    "carrocerías usadas",
    "Graas",
  ],
  applicationName: "Carrocerías Graas",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Carrocerías Graas",
    images: [{ url: "/demo/truck.jpg", width: 684, height: 336, alt: "Carrocerías Graas" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3f4f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
