/**
 * Vercel Serverless Function — Webhook Automation Handler (Phase 6).
 * Simulates forwarding leads to external services like Google Sheets, AppSheet, Slack or Zapier.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { leadId, event } = req.body;

  console.log(`[Webhook] Triggered event "${event || 'lead_create'}" for lead ${leadId}`);

  // Here you would fetch from Supabase to get the full lead context and post to Google Sheets/AppSheet
  // For Vercel Free, we simulate a successful integration run.
  
  return res.status(200).json({
    success: true,
    message: `Automation triggered successfully for lead ${leadId}`,
    service: 'Google Sheets / AppSheet Webhook Integration',
    status: 'sent',
    timestamp: new Date().toISOString()
  });
}
