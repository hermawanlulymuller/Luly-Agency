/**
 * CRM API — Phase 5 scaffold.
 * Extends leads management with pipeline stages and notes.
 */

import { getLeads, updateLeadStatus } from './leads.api.js';

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export { getLeads, updateLeadStatus };

export async function assignLead(leadId, assigneeId) {
  const { requireSupabase } = await import('./supabase-client.js');
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('leads')
    .update({ assigned_to: assigneeId, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
