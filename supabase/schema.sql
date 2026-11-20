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
  hero_video      jsonb,          -- { public_id, url, resource_type: "video" }
  hero_image      jsonb,
  about           text,
  updated_at      timestamptz not null default now()
);

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
