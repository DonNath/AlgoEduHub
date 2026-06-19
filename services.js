/* =============================================
   DELPHI EDUHUB — services.js
   ============================================= */

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================
   1. STICKY NAV SHADOW
   ============================================= */
(function initNav() {
  const nav = $('#nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* =============================================
   2. MOBILE BURGER MENU
   ============================================= */
(function initBurger() {
  const burger   = $('#burger');
  const navLinks = $('#navLinks');
  if (!burger || !navLinks) return;

  const toggle = (open) => {
    burger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => toggle(!navLinks.classList.contains('open')));
  $$('.nav__link', navLinks).forEach(l => l.addEventListener('click', () => toggle(false)));
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) toggle(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
})();


/* =============================================
   3. SERVICE CARD FILTER
   ============================================= */
(function initFilter() {
  const tabs       = $$('.tab');
  const cards      = $$('.scard');
  const emptyState = $('#emptyState');
  const resetBtn   = $('#resetFilter');

  const filterCards = (category) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCat = card.dataset.category;
      const show    = category === 'all' || cardCat === category;

      if (show) {
        card.classList.remove('hidden');
        visibleCount++;
        // Re-trigger reveal if not yet visible
        if (!card.classList.contains('visible')) {
          // Small delay so the browser paints the un-hidden card first
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('visible'));
          });
        }
      } else {
        card.classList.add('hidden');
      }
    });

    // Toggle empty state
    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab styling and aria
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      filterCards(tab.dataset.filter);
    });
  });

  // Reset link inside empty state
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      const allTab = $('[data-filter="all"]');
      if (allTab) {
        allTab.classList.add('active');
        allTab.setAttribute('aria-selected', 'true');
      }
      filterCards('all');
    });
  }
})();


/* =============================================
   4. SCROLL REVEAL
   ============================================= */
(function initReveal() {
  const elements = $$('.reveal, .scard, .board-item, .cta-banner__inner, .page-hero__inner');

  // Only add reveal class to elements that don't already have it
  elements.forEach((el) => {
    if (!el.classList.contains('scard') && !el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  elements.forEach((el) => observer.observe(el));
})();


/* =============================================
   5. STAGGER CARD ENTRANCE DELAYS
   ============================================= */
(function initCardStagger() {
  const cards = $$('.scard');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 80}ms`;
    // Remove stagger delay after first reveal so hover isn't sluggish
    card.addEventListener('transitionend', () => {
      card.style.transitionDelay = '0ms';
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
   7. KEYBOARD NAVIGATION FOR FILTER TABS
   (Left/Right arrow keys cycle through tabs)
   ============================================= */
(function initTabKeyboard() {
  const tabs = $$('.tab');
  if (!tabs.length) return;

  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') targetIndex = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  targetIndex = (i - 1 + tabs.length) % tabs.length;
      if (targetIndex !== null) {
        e.preventDefault();
        tabs[targetIndex].focus();
        tabs[targetIndex].click();
      }
    });
  });
})();
