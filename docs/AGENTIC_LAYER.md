# Agentic Layer — PM Tracker

## Risk Levels

### Low — Auto (no approval)
- Generate AI risk score from likelihood + impact
- Generate plain-language project summary
- Tag overdue tasks and highlight in UI

### Medium — Light Approval (user clicks "Use this")
- Draft weekly status report from open tasks + risks + issues
- Suggest mitigation text for a newly logged risk

### High — Always Approval
- Bulk-close resolved issues
- Reassign all tasks from one owner to another

### Critical — Human Only
- Delete a project and all its data
- No automated path; requires explicit confirmation modal + manual action

## Named Tools (v1)
| Tool | What it does | Risk |
|---|---|---|
| `score_risk` | Applies rule-based formula, writes ai_score fields | Low |
| `summarize_project` | Calls GPT-4o, writes ai_summary fields | Low |
| `draft_status_report` | Calls GPT-4o, returns draft text for user to copy | Medium |

## Audit Log Fields
Every AI action appends to `activity_logs`: `actor_name = 'AI'`, `action`, `object_type`, `object_id`, `object_title`, `created_at`.

## Agent Permissions
Agent inherits the session's user_id scope. No agent action bypasses RLS. No `run_any` or `send_any` calls.

## v1 vs Later
**v1:** `score_risk`, `summarize_project` 
**Later:** `draft_status_report`, Slack digest, reassign suggestions
