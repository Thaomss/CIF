-- À exécuter UNE SEULE FOIS dans Supabase > SQL Editor.
-- Transforme Clean en état alimenté par le futur fichier Front Office.

alter table public.reservations
  add column if not exists clean_status text not null default 'non_renseigne';

comment on column public.reservations.clean_status is
  'État Clean provenant du fichier Front Office : non_renseigne, propre, a_controler, en_cours, non_propre ou valeur métier importée.';

-- Clean n'est plus une case manuelle.
update public.check_types
set is_active = false
where code = 'clean';

-- Conserve/ajoute les cinq contrôles manuels du Front Office.
insert into public.departments (code, name)
select 'front_office', 'Front Office'
where not exists (select 1 from public.departments where code = 'front_office');

insert into public.check_types (department_id, code, label, description, sort_order, is_required, is_active)
select d.id, v.code, v.label, v.description, v.sort_order, false, true
from public.departments d
cross join (values
  ('plan', 'Plan', 'Plan remis au client.', 20),
  ('key_ready', 'Clé', 'Clé préparée ou remise.', 30),
  ('sticker', 'Macaron', 'Macaron véhicule préparé ou remis.', 40),
  ('bracelets', 'Bracelets', 'Bracelets préparés ou remis.', 50),
  ('dog', 'Chien', 'Présence d’un chien prise en compte.', 60)
) as v(code, label, description, sort_order)
where d.code = 'front_office'
and not exists (select 1 from public.check_types c where c.code = v.code);

update public.check_types set is_active = true where code in ('plan','key_ready','sticker','bracelets','dog');
update public.profiles set role = 'front_office' where username = 'frontoffice';
