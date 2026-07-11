import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Current signed-in user (or null for anonymous demo visitors).
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
