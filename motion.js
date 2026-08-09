/**
 * B2 落地页动效层 (T-B2-3 v10) —— 与 track.js 完全解耦，不触碰埋点
 * 功能：
 *   1) 产品演示循环（页面"动图"核心）
 *   2) 滚动进度条
 *   3) 导航滚动态（毛玻璃加深）
 *   4) 产品演示视差（滚动时轻微浮起，Apple 式）
 *   5) prefers-reduced-motion 兜底
 */
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1) 产品演示循环 ----
  var demo = document.querySelector('.demo');
  if (demo) {
    var variant = (document.documentElement.getAttribute('data-variant') || 'A').toUpperCase();
    if (reduced) {
      demo.classList.add('static');
    } else {
      var seq = variant === 'B'
        ? [{ s: 0, d: 2100 }, { s: 1, d: 1900 }, { s: 2, d: 3000 }, { s: 0, d: 3400 }]
        : [{ s: 0, d: 1500 }, { s: 1, d: 1700 }, { s: 2, d: 2400 }, { s: 3, d: 1900 }, { s: 4, d: 2800 }, { s: 0, d: 3400 }];
      var idx = 0;
      var timer = null;
      demo.classList.add('st0');
      function step() {
        demo.className = demo.className.replace(/\bst\d\b/g, '').trim();
        demo.classList.add('st' + seq[idx].s);
        timer = setTimeout(function () {
          idx = (idx + 1) % seq.length;
          step();
        }, seq[idx].d);
      }
      timer = setTimeout(step, seq[0].d);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { if (timer) clearTimeout(timer); }
        else { if (timer) clearTimeout(timer); idx = 0; step(); }
      });
    }
  }

  // ---- 2) 滚动进度条 ----
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var ticking = false;
    function paint() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
  }

  // ---- 3) 导航滚动态 ----
  var nav = document.querySelector('nav');
  if (nav) {
    function onScroll() { nav.classList.toggle('scrolled', (window.scrollY || 0) > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- 4) 产品演示视差（Apple 式轻微浮起） ----
  var demoWrap = document.querySelector('.demo-wrap');
  if (demoWrap && !reduced) {
    var ticking2 = false;
    function parallax() {
      var r = demoWrap.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 元素进入视口下半部时，向上轻微浮起（最大 40px）
      var p = Math.min(Math.max((vh - r.top) / vh, 0), 1);
      var offset = Math.round((1 - p) * 46);
      demoWrap.style.transform = 'translateY(' + offset + 'px)';
      ticking2 = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking2) { ticking2 = true; requestAnimationFrame(parallax); }
    }, { passive: true });
    parallax();
  }
})();