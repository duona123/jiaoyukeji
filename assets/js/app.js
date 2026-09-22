/* ============================================================
   浙招智达 - 通用交互脚本 (app.js)
   功能：主题切换、移动端导航、图标渲染、滚动动画、回到顶部
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 主题切换 (light / dark) ---------- */
  const THEME_KEY = 'zhaozhi-theme';
  const root = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(t) {
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  function applyTheme(t) {
    if (t === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    updateThemeIcon(t);
  }
  function updateThemeIcon(t) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sun = btn.querySelector('[data-icon-name="sun"]');
      const moon = btn.querySelector('[data-icon-name="moon"]');
      if (sun && moon) {
        sun.style.display = t === 'dark' ? 'none' : '';
        moon.style.display = t === 'dark' ? '' : 'none';
      }
    });
  }
  function toggleTheme() {
    const current = root.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  // Init theme: always start in light mode (matches original design).
  // Theme toggle works during the session; we do not restore a previous
  // dark preference so the default background is always white.
  applyTheme('light');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (btn) { e.preventDefault(); toggleTheme(); }
  });

  /* ---------- 移动端导航菜单 ---------- */
  function initMobileNav() {
    const toggle = document.getElementById('nav-mobile-toggle');
    const menu = document.getElementById('nav-mobile-menu');
    if (!toggle || !menu) return;

    const overlay = document.createElement('div');
    overlay.id = 'nav-mobile-overlay';
    overlay.className = 'fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm hidden md:hidden';
    document.body.appendChild(overlay);

    function open() {
      menu.classList.remove('hidden');
      menu.classList.add('flex');
      overlay.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
    function close() {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    toggle.addEventListener('click', () => {
      menu.classList.contains('hidden') ? open() : close();
    });
    overlay.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ---------- Lucide 图标渲染 ---------- */
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* ---------- 滚动渐显动画 ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- 回到顶部按钮 ---------- */
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.setAttribute('aria-label', '回到顶部');
      btn.className = 'fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all opacity-0 pointer-events-none flex items-center justify-center';
      btn.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
      document.body.appendChild(btn);
      initIcons();
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          } else {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- 当前导航高亮 ---------- */
  function initActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path) {
        a.classList.add('bg-primary/10', 'text-primary');
        a.classList.remove('text-foreground', 'hover:bg-muted');
      }
    });
  }

  /* ---------- 表单自动增高 textarea ---------- */
  function initAutoResize() {
    document.querySelectorAll('textarea[data-autoresize]').forEach(ta => {
      const resize = () => {
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 128) + 'px';
      };
      ta.addEventListener('input', resize);
      resize();
    });
  }

  /* ---------- 启动 ---------- */
  function init() {
    initIcons();
    initMobileNav();
    initReveal();
    initBackToTop();
    initActiveNav();
    initAutoResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init icons after any DOM changes (for dynamically loaded content)
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Expose for page-specific scripts
  window.ZhaozhiApp = {
    applyTheme,
    toggleTheme,
    initIcons: () => window.lucide && window.lucide.createIcons()
  };
})();
