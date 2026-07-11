"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { seg: "", label: "Dashboard" },
  { seg: "tasks", label: "Tasks" },
  { seg: "deliverables", label: "Deliverables" },
  { seg: "risks", label: "Risks" },
  { seg: "issues", label: "Issues" },
  { seg: "team", label: "Team" },
];

export function WorkspaceNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/p/${projectId}`;

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
      {TABS.map((t) => {
        const href = t.seg ? `${base}/${t.seg}` : base;
        const active = t.seg ? pathname === href : pathname === base;
        return (
          <Link
            key={t.seg || "dashboard"}
            href={href}
            className={`-mb-px whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition ${
              active
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
