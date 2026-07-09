import { BRAND } from '../config/constants.js';

export function initAiSandbox() {
  const sandboxAgentType = document.getElementById('sandbox-agent-type');
  const sandboxInputText = document.getElementById('sandbox-input-text');
  const sandboxInputLabel = document.getElementById('sandbox-input-label');
  const sandboxRunBtn = document.getElementById('sandbox-run-btn');
  const sandboxStatusText = document.getElementById('sandbox-status-text');
  const sandboxStatusDot = document.getElementById('sandbox-status-dot');
  const sandboxLog = document.getElementById('sandbox-log');
  const sandboxResultBox = document.getElementById('sandbox-result-box');
  const sandboxResultContent = document.getElementById('sandbox-result-content');

  if (!sandboxAgentType || !sandboxInputText || !sandboxRunBtn) return;

  sandboxAgentType.addEventListener('change', () => {
    const agent = sandboxAgentType.value;
    if (agent === 'creator') {
      sandboxInputLabel.textContent = 'Topik Video atau Tema Konten Anda';
      sandboxInputText.placeholder = 'Contoh: 3 Tips Sukses Bisnis Kopi Susu';
    } else if (agent === 'affiliate') {
      sandboxInputLabel.textContent = 'Nama Produk / Deskripsi Singkat';
      sandboxInputText.placeholder = 'Contoh: Speaker Bluetooth Waterproof Bass Mantap';
    } else if (agent === 'crm') {
      sandboxInputLabel.textContent = 'Pesan Chat Prospek / Pertanyaan';
      sandboxInputText.placeholder = 'Contoh: kak, paket custom jingle ini bisa diskon lagi ga?';
    }
  });

  sandboxRunBtn.addEventListener('click', () => {
    const inputVal = sandboxInputText.value.trim();
    if (!inputVal) {
      alert('Silakan ketik input uji coba terlebih dahulu!');
      return;
    }

    const agentType = sandboxAgentType.value;

    sandboxRunBtn.disabled = true;
    sandboxResultBox.classList.add('hide');
    sandboxLog.innerHTML = '';

    sandboxStatusDot.className = 'bot-status-dot running';
    sandboxStatusText.textContent = ' Sedang Memproses...';

    const addLogLine = (text, type = 'system') => {
      const line = document.createElement('div');
      line.className = `log-line ${type}`;
      line.textContent = text;
      sandboxLog.appendChild(line);
      sandboxLog.scrollTop = sandboxLog.scrollHeight;
    };

    const showResult = (content) => {
      sandboxResultContent.textContent = content;
      sandboxResultBox.classList.remove('hide');
      sandboxRunBtn.disabled = false;
      sandboxStatusDot.className = 'bot-status-dot active';
      sandboxStatusText.textContent = ' Proses Selesai!';
    };

    setTimeout(() => {
      if (agentType === 'creator') {
        addLogLine(`🔍 [SYSTEM] Memindai tren video TikTok di Indonesia untuk topik: "${inputVal}"...`, 'system');
        setTimeout(() => {
          addLogLine('⚙️ [AGENT] Menemukan 3 video kompetitor sejenis dengan views >100k.', 'system');
          setTimeout(() => {
            addLogLine('📝 [AGENT] Menyusun naskah video dengan formula AIDA (Hook-Interest-Desire-Action)...', 'system');
            setTimeout(() => {
              addLogLine('🏷️ [SEO] Mengompilasi 4-Pillar Hashtag & deskripsi kata kunci pencarian tinggi...', 'system');
              setTimeout(() => {
                addLogLine('✅ [SUCCESS] Naskah Konten & SEO berhasil dibuat!', 'success');
                const result = `🎬 NASKAH VIDEO PENDEK (DURASI 25 DETIK)\n--------------------------------------------------\n[HOOK 0-3s]: "Jangan asal jual ${inputVal} sebelum kalian tahu rahasia automasi ini!"\n[BODY 3-20s]: "Banyak orang capek bikin konten ${inputVal} manual tiap hari. Padahal dengan AI Agent Luly Agency, riset keyword dan caption bisa jalan auto-pilot. Tinggal rekam muka, sisanya AI yang sebar ke semua sosmed."\n[CTA 20-25s]: "Mau cobain sistem automasi ini secara gratis? Cek link di bio kami sekarang!"\n\n📝 CAPTION TIKTOK (SEO OPTIMIZED)\n--------------------------------------------------\nGak usah pusing mikirin ide konten ${inputVal} tiap hari! 🤯 Biar AI Agent kami yang kerja cari tren terpanas dan bikinin skripnya buat kamu. Link gratis di bio! #AIAgent #AutomasiKonten #LulyAgency #RisetAI`;
                showResult(result);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      } else if (agentType === 'affiliate') {
        addLogLine(`🛒 [SYSTEM] Menarik rating review produk: "${inputVal}"...`, 'system');
        setTimeout(() => {
          addLogLine('⚡ [AGENT] Menemukan ulasan positif pembeli untuk diolah menjadi script.', 'system');
          setTimeout(() => {
            addLogLine('🎬 [AGENT] Membuat kerangka naskah visual slideshow promo...', 'system');
            setTimeout(() => {
              addLogLine('🔗 [CRM] Memasang trigger bot komentar link checkout otomatis...', 'system');
              setTimeout(() => {
                addLogLine('✅ [SUCCESS] Skrip Promo & Setup Bot Affiliator selesai!', 'success');
                const result = `📦 SKRIP VIDEO PROMOSI AFILIASI\n--------------------------------------------------\n[Visual]: Slide ulasan pembeli + transisi ketukan musik lo-fi Lulyart.\n[Audio/VO]: "Akhirnya nemu juga ${inputVal} yang reviewnya bintang 5 semua! Desainnya super premium, baterai awet, dan harganya ramah di kantong. Cocok banget buat nemenin produktivitas harianmu."\n\n🤖 SETTING AUTOMATION BOT\n--------------------------------------------------\nPemicu Komentar: "mau", "spill", "link", "beli"\nPesan Balasan Otomatis:\n"Halo kak! Ini link pembelian ${inputVal} berdiskon khusus hari ini ya: https://luly.agency/aff-link-product 🎁"`;
                showResult(result);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      } else if (agentType === 'crm') {
        addLogLine(`💬 [SYSTEM] Mendeteksi pesan masuk: "${inputVal}"...`, 'system');
        setTimeout(() => {
          addLogLine(`🧠 [CRM] Mencocokkan pesan dengan database ${BRAND.name}...`, 'system');
          setTimeout(() => {
            addLogLine('✍️ [AGENT] Merumuskan balasan ramah & berorientasi penjualan...', 'system');
            setTimeout(() => {
              addLogLine('📋 [DATABASE] Menyimpan data prospek baru ke Notion database secara otomatis...', 'system');
              setTimeout(() => {
                addLogLine('✅ [SUCCESS] Prospek dibalas otomatis & di-input ke CRM!', 'success');
                const result = `💬 BALASAN OTOMATIS (KOMENTAR / DM)\n--------------------------------------------------\n"Halo kak! Terima kasih atas pertanyaannya. 😊\n\nUntuk pertanyaan kakak: '${inputVal}'\n\nKabar gembira! Saat ini kami sedang ada Promo Diskon Spesifik untuk paket Custom Jingle seharga Rp499.000 (Normal Rp1.200.000) dan Lisensi Musik ${BRAND.name} seharga Rp200.000.\n\nKakak bisa langsung konsultasi gratis dengan tim kami via WhatsApp resmi di wa.me/${BRAND.whatsapp}. Mau kami jadwalkan sekarang?"\n\n--------------------------------------------------\n✅ Leads berhasil disinkronkan ke Notion database: [Status: Prospek Baru]`;
                showResult(result);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      }
    }, 500);
  });
}
