"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

export function ProjectSwitcher({
  projects,
  currentId,
}: {
  projects: Pick<Project, "id" | "name">[];
  currentId: string;
}) {
  const router = useRouter();
  return (
    <select
      value={currentId}
      onChange={(e) => router.push(`/p/${e.target.value}`)}
      className="max-w-[15rem] truncate rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      aria-label="Switch project"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
