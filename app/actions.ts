"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreRisk } from "@/lib/scoring";
import { summarizeProject, type ProjectStats } from "@/lib/summary";
import { getDashboardStats, getProject } from "@/lib/db";
import type { Level, TaskStatus } from "@/lib/types";

export interface ActionState {
  ok: boolean;
  error?: string;
}

// Return a fresh object on every success so client effects re-fire each submit.
function ok(): ActionState {
  return { ok: true };
}

function fail(error: string): ActionState {
  return { ok: false, error };
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? "").toString().trim();
}

function nullable(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

async function logActivity(
  projectId: string,
  action: "created" | "updated" | "deleted",
  objectType: string,
  objectId: string | null,
  objectTitle: string | null,
  actor = "You",
) {
  const supabase = await createClient();
  await supabase.from("activity_logs").insert({
    project_id: projectId,
    actor_name: actor,
    action,
    object_type: objectType,
    object_id: objectId,
    object_title: objectTitle,
  });
}

function revalidateProject(projectId: string) {
  revalidatePath(`/p/${projectId}`);
  revalidatePath(`/p/${projectId}/tasks`);
  revalidatePath(`/p/${projectId}/risks`);
  revalidatePath(`/p/${projectId}/issues`);
  revalidatePath(`/p/${projectId}/deliverables`);
  revalidatePath("/");
}

/* ------------------------------- Projects -------------------------------- */

export async function createProject(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const name = str(fd, "name");
  if (!name) return fail("Project name is required.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description: nullable(fd, "description"),
      status: str(fd, "status") || "active",
      start_date: nullable(fd, "start_date"),
      end_date: nullable(fd, "end_date"),
    })
    .select("id")
    .single();
  if (error) return fail(error.message);
  await logActivity(data.id, "created", "project", data.id, name);
  revalidatePath("/");
  return ok();
}

/* -------------------------------- Owners --------------------------------- */

export async function createOwner(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  const name = str(fd, "name");
  if (!projectId) return fail("Missing project.");
  if (!name) return fail("Owner name is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("owners").insert({
    project_id: projectId,
    name,
    role: nullable(fd, "role"),
    email: nullable(fd, "email"),
  });
  if (error) return fail(error.message);
  await logActivity(projectId, "created", "owner", null, name);
  revalidateProject(projectId);
  return ok();
}

export async function updateOwner(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  const name = str(fd, "name");
  if (!id || !projectId) return fail("Missing owner.");
  if (!name) return fail("Owner name is required.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("owners")
    .update({ name, role: nullable(fd, "role"), email: nullable(fd, "email") })
    .eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "owner", id, name);
  revalidateProject(projectId);
  return ok();
}

export async function deleteOwner(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  if (!id || !projectId) return fail("Missing owner.");
  const supabase = await createClient();
  // owner_id on tasks/risks/etc. is ON DELETE SET NULL, so rows become unassigned.
  const { error } = await supabase.from("owners").delete().eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "deleted", "owner", id, str(fd, "name") || null);
  revalidateProject(projectId);
  return ok();
}

/* --------------------------------- Tasks --------------------------------- */

export async function createTask(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!projectId) return fail("Missing project.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    title,
    description: nullable(fd, "description"),
    status: (str(fd, "status") as TaskStatus) || "not_started",
    priority: str(fd, "priority") || "medium",
    due_date: nullable(fd, "due_date"),
    owner_id: nullable(fd, "owner_id"),
  });
  if (error) return fail(error.message);
  await logActivity(projectId, "created", "task", null, title);
  revalidateProject(projectId);
  return ok();
}

export async function updateTask(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!id || !projectId) return fail("Missing task.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description: nullable(fd, "description"),
      status: (str(fd, "status") as TaskStatus) || "not_started",
      priority: str(fd, "priority") || "medium",
      due_date: nullable(fd, "due_date"),
      owner_id: nullable(fd, "owner_id"),
    })
    .eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "task", id, title);
  revalidateProject(projectId);
  return ok();
}

export async function deleteTask(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  if (!id || !projectId) return fail("Missing task.");
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "deleted", "task", id, str(fd, "title") || null);
  revalidateProject(projectId);
  return ok();
}

/* ----------------------------- Deliverables ------------------------------ */

export async function createDeliverable(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!projectId) return fail("Missing project.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("deliverables").insert({
    project_id: projectId,
    title,
    description: nullable(fd, "description"),
    status: (str(fd, "status") as TaskStatus) || "not_started",
    due_date: nullable(fd, "due_date"),
    owner_id: nullable(fd, "owner_id"),
  });
  if (error) return fail(error.message);
  await logActivity(projectId, "created", "deliverable", null, title);
  revalidateProject(projectId);
  return ok();
}

export async function updateDeliverable(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!id || !projectId) return fail("Missing deliverable.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("deliverables")
    .update({
      title,
      description: nullable(fd, "description"),
      status: (str(fd, "status") as TaskStatus) || "not_started",
      due_date: nullable(fd, "due_date"),
      owner_id: nullable(fd, "owner_id"),
    })
    .eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "deliverable", id, title);
  revalidateProject(projectId);
  return ok();
}

export async function deleteDeliverable(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  if (!id || !projectId) return fail("Missing deliverable.");
  const supabase = await createClient();
  const { error } = await supabase.from("deliverables").delete().eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "deleted", "deliverable", id, str(fd, "title") || null);
  revalidateProject(projectId);
  return ok();
}

/* --------------------------------- Risks --------------------------------- */

export async function createRisk(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!projectId) return fail("Missing project.");
  if (!title) return fail("Title is required.");
  const likelihood = (str(fd, "likelihood") || "medium") as Level;
  const impact = (str(fd, "impact") || "medium") as Level;
  const s = scoreRisk(likelihood, impact);
  const supabase = await createClient();
  const { error } = await supabase.from("risks").insert({
    project_id: projectId,
    title,
    description: nullable(fd, "description"),
    likelihood,
    impact,
    status: str(fd, "status") || "open",
    mitigation: nullable(fd, "mitigation"),
    owner_id: nullable(fd, "owner_id"),
    ai_score: s.score,
    ai_score_source: s.source,
    ai_score_confidence: s.confidence,
    ai_score_review_status: s.review_status,
  });
  if (error) return fail(error.message);
  await logActivity(projectId, "created", "risk", null, title);
  await logActivity(projectId, "updated", "risk", null, `AI scored "${title}" at ${s.score}`, "AI");
  revalidateProject(projectId);
  return ok();
}

export async function updateRisk(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!id || !projectId) return fail("Missing risk.");
  if (!title) return fail("Title is required.");
  const likelihood = (str(fd, "likelihood") || "medium") as Level;
  const impact = (str(fd, "impact") || "medium") as Level;
  const s = scoreRisk(likelihood, impact);
  const supabase = await createClient();
  const { error } = await supabase
    .from("risks")
    .update({
      title,
      description: nullable(fd, "description"),
      likelihood,
      impact,
      status: str(fd, "status") || "open",
      mitigation: nullable(fd, "mitigation"),
      owner_id: nullable(fd, "owner_id"),
      ai_score: s.score,
      ai_score_source: s.source,
      ai_score_confidence: s.confidence,
      ai_score_review_status: s.review_status,
    })
    .eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "risk", id, title);
  revalidateProject(projectId);
  return ok();
}

export async function deleteRisk(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  if (!id || !projectId) return fail("Missing risk.");
  const supabase = await createClient();
  const { error } = await supabase.from("risks").delete().eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "deleted", "risk", id, str(fd, "title") || null);
  revalidateProject(projectId);
  return ok();
}

/* --------------------------------- Issues -------------------------------- */

export async function createIssue(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!projectId) return fail("Missing project.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("issues").insert({
    project_id: projectId,
    title,
    description: nullable(fd, "description"),
    severity: str(fd, "severity") || "medium",
    status: str(fd, "status") || "open",
    resolution: nullable(fd, "resolution"),
    owner_id: nullable(fd, "owner_id"),
  });
  if (error) return fail(error.message);
  await logActivity(projectId, "created", "issue", null, title);
  revalidateProject(projectId);
  return ok();
}

export async function updateIssue(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  const title = str(fd, "title");
  if (!id || !projectId) return fail("Missing issue.");
  if (!title) return fail("Title is required.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("issues")
    .update({
      title,
      description: nullable(fd, "description"),
      severity: str(fd, "severity") || "medium",
      status: str(fd, "status") || "open",
      resolution: nullable(fd, "resolution"),
      owner_id: nullable(fd, "owner_id"),
    })
    .eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "issue", id, title);
  revalidateProject(projectId);
  return ok();
}

export async function deleteIssue(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  const projectId = str(fd, "project_id");
  if (!id || !projectId) return fail("Missing issue.");
  const supabase = await createClient();
  const { error } = await supabase.from("issues").delete().eq("id", id);
  if (error) return fail(error.message);
  await logActivity(projectId, "deleted", "issue", id, str(fd, "title") || null);
  revalidateProject(projectId);
  return ok();
}

/* ------------------------------ AI summary ------------------------------- */

export async function refreshSummary(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const projectId = str(fd, "project_id");
  if (!projectId) return fail("Missing project.");
  const [project, dash] = await Promise.all([
    getProject(projectId),
    getDashboardStats(projectId),
  ]);
  if (!project) return fail("Project not found.");

  const stats: ProjectStats = {
    projectName: project.name,
    projectStatus: project.status,
    openTasks: dash.stats.openTasks,
    overdueTasks: dash.stats.overdueTasks,
    openRisks: dash.stats.openRisks,
    topRiskTitle: dash.stats.topRisk?.title ?? null,
    topRiskScore: dash.stats.topRisk?.ai_score ?? null,
    openIssues: dash.stats.openIssues,
    totalTasks: dash.stats.totalTasks,
    doneTasks: dash.stats.doneTasks,
  };

  const result = await summarizeProject(stats);
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      ai_summary: result.text,
      ai_summary_source: result.source,
      ai_summary_confidence: result.confidence,
      ai_summary_review_status: "unreviewed",
    })
    .eq("id", projectId);
  if (error) return fail(error.message);
  await logActivity(projectId, "updated", "summary", projectId, "AI project summary refreshed", "AI");
  revalidateProject(projectId);
  return ok();
}
