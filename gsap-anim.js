/**
 * Replify 落地页 v11 —— GSAP 动效引擎（ScrollTrigger）
 * 依据 DESIGN.md 动效规范：400-600ms / expo.out / 小位移淡入 / once
 * 无 GSAP 或 prefers-reduced-motion 时静默，内容默认可见（fallback）
 * 与 track.js 完全解耦，不触碰埋点
 */
(function () {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero：标题逐行揭示 + 元素淡入 ----
  var lines = document.querySelectorAll('h1 .line');
  if (lines.length) {
    gsap.from(lines, {
      opacity: 0, y: 30,
      duration: 0.9, stagger: 0.16, ease: 'power2.out', delay: 0.1
    });
  }
  gsap.from('.hero .sub', { opacity: 0, y: 26, duration: 0.8, delay: 0.55, ease: 'power2.out' });
  gsap.from('.hero .cta-row', { opacity: 0, y: 20, duration: 0.8, delay: 0.68, ease: 'power2.out' });
  gsap.from('.hero .pain', { opacity: 0, y: 14, duration: 0.7, delay: 0.8, ease: 'power2.out' });

  // ---- 区块滚动揭示（once，进入视口 88% 触发）----
  document.querySelectorAll('.reveal').forEach(function (wrap) {
    var targets = [];
    wrap.querySelectorAll(
      ':scope > .sec-head, :scope > .features > .f-card, :scope > .features > .trust, ' +
      ':scope > .tbl-wrap, :scope > .pricing > .price-card, :scope > form'
    ).forEach(function (el) { targets.push(el); });
    if (!targets.length) return;
    gsap.from(targets, {
      opacity: 0, y: 16, duration: 0.6, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: wrap, start: 'top 88%', once: true }
    });
  });

  // ---- 产品演示屏：滚动视差浮起（Apple 式）----
  var demoWrap = document.querySelector('.demo-wrap');
  if (demoWrap) {
    gsap.fromTo(demoWrap, { y: 44 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: demoWrap, start: 'top bottom', end: 'top 25%', scrub: 0.6 }
    });
  }
})();