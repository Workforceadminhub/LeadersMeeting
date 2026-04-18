-- Rename the long "Sub team Head ..." worker role on existing rows so
-- it matches the shortened dropdown value the form now uses.

update public.leader
   set workerrole = 'Sub team Head'
 where workerrole = 'Sub team Head (heads more 2 or more departments)';
