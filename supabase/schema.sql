-- ============================================================
-- LinkedPost AI — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Table profiles ──────────────────────────────────────────
create table if not exists public.profiles (
  id                 uuid        references auth.users(id) on delete cascade primary key,
  email              text        not null,
  full_name          text,
  avatar_url         text,
  role               text        not null default 'free'
                                 check (role in ('free', 'starter', 'pro')),
  generations_used   integer     not null default 0,
  generations_limit  integer     not null default 5,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ── Table posts ─────────────────────────────────────────────
create table if not exists public.posts (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  content     text        not null,
  tone        text        not null,
  format      text        not null,
  topic       text        not null,
  job_title   text        not null,
  word_count  integer,
  saved       boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.posts     enable row level security;

-- profiles : lecture/écriture par le propriétaire uniquement
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- posts : CRUD par le propriétaire
create policy "posts: select own"
  on public.posts for select
  using (auth.uid() = user_id);

create policy "posts: insert own"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "posts: delete own"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ── Trigger : créer le profil à l'inscription ───────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Trigger : updated_at automatique ────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ── Migration : ajout colonne saved (si table déjà créée) ───
-- À exécuter séparément si vous avez déjà la table posts :
-- alter table public.posts add column if not exists saved boolean not null default false;

-- ── Politique update pour sauvegarder un post ───────────────
create policy "posts: update own"
  on public.posts for update
  using (auth.uid() = user_id);

-- ── Nettoyage automatique des posts expirés (pg_cron) ───────
-- Nécessite l'extension pg_cron activée dans Supabase Dashboard
-- (Database > Extensions > pg_cron)
--
-- select cron.schedule(
--   'delete-expired-posts',
--   '0 3 * * *',
--   $$
--     delete from public.posts
--     where saved = false
--       and created_at < now() - interval '30 days';
--   $$
-- );
