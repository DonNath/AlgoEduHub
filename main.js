/* =============================================
   DELPHI EDUHUB — main.js
   ============================================= */

'use strict';

/* ---- Helpers ---- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================
   1. STICKY NAV — add shadow on scroll
   ============================================= */
(function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* =============================================
   2. MOBILE BURGER MENU
   ============================================= */
(function initBurger() {
  const burger    = $('#burger');
  const navLinks  = $('#navLinks');
  if (!burger || !navLinks) return;

  const toggle = (open) => {
    burger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    toggle(!isOpen);
  });

  // Close when a nav link is clicked
  $$('.nav__link', navLinks).forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click / Escape
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) toggle(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();


/* =============================================
   3. SCROLL REVEAL — fade-in-up on viewport entry
   ============================================= */
(function initReveal() {
  // Elements to animate
  const targets = [
    '.service-card',
    '.step',
    '.testimonial',
    '.section-header',
    '.cta-banner__inner',
    '.hero__content',
    '.hero__visual',
    '.trust-bar__inner',
    '.footer__brand',
    '.footer__nav',
    '.footer__contact',
  ];

  const elements = $$(targets.join(', '));
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards in a grid
    if (el.matches('.service-card, .step')) {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    elements.forEach(el => el.classList.add('visible'));
  }
})();


/* =============================================
   4. TESTIMONIAL CAROUSEL
   ============================================= */
(function initTestimonials() {
  const track  = $('#testimonialTrack');
  const dots   = $$('.dot');
  if (!track || !dots.length) return;

  const slides  = $$('.testimonial', track);
  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;

  const goTo = (index) => {
    current = (index + total) % total;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 1.5}rem))`;
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetAuto();
    });
  });

  // Auto-advance every 5s
  const startAuto = () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };
  const resetAuto = () => {
    clearInterval(autoTimer);
    startAuto();
  };

  // Touch / swipe support
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetAuto();
    }
    touchStartX = null;
  }, { passive: true });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAuto);

  // Init
  goTo(0);
  startAuto();
})();


/* =============================================
   5. SERVICE CARD — subtle entrance delay reset
   ============================================= */
(function initCardDelay() {
  // Remove stagger delay after the card has already revealed,
  // so hover transitions aren't sluggish later.
  $$('.service-card').forEach(card => {
    card.addEventListener('transitionend', () => {
      if (card.classList.contains('visible')) {
        card.style.transitionDelay = '0ms';
      }
    }, { once: true });
  });
})();


/* =============================================
   6. FOOTER YEAR
   ============================================= */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* =============================================
   7. ACTIVE NAV LINK on scroll (single-page feel)
   ============================================= */
(function initActiveLink() {
  // Only highlight based on URL match on a multi-page site,
  // but set "Home" active when at root path.
  const path     = window.location.pathname;
  const navLinks = $$('.nav__link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = new URL(link.href, window.location.origin).pathname;
    // Exact match, or root match
    if (href === path || (path === '/' && href === '/')) {
      link.classList.add('active');
    }
  });
})();
