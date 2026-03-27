create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  place text,
  organizer text,
  admin_password text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organization text not null,
  position text not null,
  name text not null,
  signature_url text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists registrations_event_id_idx on public.registrations(event_id);
create index if not exists registrations_lookup_idx on public.registrations(event_id, organization, name);

alter table public.events enable row level security;
alter table public.registrations enable row level security;

create policy if not exists "Public can read events" on public.events
for select using (true);

create policy if not exists "Public can read registrations" on public.registrations
for select using (true);

insert into storage.buckets (id, name, public)
values ('signatures', 'signatures', true)
on conflict (id) do nothing;
