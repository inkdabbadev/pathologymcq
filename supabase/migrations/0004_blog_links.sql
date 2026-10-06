-- Editable article destinations and additional categories for imported posts.
alter table public.posts add column if not exists external_url text;
alter table public.posts add column if not exists additional_category_ids uuid[] not null default '{}';
