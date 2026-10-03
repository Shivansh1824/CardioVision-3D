import { createClient } from '@supabase/supabase-js';

// Retrieve client-safe Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only instantiate if keys exist to prevent runtime crashes if env is absent
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper to check if live Supabase Auth is configured
 */
export const isSupabaseConfigured = () => Boolean(supabase);
