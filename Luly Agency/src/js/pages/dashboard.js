import { requireAuth } from '../utils/auth-guard.js';
import { signOut, getProfile, getTeamMembers } from '../api/auth.api.js';
import { getLeads, updateLeadStatus } from '../api/leads.api.js';
import { assignLead } from '../api/crm.api.js';
import { isSupabaseConfigured } from '../config/env.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuth();
  if (!session) return;

  const userEmail = document.getElementById('user-email');
  const userRole = document.getElementById('user-role');
  const leadsTable = document.getElementById('leads-table-body');
  const logoutBtn = document.getElementById('logout-btn');
  const leadsError = document.getElementById('leads-error');

  const filterBusiness = document.getElementById('filter-business');
  const filterStatus = document.getElementById('filter-status');

  // Modals
  const proposalModal = document.getElementById('ai-proposal-modal');
  const closeProposalBtn = document.getElementById('close-proposal-btn');
  const aiResultArea = document.getElementById('ai-proposal-result');
  const copyProposalBtn = document.getElementById('copy-proposal-btn');
  const shareWaProposalBtn = document.getElementById('share-wa-proposal-btn');

  const paymentModal = document.getElementById('payment-modal');
  const closePaymentBtn = document.getElementById('close-payment-btn');
  const paymentDetails = document.getElementById('payment-details');
  const qrisImage = document.getElementById('qris-image');
  const paymentStatusHint = document.getElementById('payment-status-hint');
  const simulatePayBtn = document.getElementById('simulate-pay-btn');

  let activeLeadForPayment = null;
  let teamMembers = [];

  if (userEmail) userEmail.textContent = session.user.email;

  // Load User Role & Profile
  try {
    const profile = await getProfile();
    if (userRole && profile) userRole.textContent = profile.role || 'member';
  } catch {
    if (userRole) userRole.textContent = 'member';
  }

  // Load Active Team Members
  try {
    teamMembers = await getTeamMembers();
  } catch (err) {
    console.warn('[CRM] Gagal memuat daftar tim:', err.message);
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.href = '/login';
    });
  }

  // Fetch & Render Leads
  async function loadLeads() {
    if (!leadsTable) return;
    leadsTable.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Memuat data leads...</td></tr>';

    try {
      const filters = {
        business: filterBusiness ? filterBusiness.value : '',
        status: filterStatus ? filterStatus.value : '',
        limit: 100
      };

      const leads = await getLeads(filters);

      if (leads.length === 0) {
        leadsTable.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tidak ada leads yang sesuai filter.</td></tr>';
        return;
      }

      leadsTable.innerHTML = leads.map((lead) => {
        // Build pipeline status options
        const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
        const statusOptions = statuses.map(s => `
          <option value="${s}" ${lead.status === s ? 'selected' : ''}>${s.toUpperCase()}</option>
        `).join('');

        // Build assignee options
        const assigneeOptions = [
          `<option value="">Belum Ditugaskan</option>`,
          ...teamMembers.map(member => `
            <option value="${member.id}" ${lead.assigned_to === member.id ? 'selected' : ''}>${escapeHtml(member.full_name)}</option>
          `)
        ].join('');

        const formattedBusiness = escapeHtml((lead.business || 'luly_agency').replace('_', ' ').toUpperCase());

        return `
          <tr data-lead-id="${lead.id}">
            <td>
              <strong style="display: block; color: var(--text-main);">${escapeHtml(lead.name || '-')}</strong>
              <span style="font-size: 0.75rem; padding: 2px 6px; background: rgba(0,242,254,0.1); color: var(--clr-cyan); border-radius: 4px; display: inline-block; margin-top: 4px;">${formattedBusiness}</span>
            </td>
            <td>
              <span style="display: block; font-weight: 500;">${escapeHtml(lead.whatsapp || '-')}</span>
              <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(lead.email || '-')}</span>
            </td>
            <td>${escapeHtml(lead.service || '-')}</td>
            <td>
              <select class="crm-select-status" style="padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 6px; color: var(--text-main);">
                ${statusOptions}
              </select>
            </td>
            <td>
              <select class="crm-select-assignee" style="padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 6px; color: var(--text-main); font-size: 0.85rem; max-width: 150px;">
                ${assigneeOptions}
              </select>
            </td>
            <td>${formatDate(lead.created_at)}</td>
            <td>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-outline btn-small trigger-proposal" title="Buat AI Proposal" style="padding: 6px 10px; font-size: 0.8rem;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI</button>
                <button class="btn btn-primary btn-small trigger-payment" title="Buat Tagihan / Invoice" style="padding: 6px 10px; font-size: 0.8rem;"><i class="fa-solid fa-file-invoice-dollar"></i> Bill</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Attach inline CRM update events
      attachTableEvents();

    } catch (err) {
      if (leadsError) leadsError.textContent = err.message;
      leadsTable.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Akses CRM membutuhkan role admin atau member.</td></tr>`;
    }
  }

  function attachTableEvents() {
    // 1. Status Dropdown Change
    document.querySelectorAll('.crm-select-status').forEach(select => {
      select.addEventListener('change', async (e) => {
        const row = e.target.closest('tr');
        const leadId = row.getAttribute('data-lead-id');
        const newStatus = e.target.value;

        try {
          await updateLeadStatus(leadId, newStatus);
          console.log(`[CRM] Status lead ${leadId} diubah ke ${newStatus}`);
        } catch (err) {
          alert(`Gagal mengubah status: ${err.message}`);
          loadLeads(); // revert
        }
      });
    });

    // 2. Assignee Dropdown Change
    document.querySelectorAll('.crm-select-assignee').forEach(select => {
      select.addEventListener('change', async (e) => {
        const row = e.target.closest('tr');
        const leadId = row.getAttribute('data-lead-id');
        const assigneeId = e.target.value || null;

        try {
          await assignLead(leadId, assigneeId);
          console.log(`[CRM] Lead ${leadId} ditugaskan ke ${assigneeId}`);
        } catch (err) {
          alert(`Gagal menugaskan lead: ${err.message}`);
          loadLeads(); // revert
        }
      });
    });

    // 3. AI Proposal Trigger Click
    document.querySelectorAll('.trigger-proposal').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const leadId = row.getAttribute('data-lead-id');
        
        proposalModal.classList.remove('hide');
        aiResultArea.value = 'Sedang merumuskan penawaran khusus menggunakan Gemini AI...';

        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId })
          });
          const result = await response.json();
          aiResultArea.value = result.text;

          // Wire WA share link
          const leadName = row.querySelector('td strong').textContent;
          const leadWhatsapp = row.querySelector('td span').textContent;
          const cleanWa = leadWhatsapp.replace(/[^0-9]/g, '');
          shareWaProposalBtn.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(result.text)}`;
        } catch (err) {
          console.warn('[AI] Error calling AI function, falling back to client draft:', err.message);
          
          // Local fallback copy
          const leadName = row.querySelector('td strong').textContent;
          const leadService = row.querySelectorAll('td')[2].textContent;
          const fallbackText = `Halo Kak ${leadName}! Terima kasih sudah menghubungi kami di Luly Agency.\n\nMenindaklanjuti permintaan Kakak mengenai layanan "${leadService}", kami merekomendasikan setup automasi pintar yang terintegrasi dengan database bisnis Kakak.\n\nApakah besok pukul 10:00 WIB Kakak ada waktu luang untuk Zoom call singkat?`;
          aiResultArea.value = fallbackText;

          const leadWhatsapp = row.querySelector('td span').textContent;
          const cleanWa = leadWhatsapp.replace(/[^0-9]/g, '');
          shareWaProposalBtn.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(fallbackText)}`;
        }
      });
    });

    // 4. Payment Tagihan Trigger Click
    document.querySelectorAll('.trigger-payment').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const leadId = row.getAttribute('data-lead-id');
        activeLeadForPayment = leadId;

        paymentModal.classList.remove('hide');
        paymentDetails.textContent = 'Menyiapkan invoice dari Midtrans...';
        qrisImage.style.opacity = '0.3';
        paymentStatusHint.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i> Memproses tagihan...';

        try {
          const response = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId })
          });
          const data = await response.json();

          paymentDetails.innerHTML = `<strong>Invoice:</strong> ${data.invoiceId}<br><strong>Paket:</strong> ${escapeHtml(data.serviceName)}<br><strong>Total:</strong> Rp ${data.price.toLocaleString('id-ID')}`;
          qrisImage.src = data.qrCodeUrl;
          qrisImage.style.opacity = '1';
          paymentStatusHint.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i> Silakan scan & bayar QRIS di atas';
        } catch (err) {
          console.warn('[Payments] Error calling Pay API, generating local invoice:', err.message);
          
          // Local fallback QRIS
          const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
          const leadService = row.querySelectorAll('td')[2].textContent;
          let price = 499000;
          if (leadService.includes('200')) price = 200000;
          if (leadService.includes('1.199')) price = 1199000;

          paymentDetails.innerHTML = `<strong>Invoice:</strong> ${invoiceId}<br><strong>Paket:</strong> ${escapeHtml(leadService)}<br><strong>Total:</strong> Rp ${price.toLocaleString('id-ID')}`;
          qrisImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://lulyagency.com/pay/' + invoiceId)}`;
          qrisImage.style.opacity = '1';
          paymentStatusHint.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i> Silakan scan & bayar QRIS di atas';
        }
      });
    });
  }

  // Modals Close handlers
  if (closeProposalBtn) {
    closeProposalBtn.addEventListener('click', () => {
      proposalModal.classList.add('hide');
    });
  }

  if (copyProposalBtn) {
    copyProposalBtn.addEventListener('click', () => {
      aiResultArea.select();
      document.execCommand('copy');
      alert('Teks proposal berhasil disalin ke clipboard.');
    });
  }

  if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', () => {
      paymentModal.classList.add('hide');
    });
  }

  // Simulate QRIS payment success
  if (simulatePayBtn) {
    simulatePayBtn.addEventListener('click', async () => {
      if (!activeLeadForPayment) return;

      paymentStatusHint.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--clr-cyan);"></i> Pembayaran Diterima! Mengupdate CRM...';
      simulatePayBtn.disabled = true;

      try {
        // Update pipeline status to won automatically!
        await updateLeadStatus(activeLeadForPayment, 'won');
        
        // Simulating webhook trigger
        fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: activeLeadForPayment, event: 'payment_success' })
        }).catch(() => {});

        setTimeout(() => {
          paymentModal.classList.add('hide');
          simulatePayBtn.disabled = false;
          loadLeads();
        }, 1500);

      } catch (err) {
        alert(`Gagal mengupdate status: ${err.message}`);
        simulatePayBtn.disabled = false;
      }
    });
  }

  // Filters change listener
  if (filterBusiness) filterBusiness.addEventListener('change', loadLeads);
  if (filterStatus) filterStatus.addEventListener('change', loadLeads);

  // Initial dashboard load
  loadLeads();
});

function escapeHtml(str) {
  if (!str) return '-';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
