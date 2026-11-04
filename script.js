/**
 * ============================================================================
 * Prajyot Khabale - Personal Developer Portfolio Script
 * Vanilla JavaScript (ES6+) - Clean, Modular, Accessible & High Performance
 * ============================================================================
 */

'use strict';

/**
 * ----------------------------------------------------------------------------
 * 1. CENTRAL CONFIGURATION
 * ----------------------------------------------------------------------------
 * IMPORTANT FOR PRAJYOT:
 * Update the URLs below with your actual GitHub, LinkedIn, email, and live
 * project demo links. Any link set to "#" or a placeholder will display a
 * friendly notification guiding you or recruiters.
 */
const PORTFOLIO_CONFIG = {
  // Social and Contact links
  github: 'https://github.com/prajyot-khabale',          // REPLACE with your actual GitHub username
  linkedin: 'https://linkedin.com/in/prajyot-khabale',   // REPLACE with your actual LinkedIn profile
  email: 'prajyot.khabale@example.com',                 // REPLACE with your preferred contact email
  email_mailto: 'mailto:prajyot.khabale@example.com',

  // Project 1: AI Resume Builder
  project1_github: 'https://github.com/prajyot-khabale/ai-resume-builder', // REPLACE with repository link
  project1_demo: 'https://ai-resume-builder-demo.example.com',             // REPLACE with live deployment URL

  // Project 2: RAG-Based Text-to-SQL Chatbot
  project2_github: 'https://github.com/prajyot-khabale/text-to-sql-rag-chatbot', // REPLACE with repository link
  project2_demo: 'https://github.com/prajyot-khabale/text-to-sql-rag-chatbot#readme', // Docs/Demo link

  // Project 3: Fraud Detection System
  project3_github: 'https://github.com/prajyot-khabale/fraud-detection-system', // REPLACE once repo is published
};

/**
 * ----------------------------------------------------------------------------
 * 2. DOM Elements & State
 * ----------------------------------------------------------------------------
 */
const DOM = {
  header: document.getElementById('header'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  hamburgerBtn: document.getElementById('hamburger-btn'),
  mobileOverlay: document.getElementById('mobile-overlay'),
  themeToggle: document.getElementById('theme-toggle'),
  backToTopBtn: document.getElementById('back-to-top'),
  toast: document.getElementById('toast'),
  currentYearSpan: document.getElementById('current-year'),

  // Contact Form
  contactForm: document.getElementById('contact-form'),
  formStatus: document.getElementById('form-status'),
  formSubmitBtn: document.getElementById('form-submit-btn'),
  charCounter: document.getElementById('char-counter'),
  messageInput: document.getElementById('contact-message'),
  copyEmailBtn: document.getElementById('copy-email-btn'),
  contactEmailDisplay: document.getElementById('contact-email-display'),

  // Skills filter buttons and cards
  skillFilterBtns: document.querySelectorAll('.skill-filter-btn'),
  skillCards: document.querySelectorAll('.skill-card'),

  // Scroll reveal elements
  reveals: document.querySelectorAll('.reveal-on-scroll'),
  configLinks: document.querySelectorAll('.config-link'),
};

let toastTimeout = null;

/**
 * ----------------------------------------------------------------------------
 * 3. Toast Notification Helper
 * ----------------------------------------------------------------------------
 */
function showToast(message, duration = 3000) {
  if (!DOM.toast) return;

  DOM.toast.textContent = message;
  DOM.toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, duration);
}

/**
 * ----------------------------------------------------------------------------
 * 4. Theme Management (Dark / Light Mode)
 * ----------------------------------------------------------------------------
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default dark

  document.documentElement.setAttribute('data-theme', initialTheme);

  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);

      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
    });
  }
}

/**
 * ----------------------------------------------------------------------------
 * 5. Mobile Navigation Menu
 * ----------------------------------------------------------------------------
 */
function initMobileNav() {
  if (!DOM.hamburgerBtn || !DOM.navMenu || !DOM.mobileOverlay) return;

  function toggleMenu(isOpen) {
    const currentState = DOM.hamburgerBtn.classList.contains('active');
    const newState = typeof isOpen === 'boolean' ? isOpen : !currentState;

    DOM.hamburgerBtn.classList.toggle('active', newState);
    DOM.hamburgerBtn.setAttribute('aria-expanded', String(newState));
    DOM.navMenu.classList.toggle('open', newState);
    DOM.mobileOverlay.classList.toggle('open', newState);

    // Prevent background scrolling while open on mobile
    document.body.style.overflow = newState ? 'hidden' : '';
  }

  DOM.hamburgerBtn.addEventListener('click', () => toggleMenu());
  DOM.mobileOverlay.addEventListener('click', () => toggleMenu(false));

  // Close when clicking nav items
  DOM.navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 6. Sticky Header & Scroll Spy (Active Nav Link)
 * ----------------------------------------------------------------------------
 */
function initHeaderScroll() {
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Header blur state
    if (scrollY > 30) {
      DOM.header?.classList.add('scrolled');
    } else {
      DOM.header?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 350) {
      DOM.backToTopBtn?.classList.add('visible');
    } else {
      DOM.backToTopBtn?.classList.remove('visible');
    }

    // Scroll spy for active navigation item
    const scrollPosition = scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        DOM.navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once initially
}

/**
 * ----------------------------------------------------------------------------
 * 7. Smooth Scrolling with Offset Calculation
 * ----------------------------------------------------------------------------
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = DOM.header?.offsetHeight || 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without jumping
        history.pushState(null, '', targetId);
      }
    });
  });

  // Back to top click handler
  if (DOM.backToTopBtn) {
    DOM.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
}

/**
 * ----------------------------------------------------------------------------
 * 8. Scroll Reveal Animations (IntersectionObserver)
 * ----------------------------------------------------------------------------
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal all elements immediately
    DOM.reveals.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  DOM.reveals.forEach((el) => {
    revealObserver.observe(el);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 9. Technical Skills Category Filter
 * ----------------------------------------------------------------------------
 */
function initSkillsFilter() {
  if (!DOM.skillFilterBtns.length || !DOM.skillCards.length) return;

  DOM.skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active state of buttons
      DOM.skillFilterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      DOM.skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * ----------------------------------------------------------------------------
 * 10. Contact Form Validation & Submission
 * ----------------------------------------------------------------------------
 */
function initContactForm() {
  if (!DOM.contactForm) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Character counter for message field
  if (messageInput && DOM.charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      DOM.charCounter.textContent = `${length} / 500`;
    });
  }

  // Email regex validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // Clear specific field validation on input
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const err = document.getElementById(`${input.name}-error`);
      if (err) err.classList.remove('visible');
    });
  });

  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      nameError.classList.add('visible');
      isValid = false;
    } else {
      nameInput.classList.remove('invalid');
      nameError.classList.remove('visible');
    }

    // Validate Email
    if (!isValidEmail(emailInput.value)) {
      emailInput.classList.add('invalid');
      emailError.classList.add('visible');
      isValid = false;
    } else {
      emailInput.classList.remove('invalid');
      emailError.classList.remove('visible');
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectInput.classList.add('invalid');
      subjectError.classList.add('visible');
      isValid = false;
    } else {
      subjectInput.classList.remove('invalid');
      subjectError.classList.remove('visible');
    }

    // Validate Message (min 15 characters)
    if (!messageInput.value.trim() || messageInput.value.trim().length < 15) {
      messageInput.classList.add('invalid');
      messageError.classList.add('visible');
      isValid = false;
    } else {
      messageInput.classList.remove('invalid');
      messageError.classList.remove('visible');
    }

    if (!isValid) return;

    // Form is valid: simulate delivery feedback
    const originalBtnContent = DOM.formSubmitBtn.innerHTML;
    DOM.formSubmitBtn.disabled = true;
    DOM.formSubmitBtn.innerHTML = `<span>Sending Message...</span>`;

    setTimeout(() => {
      // Simulate successful dispatch
      DOM.formStatus.className = 'form-status success';
      DOM.formStatus.textContent = 'Thank you, Prajyot has received your message and will get back to you shortly!';

      showToast('Message sent successfully!');

      DOM.contactForm.reset();
      if (DOM.charCounter) DOM.charCounter.textContent = '0 / 500';

      DOM.formSubmitBtn.disabled = false;
      DOM.formSubmitBtn.innerHTML = originalBtnContent;

      // Auto-hide status banner after 7 seconds
      setTimeout(() => {
        DOM.formStatus.className = 'form-status';
        DOM.formStatus.textContent = '';
      }, 7000);
    }, 850);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 11. Copy to Clipboard Feature
 * ----------------------------------------------------------------------------
 */
function initCopyToClipboard() {
  if (!DOM.copyEmailBtn) return;

  DOM.copyEmailBtn.addEventListener('click', async () => {
    const emailToCopy = PORTFOLIO_CONFIG.email;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for non-HTTPS / older browser contexts
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = emailToCopy;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.left = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
      }
      showToast(`Copied ${emailToCopy} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${emailToCopy}`);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 12. Dynamic Configuration Links Binder
 * ----------------------------------------------------------------------------
 */
function initConfigLinks() {
  DOM.configLinks.forEach((link) => {
    const key = link.getAttribute('data-config-key');
    if (!key || !PORTFOLIO_CONFIG[key]) return;

    const targetUrl = PORTFOLIO_CONFIG[key];

    // Set href attribute
    link.setAttribute('href', targetUrl);

    // If it's an external URL, ensure secure attributes
    if (targetUrl.startsWith('http')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }

    // Click handler for demonstration & placeholder guidance
    link.addEventListener('click', (e) => {
      if (targetUrl.includes('example.com') || targetUrl.includes('placeholder')) {
        e.preventDefault();
        showToast(`Configuration placeholder: Update "${key}" in script.js with your live URL.`);
      }
    });
  });
}

/**
 * ----------------------------------------------------------------------------
 * 13. Dynamic Year & Resume Verification
 * ----------------------------------------------------------------------------
 */
function initMetadata() {
  if (DOM.currentYearSpan) {
    DOM.currentYearSpan.textContent = new Date().getFullYear();
  }

  // Graceful handling for resume download link
  document.querySelectorAll('.resume-download-link').forEach((link) => {
    link.addEventListener('click', () => {
      showToast('Downloading Prajyot Khabale\'s resume...');
    });
  });
}

/**
 * ----------------------------------------------------------------------------
 * Initialization on DOM Ready
 * ----------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initHeaderScroll();
  initSmoothScroll();
  initScrollReveal();
  initSkillsFilter();
  initContactForm();
  initCopyToClipboard();
  initConfigLinks();
  initMetadata();

  console.log(
    '%c Prajyot Khabale - Portfolio Initialized %c Ready for Internship Applications! ',
    'background: #6366f1; color: #fff; border-radius: 4px; padding: 4px 8px; font-weight: bold;',
    'background: #10b981; color: #fff; border-radius: 4px; padding: 4px 8px;'
  );
});
