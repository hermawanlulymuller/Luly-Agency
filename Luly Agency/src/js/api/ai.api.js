/**
 * AI API — Phase 8 scaffold.
 * Connects AI Sandbox to real agent endpoints.
 */

export async function runAgent({ agentType, input, business = 'luly_agency' }) {
  const { requireSupabase } = await import('./supabase-client.js');
  const supabase = requireSupabase();

  const { data, error } = await supabase.functions.invoke('ai-agent', {
    body: { agentType, input, business },
  });

  if (error) {
    console.warn('[AI] Edge function not ready yet:', error.message);
    return null;
  }
  return data;
}
