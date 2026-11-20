/** Categorías de carrocerías. Para agregar una nueva, sumala acá. */
export const CATEGORIES = [
  { slug: "termicas", name: "Térmicas", short: "Furgones isotérmicos para frío y alimentos.", icon: "termico" },
  { slug: "baranda-volcable", name: "Baranda volcable", short: "Metálicas, arenadas y pintadas en poliuretano.", icon: "baranda" },
  { slug: "sider", name: "Sider", short: "Carga lateral rápida para logística.", icon: "sider" },
  { slug: "tolvas", name: "Tolvas", short: "Para cereales y granos, a medida.", icon: "tolva" },
  { slug: "cerealeras", name: "Cerealeras", short: "Metálicas para el campo.", icon: "baranda" },
  { slug: "todo-puerta", name: "Todo puerta", short: "Puertas en todo el lateral.", icon: "box" },
  { slug: "playas", name: "Playas", short: "Plataforma para carga voluminosa.", icon: "playa" },
  { slug: "paqueteras", name: "Paqueteras", short: "Furgón cerrado para reparto.", icon: "box" },
  { slug: "otras", name: "Otras", short: "Proyectos especiales a medida.", icon: "box" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type TruckKind = "termico" | "baranda" | "sider" | "tolva" | "playa" | "box";

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const SERVICES = [
  { icon: "wrench", title: "Reparaciones", text: "Service y reparación de carrocerías de todas las marcas." },
  { icon: "spray", title: "Arenado y pintura", text: "Arenado y pintura con esmalte poliuretánico." },
  { icon: "laser", title: "Corte láser", text: "Corte de precisión para piezas y proyectos especiales." },
  { icon: "fold", title: "Corte y plegado", text: "Corte y plegado de chapas de distintos espesores." },
  { icon: "suspension", title: "Suspensión neumática", text: "Colocación de suspensión neumática." },
  { icon: "tank", title: "Tanques adicionales", text: "Colocación y homologación de tanques adicionales." },
] as const;

export const USADO_STATUS = {
  disponible: { label: "Disponible", tone: "ok" },
  reservado: { label: "Reservado", tone: "warn" },
  vendido: { label: "Vendido", tone: "off" },
} as const;
