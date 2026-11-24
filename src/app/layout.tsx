import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@/components/analytics";
import { config } from "@/lib/config";
import { ogImage } from "@/lib/seo";
import "./globals.css";

const saira = localFont({
  src: "../fonts/Saira-Variable.ttf",
  variable: "--font-saira",
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
  authors: [{ name: "Carrocerías Graas" }],
  creator: "Lell Digital",
  publisher: "Hugo Graas e Hijos S.R.L.",
  category: "Carrocerías para camiones",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Carrocerías Graas",
    title: "Carrocerías Graas | Carrocerías y furgones térmicos en Crespo, Entre Ríos",
    description: "Fábrica de carrocerías desde 1985. Furgones térmicos y carrocerías metálicas a medida de tu chasis.",
    images: [ogImage("Carrocerías hechas para trabajar")],
  },
  twitter: { card: "summary_large_image", images: [ogImage("Carrocerías hechas para trabajar").url] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: true, address: true, email: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0d0d0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={saira.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
