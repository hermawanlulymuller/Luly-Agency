/**
 * Vercel Serverless Function — Midtrans Payments & Invoicing (Phase 7).
 * Generates checkout details or QRIS fallback for Luly Agency SaaS packages.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { leadId } = req.body;
  if (!leadId) {
    return res.status(400).json({ error: 'leadId is required' });
  }

  // Simulated logic to fetch lead details and determine pricing
  // In a real application, you'd fetch from Supabase:
  // const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
  
  // Generating a realistic mock invoice
  const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
  const serviceName = 'Premium Automation (Jingle Pro + AI Agent)';
  const price = 1199000; // Rp1.199.000

  // QRIS Mock QR code generation url using dynamic params
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://lulyagency.com/pay/' + invoiceId)}`;

  return res.status(200).json({
    success: true,
    invoiceId,
    leadId,
    serviceName,
    price,
    qrCodeUrl,
    status: 'pending_payment',
    timestamp: new Date().toISOString()
  });
}
