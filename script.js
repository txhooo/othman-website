/* ===================================================================
   VIVRE — script.js
   Header state, mobile nav, hero entrance, scroll reveals,
   live drop countdown, product "notify" toggles, modal, waitlist form.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileNav = () => {
    navToggle.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ---------- hero mark entrance ---------- */
  const heroMark = document.getElementById('heroMark');
  requestAnimationFrame(() => {
    setTimeout(() => heroMark.classList.add('is-dropped'), 150);
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- live drop countdown ----------
     Targets the next Friday at 20:00 local time —
     mirrors a real "weekly drop" cadence for a streetwear label. */
  function getNextDropDate() {
    const now = new Date();
    const target = new Date(now);
    target.setHours(20, 0, 0, 0);

    const FRIDAY = 5;
    let diff = (FRIDAY - now.getDay() + 7) % 7;
    if (diff === 0 && now >= target) diff = 7;

    target.setDate(now.getDate() + diff);
    return target;
  }

  const dropDate = getNextDropDate();
  const cdD = document.getElementById('cd-d');
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');
  const pad2 = n => String(n).padStart(2, '0');

  function tickCountdown() {
    const diff = dropDate - new Date();
    if (diff <= 0) {
      cdD.textContent = cdH.textContent = cdM.textContent = cdS.textContent = '00';
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    cdD.textContent = pad2(d);
    cdH.textContent = pad2(h);
    cdM.textContent = pad2(m);
    cdS.textContent = pad2(s);
  }

  if (cdD) {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* ---------- product "notify me" toggles ---------- */
  document.querySelectorAll('[data-notify]').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('is-active');
      btn.textContent = active ? 'Tu es sur la liste ✓' : original;
    });
  });

  /* ---------- modal ---------- */
  const modalOverlay = document.getElementById('modalOverlay');

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('is-open');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modalOverlay.classList.remove('is-open'));
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlay.classList.remove('is-open');
      closeMobileNav();
    }
  });

  /* ---------- waitlist form (front-end only) ----------
     No backend is wired up here — hook this submit handler
     up to your own email service / API when ready. */
  const waitlistForm = document.getElementById('waitlistForm');
  const formNote = document.getElementById('formNote');
  const formNoteDefault = formNote ? formNote.textContent : '';

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = waitlistForm.querySelector('input[type="email"]');
      if (!input.value) return;

      formNote.textContent = 'Tu es sur la liste. On t\'écrit dès que le drop tombe.';
      formNote.classList.add('is-success');
      input.value = '';

      setTimeout(() => {
        formNote.textContent = formNoteDefault;
        formNote.classList.remove('is-success');
      }, 5000);
    });
  }

});
