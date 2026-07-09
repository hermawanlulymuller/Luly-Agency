import { initNavigation } from './components/navigation.js';
import { initFaq } from './components/faq.js';
import { initStatsCounter } from './components/stats-counter.js';
import { initLeadForm } from './components/lead-form.js';
import { initAiSandbox } from './components/ai-sandbox.js';
import { initChatbot } from './components/chatbot.js';
import { initBusinessContext } from './components/business-context.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBusinessContext();
  initFaq();
  initStatsCounter();
  initLeadForm();
  initAiSandbox();
  initChatbot();
});
