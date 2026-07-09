import { getSession } from '../api/auth.api.js';
import { isSupabaseConfigured } from '../config/env.js';

/**
 * Redirect unauthenticated users away from protected pages.
 */
export async function requireAuth(redirectTo = '/login') {
  if (!isSupabaseConfigured()) {
    console.warn('[Auth] Supabase not configured.');
    return null;
  }

  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

/**
 * Redirect authenticated users away from public auth pages.
 */
export async function redirectIfAuthenticated(redirectTo = '/dashboard') {
  if (!isSupabaseConfigured()) return;

  const session = await getSession();
  if (session) {
    window.location.href = redirectTo;
  }
}
