-- Key/value settings table used for runtime-configurable values
-- like the meeting title. Values are JSONB so you can store either
-- a plain string ("My title") or a richer object.

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

-- Public read so the attendance page can fetch the title with the
-- anon key. Writes still require the service role (or Supabase
-- dashboard edit), so anon clients can't tamper with it.
drop policy if exists "app_settings readable by anyone" on public.app_settings;
create policy "app_settings readable by anyone"
  on public.app_settings
  for select
  using (true);

-- Seed the meeting title. Update via:
--   update public.app_settings
--      set value = to_jsonb('New title here'::text),
--          updated_at = now()
--    where key = 'meeting_title';
insert into public.app_settings (key, value)
values (
  'meeting_title',
  to_jsonb(
    E'Leaders Meeting with Pastor Mayowa Agboade\nSaturday 18th April 2026'
  )
)
on conflict (key) do nothing;
