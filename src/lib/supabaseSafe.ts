/**
 * Safe Supabase client wrapper that doesn't throw errors when env vars are missing.
 * This allows the app to run in demo mode without Supabase configuration.
 */

export interface SafeSupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: {
    id: string;
    email?: string;
  };
}

export interface SafeSupabaseClient {
  auth: {
    getSession: () => Promise<{ data: { session: SafeSupabaseSession | null } | null; error: unknown }>;
  };
  isConfigured: boolean;
}

let cachedClient: SafeSupabaseClient | null = null;

export async function getSafeSupabase(): Promise<SafeSupabaseClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isConfigured = !!(supabaseUrl && supabaseAnonKey);

  if (isConfigured && typeof window !== 'undefined') {
    try {
      // Use dynamic import for ESM compatibility
      const { supabase } = await import('@/integrations/supabase/client');
      cachedClient = {
        auth: supabase.auth,
        isConfigured: true,
      };
      return cachedClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
    }
  }

  // Return a mock client for development/demo mode
  cachedClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    isConfigured: false,
  };

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}