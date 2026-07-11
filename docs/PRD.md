# PRD — PM Tracker

## Problem
Project Managers juggle tasks, deadlines, risks, and issues across tools. There is no single place to see project health at a glance, assign ownership, and get an AI-generated summary without manual reporting.

## Target User
Project managers who need a fast, clear view of project status — and want AI to do the boring summarizing.

## Core Objects
| Object | Key Fields |
|---|---|
| Project | name, status, start_date, end_date, AI summary |
| Task | title, status, priority, due_date, owner |
| Deliverable | title, status, due_date, owner |
| Risk | title, likelihood, impact, status, mitigation, AI score |
| Issue | title, severity, status, resolution, owner |
| Owner | name, role, email |

## MVP Must-Haves (v1)
- [ ] Project dashboard: open tasks, overdue items, risk count, issue count
- [ ] Create / edit / delete tasks with status, priority, due date, owner
- [ ] Create / edit / delete risks with likelihood, impact, mitigation
- [ ] Create / edit / delete issues with severity and resolution
- [ ] Create / edit / delete deliverables with due date and owner
- [ ] AI risk score per risk (auto, no approval)
- [ ] AI plain-language project status summary on dashboard
- [ ] All screens viewable without login (demo-first)

## Non-Goals (v1)
- Multi-user accounts, team workspaces, role-based permissions
- Notifications or email digests
- PDF / slide export
- Calendar view

## Success Criteria
A recruiter opens the live URL, lands on the project dashboard showing real data, creates a new task, assigns an owner, and reads an AI-generated project summary — all in under 30 seconds, without signing in.
