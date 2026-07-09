/**
 * Payments API — Phase 7 scaffold.
 */

export async function getSubscription(userId) {
  const { requireSupabase } = await import('./supabase-client.js');
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[Payments] Table not ready yet:', error.message);
    return null;
  }
  return data;
}
