import type { ReactNode } from "react";
import {
  taskStatusClasses,
  levelClasses,
  scoreClasses,
  TASK_STATUS_LABEL,
  LEVEL_LABEL,
} from "@/lib/format";
import type { TaskStatus, Level } from "@/lib/types";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={taskStatusClasses(status)}>{TASK_STATUS_LABEL[status]}</Badge>;
}

export function LevelBadge({ level, prefix }: { level: Level; prefix?: string }) {
  return (
    <Badge className={levelClasses(level)}>
      {prefix ? `${prefix}: ` : ""}
      {LEVEL_LABEL[level]}
    </Badge>
  );
}

export function ScoreBadge({ score }: { score: number | null }) {
  return (
    <Badge className={scoreClasses(score)}>
      <span className="font-semibold tabular-nums">{score == null ? "—" : score.toFixed(1)}</span>
    </Badge>
  );
}

export function OverdueBadge() {
  return (
    <Badge className="bg-red-600 text-white ring-red-700">Overdue</Badge>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
      {icon && <div className="text-3xl">{icon}</div>}
      <p className="font-medium text-neutral-700 dark:text-neutral-200">{title}</p>
      {hint && <p className="max-w-sm text-sm text-neutral-500">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  count,
  action,
}: {
  title: string;
  count?: number;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
        {count != null && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {count}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}
