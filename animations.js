/* ============================================================
   ETERNIT — Shared Animation Engine
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal],[data-stagger],[data-split],[data-line],[data-progress]');

  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- 2. Text Split ---------- */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML = text
      .split(/\s+/)
      .map((w) => `<span class="word"><span class="word-inner">${w}</span></span>`)
      .join(' ');
  });

  /* ---------- 3. Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    const raw = el.getAttribute('data-counter');
    const prefix = raw.startsWith('+') ? '+' : '';
    const suffix = raw.endsWith('+') ? '+' : raw.endsWith('%') ? '%' : '';
    const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(ease * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(step);
  }

  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- 4. Parallax on Scroll ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;

      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollY;
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;

        // Only animate if in/near viewport
        if (scrollY + viewH > elTop - 200 && scrollY < elTop + rect.height + 200) {
          const offset = (scrollY - elTop) * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- 5. Magnetic Buttons ---------- */
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- 6. Smooth Anchor Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
