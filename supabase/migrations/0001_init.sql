create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  description text,
  status text not null default 'active',
  start_date date,
  end_date date,
  ai_summary text,
  ai_summary_source text,
  ai_summary_confidence numeric,
  ai_summary_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table projects enable row level security;
drop policy if exists "projects_v1_read" on projects;
create policy "projects_v1_read" on projects for select using (true);
drop policy if exists "projects_v1_write" on projects;
create policy "projects_v1_write" on projects for all using (true) with check (true);

create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  role text,
  email text,
  created_at timestamptz not null default now()
);

alter table owners enable row level security;
drop policy if exists "owners_v1_read" on owners;
create policy "owners_v1_read" on owners for select using (true);
drop policy if exists "owners_v1_write" on owners;
create policy "owners_v1_write" on owners for all using (true) with check (true);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  owner_id uuid references owners(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'not_started',
  priority text not null default 'medium',
  due_date date,
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;
drop policy if exists "tasks_v1_read" on tasks;
create policy "tasks_v1_read" on tasks for select using (true);
drop policy if exists "tasks_v1_write" on tasks;
create policy "tasks_v1_write" on tasks for all using (true) with check (true);

create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  owner_id uuid references owners(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'not_started',
  due_date date,
  created_at timestamptz not null default now()
);

alter table deliverables enable row level security;
drop policy if exists "deliverables_v1_read" on deliverables;
create policy "deliverables_v1_read" on deliverables for select using (true);
drop policy if exists "deliverables_v1_write" on deliverables;
create policy "deliverables_v1_write" on deliverables for all using (true) with check (true);

create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  owner_id uuid references owners(id) on delete set null,
  title text not null,
  description text,
  likelihood text not null default 'medium',
  impact text not null default 'medium',
  status text not null default 'open',
  mitigation text,
  ai_score numeric,
  ai_score_source text,
  ai_score_confidence numeric,
  ai_score_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table risks enable row level security;
drop policy if exists "risks_v1_read" on risks;
create policy "risks_v1_read" on risks for select using (true);
drop policy if exists "risks_v1_write" on risks;
create policy "risks_v1_write" on risks for all using (true) with check (true);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  owner_id uuid references owners(id) on delete set null,
  title text not null,
  description text,
  severity text not null default 'medium',
  status text not null default 'open',
  resolution text,
  created_at timestamptz not null default now()
);

alter table issues enable row level security;
drop policy if exists "issues_v1_read" on issues;
create policy "issues_v1_read" on issues for select using (true);
drop policy if exists "issues_v1_write" on issues;
create policy "issues_v1_write" on issues for all using (true) with check (true);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_id uuid references projects(id) on delete cascade,
  actor_name text,
  action text not null,
  object_type text not null,
  object_id uuid,
  object_title text,
  created_at timestamptz not null default now()
);

alter table activity_logs enable row level security;
drop policy if exists "activity_logs_v1_read" on activity_logs;
create policy "activity_logs_v1_read" on activity_logs for select using (true);
drop policy if exists "activity_logs_v1_write" on activity_logs;
create policy "activity_logs_v1_write" on activity_logs for all using (true) with check (true);

insert into projects (id, name, description, status, start_date, end_date, ai_summary, ai_summary_source, ai_summary_confidence, ai_summary_review_status) values
  ('a1000000-0000-0000-0000-000000000001', 'CRM Platform Launch', 'End-to-end delivery of the new CRM platform for the sales team.', 'active', '2025-01-06', '2025-04-30', 'Project is on track. Two open risks require mitigation. One deliverable is overdue.', 'rule-based', 0.82, 'unreviewed'),
  ('a1000000-0000-0000-0000-000000000002', 'Mobile App Redesign', 'UX overhaul of the customer-facing mobile application.', 'active', '2025-02-01', '2025-05-31', 'Three open issues blocking QA. Risk score is elevated. Recommend daily standups.', 'rule-based', 0.75, 'unreviewed');

insert into owners (id, project_id, name, role, email) values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Sara Chen', 'Tech Lead', 'sara.chen@example.com'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Marcus Rivera', 'Business Analyst', 'marcus.r@example.com'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Priya Nair', 'UX Designer', 'priya.n@example.com'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Tom Wallace', 'QA Engineer', 'tom.w@example.com');

insert into tasks (id, project_id, owner_id, title, description, status, priority, due_date) values
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Finalize API integration spec', 'Document all endpoints for CRM data sync.', 'in_progress', 'high', '2025-07-15'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Stakeholder sign-off on requirements', 'Get written approval from sales leadership.', 'not_started', 'high', '2025-07-10'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Deliver high-fidelity mockups', 'All key screens in Figma, ready for dev handoff.', 'done', 'medium', '2025-06-20'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'Write regression test suite', 'Cover all user flows added in the redesign.', 'blocked', 'high', '2025-07-05');

insert into deliverables (id, project_id, owner_id, title, description, status, due_date) values
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'CRM Data Migration Script', 'Validated ETL script for legacy data migration.', 'in_progress', '2025-07-20'),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Training Manual v1', 'User guide for sales reps on the new CRM.', 'not_started', '2025-08-01'),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Redesigned Onboarding Flow', 'New onboarding screens shipped to production.', 'not_started', '2025-07-28');

insert into risks (id, project_id, owner_id, title, description, likelihood, impact, status, mitigation, ai_score, ai_score_source, ai_score_confidence, ai_score_review_status) values
  ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Third-party API deprecation', 'Vendor may deprecate the legacy API before migration completes.', 'high', 'high', 'open', 'Accelerate migration timeline; assign dedicated engineer.', 8.5, 'rule-based', 0.88, 'unreviewed'),
  ('e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Stakeholder availability', 'Key approvers traveling during sign-off window.', 'medium', 'medium', 'open', 'Schedule async review process.', 5.0, 'rule-based', 0.80, 'unreviewed'),
  ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'QA resource shortage', 'Only one QA engineer available for regression testing.', 'high', 'high', 'open', 'Request contractor support from HR.', 8.0, 'rule-based', 0.85, 'unreviewed');

insert into issues (id, project_id, owner_id, title, description, severity, status, resolution) values
  ('f1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Dev environment mismatch', 'Local dev configs differ from staging, causing test failures.', 'high', 'open', null),
  ('f1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'Accessibility audit failures', 'Screen reader tests failing on 3 key screens.', 'high', 'open', null),
  ('f1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Design token inconsistency', 'Color tokens in Figma do not match the design system library.', 'medium', 'resolved', 'Tokens synced with design system; Figma file updated.');