import { createClient } from "@/lib/supabase/server";
import type {
  Project,
  Owner,
  Task,
  Deliverable,
  Risk,
  Issue,
  ActivityLog,
  WithOwner,
} from "@/lib/types";
import { isOverdue } from "@/lib/format";

const OWNER_SELECT = "*, owner:owners(id,name,role)";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOwners(projectId: string): Promise<Owner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .eq("project_id", projectId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getTasks(projectId: string): Promise<WithOwner<Task>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(OWNER_SELECT)
    .eq("project_id", projectId)
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data as WithOwner<Task>[]) ?? [];
}

export async function getDeliverables(
  projectId: string,
): Promise<WithOwner<Deliverable>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deliverables")
    .select(OWNER_SELECT)
    .eq("project_id", projectId)
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data as WithOwner<Deliverable>[]) ?? [];
}

export async function getRisks(projectId: string): Promise<WithOwner<Risk>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("risks")
    .select(OWNER_SELECT)
    .eq("project_id", projectId)
    .order("ai_score", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data as WithOwner<Risk>[]) ?? [];
}

export async function getIssues(projectId: string): Promise<WithOwner<Issue>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("issues")
    .select(OWNER_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as WithOwner<Issue>[]) ?? [];
}

export async function getActivity(
  projectId: string,
  limit = 10,
): Promise<ActivityLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export interface DashboardStats {
  openTasks: number;
  overdueTasks: number;
  openRisks: number;
  openIssues: number;
  totalTasks: number;
  doneTasks: number;
  topRisk: WithOwner<Risk> | null;
}

export async function getDashboardStats(
  projectId: string,
): Promise<{ stats: DashboardStats; tasks: WithOwner<Task>[]; risks: WithOwner<Risk>[]; issues: WithOwner<Issue>[]; deliverables: WithOwner<Deliverable>[] }> {
  const [tasks, risks, issues, deliverables] = await Promise.all([
    getTasks(projectId),
    getRisks(projectId),
    getIssues(projectId),
    getDeliverables(projectId),
  ]);

  const openTasks = tasks.filter((t) => t.status !== "done").length;
  const overdueTasks =
    tasks.filter((t) => isOverdue(t.due_date, t.status)).length +
    deliverables.filter((d) => isOverdue(d.due_date, d.status)).length;
  const openRisks = risks.filter((r) => r.status === "open").length;
  const openIssues = issues.filter((i) => i.status === "open").length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const topRisk =
    risks.filter((r) => r.status === "open").sort(
      (a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0),
    )[0] ?? null;

  return {
    stats: {
      openTasks,
      overdueTasks,
      openRisks,
      openIssues,
      totalTasks: tasks.length,
      doneTasks,
      topRisk,
    },
    tasks,
    risks,
    issues,
    deliverables,
  };
}
