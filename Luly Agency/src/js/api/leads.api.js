import { requireSupabase } from './supabase-client.js';
import { LEAD_SOURCE } from '../config/constants.js';

export async function submitLead({ name, whatsapp, email, service, message, business = 'luly_agency' }) {
  const supabase = requireSupabase();

  // Legacy columns support
  const contact = `${whatsapp} / ${email}`;

  const payload = {
    name: name.trim(),
    contact: contact.trim(),
    package: service.trim(),
    whatsapp: whatsapp.trim(),
    email: email.trim(),
    service: service.trim(),
    message: (message || '').trim(),
    source: LEAD_SOURCE,
    status: 'new',
    business: business,
  };

  const { data, error } = await supabase
  .from('leads')
  .insert([payload])
  .select('id')
  .single();

  if (error) throw error;
  return data;
}

export async function getLeads({ status, business, limit = 50 } = {}) {
  const supabase = requireSupabase();
  let query = supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(limit);
  if (status) query = query.eq('status', status);
  if (business) query = query.eq('business', business);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateLeadStatus(leadId, status) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
  .from('leads')
  .update({ status, updated_at: new Date().toISOString() })
  .eq('id', leadId)
  .select()
  .single();
  if (error) throw error;
  return data;
}