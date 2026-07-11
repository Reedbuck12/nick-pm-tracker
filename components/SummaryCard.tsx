"use client";

import { useActionState } from "react";
import { refreshSummary, type ActionState } from "@/app/actions";

export function SummaryCard({
  projectId,
  summary,
  source,
  confidence,
}: {
  projectId: string;
  summary: string | null;
  source: string | null;
  confidence: number | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(refreshSummary, {
    ok: false,
  });

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-neutral-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            AI
          </span>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Project Summary
          </h2>
        </div>
        <form action={formAction}>
          <input type="hidden" name="project_id" value={projectId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-indigo-300 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:opacity-60 dark:border-indigo-800 dark:bg-neutral-900 dark:text-indigo-300"
          >
            {pending ? "Refreshing…" : "↻ Refresh"}
          </button>
        </form>
      </div>

      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
        {summary ?? "No summary yet — click Refresh to generate one."}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
        {source && <span>Source: {source}</span>}
        {confidence != null && <span>Confidence: {Math.round(confidence * 100)}%</span>}
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">unreviewed</span>
      </div>

      {!state.ok && state.error && (
        <p className="mt-2 text-xs text-red-600">
          Summary unavailable — try refreshing. ({state.error})
        </p>
      )}
    </div>
  );
}
