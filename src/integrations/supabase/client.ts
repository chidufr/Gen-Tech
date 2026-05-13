// This file is protected and cannot be modified.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const resolveEnvValue = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  throw new Error(
    `Missing required environment variable. Define one of: ${keys.join(", ")}.`,
  );
};

const SUPABASE_URL = resolveEnvValue("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_ANON_KEY = resolveEnvValue("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window === "object" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
