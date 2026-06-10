/**
 * SonoTech Ultrasonic Equipment — Main JavaScript
 * Design: Technical Blueprint
 * Features: Mobile nav, FAQ accordion, scroll reveal, smooth scroll
 */

(function () {
  'use strict';

  /* ============================
     MOBILE NAVIGATION
     ============================ */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ============================
     FAQ ACCORDION
     ============================ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isOpen = this.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question').forEach(function (q) {
        q.classList.remove('open');
        if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        this.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  /* ============================
     SCROLL REVEAL ANIMATION
     ============================ */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================
     ACTIVE NAV LINK
     ============================ */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && (currentPath === '/' || currentPath === '/index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerH = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================
     CONTACT FORM VALIDATION
     ============================ */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var valid = true;
      var required = contactForm.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E53E3E';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        var firstError = contactForm.querySelector('[required]:invalid, [style*="E53E3E"]');
        if (firstError) firstError.focus();
      }
    });
  }

  /* ============================
     LAZY LOAD IMAGES
     ============================ */
  if ('IntersectionObserver' in window) {
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    // Native lazy loading is used; this is a fallback for older browsers
    var imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(function (img) {
      if (img.dataset.src) imgObserver.observe(img);
    });
  }

  /* ============================
     YEAR IN FOOTER
     ============================ */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================
     APPLICATION FORM (questionnaire)
     ============================ */
  var appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var required = appForm.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E53E3E';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;
      // Build mailto
      var data = new FormData(appForm);
      var body = [];
      data.forEach(function(v, k) { if (v) body.push(k + ': ' + v); });
      var subject = encodeURIComponent('Ultrasonic Application Questionnaire');
      var bodyStr = encodeURIComponent(body.join('\n'));
      window.location.href = 'mailto:sales@sonotech-ultrasonic.com?subject=' + subject + '&body=' + bodyStr;
    });
  }

  /* ============================
     HEADER SCROLL SHADOW
     ============================ */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ============================
     CLOSE MOBILE NAV ON LINK CLICK
     ============================ */
  document.querySelectorAll('.mobile-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (mobileNav) mobileNav.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

})();

// Load schema.js
(function() {
  var s = document.createElement('script');
  s.src = '/assets/js/schema.js';
  document.head.appendChild(s);
})();
