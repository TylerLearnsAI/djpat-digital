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

  // --- Initialize ---
  window.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    updateActiveNav();
    initServiceCTAs();
    initFormSubmission();
    checkThankYou();
  });

  // Also initialize if DOM is already loaded
  if (document.readyState !== 'loading') {
    initScrollAnimations();
    updateActiveNav();
    initServiceCTAs();
    initFormSubmission();
    checkThankYou();
  }

})();
