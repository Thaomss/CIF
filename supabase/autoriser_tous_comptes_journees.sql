-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Autorise tous les comptes authentifiés à voir, créer, modifier et supprimer les journées.
-- Cette migration ne supprime aucune journée ni aucune réservation existante.

alter table public.arrival_days enable row level security;

drop policy if exists "authenticated arrival days manage" on public.arrival_days;
create policy "authenticated arrival days manage"
on public.arrival_days
for all
to authenticated
using (true)
with check (true);

notify pgrst, 'reload schema';
