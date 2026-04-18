-- Auto-bump leader.updatedat on every insert or update so the
-- "Marked at" column on the admin drilldown is always accurate,
-- regardless of which code path mutated the row.

create or replace function public.leader_touch_updatedat()
returns trigger
language plpgsql
as $$
begin
  new.updatedat := now();
  return new;
end;
$$;

drop trigger if exists leader_touch_updatedat_trigger on public.leader;
create trigger leader_touch_updatedat_trigger
  before insert or update on public.leader
  for each row
  execute function public.leader_touch_updatedat();
