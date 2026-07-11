# Tasks — PM Tracker

## Gantt (which sprint each task lands in)
```
Week 1: Sprint 1 — DB + Core CRUD Engine
Week 2: Sprint 2 — Dashboard + AI Layer  ← v1 functional milestone
Week 3: Sprint 3 — Lock It Down (auth)
Week 4: Sprint 4 — Polish + Case Study
```

---

## Sprint 1 — Database + Core CRUD Engine
**Goal:** The app renders real data and every form persists to the database.

- [ ] Apply migration SQL to Supabase (projects, tasks, deliverables, risks, issues, owners, activity_logs)
- [ ] Seed 3–5 realistic demo rows per table
- [ ] `/` renders project list and project dashboard (loading / empty / error / ready states)
- [ ] Task list page: shows all tasks with status badge, owner name, due date
- [ ] "Add Task" form: title, description, status, priority, due_date, owner — persists to DB
- [ ] Edit and delete task — persists to DB, UI updates immediately
- [ ] "Add Risk" form: title, likelihood, impact, mitigation — persists to DB
- [ ] Edit and delete risk
- [ ] "Add Issue" form: title, severity, description — persists to DB
- [ ] Edit and delete issue
- [ ] "Add Deliverable" form — persists to DB
- [ ] Edit and delete deliverable
- [ ] No login required to view or interact

**Definition of Done:** Anonymous visitor opens the app, sees seeded project data, creates a new task with an owner and due date, and sees it appear in the task list without a page reload.

---

## Sprint 2 — Project Dashboard + AI Layer ✦ v1 functional milestone
**Goal:** Dashboard shows live project health; AI scores risks and summarizes the project.

- [ ] Dashboard summary cards: open tasks, overdue tasks, open risks, open issues
- [ ] Risk list sorted by `ai_score` descending
- [ ] `score_risk` tool: calculates score from likelihood + impact matrix, writes ai_score + source + confidence + review_status
- [ ] Score runs automatically when a risk is created or updated
- [ ] `summarize_project` tool: server-side GPT-4o call → writes ai_summary fields on project
- [ ] AI summary card on dashboard with "Refresh" button
- [ ] Status badges with color coding (Not Started → grey, In Progress → blue, Blocked → red, Done → green)
- [ ] Overdue items highlighted in red (due_date < today AND status ≠ done)
- [ ] Owner picker on all forms (dropdown from owners table)
- [ ] All five UI states handled on every screen

**Definition of Done:** Visitor sees dashboard, adds a high/high risk, sees AI score appear (≥8), reads the AI project summary, and can identify the top risk at a glance.

---

## Sprint 3 — Lock It Down
**Goal:** Auth added; data is owner-scoped; demo project remains public.

- [ ] Supabase Auth: email/password sign-up and login pages
- [ ] Replace v1 permissive RLS with `auth.uid() = user_id` owner-scoped policies
- [ ] Seed demo project assigned to a public read-only user or kept with permissive policy scoped to demo rows
- [ ] Authenticated users see only their own projects
- [ ] Logout button in nav

**Definition of Done:** Two browser sessions — one logged in, one anonymous — see different data sets. No data leaks between users.

---

## Sprint 4 — Polish + Case Study
**Goal:** Recruiter-ready presentation quality.

- [ ] Activity feed on dashboard: last 10 actions from `activity_logs`
- [ ] `draft_status_report` tool: GPT-4o drafts weekly summary → shown as copyable text block (not auto-sent)
- [ ] Overdue filter on task list
- [ ] Empty-state illustrations and copy on all screens
- [ ] Mobile-responsive layout (test at 375px)
- [ ] Case study markdown: problem → decisions → screenshots → results
- [ ] Favicon, page titles, meta description set

**Definition of Done:** Recruiter opens the live URL on a phone, navigates tasks → risks → issues, reads the AI summary, and finds the case study link — all within 30 seconds.
