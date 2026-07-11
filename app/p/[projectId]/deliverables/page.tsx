import { notFound } from "next/navigation";
import { getProject, getOwners, getDeliverables } from "@/lib/db";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { DeleteButton } from "@/components/DeleteButton";
import { deliverableFields } from "@/components/fields";
import { createDeliverable, updateDeliverable, deleteDeliverable } from "@/app/actions";
import { Card, TaskStatusBadge, OverdueBadge, EmptyState, SectionHeader } from "@/components/ui";
import { formatDate, isOverdue } from "@/lib/format";

export const metadata = { title: "Deliverables" };
export const dynamic = "force-dynamic";

export default async function DeliverablesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [owners, deliverables] = await Promise.all([
    getOwners(projectId),
    getDeliverables(projectId),
  ]);

  return (
    <div>
      <SectionHeader
        title="Deliverables"
        count={deliverables.length}
        action={
          <RecordDialog
            action={createDeliverable}
            fields={deliverableFields(owners)}
            hidden={{ project_id: projectId }}
            title="Add Deliverable"
            triggerLabel="+ Add Deliverable"
            submitLabel="Add Deliverable"
          />
        }
      />

      {deliverables.length === 0 ? (
        <EmptyState icon="📦" title="No deliverables yet" hint="Add the artifacts this project needs to ship." />
      ) : (
        <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {deliverables.map((d) => {
            const overdue = isOverdue(d.due_date, d.status);
            return (
              <div key={d.id} className="flex flex-wrap items-center gap-3 p-3.5">
                <TaskStatusBadge status={d.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{d.title}</p>
                    {overdue && <OverdueBadge />}
                  </div>
                  {d.description && <p className="mt-0.5 truncate text-sm text-neutral-500">{d.description}</p>}
                </div>
                <div className="w-28 text-sm text-neutral-500">{d.owner?.name ?? "Unassigned"}</div>
                <div className={`w-28 text-sm ${overdue ? "font-medium text-red-600 dark:text-red-400" : "text-neutral-500"}`}>
                  {formatDate(d.due_date)}
                </div>
                <div className="flex items-center gap-1">
                  <RecordDialog
                    action={updateDeliverable}
                    fields={deliverableFields(owners, {
                      title: d.title,
                      description: d.description,
                      status: d.status,
                      owner_id: d.owner_id,
                      due_date: d.due_date,
                    })}
                    hidden={{ project_id: projectId, id: d.id }}
                    title="Edit Deliverable"
                    triggerLabel="Edit"
                    triggerClassName={btnGhost}
                    submitLabel="Save changes"
                  />
                  <DeleteButton
                    action={deleteDeliverable}
                    hidden={{ project_id: projectId, id: d.id, title: d.title }}
                    confirmText="Delete deliverable?"
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
