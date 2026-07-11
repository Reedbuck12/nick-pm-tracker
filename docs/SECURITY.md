# Security — PM Tracker

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are **server-only** env vars — never exposed to the browser
- All AI calls go through `/api/ai/*` Next.js server routes
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are client-side

## Permission Model
- **v1 (demo):** Permissive RLS — all rows readable and writable without auth (demo-first)
- **Lock-down sprint:** RLS policies replaced with `auth.uid() = user_id`; demo rows assigned to a seed user
- Agent tools run server-side; they inherit the session's Supabase client and cannot exceed the caller's permissions

## Approved Tools Rule
Only `score_risk`, `summarize_project`, and `draft_status_report` are callable. No generic `run_sql`, `run_any`, or `send_any` functions exist in the codebase.

## Audit Principle
Every meaningful write — by a user or by AI — appends a row to `activity_logs` with actor, action, object type, object id, and timestamp. Logs are append-only (no delete policy on `activity_logs`).

## What to Do If Unsure
Any task touching payments, user data deletion, or external messaging must be paused and reviewed by a human before shipping. The plan will say so explicitly — do not ship guesses.
