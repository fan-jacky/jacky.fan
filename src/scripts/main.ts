// Main client-side behaviour, ported from the former React client components:
// - Navbar (scroll state, theme, mobile menu, navbar height sync)
// - Reveal animations, fade-reveal, count-up (reveal.ts)
// - LocomotiveScrollWrapper (smooth scroll + anchor handling)
// - 3D letter canvas
// - Live preview re-render hooks

import { initReveal, initFadeReveal, initCountUp } from './reveal';

// ── Theme (from Navbar) ─────────────────────────────────────────────

type Theme = 'light' | 'dark';

function resolveTheme(): Theme {
  const savedTheme = window.localStorage.getItem('theme');
  if (savedTheme === 'dark') return 'dark';
  if (savedTheme === 'light') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    return;
  }

  document.documentElement.removeAttribute('data-theme');
}

function initTheme() {
  applyTheme(resolveTheme());

  const toggle = document.querySelector<HTMLButtonElement>('.theme-toggle');
  toggle?.addEventListener('click', () => {
    const nextTheme: Theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  });
}

// ── Navbar scroll + height sync ─────────────────────────────────────

function initNavbar() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const syncNavbarHeight = () => {
    const navbarHeight = header.offsetHeight ?? 64;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  };

  syncNavbarHeight();
  window.addEventListener('resize', syncNavbarHeight);

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector<HTMLButtonElement>('.mobile-nav-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');

  const setOpen = (open: boolean) => {
    toggle?.classList.toggle('mobile-nav-toggle--open', open);
    overlay?.classList.toggle('mobile-nav-overlay--open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => {
    setOpen(!overlay?.classList.contains('mobile-nav-overlay--open'));
  });

  overlay?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  const closeButton = overlay?.querySelector<HTMLButtonElement>('.mobile-nav-overlay__close');
  closeButton?.addEventListener('click', () => setOpen(false));
}

// ── Locomotive scroll (from LocomotiveScrollWrapper) ────────────────

async function initLocomotiveScroll() {
  const LocomotiveScroll = (await import('locomotive-scroll')).default;
  const { setScrollPos, setLocoInstance } = await import('./scroll-state');

  const locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      smoothWheel: true,
      wheelMultiplier: 1,
    },
    scrollCallback: ({ limit, scroll }: any) => {
      setScrollPos({
        limit: { x: 0, y: limit },
        scroll: { x: 0, y: scroll },
      });
    },
  });

  setLocoInstance(locomotiveScroll);

  document.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const anchorTarget = anchor.getAttribute('href') ?? '';
      if (anchorTarget.length <= 1 || !document.querySelector(anchorTarget)) {
        return;
      }

      event.preventDefault();
      locomotiveScroll.scrollTo(anchorTarget);
    });
  });

  window.addEventListener('resize', () => {
    locomotiveScroll.resize();
  });

  return locomotiveScroll;
}

// ── 3D letter lazy mount ────────────────────────────────────────────

async function mountLetter3D() {
  const mount = document.querySelector('[data-letter3d] .letter3d-canvas');
  if (!mount) return;
  if ((mount as HTMLElement).dataset.letter3dBound === 'true') return;
  (mount as HTMLElement).dataset.letter3dBound = 'true';

  try {
    const { initLetter3D } = await import('./letter3d');
    initLetter3D(mount as HTMLElement);
  } catch (error) {
    console.warn('Failed to initialise 3D letter.', error);
  }
}

// ── Entry point ─────────────────────────────────────────────────────

function init() {
  initTheme();
  initNavbar();
  initReveal();
  initFadeReveal();
  initCountUp();

  initLocomotiveScroll().catch((error) => {
    console.warn('Failed to initialise smooth scrolling.', error);
  });

  mountLetter3D();

  // Live-preview re-renders replace #cms-content; re-bind behaviours after.
  window.addEventListener('lp:rerender', () => {
    initReveal();
    initFadeReveal();
    initCountUp();
    mountLetter3D();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
