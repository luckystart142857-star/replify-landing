/**
 * B2 落地页埋点脚本 (T-B2-3) v1.0.0
 * 纯前端、无后端依赖：事件写入 localStorage + console 打印，可验证。
 * 可选：页面设置 window.B2_TRACK_ENDPOINT 后，事件同时 POST 到该端点。
 * 事件：landing_page_view / cta_click / lead_submit / scroll_depth
 * 公共参数：variant / page_version / ts / session_id / device_type
 */
(function () {
  'use strict';
  var STORE_KEY = 'b2_track_events';
  var PAGE_VERSION = 'v1.0.0';

  // variant 由页面 <html data-variant="A"> 提供
  function getVariant() {
    return document.documentElement.getAttribute('data-variant') || 'unknown';
  }
  function getSessionId() {
    var sid = sessionStorage.getItem('b2_session_id');
    if (!sid) {
      sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem('b2_session_id', sid);
    }
    return sid;
  }
  function getDeviceType() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  }
  function getUtm() {
    var q = new URLSearchParams(location.search);
    return {
      utm_source: q.get('utm_source') || '',
      utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || ''
    };
  }
  function readEvents() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }
  function writeEvents(events) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(events.slice(-500))); } catch (e) {}
  }
  window.B2Track = function (name, params) {
    var utm = getUtm();
    var event = {
      event: name,
      ts: Date.now(),
      session_id: getSessionId(),
      device_type: getDeviceType(),
      page_version: PAGE_VERSION,
      variant: getVariant(),
      referrer: document.referrer || '',
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign
    };
    if (params) { for (var k in params) { event[k] = params[k]; } }
    var events = readEvents();
    events.push(event);
    writeEvents(events);
    // 控制台可见（可验证）
    console.log('[B2Track]', event.event, event);
    // 可选 endpoint（页面设置 window.B2_TRACK_ENDPOINT 后启用）
    if (window.B2_TRACK_ENDPOINT && typeof fetch === 'function') {
      try { fetch(window.B2_TRACK_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event), keepalive: true }); } catch (e) {}
    }
    return event;
  };
  window.B2TrackGetEvents = readEvents;

  // 事件一：访问（window load 后）
  function firePageView() {
    window.B2Track('landing_page_view');
  }
  // 事件二：CTA 点击（委托监听 data-cta 元素）
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    window.B2Track('cta_click', { cta_position: el.getAttribute('data-cta-position') || 'unknown', cta_text: (el.innerText || el.textContent || '').trim().slice(0, 50), card_price: el.getAttribute('data-card-price') || '' });
  });
  // 辅助：滚动深度 25/50/75/100
  var depthFired = {};
  function fireScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.round((h.scrollTop + h.clientHeight) / max * 100) : 0;
    [25, 50, 75, 100].forEach(function (d) {
      if (pct >= d && !depthFired[d]) { depthFired[d] = true; window.B2Track('scroll_depth', { depth_percentage: d }); }
    });
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(fireScroll); }, { passive: true });

  // 表单提交（lead_submit）——页面绑定到表单的 submit 处理
  window.B2BindLeadForm = function (formEl) {
    if (!formEl) return;
    formEl.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fd = new FormData(formEl);
      var email = (fd.get('email') || '').trim();
      var base = {
        twitter_provided: !!((fd.get('twitter') || '').trim()),
        pricing_pref: fd.get('pricing') || 'none',
        primary_intent: fd.get('intent') || ''
      };
      // email_hashed = 真实 SHA-256（浏览器原生 crypto.subtle；算完才落库，确保真实性）
      if (window.crypto && crypto.subtle && window.TextEncoder) {
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)).then(function (d) {
          var arr = Array.from(new Uint8Array(d));
          base.email_hashed = arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
          window.B2Track('lead_submit', base);
        }).catch(function () { base.email_hashed = 'sha-unavailable'; window.B2Track('lead_submit', base); });
      } else {
        base.email_hashed = 'sha-unavailable';
        window.B2Track('lead_submit', base);
      }
      var ok = document.getElementById('form-ok');
      if (ok) ok.style.display = 'block';
      formEl.reset();
    });
  };

  // 滚动浮现动效（不影响埋点）：仅 track.js 加载成功后启用（.js-ready），无 JS/加载失败时内容默认可见
  if (document.documentElement && document.documentElement.classList) { document.documentElement.classList.add('js-ready'); }
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(els, function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }
  if (document.readyState === 'complete') { firePageView(); initReveal(); }
  else { window.addEventListener('load', function () { firePageView(); initReveal(); }); }
})();