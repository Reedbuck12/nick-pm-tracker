import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getDashboardStats, getActivity } from "@/lib/db";
import { ruleBasedSummary } from "@/lib/summary";
import { SummaryCard } from "@/components/SummaryCard";
import { Card, TaskStatusBadge, ScoreBadge, LevelBadge, OverdueBadge, EmptyState } from "@/components/ui";
import { formatDate, isOverdue } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [{ stats, tasks, risks }, activity] = await Promise.all([
    getDashboardStats(projectId),
    getActivity(projectId, 8),
  ]);

  // Display fallback: if no stored summary, show a live rule-based one.
  const displaySummary =
    project.ai_summary ??
    ruleBasedSummary({
      projectName: project.name,
      projectStatus: project.status,
      openTasks: stats.openTasks,
      overdueTasks: stats.overdueTasks,
      openRisks: stats.openRisks,
      topRiskTitle: stats.topRisk?.title ?? null,
      topRiskScore: stats.topRisk?.ai_score ?? null,
      openIssues: stats.openIssues,
      totalTasks: stats.totalTasks,
      doneTasks: stats.doneTasks,
    }).text;

  const attention = tasks
    .filter((t) => isOverdue(t.due_date, t.status) || t.status === "blocked")
    .slice(0, 6);
  const topRisks = risks.filter((r) => r.status === "open").slice(0, 5);

  const cards = [
    { label: "Open Tasks", value: stats.openTasks, href: "tasks", tone: "neutral" },
    { label: "Overdue", value: stats.overdueTasks, href: "tasks", tone: stats.overdueTasks > 0 ? "red" : "neutral" },
    { label: "Open Risks", value: stats.openRisks, href: "risks", tone: stats.openRisks > 0 ? "amber" : "neutral" },
    { label: "Open Issues", value: stats.openIssues, href: "issues", tone: stats.openIssues > 0 ? "amber" : "neutral" },
  ] as const;

  const toneClass: Record<string, string> = {
    neutral: "text-neutral-900 dark:text-neutral-100",
    red: "text-red-600 dark:text-red-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {project.name}
          </h1>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {STATUS_LABEL[project.status] ?? project.status}
          </span>
        </div>
        {project.description && (
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">{project.description}</p>
        )}
        {(project.start_date || project.end_date) && (
          <p className="mt-1 text-xs text-neutral-400">
            {formatDate(project.start_date)} → {formatDate(project.end_date)}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={`/p/${projectId}/${c.href}`}>
            <Card className="p-4 transition hover:shadow-md">
              <div className={`text-3xl font-bold tabular-nums ${toneClass[c.tone]}`}>{c.value}</div>
              <div className="mt-1 text-sm text-neutral-500">{c.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <SummaryCard
        projectId={project.id}
        summary={displaySummary}
        source={project.ai_summary_source ?? "rule-based"}
        confidence={project.ai_summary_confidence ?? 0.8}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top risks */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Risks</h2>
            <Link href={`/p/${projectId}/risks`} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View all →
            </Link>
          </div>
          {topRisks.length === 0 ? (
            <EmptyState icon="🛡️" title="No open risks" hint="Log a risk to see it scored and ranked here." />
          ) : (
            <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {topRisks.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3">
                  <ScoreBadge score={r.ai_score} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{r.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <LevelBadge level={r.likelihood} prefix="L" />
                      <LevelBadge level={r.impact} prefix="I" />
                      {r.owner && <span className="text-xs text-neutral-400">· {r.owner.name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </section>

        {/* Needs attention */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Needs Attention</h2>
            <Link href={`/p/${projectId}/tasks`} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View tasks →
            </Link>
          </div>
          {attention.length === 0 ? (
            <EmptyState icon="✅" title="Nothing overdue or blocked" hint="All tasks are on track." />
          ) : (
            <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {attention.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3">
                  <TaskStatusBadge status={t.status} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.title}</p>
                    <p className="text-xs text-neutral-400">
                      Due {formatDate(t.due_date)}
                      {t.owner ? ` · ${t.owner.name}` : ""}
                    </p>
                  </div>
                  {isOverdue(t.due_date, t.status) && <OverdueBadge />}
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>

      {/* Activity feed */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
        {activity.length === 0 ? (
          <EmptyState icon="🕓" title="No activity yet" hint="Create or edit an item and it will show up here." />
        ) : (
          <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    a.actor_name === "AI"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {a.actor_name === "AI" ? "AI" : "•"}
                </span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  <span className="font-medium text-neutral-800 dark:text-neutral-100">{a.actor_name}</span>{" "}
                  {a.action} {a.object_type}
                  {a.object_title ? ` — ${a.object_title}` : ""}
                </span>
                <span className="ml-auto shrink-0 text-xs text-neutral-400">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
