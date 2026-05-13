import { createClient } from '@supabase/supabase-js';

const resolveEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return null;
};

const DATABASE_URL = resolveEnvValue('DATABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const DATABASE_SERVICE_ROLE_KEY = resolveEnvValue('DATABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY');

const isSupabaseConfigured = () => !!(DATABASE_URL && DATABASE_SERVICE_ROLE_KEY);

const createMockClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: new Error('Supabase server not configured') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase server not configured') }),
    updateUser: async () => ({ data: null, error: new Error('Supabase server not configured') }),
    admin: {
      updateUserById: async (_userId: string, _attributes: any) => ({ data: null, error: new Error('Supabase server not configured') }),
    },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Supabase server not configured') }),
      }),
    }),
  }),
});

if (!isSupabaseConfigured()) {
  console.warn(
    'Supabase server admin client is not configured. Define DATABASE_URL or SUPABASE_URL and DATABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY.',
  );
}

export const supabaseAdmin = isSupabaseConfigured()
  ? createClient(DATABASE_URL!, DATABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${DATABASE_SERVICE_ROLE_KEY}`,
        },
      },
    })
  : createMockClient() as any;

export { isSupabaseConfigured };
