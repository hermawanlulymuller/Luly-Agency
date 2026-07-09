import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm';
import { ENV, isSupabaseConfigured } from '../config/env.js';

let client = null;

/**
 * Singleton Supabase client.
 * Returns null when env vars are not configured (landing page still works).
 */
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Set SUPABASE_URL dan SUPABASE_ANON_KEY.');
  }
  return supabase;
}
