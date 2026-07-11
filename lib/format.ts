import type { TaskStatus, Priority, Level, RiskStatus, IssueStatus } from "./types";

// Today's date as an ISO yyyy-mm-dd string (local), for overdue comparisons.
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

// Overdue = has a due date in the past AND not in a terminal/done state.
export function isOverdue(due_date: string | null, status: string): boolean {
  if (!due_date) return false;
  if (status === "done" || status === "resolved" || status === "closed") return false;
  return due_date < todayISO();
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const LEVEL_LABEL: Record<Level, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const RISK_STATUS_LABEL: Record<RiskStatus, string> = {
  open: "Open",
  mitigated: "Mitigated",
  closed: "Closed",
};

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  open: "Open",
  resolved: "Resolved",
};

// Tailwind classes per status badge. Colors from docs/TASKS.md Sprint 2.
export function taskStatusClasses(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700";
    case "in_progress":
      return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900";
    case "done":
      return "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-900";
  }
}

export function levelClasses(level: Level): string {
  switch (level) {
    case "high":
      return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900";
    case "medium":
      return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900";
    case "low":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700";
  }
}

// Risk score color: 8+ critical (red), 5-7.9 elevated (amber), <5 low (neutral).
export function scoreClasses(score: number | null): string {
  if (score == null) return "bg-neutral-100 text-neutral-500 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700";
  if (score >= 8) return "bg-red-100 text-red-800 ring-red-300 dark:bg-red-950 dark:text-red-300 dark:ring-red-800";
  if (score >= 5) return "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900";
}
