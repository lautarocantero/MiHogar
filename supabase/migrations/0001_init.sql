-- Gastito — esquema inicial (web app con cifrado de punta a punta)
--
-- El servidor NUNCA ve datos en claro: `envelope` es el mismo VaultEnvelope
-- (PBKDF2-SHA256 600k + AES-256-GCM) que usa la app de escritorio, cifrado en
-- el navegador con la clave del hogar. Los adjuntos se suben ya cifrados.

-- 1) Vault: una fila por cuenta de usuario -------------------------------------------------
create table if not exists public.vaults (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  envelope   jsonb       not null,
  -- Control de concurrencia optimista: cada guardado exige la versión que leyó
  -- el cliente (`update ... where version = <leída>`); si otro dispositivo
  -- guardó antes, el update afecta 0 filas y el cliente lo trata como conflicto.
  version    bigint      not null default 1,
  updated_at timestamptz not null default now()
);

create or replace function public.vaults_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists vaults_touch_updated_at on public.vaults;
create trigger vaults_touch_updated_at
  before update on public.vaults
  for each row execute function public.vaults_touch_updated_at();

alter table public.vaults enable row level security;

drop policy if exists "vaults_select_own" on public.vaults;
create policy "vaults_select_own" on public.vaults
  for select using (auth.uid() = user_id);

drop policy if exists "vaults_insert_own" on public.vaults;
create policy "vaults_insert_own" on public.vaults
  for insert with check (auth.uid() = user_id);

drop policy if exists "vaults_update_own" on public.vaults;
create policy "vaults_update_own" on public.vaults
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "vaults_delete_own" on public.vaults;
create policy "vaults_delete_own" on public.vaults
  for delete using (auth.uid() = user_id);

-- 2) Adjuntos: bucket privado, cada usuario solo accede a `<su uid>/...` -------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('attachments', 'attachments', false, 26214400) -- 25 MB
on conflict (id) do nothing;

drop policy if exists "attachments_select_own" on storage.objects;
create policy "attachments_select_own" on storage.objects
  for select using (
    bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_insert_own" on storage.objects;
create policy "attachments_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_update_own" on storage.objects;
create policy "attachments_update_own" on storage.objects
  for update using (
    bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_delete_own" on storage.objects;
create policy "attachments_delete_own" on storage.objects
  for delete using (
    bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );
