import { redirectIfAuthenticated } from '../utils/auth-guard.js';
import { signUp } from '../api/auth.api.js';
import { isSupabaseConfigured } from '../config/env.js';

document.addEventListener('DOMContentLoaded', async () => {
  await redirectIfAuthenticated();

  const form = document.getElementById('auth-form');
  const errorEl = document.getElementById('auth-error');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    if (!isSupabaseConfigured()) {
      if (errorEl) errorEl.textContent = 'Supabase belum dikonfigurasi.';
      return;
    }

    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await signUp({
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('full_name'),
        whatsapp: formData.get('whatsapp'),
      });
      window.location.href = '/dashboard';
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
