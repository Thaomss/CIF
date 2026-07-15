-- À exécuter une seule fois dans Supabase pour activer le contrôle de journée Front Office.
alter table public.arrival_days
  add column if not exists front_clean_initialized boolean not null default false;

alter table public.reservations
  add column if not exists clean_previous_status text,
  add column if not exists clean_changed_at timestamptz;

insert into public.check_types (department_id, code, label, description, sort_order, is_required, is_active)
select d.id, 'day_verified', 'Vérification journée', 'Pochette d’arrivée contrôlée physiquement par le Front Office', 90, false, true
from public.departments d
where d.code = 'front_office'
and not exists (
  select 1 from public.check_types c where c.department_id = d.id and c.code = 'day_verified'
);
