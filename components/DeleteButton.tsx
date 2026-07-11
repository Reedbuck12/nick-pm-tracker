"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/app/actions";

// Small trash-style delete control with an inline confirm step. No dead buttons:
// the action deletes the row and revalidates so the UI updates immediately.
export function DeleteButton({
  action,
  hidden,
  label = "Delete",
  confirmText = "Delete this item?",
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  label?: string;
  confirmText?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    ok: false,
  });
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !state.ok && state.error) {
      // keep confirm open on error
      submitted.current = false;
    }
  }, [state]);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        aria-label={label}
      >
        {label}
      </button>
    );
  }

  return (
    <form
      action={(fd) => {
        submitted.current = true;
        formAction(fd);
      }}
      className="inline-flex items-center gap-1"
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <span className="text-xs text-neutral-500">{confirmText}</span>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {pending ? "…" : "Yes"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        No
      </button>
    </form>
  );
}
