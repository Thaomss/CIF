-- Mise à jour des cases de vérification du Front Office.
-- À exécuter une seule fois dans Supabase > SQL Editor.

with front_department as (
  select id from public.departments where code = 'front_office' limit 1
)
insert into public.check_types (department_id, code, label, description, sort_order, is_required, is_active)
select id, v.code, v.label, v.description, v.sort_order, false, true
from front_department
cross join (values
  ('key_sticker', 'Clé + macaron', 'Clé et macaron préparés ou remis.', 20),
  ('dog', 'Chien', 'Présence d’un chien prise en compte.', 30),
  ('plan', 'Plan', 'Plan préparé ou remis.', 40),
  ('bracelets', 'Bracelets', 'Bracelets préparés ou remis.', 50),
  ('verification', 'Vérification', 'Vérification finale de la pochette.', 60)
) as v(code, label, description, sort_order)
where not exists (
  select 1 from public.check_types ct
  where ct.department_id = front_department.id and ct.code = v.code
);

-- Met à jour les libellés et l’ordre si les cases existent déjà.
update public.check_types ct
set label = source.label,
    description = source.description,
    sort_order = source.sort_order,
    is_active = true
from public.departments d,
(values
  ('key_sticker', 'Clé + macaron', 'Clé et macaron préparés ou remis.', 20),
  ('dog', 'Chien', 'Présence d’un chien prise en compte.', 30),
  ('plan', 'Plan', 'Plan préparé ou remis.', 40),
  ('bracelets', 'Bracelets', 'Bracelets préparés ou remis.', 50),
  ('verification', 'Vérification', 'Vérification finale de la pochette.', 60)
) as source(code, label, description, sort_order)
where d.code = 'front_office'
  and ct.department_id = d.id
  and ct.code = source.code;

-- Les anciennes cases séparées ne sont plus affichées.
update public.check_types ct
set is_active = false
from public.departments d
where d.code = 'front_office'
  and ct.department_id = d.id
  and ct.code in ('key_ready', 'sticker');

-- Reprend les anciennes validations uniquement lorsque Clé ET Macaron étaient cochés.
insert into public.reservation_checks (reservation_id, check_type_id, is_checked)
select key_check.reservation_id, combined.id, true
from public.departments d
join public.check_types combined on combined.department_id = d.id and combined.code = 'key_sticker'
join public.check_types key_type on key_type.department_id = d.id and key_type.code = 'key_ready'
join public.check_types sticker_type on sticker_type.department_id = d.id and sticker_type.code = 'sticker'
join public.reservation_checks key_check on key_check.check_type_id = key_type.id and key_check.is_checked = true
join public.reservation_checks sticker_check on sticker_check.reservation_id = key_check.reservation_id and sticker_check.check_type_id = sticker_type.id and sticker_check.is_checked = true
where d.code = 'front_office'
on conflict (reservation_id, check_type_id)
do update set is_checked = excluded.is_checked;
