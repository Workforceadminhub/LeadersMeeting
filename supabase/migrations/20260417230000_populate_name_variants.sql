-- Keep fullname and fullnamereverse in sync with firstname + lastname.
-- The search RPC (get_search_results_v2) already checks both, so a
-- populated fullnamereverse lets leaders type "Lastname Firstname"
-- and still find the worker.

create or replace function public.leader_set_name_variants()
returns trigger
language plpgsql
as $$
begin
  new.fullname := btrim(
    coalesce(new.firstname, '') || ' ' || coalesce(new.lastname, '')
  );
  new.fullnamereverse := btrim(
    coalesce(new.lastname, '') || ' ' || coalesce(new.firstname, '')
  );
  return new;
end;
$$;

drop trigger if exists leader_set_name_variants_trigger on public.leader;
create trigger leader_set_name_variants_trigger
  before insert or update of firstname, lastname
  on public.leader
  for each row
  execute function public.leader_set_name_variants();

-- Backfill existing rows.
update public.leader
   set fullname = btrim(
         coalesce(firstname, '') || ' ' || coalesce(lastname, '')
       ),
       fullnamereverse = btrim(
         coalesce(lastname, '') || ' ' || coalesce(firstname, '')
       )
 where firstname is not null
    or lastname is not null;
