import { BRAND, whatsappLink } from '../config/constants.js';

export function initBusinessContext() {
  const selector = document.getElementById('business-context-selector');
  if (!selector) return;

  // Restore previous selection if any
  const savedBusiness = localStorage.getItem('luly_selected_business') || 'luly_agency';
  selector.value = savedBusiness;

  function updateLinks(business) {
    // 1. Save in local storage
    localStorage.setItem('luly_selected_business', business);

    // 2. Determine WA text messages based on business
    let mainMsg = 'Halo Luly Agency, saya tertarik ingin Konsultasi Gratis.';
    let heroMsg = 'Halo Luly Agency, saya tertarik dengan Jingle + AI WhatsApp UMKM mulai Rp200rb.';
    let finalMsg = 'Halo Luly Agency, saya tertarik dengan layanan AI Automation / Audio Branding dan ingin Konsultasi Gratis.';

    if (business === 'lulyart') {
      mainMsg = 'Halo Lulyart, saya tertarik membeli lisensi musik / custom jingle.';
      heroMsg = 'Halo Lulyart, saya tertarik lisensi lagu katalog Lulyart seharga Rp200rb.';
      finalMsg = 'Halo Lulyart, saya ingin memesan custom jingle atau lisensi lagu.';
    } else if (business === 'brigade571') {
      mainMsg = 'Halo Brigade571, saya tertarik dengan layanan jasa keamanan / intelijen.';
      heroMsg = 'Halo Brigade571, mohon info detail mengenai jasa pengamanan event/VVIP.';
      finalMsg = 'Halo Brigade571, saya ingin konsultasi mengenai jasa keamanan profesional.';
    } else if (business === 'luly_wallet') {
      mainMsg = 'Halo Luly Wallet, saya ingin bertanya tentang fitur e-wallet dan pembayaran UMKM.';
      heroMsg = 'Halo Luly Wallet, tertarik dengan sistem QRIS dan integrasi payment gateway.';
      finalMsg = 'Halo Luly Wallet, mohon info integrasi pembayaran untuk toko online saya.';
    } else if (business === 'luly_umkm') {
      mainMsg = 'Halo Luly UMKM, saya ingin konsultasi program digitalisasi UMKM.';
      heroMsg = 'Halo Luly UMKM, mohon info paket automasi AI khusus untuk pelaku usaha mikro.';
      finalMsg = 'Halo Luly UMKM, saya ingin mengajukan usaha saya untuk mendapat automasi AI.';
    }

    // 3. Update links on the landing page
    const navCta = document.getElementById('nav-cta-contact');
    if (navCta) navCta.href = whatsappLink(mainMsg);

    const heroBtn = document.getElementById('hero-btn-consult');
    if (heroBtn) heroBtn.href = whatsappLink(heroMsg);

    const finalBtn = document.getElementById('final-cta-btn');
    if (finalBtn) finalBtn.href = whatsappLink(finalMsg);

    // Update chatbot target WA links too
    window.__current_business_msg = mainMsg;
  }

  // Initial trigger
  updateLinks(selector.value);

  // Selector change handler
  selector.addEventListener('change', (e) => {
    updateLinks(e.target.value);
  });
}
