import { whatsappLink } from '../config/constants.js';

export function initChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatMessagesArea = document.getElementById('chat-messages-area');
  const chatbotChoices = document.getElementById('chatbot-choices');

  if (!chatbotToggle || !chatbotWindow || !chatbotClose) return;

  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hide');
    chatbotToggle.classList.remove('animate-pulse');
  });

  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hide');
  });

  const salesResponses = {
    'promo-jingle': 'Betul sekali kak! Khusus promo peluncuran ini, kami memotong harga Lisensi Musik Katalog Lulyart (hits seperti <strong>Fatamorgana Cinta</strong>) dari ~~Rp500.000~~ menjadi <strong>Rp200.000</strong> saja (sekali bayar, aman hak cipta seumur hidup!).<br><br>Kami juga menerima pembuatan Jingle Kustom seharga <strong>Rp499.000</strong>. Mau langsung amankan diskon Anda via WA?',
    'buat-website': 'Kami membangun website premium (setara Stripe/OpenAI) yang dilengkapi <strong>AI Agent CRM</strong> terintegrasi (menangkap database leads otomatis, auto-reply, dll) mulai dari <strong>Rp1.199.000</strong> saja! Sistem ini bisa menghemat puluhan jam kerja Anda setiap minggu. Tertarik untuk konsultasi gratis?',
    'klaim-slot': 'Klaim slot konsultasi & audit sistem AI gratis Anda hari ini! Kuota harian kami batasi hanya untuk 3 pemilik bisnis agar penanganan maksimal.<br><br>Silakan klik tombol di bawah untuk langsung terhubung dengan WhatsApp tim strategis kami di <strong>+62 831-3945-3234</strong>.',
  };

  function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', className);
    messageDiv.innerHTML = text;
    chatMessagesArea.appendChild(messageDiv);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
  }

  const choiceButtons = document.querySelectorAll('.chat-option-btn');
  choiceButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const choiceKey = e.currentTarget.getAttribute('data-choice');
      const userText = e.currentTarget.textContent;

      appendMessage(userText, 'user-msg');
      chatbotChoices.style.pointerEvents = 'none';

      setTimeout(() => {
        const responseText = salesResponses[choiceKey];
        appendMessage(responseText, 'bot-msg');

        const textMsg = `Halo Luly Agency, saya ingin bertanya mengenai pilihan saya di chatbot: "${userText}"`;
        const waBtn = document.createElement('a');
        waBtn.href = whatsappLink(textMsg);
        waBtn.target = '_blank';
        waBtn.rel = 'noopener';
        waBtn.className = 'btn btn-primary';
        waBtn.style.marginTop = '10px';
        waBtn.style.fontSize = '0.8rem';
        waBtn.style.padding = '8px 16px';
        waBtn.style.alignSelf = 'flex-start';
        waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Amankan Promo via WA';

        chatMessagesArea.appendChild(waBtn);
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

        chatbotChoices.style.pointerEvents = 'auto';
      }, 800);
    });
  });
}
