import { requireSupabase } from './supabase-client.js';

/**
 * Fetch services from existing `services` table.
 */
export async function getServices({ business = 'luly_agency' } = {}) {
  const supabase = requireSupabase();

  let query = supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;

  if (business) {
    return data.filter((s) => !s.business || s.business === business);
  }
  return data;
}
