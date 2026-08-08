/**
 * B2 落地页动效层 (T-B2-3 v8) —— 与 track.js 完全解耦，不触碰埋点
 * 功能：
 *   1) 产品演示循环（页面"动图"核心：AI起草→人工确认→发送 / 自动盯盘→自动发布）
 *   2) 滚动进度条
 *   3) 导航滚动态（毛玻璃加深）
 *   4) prefers-reduced-motion 兜底：定格最终态，静止可读
 */
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1) 产品演示循环 ----
  var demo = document.querySelector('.demo');
  if (demo) {
    var variant = (document.documentElement.getAttribute('data-variant') || 'A').toUpperCase();
    if (reduced) {
      // 动效关闭：定格在"最终态"（A=已发送 / B=已自动发布），静态可读
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
      // 页面隐藏时暂停，避免后台空转
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
})();