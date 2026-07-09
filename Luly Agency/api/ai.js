/**
 * Vercel Serverless Function — AI Proposal & Copywriting Agent (Phase 8).
 * Leverages Google Gemini API to generate customized business proposals, 
 * falling back to premium template drafts if the API key is unconfigured.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { leadId, prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || '';

  // 1. Gather lead details (simulated or hardcoded defaults)
  const leadName = 'Mitra Bisnis';
  const serviceType = 'Premium Automation Setup';

  // 2. Draft fallbacks
  const fallbackDraft = `Halo Kak ${leadName}! 😊\n\nTerima kasih telah menghubungi kami di *Luly Agency*.\n\nKami telah merangkum rencana implementasi sistem automasi untuk layanan *"${serviceType}"*:\n\n1. *Lead Capturing*: Integrasi database leads langsung ke Google Sheet & CRM Notion.\n2. *Auto-Responder*: WhatsApp/DM bot otomatis aktif 24/7 membalas prospek.\n3. *Sales Pipeline*: Dashboard CRM terpadu untuk monitoring leads Anda.\n\n*Investasi:* Mulai dari Rp499.000 (sekali bayar, promo bulan ini).\n\nApakah Kakak luang besok pukul 13:00 WIB untuk konsultasi detail via Zoom/WhatsApp?\n\nSalam Hangat,\n*Tim Luly Agency*`;

  if (!apiKey) {
    // Return mock response immediately if no key is configured
    return res.status(200).json({
      success: true,
      text: fallbackDraft,
      source: 'Local Rule Engine (Gemini API Key missing)'
    });
  }

  try {
    // Call Gemini API via fetch (lightweight, zero npm bundle bloat)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `Tulis draft pesan penawaran / follow-up WhatsApp yang profesional, persuasif, dan ramah untuk klien bernama "${leadName}" yang berminat dengan layanan "${serviceType}" dari Luly Agency. Buat pesannya singkat, jelas, gunakan emoji, berikan point-point benefit sistem automasi, dan tawarkan jadwal call konsultasi gratis.`
        }]
      }]
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackDraft;

    return res.status(200).json({
      success: true,
      text: generatedText.trim(),
      source: 'Gemini 2.5 Flash API'
    });

  } catch (err) {
    console.error('[AI Agent] Gemini call failed:', err.message);
    return res.status(200).json({
      success: true,
      text: fallbackDraft,
      source: 'Fallback Engine due to API error'
    });
  }
}
