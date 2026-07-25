-- Run this once in the Supabase SQL editor before deploying the migration.

create table if not exists page_blocks (
  slug text primary key,
  blocks jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists blog_posts (
  category_slug text not null,
  slug text not null,
  title text not null,
  created_at timestamptz not null default now(),
  primary key (category_slug, slug)
);

-- Storage bucket for uploaded block images.
insert into storage.buckets (id, name, public)
values ('page-images', 'page-images', true)
on conflict (id) do nothing;

-- Public read; writes happen only via the server using the service-role key,
-- which bypasses RLS, so no insert/update policy is required here.
create policy if not exists "page-images public read"
  on storage.objects for select
  using (bucket_id = 'page-images');
