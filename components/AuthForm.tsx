"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/auth/actions";
import { btnPrimary } from "@/components/RecordDialog";

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {
    ok: false,
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
            PM
          </span>
          PM Tracker
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {mode === "login" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "login"
            ? "Access your private projects."
            : "Your projects stay private to you. The demo stays public."}
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        {state.error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900">
            {state.error}
          </div>
        )}
        {state.ok && state.message && (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
            {state.message}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Email
          </label>
          <input type="email" name="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            className={inputClass}
          />
        </div>

        <button type="submit" className={`${btnPrimary} w-full`} disabled={pending}>
          {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/signup" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Sign in
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-xs text-neutral-400">
        <Link href="/" className="hover:underline">
          ← Back to the public demo
        </Link>
      </p>
    </div>
  );
}
