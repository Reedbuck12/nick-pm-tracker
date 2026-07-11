import { notFound } from "next/navigation";
import { getProject, getOwners, getTasks } from "@/lib/db";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { DeleteButton } from "@/components/DeleteButton";
import { taskFields } from "@/components/fields";
import { createTask, updateTask, deleteTask } from "@/app/actions";
import { Card, TaskStatusBadge, LevelBadge, OverdueBadge, EmptyState, SectionHeader } from "@/components/ui";
import { formatDate, isOverdue } from "@/lib/format";
import { TaskFilter } from "@/components/TaskFilter";

export const metadata = { title: "Tasks" };
export const dynamic = "force-dynamic";

export default async function TasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { projectId } = await params;
  const { filter } = await searchParams;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [owners, tasks] = await Promise.all([getOwners(projectId), getTasks(projectId)]);

  const overdueOnly = filter === "overdue";
  const shown = overdueOnly ? tasks.filter((t) => isOverdue(t.due_date, t.status)) : tasks;
  const overdueCount = tasks.filter((t) => isOverdue(t.due_date, t.status)).length;

  return (
    <div>
      <SectionHeader
        title="Tasks"
        count={tasks.length}
        action={
          <RecordDialog
            action={createTask}
            fields={taskFields(owners)}
            hidden={{ project_id: projectId }}
            title="Add Task"
            triggerLabel="+ Add Task"
            submitLabel="Add Task"
          />
        }
      />

      <div className="mb-3">
        <TaskFilter projectId={projectId} overdueCount={overdueCount} active={overdueOnly} />
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="📝"
          title={overdueOnly ? "No overdue tasks" : "No tasks yet"}
          hint={overdueOnly ? "Everything is on track." : "Add your first task to start tracking work."}
        />
      ) : (
        <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {shown.map((t) => {
            const overdue = isOverdue(t.due_date, t.status);
            return (
              <div key={t.id} className="flex flex-wrap items-center gap-3 p-3.5">
                <TaskStatusBadge status={t.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{t.title}</p>
                    {overdue && <OverdueBadge />}
                  </div>
                  {t.description && (
                    <p className="mt-0.5 truncate text-sm text-neutral-500">{t.description}</p>
                  )}
                </div>
                <LevelBadge level={t.priority} prefix="Priority" />
                <div className="w-28 text-sm text-neutral-500">{t.owner?.name ?? "Unassigned"}</div>
                <div className={`w-28 text-sm ${overdue ? "font-medium text-red-600 dark:text-red-400" : "text-neutral-500"}`}>
                  {formatDate(t.due_date)}
                </div>
                <div className="flex items-center gap-1">
                  <RecordDialog
                    action={updateTask}
                    fields={taskFields(owners, {
                      title: t.title,
                      description: t.description,
                      status: t.status,
                      priority: t.priority,
                      owner_id: t.owner_id,
                      due_date: t.due_date,
                    })}
                    hidden={{ project_id: projectId, id: t.id }}
                    title="Edit Task"
                    triggerLabel="Edit"
                    triggerClassName={btnGhost}
                    submitLabel="Save changes"
                  />
                  <DeleteButton
                    action={deleteTask}
                    hidden={{ project_id: projectId, id: t.id, title: t.title }}
                    confirmText="Delete task?"
                  />
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
