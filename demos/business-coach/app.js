// ===================================================
// Marcus Cole Consulting — Landing Page Scripts
// ===================================================

(function () {
  'use strict';

  // ---- Header scroll behavior ----
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile navigation ----
  const mobileToggle = document.querySelector('.header__mobile-toggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);

      // Toggle icon
      if (isOpen) {
        mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        document.body.style.overflow = 'hidden';
      } else {
        mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        document.body.style.overflow = '';
      }
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll reveal animations ----
  function addFadeInClasses() {
    const selectors = [
      '.section-label',
      '.section-title',
      '.section-subtitle',
      '.problem__card',
      '.framework__step',
      '.results__stat',
      '.case-study',
      '.testimonial',
      '.checklist__content',
      '.checklist__visual',
      '.about__image',
      '.about__content',
      '.hero__content',
      '.hero__visual'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('fade-in');
      });
    });

    // Add stagger parent classes
    document.querySelectorAll('.problem__grid, .testimonials__grid, .results__stats').forEach(el => {
      el.classList.add('stagger-children');
    });
  }

  addFadeInClasses();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ---- Number counter animation ----
  function animateNumber(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.round(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        numberObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.results__number[data-target]').forEach(el => {
    numberObserver.observe(el);
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

// ---- Form handler ----
function handleFormSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn = e.target.querySelector('button[type="submit"]');

  if (input.value) {
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Check Your Inbox!';
      btn.style.background = '#22c55e';
      input.value = '';

      setTimeout(() => {
        btn.textContent = 'Get the Checklist';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  }
}
