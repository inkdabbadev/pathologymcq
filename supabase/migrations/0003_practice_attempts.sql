-- Practice quiz attempts: one row per completed attempt, keyed by email.
-- Written and read only through server API routes (service role); no public policies.

create table if not exists public.practice_attempts (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  topic_slug    text not null,
  topic_label   text not null,
  score         integer not null,
  total         integer not null,
  created_at    timestamptz not null default now()
);

create index if not exists practice_attempts_created_idx on public.practice_attempts (created_at desc);
create index if not exists practice_attempts_email_idx on public.practice_attempts (email);

alter table public.practice_attempts enable row level security;
