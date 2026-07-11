# Architecture — PM Tracker

## Stack
- **Frontend:** Next.js 14 (App Router) — deployed on Vercel
- **Database:** Supabase (Postgres + RLS)
- **AI:** OpenAI GPT-4o via server-side API route (key never in browser)
- **Styling:** Tailwind CSS + shadcn/ui

## What to Build Now vs Later
**Now:** Projects, Tasks, Deliverables, Risks, Issues, Owners CRUD + dashboard + AI score/summary 
**Next:** Auth, per-user RLS, activity feed, status report draft 
**Later:** Multi-project workspace, Slack digest, calendar view

## Key User Action — End-to-End Flow
1. Visitor opens `/` → dashboard loads seeded project data from Supabase
2. Visitor clicks "Add Task" → form appears
3. Form submitted → `POST /api/tasks` → insert row in `tasks` table → revalidate
4. Task appears in list with correct status badge and owner name
5. AI summary card calls `/api/ai/summary` (server route) → GPT summarizes open tasks/risks → stores result in `projects.ai_summary` with `source`, `confidence`, `review_status`
6. Dashboard reflects updated summary

## Layer Plan
1. **Data layer first** — schema, seed data, RLS policies
2. **App logic second** — CRUD forms, status rules, deadline highlighting (runs with AI off)
3. **Smart features third** — AI risk scoring, AI project summary

## Core Without AI
All task tracking, risk logging, issue management, and owner assignment work entirely without AI. AI adds scored insights and summaries on top.
