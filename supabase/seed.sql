-- ============================================================================
--  Datos iniciales · ejecutar DESPUÉS de schema.sql
--  Carga los datos de contacto y un catálogo base para arrancar.
--  Las imágenes se suben después desde el panel (/admin).
-- ============================================================================

insert into public.settings (id, company_name, legal_name, phone, whatsapp, email, address, city, hours, instagram, facebook, maps_query, hero_title, hero_kicker, hero_subtitle, about)
values (
  1,
  'Carrocerías Graas',
  'Hugo Graas e Hijos S.R.L.',
  '343 495-0909',
  '5493434157700',
  'contacto@hugograas.com.ar',
  'Santiago Eichhorn 235, Parque Industrial',
  'Crespo, Entre Ríos (3116)',
  'Lunes a viernes de 7 a 17 h',
  'https://www.instagram.com/carrocerias.graas/',
  'https://www.facebook.com/carroceriasgraas/',
  'Carrocerías Graas, Santiago Eichhorn 235, Crespo, Entre Ríos',
  E'Carrocerías\nhechas para\ntrabajar.',
  'Fábrica en Crespo · Entre Ríos · Desde 1985',
  'Furgones térmicos y carrocerías metálicas a medida de tu camión. Diseño, fabricación, homologación y service en un solo lugar.',
  'Somos una empresa familiar que desde 1985 trabaja en el sector metalúrgico, fabricando carrocerías para camiones, acoplados y furgones térmicos. Nacimos en Crespo como "Metalúrgica Santa María" y desde 1994 estamos en el Parque Industrial, sobre la Ruta Nacional 12.'
)
on conflict (id) do nothing;

insert into public.products (slug, title, category, summary, description, specs, featured, sort) values
('furgon-termico', 'Furgón térmico', 'termicas',
 'Furgones isotérmicos para transporte de alimentos, lácteos y carga refrigerada.',
 'Carrocerías isotérmicas fabricadas a medida de cada chasis, con paneles de alta aislación y terminación sanitaria. Preparadas para equipo de frío.',
 '[{"label":"Medidas","value":"A medida del chasis"},{"label":"Aislación","value":"Paneles isotérmicos"},{"label":"Uso","value":"Alimentos, lácteos, frigoríficos"}]', true, 1),
('baranda-volcable', 'Baranda volcable', 'baranda-volcable',
 'Metálicas, arenadas y pintadas con esmalte poliuretánico.',
 'Carrocería metálica de baranda volcable. Medidas a elección del cliente. Accesorios incluidos: cajón de herramientas, tanque de agua, guardabarros con guardafangos y luces reglamentarias. Producto homologado y certificado.',
 '[{"label":"Medidas","value":"A elección del cliente"},{"label":"Terminación","value":"Arenado + esmalte poliuretánico"},{"label":"Incluye","value":"Cajón de herramientas, tanque de agua, guardabarros, luces"}]', true, 2),
('sider', 'Sider', 'sider',
 'Carga lateral rápida para logística y distribución.',
 'Carrocería sider con lonas laterales corredizas para carga y descarga ágil con autoelevador.',
 '[{"label":"Medidas de referencia","value":"6,40 × 2,60 × 2,55 m"},{"label":"Carga","value":"Lateral y trasera"}]', true, 3),
('metalica-cerealera', 'Metálica cerealera', 'cerealeras',
 'Carrocería metálica para el campo y el transporte de cereal.',
 'Carrocería metálica cerealera, robusta y liviana.',
 '[{"label":"Medidas de referencia","value":"5,10 × 2,70 × 1,95 m"}]', false, 5),
('todo-puerta', 'Metálica todo puerta', 'todo-puerta',
 'Puertas laterales en todo el largo para cargas paletizadas.',
 'Carrocería metálica con puertas en toda la extensión lateral.',
 '[{"label":"Medidas","value":"A medida"}]', false, 6),
('playa', 'Carrocería playa', 'playas',
 'Plataforma con pecho, ideal para cargas voluminosas.',
 'Carrocería tipo playa.',
 '[{"label":"Medidas de referencia","value":"5,20 × 2,50 m, alto 1,40 m"}]', false, 7),
('paquetera', 'Paquetera', 'paqueteras',
 'Furgón cerrado para reparto urbano.',
 'Carrocería paquetera cerrada para distribución y reparto.',
 '[{"label":"Medidas","value":"A medida"}]', false, 8)
on conflict (slug) do nothing;

insert into public.usados (slug, title, category, status, summary, specs, featured, sort) values
('sider-6-40', 'Carrocería sider 6,40 m', 'sider', 'disponible',
 'Sider en muy buen estado, lista para trabajar.',
 '[{"label":"Largo ext.","value":"6,40 m"},{"label":"Ancho ext.","value":"2,60 m"},{"label":"Alto int.","value":"2,55 m"},{"label":"Chasis","value":"87,5 cm"}]', true, 1),
('baranda-volcable-5-40', 'Baranda volcable 5,40 m', 'baranda-volcable', 'disponible',
 'Carrocería metálica de baranda volcable.',
 '[{"label":"Largo","value":"5,40 m"},{"label":"Ancho","value":"2,60 m"},{"label":"Alto baranda","value":"0,90 m"}]', true, 2),
('playa-chasis-mercedes', 'Carrocería playa (chasis Mercedes)', 'playas', 'disponible',
 'Playa para chasis Mercedes.',
 '[{"label":"Largo","value":"5,20 m"},{"label":"Ancho","value":"2,50 m"},{"label":"Alto","value":"1,40 m"}]', false, 3),
('metalica-cerealera-5-10', 'Metálica cerealera 5,10 m', 'cerealeras', 'reservado',
 'Cerealera metálica.',
 '[{"label":"Largo","value":"5,10 m"},{"label":"Ancho","value":"2,70 m"},{"label":"Alto","value":"1,95 m"}]', false, 4)
on conflict (slug) do nothing;
