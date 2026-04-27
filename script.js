/* ============================================================
   script.js — Rishi Kulkarni Portfolio
   ============================================================ */
'use strict';

/* --------------------------------------------------------
   1. NAV — Scroll state + Mobile Menu
   -------------------------------------------------------- */
(function initNav() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  // Scroll-based nav styling
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* --------------------------------------------------------
   2. HERO CANVAS — Particle network
   -------------------------------------------------------- */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;
  const COUNT = window.innerWidth < 600 ? 40 : 80;
  const MAX_DIST = 140;
  const MOUSE = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Ambient gradient overlay
    const grd = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.7);
    grd.addColorStop(0, 'rgba(99,102,241,0.07)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    const grd2 = ctx.createRadialGradient(W * 0.75, H * 0.65, 0, W * 0.75, H * 0.65, W * 0.5);
    grd2.addColorStop(0, 'rgba(139,92,246,0.05)');
    grd2.addColorStop(1, 'transparent');
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, W, H);

    // Update + draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion (subtle)
      const dx = p.x - MOUSE.x;
      const dy = p.y - MOUSE.y;
      const md = Math.sqrt(dx * dx + dy * dy);
      if (md < 100) {
        p.vx += dx / md * 0.04;
        p.vy += dy / md * 0.04;
      }
      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx /= speed; p.vy /= speed; }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,0.5)';
      ctx.fill();

      // Draw edges
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const dist = Math.sqrt(ex * ex + ey * ey);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  }, { passive: true });

  canvas.closest('.hero').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    MOUSE.x = e.clientX - rect.left;
    MOUSE.y = e.clientY - rect.top;
  }, { passive: true });
  canvas.closest('.hero').addEventListener('mouseleave', () => {
    MOUSE.x = -9999; MOUSE.y = -9999;
  });

  init();
  draw();
})();

/* --------------------------------------------------------
   3. SCROLL REVEAL — Intersection Observer
   -------------------------------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const cards = document.querySelectorAll('.project-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, _) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger based on DOM index
        const index = Array.from(cards).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('revealed');
        cardObserver.unobserve(entry.target);
        // Reset delay after animation
        setTimeout(() => { entry.target.style.transitionDelay = ''; }, 800);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  // Stagger reveal-up within same parent
  const groups = {};
  els.forEach(el => {
    const parent = el.parentElement;
    if (!groups[parent]) groups[parent] = [];
    groups[parent].push(el);
  });
  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });
  });

  cards.forEach(card => cardObserver.observe(card));
})();

/* --------------------------------------------------------
   4. COUNTER ANIMATION — Stats bar
   -------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* --------------------------------------------------------
   5. PROJECT MODAL
   -------------------------------------------------------- */
(function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const content = document.getElementById('modal-content');

  const MODAL_DATA = {
    'modal-adapti': {
      title: 'AdaptiLLM',
      tag: 'AI / Mobile',
      problem: 'Running large language models on-device in Android failed constantly — either the app crashed from out-of-memory errors, or the inference was so slow it was unusable.',
      solution: 'Built a production-grade Android inference engine with dynamic context-aware memory management. The engine auto-scales context size based on available RAM, streams tokens using a buffered queue for near-instant perceived response, and handles model quantization (GGUF) natively using llama.cpp bindings.',
      impact: ['On-device LLM inference with <1s first-token latency', 'Zero-crash architecture via adaptive memory budgeting', 'Supports multiple quantization levels (Q4_K_M, Q8_0)'],
      stack: ['Android', 'Kotlin', 'llama.cpp', 'GGUF', 'JNI', 'Coroutines'],
    },
    'modal-watchman': {
      title: 'Watchman CCTV',
      tag: 'AI / Computer Vision',
      problem: 'Professional CCTV systems cost thousands of dollars. Most homeowners have no real-time intrusion detection — just recorded footage nobody watches.',
      solution: 'Turned any Android phone into a live CCTV camera via DroidCam. Built a Python server that receives the MJPEG stream, runs YOLOv8 human detection per-frame, and fires a desktop notification with a cropped detection image within milliseconds of spotting a person.',
      impact: ['~30 FPS real-time processing on consumer hardware', 'Sub-second alert latency from detection to notification', 'Zero hardware cost beyond an old Android phone'],
      stack: ['Python', 'YOLOv8', 'OpenCV', 'DroidCam API', 'Plyer', 'MJPEG'],
    },
    'modal-hackathon': {
      title: 'Agentic AI Hackathon Site',
      tag: 'Web / Design',
      problem: 'Hackathon organizers needed a premium event website that projected credibility and drove sign-ups — with no design budget and a 6-hour deadline.',
      solution: 'Designed and shipped a full static website from scratch with glassmorphism UI, animated countdown timer, schedule, sponsor section, and FAQ. Deployed on GitHub Pages with zero cost.',
      impact: ['Shipped in 6 hours, used by real event organizers', 'Premium design at zero hosting/framework cost', 'Full responsive layout, mobile-first'],
      stack: ['HTML', 'CSS', 'Vanilla JS', 'GitHub Pages', 'Google Fonts'],
    },
  };

  function openModal(id) {
    const data = MODAL_DATA[id];
    if (!data) return;

    content.innerHTML = `
      <div style="margin-bottom:6px;">
        <span style="font-size:0.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-3);font-family:var(--font-mono);">${data.tag}</span>
      </div>
      <h2 id="modal-title" style="font-size:1.75rem;font-weight:800;letter-spacing:-.03em;margin-bottom:24px;">${data.title}</h2>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div>
          <div style="font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px;">Problem</div>
          <p style="font-size:.9rem;color:var(--text-secondary);line-height:1.75;">${data.problem}</p>
        </div>
        <div>
          <div style="font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px;">Solution</div>
          <p style="font-size:.9rem;color:var(--text-secondary);line-height:1.75;">${data.solution}</p>
        </div>
        <div style="background:rgba(124,58,237,.07);border:1px solid rgba(124,58,237,.15);border-radius:10px;padding:16px;">
          <div style="font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px;">Key Impact</div>
          <ul style="display:flex;flex-direction:column;gap:8px;">
            ${data.impact.map(i => `<li style="display:flex;gap:8px;align-items:flex-start;font-size:.875rem;color:var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;"><path d="M3 8l3 3 7-6" stroke="var(--accent-3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              ${i}
            </li>`).join('')}
          </ul>
        </div>
        <div>
          <div style="font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px;">Tech Stack</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${data.stack.map(t => `<span style="font-size:.75rem;padding:4px 12px;border-radius:20px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:var(--accent-3);font-family:var(--font-mono);">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Card click → open modal
  document.querySelectorAll('.project-card[data-modal]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.modal);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* --------------------------------------------------------
   6. SMOOTH SCROLL — Nav links
   -------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* --------------------------------------------------------
   7. ACTIVE NAV — Highlight current section
   -------------------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--text-primary)';
            link.style.background = 'rgba(255,255,255,0.05)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* --------------------------------------------------------
   8. CURSOR GLOW — Subtle radial follow
   -------------------------------------------------------- */
(function initCursorGlow() {
  // Only on non-touch
  if (window.matchMedia('(hover: none)').matches) return;

  let cx = 0, cy = 0;
  let raf;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '1',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    top: '0', left: '0',
    willChange: 'transform',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
  }, { passive: true });

  function update() {
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    raf = requestAnimationFrame(update);
  }
  update();
})();

/* --------------------------------------------------------
   9. HERO ENTRANCE — Staged reveal on load
   -------------------------------------------------------- */
(function initHeroEntrance() {
  const items = [
    document.getElementById('hero-badge'),
    document.getElementById('hero-name'),
    document.getElementById('hero-title'),
    document.getElementById('hero-tagline'),
    document.getElementById('hero-actions'),
  ].filter(Boolean);

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
  });

  // Trigger after a short delay to ensure paint
  setTimeout(() => {
    items.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }, 150);

  // Scroll indicator fades on scroll
  const indicator = document.getElementById('scroll-indicator');
  if (indicator) {
    window.addEventListener('scroll', () => {
      indicator.style.opacity = window.scrollY > 80 ? '0' : '';
    }, { passive: true });
  }
})();

/* --------------------------------------------------------
   10. SKILL TAG — Micro-animation on entry
   -------------------------------------------------------- */
(function initSkillTags() {
  const tags = document.querySelectorAll('.skill-tag');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.85) translateY(6px)';
          tag.style.transition = `opacity 0.35s ${i * 40}ms ease, transform 0.35s ${i * 40}ms ease`;
          requestAnimationFrame(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1) translateY(0)';
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-group').forEach(g => observer.observe(g));
})();
