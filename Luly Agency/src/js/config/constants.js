/**
 * Shared constants — single source of truth for URLs, pricing, and branding.
 */

export const BRAND = {
  name: 'Luly Agency',
  email: 'hello@lulyagency.com',
  whatsapp: '6283139453234',
  whatsappDisplay: '+62 831-3945-3234',
  instagram: 'https://instagram.com/lulyart4',
  spotify: 'https://open.spotify.com/playlist/0XtYKprk12whcVcOAXue5v?si=I3JmIEO1QWuzrA1hAy4aVQ',
  youtube: 'https://www.youtube.com/results?search_query=Lulyart',
};

export const WHATSAPP_BASE = `https://wa.me/${BRAND.whatsapp}`;

export function whatsappLink(message) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export const PRICING = {
  lite: { label: 'Paket LITE: Lisensi Lagu Katalog Lulyart (Rp200.000)', value: 'Lite License - Rp200.000' },
  medium: { label: 'Paket MEDIUM: Custom Jingle Lite (Rp499.000)', value: 'Custom Jingle Lite - Rp499.000' },
  premium: { label: 'Paket PREMIUM: Jingle Pro + Automation (Rp1.199.000)', value: 'Premium Automation - Rp1.199.000' },
  custom: { label: 'Jasa Automasi AI Agent Saja (Konsultasi Custom)', value: 'Jasa AI Automation Agent Only' },
};

export const BUSINESSES = ['luly_agency', 'lulyart', 'brigade571', 'luly_wallet', 'luly_umkm'];

export const LEAD_SOURCE = 'landing_page';
