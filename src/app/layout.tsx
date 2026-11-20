import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { config } from "@/lib/config";
import "./globals.css";

const anton = localFont({
  src: "../fonts/Anton-Regular.ttf",
  variable: "--font-anton",
  display: "swap",
});

const montserrat = localFont({
  src: "../fonts/Montserrat-Variable.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Carrocerías Graas | Térmicas y metálicas en Crespo, Entre Ríos",
    template: "%s | Carrocerías Graas",
  },
  description:
    "Fábrica de carrocerías desde 1985 en el Parque Industrial de Crespo, Entre Ríos. Térmicas, baranda volcable, sider y tolvas a medida. Usados, reparaciones y servicio de grúa.",
  keywords: [
    "carrocerías Entre Ríos",
    "carrocerías Crespo",
    "furgón térmico",
    "carrocería baranda volcable",
    "carrocería sider",
    "tolva para camión",
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
  themeColor: "#0d0d0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${anton.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
