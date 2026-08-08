# B2 T-B2-3 落地页静态实现 + 埋点代码（v8：设计技能升级版）

> 实现：Codex（T-B2-3 负责人）　|　2026-08-08　|　基于 T-B2-2 v11 定稿文案
> v8 升级：按用户要求引入 5 个 GitHub 高评分设计 skills（taste-skill / impeccable / ui-ux-pro-max / shadcnblocks / brand-design-md），
> 完成"动图 + 品味"升级；文案忠实 v11，埋点不变，track.js 零改动。

## 文件清单（B2/landing/）
| 文件 | 说明 |
|---|---|
| `a/index.html` | A 版（半自动：「AI 起草 + 你确认后发送」），`data-variant="A"` |
| `b/index.html` | B 版（全自动：「一键全自动运营」），`data-variant="B"` |
| `track.js` | 共享埋点脚本（纯前端，无后端依赖）——v8 未改动 |
| `motion.js` | v8 动效层：产品演示循环（动图）/ 滚动进度条 / 导航滚动态 / reduced-motion 兜底 |
| `style.css` | v8 共享样式（Bento 布局 / 极光动效 / SVG 图标 / 可访问性） |

## v8 设计升级要点
- 设计读法：Premium Consumer SaaS Landing · Dark Tech · Bento（Apple/Linear 精准风 + 克制动效）
- Bento 卖点：不对称网格（wide 跨 4 列 + tall×2 跨 2 列 + trust 面板跨 2 列）
- emoji 图标 → 统一线性 SVG（修复 ui-ux-pro-max 反模式）
- 动图核心（focal moment）：A=AI起草→确认→发送循环；B=雷达盯盘→自动发布循环；页面隐藏自动暂停
- 氛围：极光漂移 + 电影颗粒 + CTA 扫光 + 推荐卡渐变描边旋转
- 可访问性：触控≥44px / :focus-visible / prefers-reduced-motion / 375px 无横向滚动
- A/B 唯一自变量仍是定位文案；营销文案逐字未改

## 验收对照（T-B2-3）
| 验收项 | 状态 | 说明 |
|---|---|---|
| 两套静态页可独立访问 | ✅ | 本地服务器 http://127.0.0.1:8090/a/ 与 /b/ 均 200；file:// 也可打开 |
| 埋点事件可验证 | ✅ | 4 事件：landing_page_view / cta_click / lead_submit / scroll_depth；track_test.js 15 项全过 |
| 无后端依赖 | ✅ | 纯前端；可选 `window.B2_TRACK_ENDPOINT` 启用 POST 上报 |
| 不做扩展功能/无后端/无数据库 | ✅ | 仅静态页 + 埋点 + 动效 |
| 动图与品味 | ✅ | 产品演示循环 / 极光 / 扫光 / Bento / Inter 字体 / SVG 图标（浏览器实测全过） |

## 埋点设计
- 公共参数：variant / page_version / ts / session_id / device_type / referrer / utm_*
- 事件一 landing_page_view：window load 后（含 utm 捕获）
- 事件二 cta_click：点击 `data-cta` 元素（含 cta_position/cta_text/card_price）
- 辅助 scroll_depth：滚动达 25/50/75/100%
- 事件三 lead_submit：表单提交（email_sha256 脱敏 / twitter_provided / pricing_pref / primary_intent）

## 使用方式
```powershell
# 本地预览
node D:\...\server.js    # 启动后打开 http://127.0.0.1:8090/a/ 或 /b/

# 验证埋点
node track_test.js       # 15 项全过
```

## 版本演进
- v2 修正（Claude 审查）：①email_hashed 改真实同步 SHA-256 ②cta_click 补 cta_text/card_price ③B 版表单字段改「最关心的风控指标」④B 版定价档名改「初创试用版/黑客增长版」⑤A 版对比表统一 Fireply
- v5 设计升级：Apple/Amazon 级高端视觉（深色渐变/玻璃拟态/sticky 导航/产品交互 mockup/滚动动效）
- v6 修正：reveal 动效加 .js-ready 兜底（无 JS 内容默认可见）、mockup 演示按钮去 data-cta、对比表 th scope=row、对比度调亮
- v7 修正：导航栏内联色值统一 #8b93a8（对比度达标）
- v8 设计技能升级：Bento + 动图演示循环 + 极光/扫光/描边动效 + Inter 字体 + SVG 图标 + 可访问性（详见 outputs\B2-T-B2-3-v8-设计技能升级-交付说明.md）

## 说明
- 页面文案已按 v11 定稿采用定性表述（不含 [推测] 内部标签）
- 定价档位 $15/$29 为内部假设（来源见 T-B2-2 v11）；Fireply $69 为二级证据
- 结论待 T-B2-4 投放数据（页面不下"哪版更好"结论）