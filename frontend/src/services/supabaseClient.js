import { createClient } from '@supabase/supabase-js';

// Retrieve client-safe Vite environment variables with public project fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ykoewvodqxcccakaewya.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2V3dm9kcXhjY2Nha2Fld3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjQ4NzAsImV4cCI6MjEwNjM0MDg3MH0.F5_RAKxgAqG835VsKErZJLo3390hMy8_hHlMhKZN9gE';

// Create Supabase client with robust session recovery
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper to check if live Supabase Auth is configured
 */
export const isSupabaseConfigured = () => Boolean(supabase);
