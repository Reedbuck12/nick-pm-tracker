import { notFound } from "next/navigation";
import { getProject, getOwners } from "@/lib/db";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { DeleteButton } from "@/components/DeleteButton";
import { ownerFields } from "@/components/fields";
import { createOwner, updateOwner, deleteOwner } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui";

export const metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const owners = await getOwners(projectId);

  return (
    <div>
      <SectionHeader
        title="Team"
        count={owners.length}
        action={
          <RecordDialog
            action={createOwner}
            fields={ownerFields()}
            hidden={{ project_id: projectId }}
            title="Add Owner"
            triggerLabel="+ Add Owner"
            submitLabel="Add Owner"
          />
        }
      />
      <p className="mb-3 text-sm text-neutral-500">
        Owners can be assigned to tasks, deliverables, risks, and issues.
      </p>

      {owners.length === 0 ? (
        <EmptyState icon="👥" title="No team members yet" hint="Add owners so you can assign work." />
      ) : (
        <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {owners.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {o.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{o.name}</p>
                <p className="truncate text-sm text-neutral-500">
                  {o.role ?? "—"}
                  {o.email ? ` · ${o.email}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <RecordDialog
                  action={updateOwner}
                  fields={ownerFields({ name: o.name, role: o.role, email: o.email })}
                  hidden={{ project_id: projectId, id: o.id }}
                  title="Edit Owner"
                  triggerLabel="Edit"
                  triggerClassName={btnGhost}
                  submitLabel="Save changes"
                />
                <DeleteButton
                  action={deleteOwner}
                  hidden={{ project_id: projectId, id: o.id, name: o.name }}
                  confirmText="Remove owner?"
                />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
