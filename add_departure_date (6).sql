-- À exécuter une seule fois dans Supabase pour rendre « Contrôle journée » totalement indépendant du Back Office.
create table if not exists public.front_day_rows (
  id uuid primary key default gen_random_uuid(),
  arrival_day_id uuid not null references public.arrival_days(id) on delete cascade,
  reservation_number text not null,
  firstname text,
  lastname text,
  accommodation_type text,
  pitch text,
  clean_status text not null default 'non_renseigne',
  clean_previous_status text,
  clean_changed_at timestamptz,
  is_verified boolean not null default false,
  is_last_minute boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(arrival_day_id, reservation_number)
);

alter table public.front_day_rows enable row level security;

drop policy if exists "authenticated front day rows read" on public.front_day_rows;
create policy "authenticated front day rows read" on public.front_day_rows
for select to authenticated using (true);

drop policy if exists "authenticated front day rows write" on public.front_day_rows;
create policy "authenticated front day rows write" on public.front_day_rows
for all to authenticated using (true) with check (true);

do $$ begin
  alter publication supabase_realtime add table public.front_day_rows;
exception when duplicate_object then null;
end $$;

-- Mise à niveau si la table existait déjà avant l'ajout des Last minute.
alter table public.front_day_rows add column if not exists is_last_minute boolean not null default false;
