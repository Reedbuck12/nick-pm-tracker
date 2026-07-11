# Data Model — PM Tracker

## projects
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner scope (v1: null for demo rows) |
| name | text | |
| description | text | |
| status | text | active / completed / on_hold |
| start_date | date | |
| end_date | date | |
| ai_summary | text | AI field |
| ai_summary_source | text | e.g. 'gpt-4o' or 'rule-based' |
| ai_summary_confidence | numeric | 0–1 |
| ai_summary_review_status | text | unreviewed / approved / rejected |
| created_at | timestamptz | |

## owners
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| project_id | uuid FK → projects | |
| name | text | |
| role | text | |
| email | text | |

## tasks
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| project_id | uuid FK → projects | |
| owner_id | uuid FK → owners nullable | |
| title | text | |
| description | text | |
| status | text | not_started / in_progress / blocked / done |
| priority | text | low / medium / high |
| due_date | date | |

## deliverables
Same shape as tasks minus `priority`.

## risks
| Extra Fields | Type | Notes |
|---|---|---|
| likelihood | text | low / medium / high |
| impact | text | low / medium / high |
| mitigation | text | |
| ai_score | numeric | AI field (0–10) |
| ai_score_source | text | |
| ai_score_confidence | numeric | |
| ai_score_review_status | text | |

## issues
| Extra Fields | Type | Notes |
|---|---|---|
| severity | text | low / medium / high |
| resolution | text | |

## activity_logs
| Field | Type | Notes |
|---|---|---|
| actor_name | text | |
| action | text | created / updated / deleted |
| object_type | text | task / risk / issue / deliverable |
| object_id | uuid | |
| object_title | text | |

## RLS
All tables: permissive v1 read+write for demo. Lock-down sprint replaces with `auth.uid() = user_id`.
