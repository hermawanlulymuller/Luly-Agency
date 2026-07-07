document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenuBar = document.getElementById('nav-menu-bar');

    if (mobileMenuToggle && navMenuBar) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenuBar.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (navMenuBar.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu on nav link click (mobile)
        const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenuBar.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                }
            });
        }
    });

    // 3. Stats Counter Animation (using IntersectionObserver)
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 1500; // 1.5 seconds animation
            const increment = target / (duration / 16); // ~60fps
            
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    el.textContent = Math.ceil(count) + (el.textContent.includes('%') || target === 99 ? '%' : (target === 24 ? '/7' : '+'));
                    requestAnimationFrame(updateCount);
                } else {
                    el.textContent = target + (target === 99 ? '%' : (target === 24 ? '/7' : '+'));
                }
            };
            
            updateCount();
        };

        const observerOptions = {
            threshold: 0.5
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, observerOptions);

        statNumbers.forEach(num => {
            statsObserver.observe(num);
        });
    }

    // 4. Contact Form Submission (Simulator)
    const leadForm = document.getElementById('lead-form');
    const formSuccessAlert = document.getElementById('form-success-alert');

    if (leadForm && formSuccessAlert) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(leadForm);
            const clientName = formData.get('name');
            const clientContact = formData.get('contact');
            const selectedPackage = formData.get('package');
            const message = formData.get('message');
            
            console.log('Lead Captured:', { clientName, clientContact, selectedPackage, message });
            
            // Show exact requested alert text: "Tim Luly Agency akan WA kamu 1x24 jam"
            leadForm.classList.add('hide');
            formSuccessAlert.classList.remove('hide');
        });
    }

    // 5. Interactive AI Agent Sandbox (Coba AI Gratis)
    const sandboxAgentType = document.getElementById('sandbox-agent-type');
    const sandboxInputText = document.getElementById('sandbox-input-text');
    const sandboxInputLabel = document.getElementById('sandbox-input-label');
    const sandboxRunBtn = document.getElementById('sandbox-run-btn');
    const sandboxStatusText = document.getElementById('sandbox-status-text');
    const sandboxStatusDot = document.getElementById('sandbox-status-dot');
    const sandboxLog = document.getElementById('sandbox-log');
    const sandboxResultBox = document.getElementById('sandbox-result-box');
    const sandboxResultContent = document.getElementById('sandbox-result-content');

    if (sandboxAgentType && sandboxInputText && sandboxRunBtn) {
        // Change input label based on agent selected
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

        // Run simulation timeline
        sandboxRunBtn.addEventListener('click', () => {
            const inputVal = sandboxInputText.value.trim();
            if (!inputVal) {
                alert('Silakan ketik input uji coba terlebih dahulu!');
                return;
            }

            const agentType = sandboxAgentType.value;
            
            // Set UI to loading state
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

            setTimeout(() => {
                if (agentType === 'creator') {
                    addLogLine(`🔍 [SYSTEM] Memindai tren video TikTok di Indonesia untuk topik: "${inputVal}"...`, 'system');
                    
                    setTimeout(() => {
                        addLogLine(`⚙️ [AGENT] Menemukan 3 video kompetitor sejenis dengan views >100k.`, 'system');
                        
                        setTimeout(() => {
                            addLogLine(`📝 [AGENT] Menyusun naskah video dengan formula AIDA (Hook-Interest-Desire-Action)...`, 'system');
                            
                            setTimeout(() => {
                                addLogLine(`🏷️ [SEO] Mengompilasi 4-Pillar Hashtag & deskripsi kata kunci pencarian tinggi...`, 'system');
                                
                                setTimeout(() => {
                                    addLogLine(`✅ [SUCCESS] Naskah Konten & SEO berhasil dibuat!`, 'success');
                                    
                                    const result = `🎬 NASKAH VIDEO PENDEK (DURASI 25 DETIK)\n--------------------------------------------------\n[HOOK 0-3s]: "Jangan asal jual ${inputVal} sebelum kalian tahu rahasia automasi ini!"\n[BODY 3-20s]: "Banyak orang capek bikin konten ${inputVal} manual tiap hari. Padahal dengan AI Agent Luly Agency, riset keyword dan caption bisa jalan auto-pilot. Tinggal rekam muka, sisanya AI yang sebar ke semua sosmed."\n[CTA 20-25s]: "Mau cobain sistem automasi ini secara gratis? Cek link di bio kami sekarang!"\n\n📝 CAPTION TIKTOK (SEO OPTIMIZED)\n--------------------------------------------------\nGak usah pusing mikirin ide konten ${inputVal} tiap hari! 🤯 Biar AI Agent kami yang kerja cari tren terpanas dan bikinin skripnya buat kamu. Link gratis di bio! #AIAgent #AutomasiKonten #LulyAgency #RisetAI`;
                                    
                                    showResult(result);
                                }, 800);
                            }, 800);
                        }, 800);
                    }, 800);
                } else if (agentType === 'affiliate') {
                    addLogLine(`🛒 [SYSTEM] Menarik rating review produk: "${inputVal}"...`, 'system');
                    
                    setTimeout(() => {
                        addLogLine(`⚡ [AGENT] Menemukan ulasan positif pembeli untuk diolah menjadi script.`, 'system');
                        
                        setTimeout(() => {
                            addLogLine(`🎬 [AGENT] Membuat kerangka naskah visual slideshow promo...`, 'system');
                            
                            setTimeout(() => {
                                addLogLine(`🔗 [CRM] Memasang trigger bot komentar link checkout otomatis...`, 'system');
                                
                                setTimeout(() => {
                                    addLogLine(`✅ [SUCCESS] Skrip Promo & Setup Bot Affiliator selesai!`, 'success');
                                    
                                    const result = `📦 SKRIP VIDEO PROMOSI AFILIASI\n--------------------------------------------------\n[Visual]: Slide ulasan pembeli + transisi ketukan musik lo-fi Lulyart.\n[Audio/VO]: "Akhirnya nemu juga ${inputVal} yang reviewnya bintang 5 semua! Desainnya super premium, baterai awet, dan harganya ramah di kantong. Cocok banget buat nemenin produktivitas harianmu."\n\n🤖 SETTING AUTOMATION BOT\n--------------------------------------------------\nPemicu Komentar: "mau", "spill", "link", "beli"\nPesan Balasan Otomatis:\n"Halo kak! Ini link pembelian ${inputVal} berdiskon khusus hari ini ya: https://luly.agency/aff-link-product 🎁"`;
                                    
                                    showResult(result);
                                }, 800);
                            }, 800);
                        }, 800);
                    }, 800);
                } else if (agentType === 'crm') {
                    addLogLine(`💬 [SYSTEM] Mendeteksi pesan masuk: "${inputVal}"...`, 'system');
                    
                    setTimeout(() => {
                        addLogLine(`🧠 [CRM] Mencocokkan pesan dengan database Luly Agency...`, 'system');
                        
                        setTimeout(() => {
                            addLogLine(`✍️ [AGENT] Merumuskan balasan ramah & berorientasi penjualan...`, 'system');
                            
                            setTimeout(() => {
                                addLogLine(`📋 [DATABASE] Menyimpan data prospek baru ke Notion database secara otomatis...`, 'system');
                                
                                setTimeout(() => {
                                    addLogLine(`✅ [SUCCESS] Prospek dibalas otomatis & di-input ke CRM!`, 'success');
                                    
                                    const result = `💬 BALASAN OTOMATIS (KOMENTAR / DM)\n--------------------------------------------------\n"Halo kak! Terima kasih atas pertanyaannya. 😊\n\nUntuk pertanyaan kakak: '${inputVal}'\n\nKabar gembira! Saat ini kami sedang ada Promo Diskon Spesifik untuk paket Custom Jingle seharga Rp499.000 (Normal Rp1.200.000) dan Lisensi Musik Lulyart seharga Rp200.000.\n\nKakak bisa langsung konsultasi gratis dengan tim kami via WhatsApp resmi di wa.me/6283139453234. Mau kami jadwalkan sekarang?"\n\n--------------------------------------------------\n✅ Leads berhasil disinkronkan ke Notion database: [Status: Prospek Baru]`;
                                    
                                    showResult(result);
                                }, 800);
                            }, 800);
                        }, 800);
                    }, 800);
                }
            }, 500);
        });

        function showResult(content) {
            sandboxResultContent.textContent = content;
            sandboxResultBox.classList.remove('hide');
            sandboxRunBtn.disabled = false;
            sandboxStatusDot.className = 'bot-status-dot active';
            sandboxStatusText.textContent = ' Proses Selesai!';
        }
    }

    // 6. High-Conversion Chatbot Widget (Banyak Arah Penjualan Menarik)
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatMessagesArea = document.getElementById('chat-messages-area');
    const chatbotChoices = document.getElementById('chatbot-choices');

    if (chatbotToggle && chatbotWindow && chatbotClose) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hide');
            chatbotToggle.classList.remove('animate-pulse');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hide');
        });

        // Conversion-oriented responses
        const salesResponses = {
            'promo-jingle': 'Betul sekali kak! Khusus promo peluncuran ini, kami memotong harga Lisensi Musik Katalog Lulyart (hits seperti <strong>Fatamorgana Cinta</strong>) dari ~~Rp500.000~~ menjadi <strong>Rp200.000</strong> saja (sekali bayar, aman hak cipta seumur hidup!).<br><br>Kami juga menerima pembuatan Jingle Kustom seharga <strong>Rp499.000</strong>. Mau langsung amankan diskon Anda via WA?',
            'buat-website': 'Kami membangun website premium (setara Stripe/OpenAI) yang dilengkapi <strong>AI Agent CRM</strong> terintegrasi (menangkap database leads otomatis, auto-reply, dll) mulai dari <strong>Rp1.199.000</strong> saja! Sistem ini bisa menghemat puluhan jam kerja Anda setiap minggu. Tertarik untuk konsultasi gratis?',
            'klaim-slot': 'Klaim slot konsultasi & audit sistem AI gratis Anda hari ini! Kuota harian kami batasi hanya untuk 3 pemilik bisnis agar penanganan maksimal.<br><br>Silakan klik tombol di bawah untuk langsung terhubung dengan WhatsApp tim strategis kami di <strong>+62 831-3945-3234</strong>.'
        };

        const choiceButtons = document.querySelectorAll('.chat-option-btn');
        choiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const choiceKey = e.currentTarget.getAttribute('data-choice');
                const userText = e.currentTarget.textContent;

                appendMessage(userText, 'user-msg');
                chatbotChoices.style.pointerEvents = 'none';

                setTimeout(() => {
                    const responseText = salesResponses[choiceKey];
                    appendMessage(responseText, 'bot-msg');
                    
                    // Proactively append a direct WhatsApp CTA button inside the chat window
                    const waBtn = document.createElement('a');
                    waBtn.href = `https://wa.me/6283139453234?text=Halo%20Luly%20Agency,%20saya%20ingin%20bertanya%20mengenai%20pilihan%20saya%20di%20chat%20yaitu%20${encodeURIComponent(userText)}.`;
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

        function appendMessage(text, className) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', className);
            messageDiv.innerHTML = text;
            chatMessagesArea.appendChild(messageDiv);
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }
    }
});
