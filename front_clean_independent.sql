-- À exécuter UNE SEULE FOIS dans Supabase > SQL Editor.
-- Crée un suivi des états de nettoyage propre au Front Office.
-- Cette table ne modifie jamais public.reservations ni les données du Back Office.

create table if not exists public.front_clean_statuses (
  id uuid primary key default gen_random_uuid(),
  arrival_day_id uuid not null references public.arrival_days(id) on delete cascade,
  reservation_number text not null,
  clean_status text not null default 'non_renseigne',
  clean_previous_status text,
  clean_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (arrival_day_id, reservation_number)
);

create index if not exists front_clean_statuses_day_idx
  on public.front_clean_statuses (arrival_day_id);

alter table public.front_clean_statuses enable row level security;

drop policy if exists "authenticated front clean read" on public.front_clean_statuses;
create policy "authenticated front clean read"
on public.front_clean_statuses
for select to authenticated
using (true);

drop policy if exists "authenticated front clean write" on public.front_clean_statuses;
create policy "authenticated front clean write"
on public.front_clean_statuses
for all to authenticated
using (true)
with check (true);

-- Reprend uniquement l'état actuellement affiché comme point de départ.
-- Après cette copie initiale, les états Front restent complètement indépendants.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reservations'
      and column_name = 'clean_status'
  ) then
    insert into public.front_clean_statuses (
      arrival_day_id,
      reservation_number,
      clean_status,
      clean_previous_status,
      clean_changed_at
    )
    select
      r.arrival_day_id,
      r.reservation_number,
      coalesce(nullif(r.clean_status, ''), 'non_renseigne'),
      null,
      null
    from public.reservations r
    on conflict (arrival_day_id, reservation_number) do nothing;
  else
    insert into public.front_clean_statuses (
      arrival_day_id,
      reservation_number,
      clean_status,
      clean_previous_status,
      clean_changed_at
    )
    select
      r.arrival_day_id,
      r.reservation_number,
      'non_renseigne',
      null,
      null
    from public.reservations r
    on conflict (arrival_day_id, reservation_number) do nothing;
  end if;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.front_clean_statuses;
exception when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
