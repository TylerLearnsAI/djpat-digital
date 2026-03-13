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

  // --- Initialize ---
  window.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    updateActiveNav();
  });

  // Also initialize if DOM is already loaded
  if (document.readyState !== 'loading') {
    initScrollAnimations();
    updateActiveNav();
  }

})();
