/**
 * Contenido de la línea de carrocerías térmicas (foco comercial del sitio).
 * Revisar y ajustar con Graas: medidas, materiales y alcance real de cada punto.
 */

export const TERMICOS_FEATURES = [
  { icon: "snowflake", title: "Paneles isotérmicos", text: "Paneles de alta aislación para sostener la cadena de frío en cada viaje." },
  { icon: "droplets", title: "Terminación sanitaria", text: "Interiores lisos, fáciles de lavar y aptos para el transporte de alimentos." },
  { icon: "fan", title: "Listos para equipo de frío", text: "Estructura preparada para instalar el equipo de refrigeración." },
  { icon: "door", title: "Puertas a medida", text: "Traseras y laterales, con burletes y herrajes reforzados." },
  { icon: "ruler", title: "A medida de tu chasis", text: "Relevamos tu camión y diseñamos el furgón según su uso y su carga." },
  { icon: "shield", title: "Homologados", text: "Se entregan homologados y certificados, listos para circular." },
] as const;

export const TERMICOS_USOS = [
  { icon: "milk", title: "Lácteos", text: "Distribución de leche, quesos y derivados." },
  { icon: "beef", title: "Carnes y frigoríficos", text: "Transporte de carnes y productos congelados." },
  { icon: "basket", title: "Alimentos y bebidas", text: "Reparto a comercios, supermercados y autoservicios." },
  { icon: "truck", title: "Reparto refrigerado", text: "Última milla y distribución urbana con frío." },
] as const;

export const TERMICOS_PROCESO = [
  { title: "Relevamos tu chasis", text: "Medimos el camión y conversamos sobre qué vas a transportar." },
  { title: "Diseñamos a medida", text: "Definimos medidas, puertas, aislación y accesorios." },
  { title: "Fabricamos en Crespo", text: "Construcción en nuestro taller del Parque Industrial." },
  { title: "Homologamos y entregamos", text: "Lista para trabajar, con service y repuestos en el mismo lugar." },
] as const;

export const TERMICOS_FAQ = [
  {
    q: "¿Para qué camiones fabrican furgones térmicos?",
    a: "Los fabricamos a medida de cada chasis, desde utilitarios hasta camiones medianos y pesados. Antes de diseñar relevamos el vehículo para definir medidas y peso.",
  },
  {
    q: "¿El furgón incluye el equipo de frío?",
    a: "Entregamos el furgón preparado para instalar el equipo de refrigeración. Consultanos por la provisión e instalación del equipo que necesites.",
  },
  {
    q: "¿Están homologados?",
    a: "Sí. Nuestras carrocerías se entregan homologadas y certificadas.",
  },
  {
    q: "¿Reparan o reacondicionan furgones térmicos?",
    a: "Sí. En nuestro taller de Crespo hacemos reparaciones, cambio de paneles y puertas, y reacondicionamiento de furgones térmicos.",
  },
  {
    q: "¿Cómo pido un presupuesto?",
    a: "Escribinos por WhatsApp o desde el formulario con la marca y modelo del chasis, las medidas que buscás y qué vas a transportar. Te respondemos con una propuesta a medida.",
  },
] as const;
