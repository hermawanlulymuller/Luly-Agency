/**
 * Automation API — Phase 6 scaffold.
 * Triggers workflows (WhatsApp auto-reply, CRM sync, notifications).
 */

export async function triggerLeadAutomation(leadId) {
  const { requireSupabase } = await import('./supabase-client.js');
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('automation_runs')
    .insert([{
      lead_id: leadId,
      type: 'lead_welcome',
      status: 'pending',
      business: 'luly_agency',
    }])
    .select()
    .single();

  if (error) {
    console.warn('[Automation] Table not ready yet:', error.message);
    return null;
  }
  return data;
}
