# Intelligence Layer — PM Tracker

## Messy Input
PMs log risks with free-text titles, vague likelihood/impact labels, and no consistent scoring.

## Auto-Structured Schema (per risk)
```json
{
  "risk_id": "uuid",
  "title": "Third-party API deprecation",
  "likelihood": "high",
  "impact": "high",
  "ai_score": 8.5,
  "ai_score_source": "rule-based",
  "ai_score_confidence": 0.88,
  "ai_score_review_status": "unreviewed"
}
```

## Events to Track
- Task created / status changed / overdue
- Risk added / score changed
- Issue opened / resolved
- Deliverable due date passed without `done` status

## Scoring Rules (v1 — rule-based, no AI call needed)
| Likelihood | Impact | Score |
|---|---|---|
| high | high | 8–10 |
| high | medium | 6–7 |
| medium | high | 6–7 |
| medium | medium | 4–5 |
| low | * | 1–3 |

## What Gets Ranked
- Risks sorted by `ai_score` descending on dashboard
- Open/blocked tasks sorted by due_date ascending

## AI Project Summary (v1)
- Triggered on dashboard load if `ai_summary_review_status = 'unreviewed'` or stale (>1 hr)
- Prompt: open task count, overdue count, top risks, open issues → GPT returns 2-sentence summary
- Stored in `projects.ai_summary` with source + confidence

## v1 vs Later
**v1:** Rule-based risk scores; GPT project summary (auto) 
**Later:** GPT risk scoring with justification; weekly AI status report draft
