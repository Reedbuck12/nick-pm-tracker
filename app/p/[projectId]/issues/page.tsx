import { notFound } from "next/navigation";
import { getProject, getOwners, getIssues } from "@/lib/db";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { DeleteButton } from "@/components/DeleteButton";
import { issueFields } from "@/components/fields";
import { createIssue, updateIssue, deleteIssue } from "@/app/actions";
import { Card, LevelBadge, EmptyState, SectionHeader, Badge } from "@/components/ui";

export const metadata = { title: "Issues" };
export const dynamic = "force-dynamic";

export default async function IssuesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [owners, issues] = await Promise.all([getOwners(projectId), getIssues(projectId)]);

  return (
    <div>
      <SectionHeader
        title="Issues"
        count={issues.length}
        action={
          <RecordDialog
            action={createIssue}
            fields={issueFields(owners)}
            hidden={{ project_id: projectId }}
            title="Add Issue"
            triggerLabel="+ Add Issue"
            submitLabel="Add Issue"
          />
        }
      />

      {issues.length === 0 ? (
        <EmptyState icon="🐞" title="No issues logged" hint="Track blockers and defects here as they come up." />
      ) : (
        <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {issues.map((i) => {
            const resolved = i.status === "resolved";
            return (
              <div key={i.id} className="flex flex-wrap items-center gap-3 p-3.5">
                <Badge
                  className={
                    resolved
                      ? "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-900"
                      : "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900"
                  }
                >
                  {resolved ? "Resolved" : "Open"}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${resolved ? "text-neutral-500 line-through" : "text-neutral-900 dark:text-neutral-100"}`}>
                    {i.title}
                  </p>
                  {i.description && <p className="mt-0.5 truncate text-sm text-neutral-500">{i.description}</p>}
                  {i.resolution && (
                    <p className="mt-0.5 truncate text-sm text-emerald-600 dark:text-emerald-400">
                      <span className="font-medium">Resolution:</span> {i.resolution}
                    </p>
                  )}
                </div>
                <LevelBadge level={i.severity} prefix="Severity" />
                <div className="w-28 text-sm text-neutral-500">{i.owner?.name ?? "Unassigned"}</div>
                <div className="flex items-center gap-1">
                  <RecordDialog
                    action={updateIssue}
                    fields={issueFields(owners, {
                      title: i.title,
                      description: i.description,
                      severity: i.severity,
                      status: i.status,
                      owner_id: i.owner_id,
                      resolution: i.resolution,
                    })}
                    hidden={{ project_id: projectId, id: i.id }}
                    title="Edit Issue"
                    triggerLabel="Edit"
                    triggerClassName={btnGhost}
                    submitLabel="Save changes"
                  />
                  <DeleteButton
                    action={deleteIssue}
                    hidden={{ project_id: projectId, id: i.id, title: i.title }}
                    confirmText="Delete issue?"
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
