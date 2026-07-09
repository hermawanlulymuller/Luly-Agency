/**
 * Runtime environment configuration.
 * Populated by scripts/inject-env.js during Vercel build,
 * or set manually in window.__ENV for local development.
 */

const injected = typeof window !== 'undefined' ? window.__ENV : {};

export const ENV = {
  supabaseUrl: injected.SUPABASE_URL || '',
  supabaseAnonKey: injected.SUPABASE_ANON_KEY || '',
};

export function isSupabaseConfigured() {
  return Boolean(ENV.supabaseUrl && ENV.supabaseAnonKey);
}
