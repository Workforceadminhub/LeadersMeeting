-- Add a gender column to the leader table and include it in the
-- search RPC so existing records round-trip through the edit form.

alter table public.leader
  add column if not exists gender text;

create or replace function get_search_results_v2(search_text text)
returns setof record
language sql
as $$
    select
        p.id,
        p.identifier,
        p.firstname,
        p.lastname,
        p.fullname,
        p.department,
        p.phonenumber,
        p.email,
        p.team,
        p.workerrole,
        p.updatedat,
        p.fullnamereverse,
        p.fullnamenoothername,
        p.fullnamenoothernamereverse,
        p.ispresent,
        p.validate,
        p.isactive,
        p.isconfirmed,
        p.campus,
        p.gender
    from
        leader p
    where
        p.firstname ilike '%' || search_text || '%'
        or p.lastname ilike '%' || search_text || '%'
        or p.phonenumber ilike '%' || search_text || '%'
        or p.fullname ilike '%' || search_text || '%'
        or p.fullnamereverse ilike '%' || search_text || '%'
        or p.team ilike '%' || search_text || '%'
        or p.department ilike '%' || search_text || '%'
        or p.email ilike '%' || search_text || '%'
        or p.campus ilike '%' || search_text || '%'
        or p.fullnamenoothername ilike '%' || search_text || '%'
        or p.fullnamenoothernamereverse ilike '%' || search_text || '%';
$$;
