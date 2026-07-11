-- Sprint 3 — Lock It Down.
-- Replace permissive v1 policies with owner-scoped RLS, while keeping demo rows
-- (user_id IS NULL) publicly readable AND writable so the no-login demo keeps
-- working. Authenticated users additionally see/manage only their own rows
-- (auth.uid() = user_id). No data leaks between two different signed-in users.

-- Helper predicate, inlined per policy: (user_id is null or auth.uid() = user_id)

do $$
declare
  t text;
begin
  foreach t in array array['projects','owners','tasks','deliverables','risks','issues'] loop
    execute format('drop policy if exists %I on %I', t || '_v1_read', t);
    execute format('drop policy if exists %I on %I', t || '_v1_write', t);

    execute format($f$
      create policy %I on %I for select
      using (user_id is null or auth.uid() = user_id)
    $f$, t || '_select', t);

    execute format($f$
      create policy %I on %I for insert
      with check (user_id is null or auth.uid() = user_id)
    $f$, t || '_insert', t);

    execute format($f$
      create policy %I on %I for update
      using (user_id is null or auth.uid() = user_id)
      with check (user_id is null or auth.uid() = user_id)
    $f$, t || '_update', t);

    execute format($f$
      create policy %I on %I for delete
      using (user_id is null or auth.uid() = user_id)
    $f$, t || '_delete', t);
  end loop;
end $$;

-- activity_logs is append-only (SECURITY.md): select + insert, no update/delete.
drop policy if exists "activity_logs_v1_read" on activity_logs;
drop policy if exists "activity_logs_v1_write" on activity_logs;

create policy "activity_logs_select" on activity_logs for select
  using (user_id is null or auth.uid() = user_id);

create policy "activity_logs_insert" on activity_logs for insert
  with check (user_id is null or auth.uid() = user_id);
