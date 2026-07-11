import Link from "next/link";
import { signOut } from "@/app/auth/actions";

// Server component: shows the signed-in user's email + Logout, or a Sign in link.
export function UserMenu({ email }: { email: string | null }) {
  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-[12rem] truncate text-sm text-neutral-500 md:inline"
        title={email}
      >
        {email}
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
