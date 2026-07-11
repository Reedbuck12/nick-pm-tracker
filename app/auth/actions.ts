"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  ok: boolean;
  error?: string;
  message?: string;
}

function email(fd: FormData) {
  return (fd.get("email") ?? "").toString().trim();
}
function password(fd: FormData) {
  return (fd.get("password") ?? "").toString();
}

export async function signIn(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const e = email(fd);
  const p = password(fd);
  if (!e || !p) return { ok: false, error: "Email and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const e = email(fd);
  const p = password(fd);
  if (!e || !p) return { ok: false, error: "Email and password are required." };
  if (p.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email: e, password: p });
  if (error) return { ok: false, error: error.message };

  // If email confirmation is enabled, there's no active session yet.
  if (!data.session) {
    return {
      ok: true,
      message: "Account created. Check your email to confirm, then sign in.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
