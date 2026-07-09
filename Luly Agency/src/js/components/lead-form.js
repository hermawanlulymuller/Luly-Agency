import { isSupabaseConfigured } from '../config/env.js';
import { submitLead } from '../api/leads.api.js';
import { triggerLeadAutomation } from '../api/automation.api.js';

export function initLeadForm() {
  const leadForm = document.getElementById('lead-form');
  const formSuccessAlert = document.getElementById('form-success-alert');

  if (!leadForm || !formSuccessAlert) return;

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const payload = {
      name: formData.get('name'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message'),
    };

    const submitBtn = document.getElementById('form-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
    }

    try {
      if (isSupabaseConfigured()) {
        const lead = await submitLead(payload);
        console.log('Lead saved:', lead.id);
        triggerLeadAutomation(lead.id).catch(() => {});
      } else {
        console.warn('[LeadForm] Supabase not configured — simulating submit.');
        console.log('Lead Captured:', payload);
      }

      leadForm.classList.add('hide');
      formSuccessAlert.classList.remove('hide');
    } catch (err) {
      console.error('Lead submission failed:', err.message);
      alert(`Gagal mengirim permintaan: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Permintaan Konsultasi';
      }
    }
  });
}
