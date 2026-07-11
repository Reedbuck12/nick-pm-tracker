// Shared domain types for PM Tracker. Mirror supabase/migrations/0001_init.sql.

export type ProjectStatus = "active" | "completed" | "on_hold";
export type TaskStatus = "not_started" | "in_progress" | "blocked" | "done";
export type Priority = "low" | "medium" | "high";
export type Level = "low" | "medium" | "high";
export type RiskStatus = "open" | "mitigated" | "closed";
export type IssueStatus = "open" | "resolved";
export type ReviewStatus = "unreviewed" | "approved" | "rejected";

export interface Project {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  ai_summary: string | null;
  ai_summary_source: string | null;
  ai_summary_confidence: number | null;
  ai_summary_review_status: ReviewStatus | null;
  created_at: string;
}

export interface Owner {
  id: string;
  user_id: string | null;
  project_id: string;
  name: string;
  role: string | null;
  email: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string | null;
  project_id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  user_id: string | null;
  project_id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export interface Risk {
  id: string;
  user_id: string | null;
  project_id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  likelihood: Level;
  impact: Level;
  status: RiskStatus;
  mitigation: string | null;
  ai_score: number | null;
  ai_score_source: string | null;
  ai_score_confidence: number | null;
  ai_score_review_status: ReviewStatus | null;
  created_at: string;
}

export interface Issue {
  id: string;
  user_id: string | null;
  project_id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  severity: Level;
  status: IssueStatus;
  resolution: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  project_id: string;
  actor_name: string | null;
  action: string;
  object_type: string;
  object_id: string | null;
  object_title: string | null;
  created_at: string;
}

// Rows joined with their owner (via PostgREST embedding).
export type WithOwner<T> = T & { owner: Pick<Owner, "id" | "name" | "role"> | null };
