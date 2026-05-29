/* ==========================================================================
   Triveni HR Solution Pvt. Ltd. — site behaviour
   Vanilla JS, no dependencies. Safe to load with `defer`.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- nav */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    var scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      scrim.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    scrim.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Dropdowns: hover on desktop (CSS), tap-to-open on mobile.
    nav.querySelectorAll('.nav__item--has-menu > .nav__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth > 992) return;      // desktop: follow the link
        e.preventDefault();
        link.parentElement.classList.toggle('is-open');
      });
    });

    // Reset mobile state when we grow back to desktop.
    var lastWide = window.innerWidth > 992;
    window.addEventListener('resize', function () {
      var wide = window.innerWidth > 992;
      if (wide !== lastWide) {
        lastWide = wide;
        if (wide) {
          setOpen(false);
          nav.querySelectorAll('.is-open').forEach(function (el) { el.classList.remove('is-open'); });
        }
      }
    });
  }

  /* ------------------------------------------------------ sticky header */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------ scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });

    // Safety net. In odd viewports (zero-height embeds, some in-app webviews)
    // the observer can never report, which would leave the whole page blank.
    // If nothing at all has been revealed shortly after load, show everything.
    window.setTimeout(function () {
      if (!document.querySelector('.reveal.is-in')) {
        items.forEach(function (el) { el.classList.add('is-in'); });
      }
    }, 1500);
  }

  /* ---------------------------------------------------------- counters */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (reduceMotion) { el.textContent = String(target); return; }

      var duration = 1500;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
        el.textContent = String(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { el.textContent = '0'; io.observe(el); });
  }

  /* --------------------------------------------------------- marquee */
  // Duplicates the logo track once so the CSS -50% translate loops seamlessly.
  function initMarquee() {
    document.querySelectorAll('.marquee__track').forEach(function (track) {
      if (track.dataset.cloned === 'true') return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = 'true';
      track.setAttribute('aria-hidden', 'false');
    });
  }

  /* --------------------------------------------------------- to top */
  function initToTop() {
    var btn = document.querySelector('.to-top');
    if (!btn) return;
    var ticking = false;
    function update() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    update();
  }

  /* --------------------------------------------------------- jumpnav */
  /* Highlights the chip for whichever section you are currently reading,
     and keeps that chip in view when the bar has to scroll sideways. */
  function initJumpnav() {
    var bar = document.querySelector('.jumpnav');
    if (!bar) return;

    var links = [];
    bar.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) links.push({ a: a, target: target });
    });
    if (!links.length) return;

    var current = null;
    var ticking = false;

    function update() {
      ticking = false;
      var line = bar.getBoundingClientRect().bottom + 8;
      var active = null;

      links.forEach(function (item) {
        if (item.target.getBoundingClientRect().top <= line) active = item;
      });

      // Past the last section (footer): keep the final chip lit.
      if (!active && window.scrollY > 0) active = null;
      if (active === current) return;

      if (current) current.a.classList.remove('is-active');
      current = active;
      if (!current) return;

      current.a.classList.add('is-active');
      var chip = current.a.getBoundingClientRect();
      var list = current.a.closest('ul').getBoundingClientRect();
      if (chip.left < list.left || chip.right > list.right) {
        current.a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ----------------------------------------------------------- forms */
  /* Posts to Web3Forms (https://web3forms.com) via fetch so the visitor
     stays on the page. Set your access key in the form's hidden
     `access_key` input — see README.md. */
  function initForms() {
    document.querySelectorAll('form[data-ajax-form]').forEach(function (form) {
      var status = form.querySelector('.form__status');
      var submit = form.querySelector('[type="submit"]');
      var originalLabel = submit ? submit.textContent : '';

      form.addEventListener('submit', function (e) {
        var keyField = form.querySelector('input[name="access_key"]');
        var key = keyField ? keyField.value.trim() : '';

        // Not configured yet — don't pretend it sent.
        if (!key || key.indexOf('YOUR_WEB3FORMS') === 0) {
          e.preventDefault();
          if (status) {
            status.className = 'form__status is-err';
            status.textContent = 'This form is not connected yet. Please email info@trivenihr.com or call +977-1-4974619 in the meantime.';
          }
          return;
        }

        e.preventDefault();
        if (status) { status.className = 'form__status'; status.textContent = ''; }
        if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data && data.success) {
              status.className = 'form__status is-ok';
              status.textContent = 'Thank you — your message has been sent. We will get back to you shortly.';
              form.reset();
            } else {
              throw new Error((data && data.message) || 'Send failed');
            }
          })
          .catch(function () {
            status.className = 'form__status is-err';
            status.textContent = 'Sorry, the message could not be sent. Please email info@trivenihr.com or call +977-1-4974619.';
          })
          .then(function () {
            if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
            if (status) status.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
          });
      });
    });
  }

  /* ------------------------------------------------- leadership bios */
  /* Each team card is a button that opens a <dialog> holding that person's
     profile. The bio text lives in the HTML, so it is indexable by search
     engines even though the dialog starts closed. */
  function initBios() {
    var triggers = document.querySelectorAll('[data-bio]');
    if (!triggers.length) return;

    var supported = typeof HTMLDialogElement === 'function' &&
                    typeof document.createElement('dialog').showModal === 'function';

    // Never leave the page scroll-locked: unlock whenever no dialog is open,
    // rather than trusting a single 'close' event to fire.
    function syncLock() {
      var anyOpen = false;
      document.querySelectorAll('dialog.bio').forEach(function (d) {
        if (d.open) anyOpen = true;
      });
      document.body.style.overflow = anyOpen ? 'hidden' : '';
    }

    triggers.forEach(function (btn) {
      var dlg = document.getElementById(btn.getAttribute('data-bio'));
      if (!dlg) return;

      function open() {
        if (supported) {
          dlg.showModal();
        } else {
          // Very old browser: reveal the bio inline rather than losing it.
          dlg.setAttribute('open', '');
          dlg.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        syncLock();
      }

      function close() {
        if (supported) dlg.close(); else dlg.removeAttribute('open');
        syncLock();
        btn.focus();
      }

      btn.addEventListener('click', open);

      dlg.querySelectorAll('[data-close]').forEach(function (x) {
        x.addEventListener('click', close);
      });

      // Click on the backdrop (outside the dialog box) closes it.
      dlg.addEventListener('click', function (e) {
        if (e.target !== dlg) return;
        var r = dlg.getBoundingClientRect();
        var outside = e.clientX < r.left || e.clientX > r.right ||
                      e.clientY < r.top  || e.clientY > r.bottom;
        if (outside) close();
      });

      // Escape closes a native modal itself; these keep our lock in step.
      dlg.addEventListener('cancel', function () { window.setTimeout(syncLock, 0); });
      dlg.addEventListener('close',  function () { window.setTimeout(syncLock, 0); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.setTimeout(syncLock, 0);
    });
  }


  /* ------------------------------------------------------ copy to clipboard */
  /* Buttons with data-copy="#selector" copy that field's value and confirm
     inline. Falls back to selecting the text if the async API is unavailable
     (older browsers, or a page served over plain HTTP). */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      var target = document.querySelector(btn.getAttribute('data-copy'));
      if (!target) return;
      var original = btn.innerHTML;
      var done = btn.getAttribute('data-copied') || 'Copied';
      var timer;

      function confirmed() {
        btn.classList.add('is-copied');
        btn.innerHTML = done;
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.classList.remove('is-copied');
          btn.innerHTML = original;
        }, 2200);
      }

      function manual() {
        // Could not copy for us — select it and tell the truth.
        btn.classList.remove('is-copied');
        btn.innerHTML = 'Press Ctrl/Cmd + C';
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { btn.innerHTML = original; }, 3200);
      }

      function legacyCopy() {
        try {
          target.focus();
          target.select();
          target.setSelectionRange(0, 99999);
          return document.execCommand('copy');
        } catch (e) {
          return false;
        }
      }

      btn.addEventListener('click', function () {
        var text = target.value || target.textContent || '';
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(confirmed, function () {
            if (legacyCopy()) { confirmed(); } else { manual(); }
          });
        } else if (legacyCopy()) {
          confirmed();
        } else {
          manual();
        }
      });
    });
  }


  /* ------------------------------------------------------- hero aura */
  /* Nudges the hero's brand glows toward the pointer. Sets two custom
     properties the CSS reads; rAF only runs while the motion is settling,
     so it costs nothing once the pointer stops. */
  function initHeroAura() {
    var hero = document.querySelector('.hero');
    if (!hero || !hero.querySelector('.hero__aura')) return;
    if (reduceMotion) return;
    // Pointer parallax makes no sense on touch — leave the ambient drift alone.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function step() {
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;
      hero.style.setProperty('--mx', curX.toFixed(4));
      hero.style.setProperty('--my', curY.toFixed(4));
      if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
        raf = window.requestAnimationFrame(step);
      } else {
        raf = null;
      }
    }
    function kick() { if (!raf) raf = window.requestAnimationFrame(step); }

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    }, { passive: true });

    hero.addEventListener('mouseleave', function () {
      targetX = 0; targetY = 0; kick();
    }, { passive: true });
  }

  /* ------------------------------------------------------------ year */
  function initYear() {
    var y = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });
  }

  /* ------------------------------------------------------------- go */
  function boot() {
    initNav();
    initHeader();
    initReveal();
    initCounters();
    initMarquee();
    initToTop();
    initJumpnav();
    initForms();
    initBios();
    initCopy();
    initHeroAura();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
