"use client";

import { useActionState, useEffect, useState, useRef, type ReactNode } from "react";
import type { ActionState } from "@/app/actions";

export type FieldDef =
  | {
      name: string;
      label: string;
      type: "text" | "date" | "email";
      required?: boolean;
      placeholder?: string;
      defaultValue?: string | null;
      full?: boolean;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      required?: boolean;
      placeholder?: string;
      defaultValue?: string | null;
      full?: boolean;
    }
  | {
      name: string;
      label: string;
      type: "select";
      required?: boolean;
      options: { value: string; label: string }[];
      defaultValue?: string | null;
      full?: boolean;
    };

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800";

export function RecordDialog({
  action,
  fields,
  hidden,
  title,
  triggerLabel,
  triggerClassName = btnPrimary,
  submitLabel = "Save",
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  fields: FieldDef[];
  hidden: Record<string, string>;
  title: string;
  triggerLabel: ReactNode;
  triggerClassName?: string;
  submitLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    ok: false,
  });
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && state.ok) {
      setOpen(false);
      submitted.current = false;
    }
  }, [state]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/50 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="my-8 w-full max-w-lg rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form
              action={(fd) => {
                submitted.current = true;
                formAction(fd);
              }}
              className="px-5 py-4"
            >
              {Object.entries(hidden).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}

              {!state.ok && state.error && (
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900">
                  {state.error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {fields.map((f) => (
                  <div key={f.name} className={f.full ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                    <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {f.label}
                      {f.required && <span className="text-red-500"> *</span>}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea
                        name={f.name}
                        required={f.required}
                        placeholder={f.placeholder}
                        defaultValue={f.defaultValue ?? ""}
                        rows={3}
                        className={inputClass}
                      />
                    ) : f.type === "select" ? (
                      <select
                        name={f.name}
                        required={f.required}
                        defaultValue={f.defaultValue ?? f.options[0]?.value}
                        className={inputClass}
                      >
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        name={f.name}
                        required={f.required}
                        placeholder={f.placeholder}
                        defaultValue={f.defaultValue ?? ""}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" className={btnGhost} onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={btnPrimary} disabled={pending}>
                  {pending ? "Saving…" : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
