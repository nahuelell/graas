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
