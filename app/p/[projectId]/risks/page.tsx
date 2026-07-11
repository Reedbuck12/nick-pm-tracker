import { notFound } from "next/navigation";
import { getProject, getOwners, getRisks } from "@/lib/db";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { DeleteButton } from "@/components/DeleteButton";
import { riskFields } from "@/components/fields";
import { createRisk, updateRisk, deleteRisk } from "@/app/actions";
import { Card, ScoreBadge, LevelBadge, EmptyState, SectionHeader, Badge } from "@/components/ui";
import { RISK_STATUS_LABEL } from "@/lib/format";

export const metadata = { title: "Risks" };
export const dynamic = "force-dynamic";

export default async function RisksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [owners, risks] = await Promise.all([getOwners(projectId), getRisks(projectId)]);

  return (
    <div>
      <SectionHeader
        title="Risks"
        count={risks.length}
        action={
          <RecordDialog
            action={createRisk}
            fields={riskFields(owners)}
            hidden={{ project_id: projectId }}
            title="Add Risk"
            triggerLabel="+ Add Risk"
            submitLabel="Add Risk"
          />
        }
      />
      <p className="mb-3 text-sm text-neutral-500">
        Risks are auto-scored (0–10) from likelihood × impact and ranked highest-first.
      </p>

      {risks.length === 0 ? (
        <EmptyState icon="🛡️" title="No risks logged" hint="Add a risk to see it scored and ranked." />
      ) : (
        <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {risks.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 p-3.5">
              <ScoreBadge score={r.ai_score} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{r.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <LevelBadge level={r.likelihood} prefix="Likelihood" />
                  <LevelBadge level={r.impact} prefix="Impact" />
                  <Badge className="bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
                    {RISK_STATUS_LABEL[r.status] ?? r.status}
                  </Badge>
                  {r.owner && <span className="text-xs text-neutral-400">· {r.owner.name}</span>}
                </div>
                {r.mitigation && (
                  <p className="mt-1 truncate text-sm text-neutral-500">
                    <span className="font-medium">Mitigation:</span> {r.mitigation}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <RecordDialog
                  action={updateRisk}
                  fields={riskFields(owners, {
                    title: r.title,
                    description: r.description,
                    likelihood: r.likelihood,
                    impact: r.impact,
                    status: r.status,
                    owner_id: r.owner_id,
                    mitigation: r.mitigation,
                  })}
                  hidden={{ project_id: projectId, id: r.id }}
                  title="Edit Risk"
                  triggerLabel="Edit"
                  triggerClassName={btnGhost}
                  submitLabel="Save changes"
                />
                <DeleteButton
                  action={deleteRisk}
                  hidden={{ project_id: projectId, id: r.id, title: r.title }}
                  confirmText="Delete risk?"
                />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
