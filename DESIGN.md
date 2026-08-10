# Replify 落地页 DESIGN.md（v11 重做方向锁定）

> 由 ui-ux-pro-max 定方向（Liquid Glass + AI Personalization Landing）
> 由 interface-design 锁定设计系统（本文件为唯一设计事实源，实现不得跑偏）
> 更新时间：2026-08-10

## 1. 设计方向（一句话）
Liquid Glass + Apple 深空黑：流动玻璃质感、深黑底、超大留白、电影级流体动效。

## 2. 设计 Token（禁止自由发挥，必须用这些值）
```css
--bg: #000;                  /* 深空黑底 */
--bg-glass: rgba(255,255,255,.05);   /* 玻璃面板 */
--line-glass: rgba(255,255,255,.12); /* 玻璃描边 */
--ink: #f5f5f7;              /* 主文字（Apple 白） */
--ink-dim: #a1a1a6;          /* 次级文字（Apple 灰，带倾向） */
--ink-faint: #86868b;        /* 弱文字 */
--accent: #2997ff;           /* 强调蓝（Apple） */
--accent-2: #0071e3;         /* 按钮蓝（Apple） */
--green: #30d158;            /* 成功 */
--radius: 24px; --radius-lg: 34px;
--ease: cubic-bezier(.16,1,.3,1);   /* 流体质感缓动 */
font: -apple-system / SF Pro Display / Inter
```

## 3. 组件规范
- 按钮：胶囊 border-radius 980px，#0071e3 底白字，hover 微上浮+光晕，min-height 54px
- 卡片：玻璃面板（半透明白 5% + 1px 玻璃描边 + backdrop-blur），大圆角，hover 上浮 4-6px + 品牌描边
- 导航：透明 → 滚动后毛玻璃（blur 24px + 半透明黑 + 底部细线）
- 表单：玻璃输入框，focus 苹果蓝光晕（box-shadow 0 0 0 4px rgba(41,151,255,.18)）
- 标题：clamp(56-110px)，字重 800，字距 -0.035em，纯白（禁止渐变文字）

## 4. 动效规范（GSAP 驱动）
- 时长：滚动揭示 400-600ms；状态反馈 150-300ms；focal moment 500-800ms
- 缓动：expo.out / power1.out（流体，禁止 bounce）
- 手法：opacity + transform（y 8-16px 小位移，读作淡入非滑动）；scrollTrigger start 'top 90%'
- 交错：stagger 0.02-0.06s，禁止长列表大延迟
- 唯一 focal moment：产品演示循环（A 起草→确认→发送 / B 盯盘→发布）
- prefers-reduced-motion：全关，内容默认可见
- 禁用 SplitText 等付费插件（用普通 fade fallback）

## 5. 禁止项（craft-floor / interface-design 共识）
- ❌ emoji/Unicode 当图标（用 SVG，统一 stroke 1.8）
- ❌ 渐变文字（强调用字重/字号）
- ❌ 纯灰次级文字（从 hue 取倾向色）
- ❌ 卡片套卡片、三等高卡片堆砌
- ❌ 每 section 相同入场动画（要有节奏差异）
- ❌ 无限循环装饰动效（除 focal moment 与极光）
- ❌ 桌面/移动端掉队（375/768/1024/1440 全过）

## 6. 固定约束（不可改）
- 营销文案逐字=T-B2-2 v11；track.js 零改动；A/B 唯一自变量=定位文案
- 埋点 4 事件 + data-cta/data-cta-position/data-card-price 必须保留
- 纯前端、file:// 可开、无后端依赖

## 7. 验收基准
impeccable craft-floor 全绿 + ui-ux-pro-max 交付清单 + ponytail 无臃肿 + playwright 逐屏自查通过。