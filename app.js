document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenuBar = document.getElementById('nav-menu-bar');

    if (mobileMenuToggle && navMenuBar) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenuBar.classList.toggle('active');
            // Toggle icon bars to xmark
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

        // Close menu on click of nav link (mobile)
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

    // 2. Pricing Package Selection Helper
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const selectedPackageDropdown = document.getElementById('selected-package');

    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planName = e.target.getAttribute('data-plan');
            if (selectedPackageDropdown && planName) {
                selectedPackageDropdown.value = planName;
            }
        });
    });

    // 3. Contact Form Submission (Simulation)
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
            
            // Log for verification
            console.log('Lead Submitted:', { clientName, clientContact, selectedPackage, message });
            
            // Hide the form and show the success message
            leadForm.classList.add('hide');
            formSuccessAlert.classList.remove('hide');
        });
    }

    // 4. Simulated AI Chatbot Widget
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatMessagesArea = document.getElementById('chat-messages-area');
    const chatbotChoices = document.getElementById('chatbot-choices');

    if (chatbotToggle && chatbotWindow && chatbotClose) {
        // Toggle window
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hide');
            chatbotToggle.classList.remove('animate-pulse');
        });

        // Close window
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hide');
        });

        // Chatbot interaction logic
        const botResponses = {
            'cara-kerja-agent': 'AI Agent kami di Luly Agency bekerja secara otomatis di background. Kami mengintegrasikan API model bahasa besar (seperti Gemini 3.5) dengan scheduler media sosial dan bot chat Instagram/TikTok. Hasilnya, agent bisa riset, generate konten SEO, posting otomatis, dan membalas prospek dalam hitungan detik!',
            'jingle-umkm': 'Betul sekali! Paket LITE Lisensi Katalog Lulyart seharga Rp200.000 (diskon dari Rp500.000) memberikan Anda hak guna salah satu lagu Lulyart (misalnya single hits Fatamorgana Cinta) untuk video promosi. Jika Anda ingin lagu custom bertema khusus, Anda bisa mengambil paket Custom Jingle Lite seharga Rp499.000!',
            'konsultasi-free': 'Tentu! Anda bisa langsung mengisi formulir hubungi kami di bagian bawah halaman ini, kirim email ke <strong>hello@lulyagency.com</strong>, atau silakan hubungi kami langsung via WhatsApp di <strong><a href="https://wa.me/6283139453234?text=Halo%20Luly%20Agency,%20saya%20ingin%20berkonsultasi%20gratis." target="_blank" style="color: #00F2FE;">+62 831-3945-3234</a></strong>.'
        };

        const choiceButtons = document.querySelectorAll('.chat-option-btn');
        choiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const choiceKey = e.target.getAttribute('data-choice');
                const userText = e.target.textContent;

                // Append user message
                appendMessage(userText, 'user-msg');

                // Temporarily disable options to simulate typing
                chatbotChoices.style.pointerEvents = 'none';

                // Typing animation simulation
                setTimeout(() => {
                    const responseText = botResponses[choiceKey] || 'Mohon maaf, saya belum memahami pertanyaan tersebut. Silakan isi form kontak kami untuk berbicara dengan manusia!';
                    appendMessage(responseText, 'bot-msg');
                    chatbotChoices.style.pointerEvents = 'auto';
                }, 800);
            });
        });

        function appendMessage(text, className) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', className);
            messageDiv.innerHTML = text;
            chatMessagesArea.appendChild(messageDiv);
            
            // Auto scroll to bottom
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }
    }

    // 5. Interactive AI Agent Sandbox Tryout
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
        // Change labels based on selected agent type
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

        // Run simulation
        sandboxRunBtn.addEventListener('click', () => {
            const inputVal = sandboxInputText.value.trim();
            if (!inputVal) {
                alert('Silakan masukkan input uji coba terlebih dahulu!');
                return;
            }

            const agentType = sandboxAgentType.value;
            
            // Prepare UI state
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

            // Start timeline execution
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
                                    
                                    // Show final output
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
});
