-- Pathology MCQ — Blog schema (categories + posts) for the admin edit system.
-- Run this in the Supabase SQL editor (or `supabase db push`).

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Tables ---------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default 'Untitled post',
  slug         text not null unique,
  excerpt      text not null default '',
  cover_image  text,
  category_id  uuid references public.categories(id) on delete set null,
  status       text not null default 'draft' check (status in ('draft','published')),
  -- content is an ordered array of blocks (see lib/blog/types.ts)
  content      jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_status_idx   on public.posts (status);
create index if not exists posts_category_idx  on public.posts (category_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.categories enable row level security;
alter table public.posts      enable row level security;

-- Categories: readable by everyone, writable by any signed-in (admin) user.
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories
  for select using (true);

drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories
  for all to authenticated using (true) with check (true);

-- Posts: published posts are public; admins (signed-in) can see & manage all.
drop policy if exists posts_read_published on public.posts;
create policy posts_read_published on public.posts
  for select using (status = 'published');

drop policy if exists posts_admin_read on public.posts;
create policy posts_admin_read on public.posts
  for select to authenticated using (true);

drop policy if exists posts_admin_write on public.posts;
create policy posts_admin_write on public.posts
  for all to authenticated using (true) with check (true);

-- Storage bucket for post images --------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

drop policy if exists blog_public_read on storage.objects;
create policy blog_public_read on storage.objects
  for select using (bucket_id = 'blog');

drop policy if exists blog_admin_write on storage.objects;
create policy blog_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'blog') with check (bucket_id = 'blog');

-- Seed a couple of categories so the blog isn't empty on first load ----------
insert into public.categories (name, slug) values
  ('Exam Prep Guides', 'exam-prep-guides'),
  ('MCQ Strategies', 'mcq-strategies')
on conflict (slug) do nothing;
