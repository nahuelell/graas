-- ============================================================================
--  Carrocerías Graas · SETUP COMPLETO (esquema + seguridad + datos iniciales)
--  Pegar TODO en Supabase → SQL Editor → New query → Run.
--  Se puede volver a correr sin romper nada.
-- ============================================================================

-- ============================================================================
--  Carrocerías Graas · Esquema de base de datos (Supabase / Postgres)
--  Ejecutar completo en: Supabase → SQL Editor → New query → Run
--  Es idempotente: se puede volver a correr sin romper datos existentes.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Administradores ─────────────────────────────────────────────────────────
-- Solo los usuarios cargados en esta tabla pueden entrar al panel y editar.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── updated_at automático ──────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Catálogo de carrocerías (productos nuevos) ─────────────────────────────
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  category        text not null default 'otras',
  summary         text,
  description     text,
  specs           jsonb not null default '[]'::jsonb,   -- [{ "label": "Largo", "value": "6,40 m" }]
  images          jsonb not null default '[]'::jsonb,   -- [{ public_id, url, width, height, resource_type }]
  featured        boolean not null default false,
  published       boolean not null default true,
  sort            integer not null default 0,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Usados ──────────────────────────────────────────────────────────────────
create table if not exists public.usados (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  category        text not null default 'otras',
  status          text not null default 'disponible' check (status in ('disponible', 'reservado', 'vendido')),
  year            integer,
  price           numeric(14, 2),
  show_price      boolean not null default false,
  summary         text,
  description     text,
  specs           jsonb not null default '[]'::jsonb,
  images          jsonb not null default '[]'::jsonb,
  featured        boolean not null default false,
  published       boolean not null default true,
  sort            integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Trabajos entregados ────────────────────────────────────────────────────
create table if not exists public.trabajos (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  client        text,
  category      text not null default 'otras',
  description   text,
  images        jsonb not null default '[]'::jsonb,
  delivered_at  date,
  published     boolean not null default true,
  sort          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Ajustes del sitio (una sola fila, id = 1) ──────────────────────────────
create table if not exists public.settings (
  id              integer primary key default 1 check (id = 1),
  company_name    text not null default 'Carrocerías Graas',
  legal_name      text default 'Hugo Graas e Hijos S.R.L.',
  phone           text,
  whatsapp        text,           -- solo números con código de país: 5493434157700
  email           text,
  address         text,
  city            text,
  hours           text,
  instagram       text,
  facebook        text,
  maps_query      text,
  hero_kicker     text,
  hero_subtitle   text,
  hero_title      text,           -- título grande de la portada (una línea por renglón)
  hero_images     jsonb not null default '[]'::jsonb,  -- carrusel de portada, máx. 10 (la primera sale siempre primera)
  about           text,
  updated_at      timestamptz not null default now()
);

-- Para bases creadas con una versión anterior del esquema
alter table public.settings add column if not exists hero_title text;
alter table public.settings add column if not exists hero_images jsonb not null default '[]'::jsonb;

-- ── Consultas (formulario de contacto) ─────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  interest    text,
  message     text,
  source      text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Índices ─────────────────────────────────────────────────────────────────
create index if not exists products_category_idx on public.products (category);
create index if not exists products_published_idx on public.products (published, sort);
create index if not exists usados_published_idx on public.usados (published, sort);
create index if not exists trabajos_published_idx on public.trabajos (published, sort);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ── Triggers updated_at ─────────────────────────────────────────────────────
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists usados_touch on public.usados;
create trigger usados_touch before update on public.usados for each row execute function public.touch_updated_at();
drop trigger if exists trabajos_touch on public.trabajos;
create trigger trabajos_touch before update on public.trabajos for each row execute function public.touch_updated_at();
drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- ============================================================================
--  Seguridad (Row Level Security)
--  · El público solo LEE lo publicado y puede ENVIAR consultas.
--  · Solo los administradores (tabla admins) pueden crear, editar y borrar.
-- ============================================================================
alter table public.admins   enable row level security;
alter table public.products enable row level security;
alter table public.usados   enable row level security;
alter table public.trabajos enable row level security;
alter table public.settings enable row level security;
alter table public.leads    enable row level security;

drop policy if exists "admins: ver propio" on public.admins;
create policy "admins: ver propio" on public.admins for select to authenticated using (user_id = auth.uid());

drop policy if exists "products: lectura publica" on public.products;
create policy "products: lectura publica" on public.products for select using (published or public.is_admin());
drop policy if exists "products: admin escribe" on public.products;
create policy "products: admin escribe" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "usados: lectura publica" on public.usados;
create policy "usados: lectura publica" on public.usados for select using (published or public.is_admin());
drop policy if exists "usados: admin escribe" on public.usados;
create policy "usados: admin escribe" on public.usados for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "trabajos: lectura publica" on public.trabajos;
create policy "trabajos: lectura publica" on public.trabajos for select using (published or public.is_admin());
drop policy if exists "trabajos: admin escribe" on public.trabajos;
create policy "trabajos: admin escribe" on public.trabajos for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings: lectura publica" on public.settings;
create policy "settings: lectura publica" on public.settings for select using (true);
drop policy if exists "settings: admin escribe" on public.settings;
create policy "settings: admin escribe" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads: cualquiera envia" on public.leads;
create policy "leads: cualquiera envia" on public.leads for insert to anon, authenticated with check (true);
drop policy if exists "leads: admin gestiona" on public.leads;
create policy "leads: admin gestiona" on public.leads for select to authenticated using (public.is_admin());
drop policy if exists "leads: admin actualiza" on public.leads;
create policy "leads: admin actualiza" on public.leads for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "leads: admin borra" on public.leads;
create policy "leads: admin borra" on public.leads for delete to authenticated using (public.is_admin());


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
  'Fábrica de carrocerías en Crespo, Entre Ríos, desde 1985',
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


-- ============================================================================
--  Trabajá con nosotros: postulaciones + CVs + email de avisos
--  Si ya ejecutaste setup-completo.sql antes, corré SOLO este archivo.
--  Es idempotente: se puede volver a correr sin romper nada.
-- ============================================================================

-- Email que recibe los avisos de consultas y postulaciones (se edita en el panel → Ajustes)
alter table public.settings add column if not exists notify_email text;

-- Postulaciones
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  city        text,
  position    text,
  message     text,
  cv_path     text,          -- ruta del archivo en el bucket "cvs"
  cv_name     text,
  cv_size     integer,
  cv_type     text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists applications_created_idx on public.applications (created_at desc);

alter table public.applications enable row level security;
drop policy if exists "applications: cualquiera envia" on public.applications;
create policy "applications: cualquiera envia" on public.applications for insert to anon, authenticated with check (true);
drop policy if exists "applications: admin lee" on public.applications;
create policy "applications: admin lee" on public.applications for select to authenticated using (public.is_admin());
drop policy if exists "applications: admin actualiza" on public.applications;
create policy "applications: admin actualiza" on public.applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "applications: admin borra" on public.applications;
create policy "applications: admin borra" on public.applications for delete to authenticated using (public.is_admin());

-- Bucket privado para los CV: máximo 8 MB, solo PDF o imagen
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 8388608, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Cualquiera puede SUBIR su CV; solo los administradores pueden verlos o borrarlos
drop policy if exists "cvs: cualquiera sube" on storage.objects;
create policy "cvs: cualquiera sube" on storage.objects for insert to anon, authenticated with check (bucket_id = 'cvs');
drop policy if exists "cvs: admin lee" on storage.objects;
create policy "cvs: admin lee" on storage.objects for select to authenticated using (bucket_id = 'cvs' and public.is_admin());
drop policy if exists "cvs: admin borra" on storage.objects;
create policy "cvs: admin borra" on storage.objects for delete to authenticated using (bucket_id = 'cvs' and public.is_admin());


-- ============================================================================
--  ÚLTIMO PASO: dar permisos de administrador
--  1) Supabase → Authentication → Users → Add user → Create new user
--       Email:    graascarrocerias@hugograas.com.ar
--       Password: mínimo 6 caracteres (ej: Graas2026!)
--       Marcar "Auto Confirm User"
--  2) Después ejecutá SOLO estas 3 líneas (sacales los "--", seleccionalas y Run):
-- ============================================================================
-- insert into public.admins (user_id, name)
-- select id, 'Graas' from auth.users where email = 'graascarrocerias@hugograas.com.ar'
-- on conflict (user_id) do nothing;
