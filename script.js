/* ================================================
   DJPAT Digital — Main JavaScript
   ================================================ */

(function () {
  'use strict';

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('djpat-theme', theme);
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('djpat-theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // --- Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    mainNav.classList.toggle('is-open');
  });

  // Close mobile menu on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    });
  });

  // --- Sticky Header with hide-on-scroll ---
  const header = document.getElementById('site-header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }

    if (scrollY > lastScrollY && scrollY > 300) {
      header.classList.add('site-header--hidden');
    } else {
      header.classList.remove('site-header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // --- Scroll Animations (Intersection Observer) ---
  function initScrollAnimations() {
    // Add fade-in class to animatable elements
    const animatableSelectors = [
      '.section-header',
      '.service-card',
      '.portfolio-card',
      '.process-step',
      '.about-content',
      '.about-visual',
      '.contact-inner',
      '.hero-badge',
      '.hero-title',
      '.hero-subtitle',
      '.hero-actions',
      '.hero-stats'
    ];

    animatableSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('fade-in');
      });
    });

    // Add stagger containers
    document.querySelectorAll('.services-grid, .portfolio-grid, .process-steps').forEach(el => {
      el.classList.add('stagger-children');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active nav link highlight ---
  function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
  }, { passive: true });

  // --- Service CTA → pre-select service in contact form ---
  function initServiceCTAs() {
    document.querySelectorAll('.service-cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serviceName = btn.getAttribute('data-service');
        const serviceSelect = document.getElementById('contact-service');
        if (serviceSelect && serviceName) {
          // Set the value
          for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === serviceName) {
              serviceSelect.selectedIndex = i;
              break;
            }
          }
          // Brief highlight animation
          const selectGroup = serviceSelect.closest('.form-group');
          if (selectGroup) {
            selectGroup.classList.add('is-highlighted');
            setTimeout(() => selectGroup.classList.remove('is-highlighted'), 2000);
          }
          // Focus on the name field so user can start filling in
          setTimeout(() => {
            const nameField = document.getElementById('contact-name');
            if (nameField) nameField.focus();
          }, 400);
        }
      });
    });
  }

  // --- AJAX Form Submission (no redirect, no email login gate) ---
  function initFormSubmission() {
    const form = document.getElementById('contact-form');
    const thankYou = document.getElementById('thank-you');
    if (!form || !thankYou) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          form.style.display = 'none';
          thankYou.style.display = 'block';
          thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please email us directly at tyler@djpatdigital.com');
      });
    });
  }

  // --- Thank you state on URL hash (legacy fallback) ---
  function checkThankYou() {
    if (window.location.hash === '#thank-you') {
      const form = document.getElementById('contact-form');
      const thankYou = document.getElementById('thank-you');
      if (form && thankYou) {
        form.style.display = 'none';
        thankYou.style.display = 'block';
      }
    }
  }

  // --- Service Detail Modals ---
  var modalData = {
    starter: {
      name: 'Starter Site',
      price: '$500',
      description: 'A clean, professional website for businesses just getting started online. Up to 5 pages, fully custom-designed and built to convert visitors into customers. Perfect for service businesses, consultants, and local shops that need a strong web presence without the enterprise price tag.',
      features: [
        'Custom design — not a template',
        'Mobile-responsive on all devices',
        'Contact form with email notifications',
        'SEO basics (meta tags, sitemap, Open Graph)',
        'Google Analytics setup and configuration',
        'Free hosting and SSL certificate'
      ],
      included: [
        'Web hosting (no monthly fee)',
        'SSL certificate (HTTPS)',
        'Contact form processing',
        'Basic analytics tracking',
        'One round of revisions'
      ],
      costs: [
        'Domain name: ~$12/year (you choose and own it)',
        'That\'s it — everything else is included at no extra cost'
      ],
      ctaText: 'Get Started — Free Mock-Up',
      dataService: 'Starter Website Build'
    },
    pro: {
      name: 'Pro Site',
      price: '$1,500',
      description: 'A full-featured website for growing businesses that need more than the basics. 10+ pages with blog, booking integration, and advanced SEO to help you rank higher and convert more visitors. Ideal for established businesses ready to level up their online presence.',
      features: [
        'Everything in Starter, plus:',
        'Blog section with easy content management',
        'Online booking integration (Calendly/Cal.com)',
        'Advanced SEO (schema markup, local SEO, rich snippets)',
        'Multiple contact forms for different services',
        'Priority delivery'
      ],
      included: [
        'Web hosting (no monthly fee)',
        'SSL certificate (HTTPS)',
        'Contact form processing',
        'Blog platform setup',
        'Analytics and search console setup',
        'Two rounds of revisions'
      ],
      costs: [
        'Domain name: ~$12/year',
        'Booking software: free tiers available (Calendly, Cal.com)',
        'Custom email (optional): ~$6/month per mailbox',
        'Most businesses pay $0–$6/month total beyond the domain'
      ],
      ctaText: 'Get Started — Free Mock-Up',
      dataService: 'Pro Website Build'
    },
    premium: {
      name: 'Premium Build',
      price: 'Starting at $2,500',
      description: 'A fully custom website build for businesses with complex needs — e-commerce, CRM integration, multi-location pages, and advanced interactivity. We scope every project individually so you only pay for what you need. Perfect for businesses ready to invest in a serious online platform.',
      features: [
        'Everything in Pro, plus:',
        'E-commerce / online payment processing',
        'CRM integration (HubSpot, Salesforce, etc.)',
        'Multi-location pages with local SEO for each',
        'Custom booking and scheduling systems',
        'Advanced animations and interactive elements',
        'Custom scope tailored to your needs'
      ],
      included: [
        'Web hosting (no monthly fee)',
        'SSL certificate (HTTPS)',
        'All form processing',
        'Full analytics suite setup',
        'Three rounds of revisions',
        'Pre-launch cost mapping session'
      ],
      costs: [
        'Domain name: ~$12/year',
        'Stripe payment processing: 2.9% + $0.30 per transaction',
        'CRM tools: varies ($0–$50/month depending on provider and plan)',
        'Email marketing: free tiers available (Mailchimp, Brevo)',
        'We\'ll map out every cost before you commit — no surprises'
      ],
      ctaText: 'Get Started — Discuss Your Project',
      dataService: 'Premium Website Build'
    },
    landing: {
      name: 'Landing Page',
      price: '$350',
      description: 'A single, high-converting landing page designed to capture leads and drive action. Perfect for ad campaigns, product launches, event signups, and promotions. Delivered same day so you can start converting traffic immediately.',
      features: [
        'High-converting design optimized for action',
        'Lead capture form with email notifications',
        'Mobile-responsive on all devices',
        'SEO-optimized (meta tags, Open Graph)',
        'Fast delivery — same day turnaround'
      ],
      included: [
        'Web hosting (no monthly fee)',
        'SSL certificate (HTTPS)',
        'Form processing',
        'Analytics tracking setup',
        'One round of revisions'
      ],
      costs: [
        'Domain name: ~$12/year (or use a subdomain for free)',
        'No ongoing costs — hosting and SSL are free'
      ],
      ctaText: 'Get Started — Free Mock-Up',
      dataService: 'Landing Page'
    }
  };

  function initModals() {
    var overlay = document.getElementById('modal-overlay');
    var card = document.getElementById('modal-card');
    var closeBtn = document.getElementById('modal-close');
    var body = document.getElementById('modal-body');
    if (!overlay || !body) return;

    function openModal(key) {
      var data = modalData[key];
      if (!data) return;

      var featuresHtml = data.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');
      var includedHtml = data.included.map(function(f) { return '<li>' + f + '</li>'; }).join('');
      var costsHtml = data.costs.map(function(f) { return '<li>' + f + '</li>'; }).join('');

      body.innerHTML =
        '<h2 id="modal-title">' + data.name + '</h2>' +
        '<div class="modal-price">' + data.price + '</div>' +
        '<p class="modal-description">' + data.description + '</p>' +
        '<div class="modal-section"><h4>Features</h4><ul>' + featuresHtml + '</ul></div>' +
        '<div class="modal-section"><h4>What\'s Included at No Extra Cost</h4><ul>' + includedHtml + '</ul></div>' +
        '<div class="modal-section"><h4>Potential Operating Costs</h4><ul>' + costsHtml + '</ul></div>' +
        '<div class="modal-section"><h4>How It Works</h4><ol class="modal-steps">' +
          '<li>You reach out — tell us about your business and what you need</li>' +
          '<li>We build a free mock-up within 24 hours — no commitment</li>' +
          '<li>You decide — love it, revise it, or walk away. Zero pressure</li>' +
        '</ol></div>' +
        '<button class="btn btn-primary modal-cta" data-service="' + data.dataService + '">' + data.ctaText + '</button>';

      // Attach CTA handler
      var ctaBtn = body.querySelector('.modal-cta');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
          closeModal();
          var serviceSelect = document.getElementById('contact-service');
          var serviceName = ctaBtn.getAttribute('data-service');
          if (serviceSelect && serviceName) {
            for (var i = 0; i < serviceSelect.options.length; i++) {
              if (serviceSelect.options[i].value === serviceName) {
                serviceSelect.selectedIndex = i;
                break;
              }
            }
            var selectGroup = serviceSelect.closest('.form-group');
            if (selectGroup) {
              selectGroup.classList.add('is-highlighted');
              setTimeout(function() { selectGroup.classList.remove('is-highlighted'); }, 2000);
            }
          }
          var contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setTimeout(function() {
            var nameField = document.getElementById('contact-name');
            if (nameField) nameField.focus();
          }, 600);
        });
      }

      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // Close button
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal card
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Attach Learn More buttons
    document.querySelectorAll('.service-learn-more').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-modal');
        openModal(key);
      });
    });
  }

  // --- Initialize ---
  window.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    updateActiveNav();
    initServiceCTAs();
    initFormSubmission();
    initModals();
    checkThankYou();
  });

  // Also initialize if DOM is already loaded
  if (document.readyState !== 'loading') {
    initScrollAnimations();
    updateActiveNav();
    initServiceCTAs();
    initFormSubmission();
    initModals();
    checkThankYou();
  }

})();
