-- Catalog: courses, bundles, hard-copy books, mock tests, mock categories.
-- Stored generically as JSON documents keyed by (kind, id). The full entity
-- lives in `data`; a few columns are lifted out for ordering/filtering.

create table if not exists public.catalog_items (
  kind        text not null,           -- 'courses' | 'bundles' | 'books' | 'mock_tests' | 'mock_categories'
  id          text not null,
  slug        text,
  category    text,
  position    double precision not null default 0,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (kind, id)
);

create index if not exists catalog_kind_pos_idx on public.catalog_items (kind, position);

alter table public.catalog_items enable row level security;

-- Public can read the catalog.
drop policy if exists catalog_read on public.catalog_items;
create policy catalog_read on public.catalog_items for select using (true);

-- Signed-in (admin) writes; the app also uses the service role which bypasses RLS.
drop policy if exists catalog_write on public.catalog_items;
create policy catalog_write on public.catalog_items
  for all to authenticated using (true) with check (true);
