import Link from "next/link";

export function TaskFilter({
  projectId,
  overdueCount,
  active,
}: {
  projectId: string;
  overdueCount: number;
  active: boolean;
}) {
  const base = `/p/${projectId}/tasks`;
  const pill = (on: boolean) =>
    `rounded-full px-3 py-1 text-sm font-medium transition ${
      on
        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    }`;

  return (
    <div className="flex items-center gap-2">
      <Link href={base} className={pill(!active)}>
        All
      </Link>
      <Link href={`${base}?filter=overdue`} className={pill(active)}>
        Overdue{overdueCount > 0 ? ` (${overdueCount})` : ""}
      </Link>
    </div>
  );
}
