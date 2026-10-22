create table public.kits(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, league text not null, season text not null,
  type text not null default 'kit' check (type in ('kit','kitpack')),
  author text, version text, description text,
  preview_path text,
  files text[] not null default '{}',
  published boolean not null default false,
  download_count int not null default 0,
  created_at timestamptz not null default now());
create table public.downloads(
  id bigserial primary key, kit_id uuid not null references public.kits on delete cascade,
  visitor text not null, day date not null default current_date, unique(kit_id, visitor, day));
create table public.admins(user_id uuid primary key references auth.users on delete cascade);

alter table public.kits enable row level security;
alter table public.downloads enable row level security;
alter table public.admins enable row level security;
create policy "leitura publica" on public.kits for select using (published);
create policy "admin gerencia" on public.kits for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admin le admins" on public.admins for select using (user_id = auth.uid());

create function public.register_download(p_kit uuid, p_visitor text) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into downloads(kit_id, visitor) values (p_kit, p_visitor) on conflict do nothing;
  if found then update kits set download_count = download_count + 1 where id = p_kit; end if;
end $$;
revoke all on function public.register_download from public, anon, authenticated;

insert into storage.buckets(id, name, public) values ('kits','kits',false) on conflict do nothing;
create policy "admin envia arquivos" on storage.objects for all
  using (bucket_id='kits' and exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (bucket_id='kits' and exists (select 1 from public.admins a where a.user_id = auth.uid()));
