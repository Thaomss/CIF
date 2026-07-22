-- À exécuter une seule fois dans Supabase > SQL Editor
-- Ajoute la date de départ aux réservations existantes sans supprimer aucune donnée.
alter table public.reservations
add column if not exists departure_date date;
