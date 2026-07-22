-- À exécuter une seule fois dans l’éditeur SQL Supabase.
-- Autorise le nouveau statut Back Office « CIF pas possible ».

alter table public.reservations
  drop constraint if exists reservations_call_status_check;

alter table public.reservations
  add constraint reservations_call_status_check
  check (call_status in (
    'a_appeler',
    'message_laisse',
    'a_rappeler',
    'attente_client',
    'termine',
    'cif_pas_possible'
  ));
