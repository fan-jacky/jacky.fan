// Reveal / fade / count-up initializers, shared between the initial page load
// (main.ts) and live-preview re-renders (live-preview.ts).

// ── Reveal animations (from PortfolioEnhancements) ──────────────────

let revealObserver: IntersectionObserver | null = null;

export function initReveal(root: ParentNode = document) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
  }

  root.querySelectorAll('.reveal, .reveal-stagger:not(.visible)').forEach((element) => {
    if ((element as HTMLElement).dataset.revealBound === 'true') return;
    (element as HTMLElement).dataset.revealBound = 'true';
    revealObserver?.observe(element);
  });
}

// ── FadeInBottom (fade-reveal wrappers) ─────────────────────────────

let fadeObserver: IntersectionObserver | null = null;

export function initFadeReveal(root: ParentNode = document) {
  if (!fadeObserver) {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.remove('fade-reveal', 'opacity-0');
            el.classList.add('fadeInBottom');
            fadeObserver?.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
  }

  root.querySelectorAll('.fade-reveal').forEach((element) => {
    fadeObserver?.observe(element);
  });
}

// ── CountUp ─────────────────────────────────────────────────────────

let countObserver: IntersectionObserver | null = null;

export function initCountUp(root: ParentNode = document) {
  if (!countObserver) {
    countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          countObserver?.unobserve(el);
          runCountUp(el);
        });
      },
      { threshold: 0.3 },
    );
  }

  root.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
    if (el.dataset.countupStarted === 'true') return;
    countObserver?.observe(el);
  });
}

function runCountUp(el: HTMLElement) {
  el.dataset.countupStarted = 'true';
  const end = parseInt(el.dataset.countup ?? '0', 10);
  const suffix = el.dataset.countupSuffix ?? '';
  const duration = 2000;

  const startTime = performance.now();
  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(eased * end)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
