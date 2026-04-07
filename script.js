/**
 * Author: Arif Siddique
 * Assignment: Gushwork Web Developer
 */




/**
 * script.js
 * Mangalam HDPE Pipes – Product Page JS
 *
 * Features:
 *  1. Sticky header (appears when scrolled past first fold, hides on scroll up)
 *  2. Mobile navigation toggle
 *  3. Image carousel with arrow + thumbnail navigation
 *  4. Zoom preview on carousel image hover (desktop)
 *  5. FAQ accordion
 *  6. Applications carousel (horizontal scroll)
 *  7. Process tabs
 */

/* ============================================================
   1. STICKY HEADER – appears after first fold, hides on scroll up
============================================================ */
(function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  const mainNav = document.getElementById('mainNav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.75; // 75vh = "first fold"

    if (currentScrollY > heroHeight) {
      // Past first fold
      if (currentScrollY < lastScrollY) {
        // Scrolling UP → show sticky header
        stickyHeader.classList.add('visible');
        stickyHeader.setAttribute('aria-hidden', 'false');
      } else {
        // Scrolling DOWN → hide sticky header
        stickyHeader.classList.remove('visible');
        stickyHeader.setAttribute('aria-hidden', 'true');
      }
    } else {
      // Above first fold → always hide
      stickyHeader.classList.remove('visible');
      stickyHeader.setAttribute('aria-hidden', 'true');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();


/* ============================================================
   2. MOBILE NAVIGATION TOGGLE
============================================================ */
(function initMobileNav() {
  const burger = document.getElementById('mainBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });
})();


/* ============================================================
   3. IMAGE CAROUSEL
============================================================ */
(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const thumbs = document.querySelectorAll('.thumb');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;

  /** Activate slide at index i */
  function goTo(index) {
    // Clamp/wrap
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Deactivate old
    slides[current].classList.remove('active');
    thumbs[current] && thumbs[current].classList.remove('active');

    current = index;

    // Activate new
    slides[current].classList.add('active');
    thumbs[current] && thumbs[current].classList.add('active');
  }

  // Arrow buttons
  prevBtn && prevBtn.addEventListener('click', function () {
    goTo(current - 1);
    resetAutoplay();
  });

  nextBtn && nextBtn.addEventListener('click', function () {
    goTo(current + 1);
    resetAutoplay();
  });

  // Thumbnail clicks
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const idx = parseInt(thumb.getAttribute('data-index'), 10);
      goTo(idx);
      resetAutoplay();
    });
  });

  // Autoplay every 4 seconds
  function startAutoplay() {
    autoplayTimer = setInterval(function () {
      goTo(current + 1);
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();

  /* ---- Zoom Preview positioning on mouse move ---- */
  slides.forEach(function (slide) {
    const imgWrap = slide.querySelector('.carousel-img-wrap');
    const zoomPreview = slide.querySelector('.zoom-preview');
    const zoomImg = zoomPreview ? zoomPreview.querySelector('img') : null;

    if (!imgWrap || !zoomPreview || !zoomImg) return;

    imgWrap.addEventListener('mousemove', function (e) {
      const rect = imgWrap.getBoundingClientRect();

      // Calculate cursor position as percentage within the image
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;

      // Pan the zoomed image so cursor area is centered in preview
      // zoomImg is scale(1.5), so offset range = 50% of original size
      const offsetX = (0.5 - xPct) * 50; // px
      const offsetY = (0.5 - yPct) * 50;
      zoomImg.style.transform = `scale(1.5) translate(${offsetX}%, ${offsetY}%)`;

      // Position the preview box near cursor (right side preferred)
      const previewW = 220;
      const gap = 16;
      let left = e.clientX - rect.left + gap;
      let top = e.clientY - rect.top - 90; // center vertically

      // Keep preview inside carousel horizontally
      if (left + previewW > rect.width - 8) {
        left = e.clientX - rect.left - previewW - gap;
      }

      // Keep preview inside vertically
      const previewH = 180;
      if (top < 0) top = 0;
      if (top + previewH > rect.height) top = rect.height - previewH;

      zoomPreview.style.position = 'absolute';
      zoomPreview.style.left = left + 'px';
      zoomPreview.style.top = top + 'px';
      zoomPreview.style.right = 'auto';
      zoomPreview.style.bottom = 'auto';
      zoomPreview.style.transform = 'none';
    });
  });
})();


/* ============================================================
   4. FAQ ACCORDION
============================================================ */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    const icon = item.querySelector('.faq-icon');

    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (fi) {
        fi.classList.remove('open');
        const ic = fi.querySelector('.faq-icon');
        const bt = fi.querySelector('.faq-q');
        if (ic) ic.textContent = '+';
        if (bt) bt.setAttribute('aria-expanded', 'false');
      });

      // If it wasn't open, open it
      if (!isOpen) {
        item.classList.add('open');
        if (icon) icon.textContent = '−';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ============================================================
   5. APPLICATIONS CAROUSEL (horizontal scroll)
============================================================ */
(function initAppCarousel() {
  const track = document.getElementById('appTrack');
  const prevBtn = document.getElementById('appPrev');
  const nextBtn = document.getElementById('appNext');

  if (!track) return;

  const cards = track.querySelectorAll('.app-card');
  const cardW = cards[0] ? cards[0].offsetWidth + 20 : 0; // width + gap
  let offset = 0;
  const maxOffset = Math.max(0, (cards.length - 4) * (cardW));

  function updateTrack() {
    track.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn && prevBtn.addEventListener('click', function () {
    offset = Math.max(0, offset - cardW);
    updateTrack();
  });

  nextBtn && nextBtn.addEventListener('click', function () {
    // Recalculate on each click in case of resize
    const cW = cards[0] ? cards[0].offsetWidth + 20 : cardW;
    const visibleCount = Math.floor(track.parentElement.offsetWidth / cW);
    const max = Math.max(0, (cards.length - visibleCount) * cW);
    offset = Math.min(max, offset + cW);
    updateTrack();
  });

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const dx = startX - e.changedTouches[0].clientX;
    const cW = cards[0] ? cards[0].offsetWidth + 20 : 280;
    const visibleCount = Math.floor(track.parentElement.offsetWidth / cW);
    const max = Math.max(0, (cards.length - visibleCount) * cW);

    if (dx > 40) {
      offset = Math.min(max, offset + cW);
    } else if (dx < -40) {
      offset = Math.max(0, offset - cW);
    }
    updateTrack();
  }, { passive: true });
})();


/* ============================================================
   6. PROCESS TABS
============================================================ */
(function initProcessTabs() {
  const tabs = document.querySelectorAll('.ptab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      // In a real implementation you'd swap content panels here
    });
  });
})();


/* ============================================================
   7. SMOOTH REVEAL ON SCROLL (Intersection Observer)
============================================================ */
(function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.feature-card, .portfolio-card, .testi-card, .faq-item, .app-card, .resource-item'
  );

  if (!('IntersectionObserver' in window)) return;

  revealTargets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger within the same parent grid
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        const delay = (idx % 4) * 80; // stagger by position in row

        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(function (el) { observer.observe(el); });
})();


/* ============================================================
   8. KEYBOARD ACCESSIBILITY – carousel arrow keys
============================================================ */
(function initCarouselKeyboard() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      document.getElementById('prevBtn') && document.getElementById('prevBtn').click();
    } else if (e.key === 'ArrowRight') {
      document.getElementById('nextBtn') && document.getElementById('nextBtn').click();
    }
  });
})();