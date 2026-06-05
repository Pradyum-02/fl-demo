/**
 * Sweet trEat — script.js
 * Pure Vanilla JavaScript
 * Handles: Navigation, Scroll Animations, Testimonial Slider,
 *          Gallery Filter, Lightbox, Form Validation, Back-to-Top
 */

'use strict';

/* =====================================================
   UTILITY HELPERS
   ===================================================== */

/**
 * Throttle a function to run at most once per `limit` ms.
 */
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce a function: delays execution until `wait` ms after last call.
 */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* =====================================================
   1. NAVBAR — SCROLL EFFECT + HAMBURGER MENU
   ===================================================== */

(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Create overlay element for mobile nav backdrop
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  /* Scroll effect on navbar */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', throttle(handleNavbarScroll, 100), { passive: true });
  handleNavbarScroll(); // run once on load

  /* Toggle mobile menu */
  function openMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActiveLink, 150), { passive: true });
  updateActiveLink();
})();


/* =====================================================
   2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ===================================================== */

(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  if (!revealEls.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();


/* =====================================================
   3. HERO — STAGGER TITLE ANIMATION ON LOAD
   ===================================================== */

(function initHeroAnimation() {
  const titleLines = document.querySelectorAll('.title-line');

  titleLines.forEach(function (line, i) {
    line.style.opacity = '0';
    line.style.transform = 'translateY(30px)';
    line.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

    setTimeout(function () {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  // Stagger the hero badge and sub-text
  const heroBadge = document.querySelector('.hero-badge');
  const heroSub   = document.querySelector('.hero-sub');
  const heroActions = document.querySelector('.hero-actions');
  const heroStats  = document.querySelector('.hero-stats');
  const heroVisual = document.querySelector('.hero-visual');

  [heroBadge, heroSub, heroActions, heroStats].forEach(function (el, i) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    setTimeout(function () {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 600 + i * 150);
  });

  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(50px)';
    heroVisual.style.transition = 'opacity 1s ease, transform 1s ease';
    setTimeout(function () {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateX(0)';
    }, 700);
  }
})();


/* =====================================================
   4. TESTIMONIAL SLIDER
   ===================================================== */

(function initTestimonialSlider() {
  const slides     = document.querySelectorAll('.slide');
  const dotsWrap   = document.getElementById('sliderDots');
  const prevBtn    = document.getElementById('sliderPrev');
  const nextBtn    = document.getElementById('sliderNext');

  if (!slides.length || !dotsWrap) return;

  let current    = 0;
  let autoTimer  = null;
  const AUTO_MS  = 4500;

  // Build dots
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function getDots() {
    return dotsWrap.querySelectorAll('.dot');
  }

  function goTo(index) {
    const dots = getDots();

    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(goNext, AUTO_MS);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goPrev();
      stopAuto();
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goNext();
      stopAuto();
      startAuto();
    });
  }

  // Touch/swipe support
  let touchStartX = 0;
  const sliderEl = document.querySelector('.slider-wrap');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goNext() : goPrev();
        stopAuto();
        startAuto();
      }
    }, { passive: true });
  }

  // Keyboard navigation
  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goPrev(); stopAuto(); startAuto(); }
      if (e.key === 'ArrowRight') { goNext(); stopAuto(); startAuto(); }
    });
  }

  startAuto();
})();


/* =====================================================
   5. GALLERY FILTER + LIGHTBOX
   ===================================================== */

(function initGallery() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox    = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose   = document.getElementById('lightboxClose');

  if (!filterBtns.length) return;

  /* ---- Filter ---- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        const cat = item.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.style.display = '';
          // Re-trigger animation
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(function () {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(function () { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ---- Lightbox ---- */
  function openLightbox(item) {
    if (!lightbox || !lightboxContent) return;

    // Clone inner content
    const inner = item.querySelector('.gallery-inner');
    const label = item.querySelector('.gallery-label');

    lightboxContent.innerHTML = '';

    const clone = document.createElement('div');
    clone.style.cssText = inner.style.cssText;
    clone.style.width = '100%';
    clone.style.height = '300px';
    clone.style.borderRadius = '16px';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.gap = '1rem';
    clone.style.background = inner.style.background || 'linear-gradient(135deg, #f5c87a, #e8942a)';

    const emoji = inner.querySelector('.gallery-emoji');
    if (emoji) {
      const emojiClone = emoji.cloneNode(true);
      emojiClone.style.fontSize = '5rem';
      clone.appendChild(emojiClone);
    }

    if (label) {
      const labelClone = label.cloneNode(true);
      labelClone.style.fontSize = '1rem';
      clone.appendChild(labelClone);
    }

    lightboxContent.appendChild(clone);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animate in
    lightboxContent.style.opacity = '0';
    lightboxContent.style.transform = 'scale(0.9)';
    requestAnimationFrame(function () {
      lightboxContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      lightboxContent.style.opacity = '1';
      lightboxContent.style.transform = 'scale(1)';
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightboxContent.style.opacity = '0';
    lightboxContent.style.transform = 'scale(0.9)';
    setTimeout(function () {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View ' + (item.querySelector('.gallery-label')?.textContent || 'item'));
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.style.display !== 'none') {
      closeLightbox();
    }
  });
})();


/* =====================================================
   6. CONTACT FORM — VALIDATION & SUBMIT
   ===================================================== */

(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('name');
    const phone   = document.getElementById('phone');
    const message = document.getElementById('message');
    let isValid   = true;

    // Clear previous errors
    [name, phone, message].forEach(function (field) {
      field.style.borderColor = '';
    });

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
      name.style.borderColor = '#c0392b';
      name.focus();
      isValid = false;
    }

    // Validate phone (basic: 10 digits)
    const phoneDigits = phone.value.replace(/\s/g, '').replace(/-/g, '');
    if (!phoneDigits || !/^\d{10,}$/.test(phoneDigits)) {
      phone.style.borderColor = '#c0392b';
      if (isValid) phone.focus();
      isValid = false;
    }

    // Validate message
    if (!message.value.trim() || message.value.trim().length < 5) {
      message.style.borderColor = '#c0392b';
      if (isValid) message.focus();
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(function () {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      if (success) {
        success.style.display = 'block';
        setTimeout(function () {
          success.style.display = 'none';
        }, 5000);
      }
    }, 1200);
  });

  // Live field styling on input
  [document.getElementById('name'), document.getElementById('phone'), document.getElementById('message')].forEach(function (field) {
    if (!field) return;
    field.addEventListener('input', function () {
      if (field.value.trim()) {
        field.style.borderColor = '';
      }
    });
  });
})();


/* =====================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ===================================================== */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
})();


/* =====================================================
   8. BACK TO TOP BUTTON
   ===================================================== */

(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', throttle(function () {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 200), { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =====================================================
   9. COUNTER ANIMATION (stats in hero)
   ===================================================== */

(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  function animateValue(el, start, end, duration, suffix) {
    const startTime = performance.now();
    const isDecimal = String(end).includes('.');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      el.textContent = isDecimal ? current.toFixed(1) + suffix : Math.round(current) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent.trim();
      observer.unobserve(el);

      if (text === '4.1') {
        animateValue(el, 0, 4.1, 1500, '');
      } else if (text === '439+') {
        animateValue(el, 0, 439, 1800, '+');
      }
      // 'Daily' stays as text
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) {
    if (el.textContent.trim() !== 'Daily') {
      observer.observe(el);
    }
  });
})();


/* =====================================================
   10. SPECIALTY CARD FILTER TABS (accessibility)
   ===================================================== */

(function initSpecialtyCards() {
  // Add keyboard accessibility to specialty cards
  document.querySelectorAll('.specialty-card').forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
  });
})();


/* =====================================================
   11. PAGE LOAD COMPLETE — Remove loading flicker
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Ensure the page is fully rendered before showing
  document.body.style.visibility = 'visible';

  // Log welcome message in console
  console.log(
    '%cSweet trEat 🍬',
    'font-size:20px; font-weight:bold; color:#6B1A1A; font-family:Georgia,serif;'
  );
  console.log(
    '%cस्वीट ट्रीट — Pashan, Pune',
    'font-size:13px; color:#D4621E;'
  );
  console.log('%cPremium sweet shop website — Pure HTML/CSS/JS', 'font-size:11px; color:#888;');
});
