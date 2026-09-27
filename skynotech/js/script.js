/**
 * Sky Nova Project Labs - Official Corporate JavaScript
 * Vanilla JS only. Zero heavy dependencies, zero animation libraries.
 * Handles: Responsive Navigation, Form Validations (Frontend Only),
 *          Client Reviews Scroll-Snap Slider
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle & Accessibility
  // -------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      }
    });

    // Close menu when clicking any nav-link
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Newsletter Form Validation (Frontend Only)
  // -------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const messageBox = document.getElementById('newsletter-message');

      if (!emailInput || !messageBox) return;

      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue || !emailRegex.test(emailValue)) {
        messageBox.className = 'form-message error';
        messageBox.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
      }

      // Success state per specification
      messageBox.className = 'form-message success';
      messageBox.textContent = 'Thank you for subscribing!';
      emailInput.value = '';
    });
  }

  // -------------------------------------------------------------------------
  // 3. Quote Request Form Validation (Frontend Only, quote.html)
  // -------------------------------------------------------------------------
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const feedbackBox = document.getElementById('quote-feedback');

      const name = document.getElementById('quote-name');
      const email = document.getElementById('quote-email');
      const phone = document.getElementById('quote-phone');
      const service = document.getElementById('quote-service');
      const description = document.getElementById('quote-description');

      // Helper validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;
      let errorMsg = '';

      if (!name.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your full name.';
        name.focus();
      } else if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        isValid = false;
        errorMsg = 'Please provide a valid email address.';
        email.focus();
      } else if (!phone.value.trim() || phone.value.trim().length < 7) {
        isValid = false;
        errorMsg = 'Please provide a valid phone number.';
        phone.focus();
      } else if (!service.value) {
        isValid = false;
        errorMsg = 'Please select a required service category.';
        service.focus();
      } else if (!description.value.trim()) {
        isValid = false;
        errorMsg = 'Please provide a brief description of your project requirements.';
        description.focus();
      }

      if (!isValid) {
        if (feedbackBox) {
          feedbackBox.className = 'form-message error';
          feedbackBox.textContent = errorMsg;
        }
        return;
      }

      // Requirement 23 Exact Confirmation:
      // "Thank you! Your request has been received. Our team will get back to you soon."
      if (feedbackBox) {
        feedbackBox.className = 'form-message success';
        feedbackBox.textContent = 'Thank you! Your request has been received. Our team will get back to you soon.';
      }

      quoteForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 4. Contact Us Form Validation (Frontend Only, contact.html)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const feedbackBox = document.getElementById('contact-feedback');

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;
      let errorMsg = '';

      if (!name.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your name.';
        name.focus();
      } else if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        isValid = false;
        errorMsg = 'Please provide a valid email address.';
        email.focus();
      } else if (!message.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your message.';
        message.focus();
      }

      if (!isValid) {
        if (feedbackBox) {
          feedbackBox.className = 'form-message error';
          feedbackBox.textContent = errorMsg;
        }
        return;
      }

      if (feedbackBox) {
        feedbackBox.className = 'form-message success';
        feedbackBox.textContent = 'Thank you for reaching out! We have received your message and will get back to you soon.';
      }

      contactForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 5. Client Reviews Slider (CSS scroll-snap + Vanilla JS controls)
  // -------------------------------------------------------------------------
  const reviewsSlider = document.querySelector('[data-reviews-slider]');

  if (reviewsSlider) {
    const viewport = reviewsSlider.querySelector('[data-reviews-viewport]');
    const track = reviewsSlider.querySelector('[data-reviews-track]');
    const prevBtn = reviewsSlider.querySelector('[data-reviews-prev]');
    const nextBtn = reviewsSlider.querySelector('[data-reviews-next]');
    const dotsWrap = reviewsSlider.querySelector('[data-reviews-dots]');

    if (viewport && track) {
      const cards = Array.prototype.slice.call(track.querySelectorAll('.review-card'));

      if (cards.length) {
        let step = 0;
        let positions = 1;
        let activeIndex = 0;
        let frameRequested = false;

        // Distance travelled when advancing by one card
        function measureStep() {
          const styles = window.getComputedStyle(track);
          const gap = parseFloat(styles.columnGap || styles.gap) || 0;
          return cards[0].getBoundingClientRect().width + gap;
        }

        // Number of reachable snapped scroll positions
        function measurePositions() {
          const maxScroll = viewport.scrollWidth - viewport.clientWidth;
          if (maxScroll <= 1) return 1;
          return Math.max(1, Math.round(maxScroll / step) + 1);
        }

        function buildDots() {
          if (!dotsWrap) return;
          dotsWrap.textContent = '';
          for (let i = 0; i < positions; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'reviews-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Go to review position ' + (i + 1) + ' of ' + positions);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', function () {
              scrollToPosition(i);
            });
            dotsWrap.appendChild(dot);
          }
        }

        function syncUI() {
          const maxScroll = viewport.scrollWidth - viewport.clientWidth;
          if (maxScroll <= 1) {
            activeIndex = 0;
          } else {
            activeIndex = Math.min(positions - 1, Math.max(0, Math.round(viewport.scrollLeft / step)));
          }

          if (prevBtn) prevBtn.disabled = activeIndex === 0;
          if (nextBtn) nextBtn.disabled = activeIndex >= positions - 1;

          if (dotsWrap) {
            const dots = dotsWrap.children;
            for (let i = 0; i < dots.length; i++) {
              const isActive = i === activeIndex;
              dots[i].classList.toggle('is-active', isActive);
              dots[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
            }
          }
        }

        function scrollToPosition(index) {
          const target = Math.min(positions - 1, Math.max(0, index)) * step;
          viewport.scrollTo({ left: target, behavior: 'smooth' });
        }

        function recalculate() {
          step = measureStep();
          positions = measurePositions();
          buildDots();
          syncUI();
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            scrollToPosition(activeIndex - 1);
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            scrollToPosition(activeIndex + 1);
          });
        }

        viewport.addEventListener('scroll', function () {
          if (frameRequested) return;
          frameRequested = true;
          window.requestAnimationFrame(function () {
            frameRequested = false;
            syncUI();
          });
        }, { passive: true });

        viewport.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollToPosition(activeIndex + 1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollToPosition(activeIndex - 1);
          }
        });

        let resizeTimer = null;
        window.addEventListener('resize', function () {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(recalculate, 150);
        });

        recalculate();
      }
    }
  }
});
