/**
 * Datos de ejemplo. Se usan solo mientras Supabase no esté configurado,
 * para poder ver y presentar el sitio completo desde el primer `npm run dev`.
 */
import type { MediaAsset, Product, Settings, Trabajo, Usado } from "./types";

const img = (name: string, alt: string): MediaAsset => ({
  public_id: `demo/${name}`,
  url: `/demo/${name}.jpg`,
  width: 684,
  height: 608,
  resource_type: "image",
  alt,
});

const now = "2026-11-01T12:00:00.000Z";
const base = { featured: false, published: true, created_at: now, updated_at: now, seo_title: null, seo_description: null };

export const demoSettings: Settings = {
  id: 1,
  company_name: "Carrocerías Graas",
  legal_name: "Hugo Graas e Hijos S.R.L.",
  phone: "343 495-0909",
  whatsapp: "5493434157700",
  email: "contacto@hugograas.com.ar",
  address: "Santiago Eichhorn 235, Parque Industrial",
  city: "Crespo, Entre Ríos (3116)",
  hours: "Lunes a viernes de 7 a 17 h",
  instagram: "https://www.instagram.com/carrocerias.graas/",
  facebook: "https://www.facebook.com/carroceriasgraas/",
  maps_query: "Carrocerías Graas, Santiago Eichhorn 235, Crespo, Entre Ríos",
  hero_kicker: "Carrocerías térmicas · Crespo, Entre Ríos",
  hero_subtitle:
    "Diseñamos y fabricamos furgones isotérmicos para alimentos, lácteos y carga refrigerada. A medida de tu chasis, homologados y con service en nuestro taller.",
  hero_video: null,
  hero_image: null,
  about:
    'Somos una empresa familiar que desde 1985 trabaja en el sector metalúrgico, fabricando carrocerías para camiones y acoplados, con especialización en furgones térmicos. Nacimos en Crespo como "Metalúrgica Santa María" y desde 1994 estamos en el Parque Industrial, sobre la Ruta Nacional 12.',
  updated_at: now,
};

export const demoProducts: Product[] = [
  {
    ...base, id: "p1", slug: "furgon-termico", title: "Furgón térmico", category: "termicas", featured: true, sort: 1,
    summary: "Furgones isotérmicos para transporte de alimentos, lácteos y carga refrigerada.",
    description: "Carrocerías isotérmicas fabricadas a medida de cada chasis, con paneles de alta aislación y terminación sanitaria. Preparadas para equipo de frío.",
    specs: [{ label: "Medidas", value: "A medida del chasis" }, { label: "Aislación", value: "Paneles isotérmicos" }, { label: "Uso", value: "Alimentos, lácteos, frigoríficos" }],
    images: [],
  },
  {
    ...base, id: "p2", slug: "baranda-volcable", title: "Baranda volcable", category: "baranda-volcable", featured: true, sort: 2,
    summary: "Metálicas, arenadas y pintadas con esmalte poliuretánico.",
    description: "Carrocería metálica de baranda volcable. Medidas a elección del cliente. Accesorios incluidos: cajón de herramientas, tanque de agua, guardabarros con guardafangos y luces reglamentarias. Producto homologado y certificado.",
    specs: [{ label: "Medidas", value: "A elección del cliente" }, { label: "Terminación", value: "Arenado + esmalte poliuretánico" }, { label: "Incluye", value: "Cajón de herramientas, tanque de agua, guardabarros, luces" }],
    images: [img("truck", "Carrocería baranda volcable"), img("baranda-volcable", "Baranda volcable entregada")],
  },
  {
    ...base, id: "p3", slug: "sider", title: "Sider", category: "sider", featured: true, sort: 3,
    summary: "Carga lateral rápida para logística y distribución.",
    description: "Carrocería sider con lonas laterales corredizas para carga y descarga ágil con autoelevador.",
    specs: [{ label: "Medidas de referencia", value: "6,40 × 2,60 × 2,55 m" }, { label: "Carga", value: "Lateral y trasera" }],
    images: [],
  },
  {
    ...base, id: "p5", slug: "metalica-cerealera", title: "Metálica cerealera", category: "cerealeras", sort: 5,
    summary: "Carrocería metálica para el campo y el transporte de cereal.",
    description: "Carrocería metálica cerealera, robusta y liviana.",
    specs: [{ label: "Medidas de referencia", value: "5,10 × 2,70 × 1,95 m" }],
    images: [],
  },
  {
    ...base, id: "p6", slug: "todo-puerta", title: "Metálica todo puerta", category: "todo-puerta", sort: 6,
    summary: "Puertas laterales en todo el largo para cargas paletizadas.",
    description: "Carrocería metálica con puertas en toda la extensión lateral.",
    specs: [{ label: "Medidas", value: "A medida" }],
    images: [],
  },
];

export const demoUsados: Usado[] = [
  {
    ...base, id: "u1", slug: "baranda-volcable-5-40", title: "Baranda volcable 5,40 m", category: "baranda-volcable", status: "disponible",
    year: null, price: null, show_price: false, featured: true, sort: 1,
    summary: "Carrocería metálica de baranda volcable, lista para trabajar.", description: null,
    specs: [{ label: "Largo", value: "5,40 m" }, { label: "Ancho", value: "2,60 m" }, { label: "Alto baranda", value: "0,90 m" }],
    images: [img("baranda-volcable", "Baranda volcable usada"), img("truck", "Baranda volcable usada, vista lateral")],
  },
  {
    ...base, id: "u2", slug: "sider-6-40", title: "Carrocería sider 6,40 m", category: "sider", status: "disponible",
    year: null, price: null, show_price: false, featured: true, sort: 2,
    summary: "Sider en muy buen estado.", description: null,
    specs: [{ label: "Largo ext.", value: "6,40 m" }, { label: "Ancho ext.", value: "2,60 m" }, { label: "Alto int.", value: "2,55 m" }, { label: "Chasis", value: "87,5 cm" }],
    images: [],
  },
  {
    ...base, id: "u3", slug: "metalica-cerealera-5-10", title: "Metálica cerealera 5,10 m", category: "cerealeras", status: "reservado",
    year: null, price: null, show_price: false, sort: 3,
    summary: "Cerealera metálica.", description: null,
    specs: [{ label: "Largo", value: "5,10 m" }, { label: "Ancho", value: "2,70 m" }, { label: "Alto", value: "1,95 m" }],
    images: [],
  },
];

export const demoTrabajos: Trabajo[] = [
  {
    id: "t1", title: "Baranda volcable metálica", client: null, category: "baranda-volcable", description: "Unidad entregada.",
    images: [img("baranda-volcable", "Baranda volcable entregada")], delivered_at: "2026-10-10", published: true, sort: 1, created_at: now, updated_at: now,
  },
  {
    id: "t2", title: "En cada detalle", client: null, category: "otras", description: "Soldadura y terminación en nuestro taller.",
    images: [img("detalle", "Soldador trabajando en el taller")], delivered_at: "2026-09-20", published: true, sort: 2, created_at: now, updated_at: now,
  },
  {
    id: "t3", title: "Equipo Impulse 35", client: null, category: "otras", description: "Acompañando proyectos de la región.",
    images: [img("equipo", "Equipo Impulse 35")], delivered_at: "2026-08-15", published: true, sort: 3, created_at: now, updated_at: now,
  },
  {
    id: "t4", title: "Carrocería sobre chasis", client: null, category: "baranda-volcable", description: null,
    images: [img("truck", "Camión con carrocería metálica")], delivered_at: "2026-07-01", published: true, sort: 4, created_at: now, updated_at: now,
  },
];
