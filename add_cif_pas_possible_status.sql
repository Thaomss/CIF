-- À exécuter dans Supabase > SQL Editor
create extension if not exists pgcrypto;

create table if not exists public.arrival_sessions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  arrival_date date not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.arrival_sessions(id) on delete cascade,
  reservation_number text not null,
  first_name text not null default '',
  last_name text not null default '',
  distribution_channel text not null default '',
  due_amount numeric(10,2) not null default 0,
  accommodation_type text not null default '',
  unit_name text not null default '',
  swikly_ok boolean not null default false,
  travel_party_ok boolean not null default false,
  cif_ready boolean not null default false,
  call_status text not null default 'a_appeler' check (call_status in ('a_appeler','message_laisse','a_rappeler','attente_client','termine')),
  note text not null default '',
  is_manual boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(session_id,reservation_number)
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists reservations_updated_at on public.reservations;
create trigger reservations_updated_at before update on public.reservations for each row execute function public.set_updated_at();

alter table public.arrival_sessions enable row level security;
alter table public.reservations enable row level security;

-- Tous les comptes connectés peuvent lire et modifier les données métier.
create policy "authenticated sessions read" on public.arrival_sessions for select to authenticated using (true);
create policy "authenticated sessions write" on public.arrival_sessions for all to authenticated using (true) with check (true);
create policy "authenticated reservations read" on public.reservations for select to authenticated using (true);
create policy "authenticated reservations write" on public.reservations for all to authenticated using (true) with check (true);

-- Nécessaire pour recevoir les changements en direct.
alter publication supabase_realtime add table public.reservations;

insert into public.arrival_sessions(name,arrival_date)
select 'Arrivées du 10 juillet 2026','2026-07-10'
where not exists (select 1 from public.arrival_sessions);

