# Chinese Gender Predictor

英文清宫图娱乐工具站，静态生成，适合部署至 Vercel。所有日期运算在浏览器内完成，不上传生日、受孕日期或预产期。

## 本地运行

```bash
npm ci
npm run dev
```

预览地址：`http://127.0.0.1:4321/`。静态预览不自动热更新，修改后运行 `npm run build` 并刷新页面。`PORT` 可覆盖端口。

```bash
npm run build:verified

# 模拟正式部署及索引策略
SITE_URL=https://chinesegenderpredictor.net VERCEL_ENV=production npm run build:verified

# 发布后检查真实 HTTP 响应
npm run verify:live
```

## 部署到 Vercel

- Framework Preset：**Other**。
- Build Command：`npm run build:verified`，依次执行测试、构建和静态检查。
- Output Directory：`dist`。
- Install Command：默认 `npm install`，仓库已包含锁文件。
- Node.js：22 LTS。
- 根目录已有 `vercel.json`，提供静态路由、安全响应头和构建设置。

上线正式域名前，在 Vercel **Production** 环境设置 `SITE_URL` 为你实际拥有的 HTTPS 主域名，`https://chinesegenderpredictor.net`。不要填写竞品域名。重新部署后检查 canonical、robots 和 sitemap。不要把 `.env.example` 的示例当真实域名。

普通本地构建未配置 `SITE_URL` 时会主动输出 `noindex,nofollow` 和禁止抓取的 robots，不生成 sitemap；正式环境配置后才打开索引。正式部署的检查还会拒绝缺少 `SITE_URL` 的生产环境。Vercel Preview 即使继承域名仍保持 noindex。GitHub workflow 检查正式与预览两种策略；远程发布仍需查看实际任务结果。此行为是为了避免测试站抢先收录。脚本不自行加载 `.env`；本地可通过 shell 环境变量或 `node --env-file=.env scripts/build.mjs` 验证正式构建。

部署架构：Spaceship 注册，Cloudflare DNS，Vercel 托管，GitHub 保存代码。发布状态见 [部署记录](DEPLOYMENT.md)。用户要求只使用自有域名；Vercel Domains 仅保留根域和 www（308 跳转至根域），不要重新添加默认 `.vercel.app` 项目域名。

## 页面与关键词

| 路由 | 用途 |
|---|---|
| `/` | 唯一主预测器，覆盖 predictor / calendar / chart / birth chart |
| `/lunar-age-calculator/` | 农历年龄计算器，显示同一目标日期的传统虚岁与公历周岁，解释春节及生日差异 |
| `/chinese-gender-calendar-2026/`、`/chinese-gender-calendar-2027/` | 各年月份对照、完整图表和 A4／Letter PDF |
| `/gender-reveal-games/` | 五种原创可打印小游戏；单项与九页整套 A4／Letter PDF、实际预览和答案 |
| `/old-wives-tales-gender-prediction/` | 八种民俗说法的来源说明及空白娱乐记录表，不做症状评估 |
| `/how-it-works/` | 公式、同转换器生成的月界实例、矩阵来源和闰月约定 |
| `/accuracy/` | 原始研究与 calendar／predictor 准确性问题的直接回答 |
| `/about/`、`/privacy/`、`/terms/` | 网站说明、隐私与使用边界 |

完整调研与规划在 `docs/`。2026-10-09 的[关键词方案](SEO-OPPORTUNITIES-2026-10-09.md)及[候选词表](seo-keywords-2026-10-09.csv)记录 Semrush／Similarweb 实测口径；搜索量与 KD 是工具估算，不能当本站流量或收入承诺。2026-10-08 的资料保留为历史记录。

## 架构与计算规则

- `src/templates.mjs`：静态布局、首页、表单和28×12表格。
- `src/pages.mjs`：方法、证据、年度对照与支持页面。
- `src/games-content.mjs`：五种可打印游戏的正文、预览、规则和单项／整套下载。
- `src/old-wives-tales.mjs`：民俗猜测指南正文，医学与民俗来源核对见 [来源记录](OLD-WIVES-TALES-SOURCES.md)。
- `src/calendar.mjs`：严格日期校验、农历转换、虚岁与结果。
- `src/chart.mjs`：固定版本的传统矩阵；不是统一官方原本。
- `src/client.mjs`：交互、字段错误定位；农历模块只在计算器页面按需加载。
- `src/date-parts.mjs`：英文 Month／Day／Year 控件的输入整理，拼成计算器使用的日期；实际历日继续由 `calendar.mjs` 严格校验。
- `src/calculator-loader.mjs`：模块失败或 15 秒超时的恢复处理；保持按钮禁用并显示重载入口。
- `scripts/build.mjs`：预渲染11页、打包、robots/sitemap/canonical。
- `scripts/check.mjs`：元数据、链接、唯一 ID、索引策略和无脚本表单保护检查。
- `scripts/verify-live.mjs`：生产 HTTP、跳转、资源和 PDF 检查。
- `tests/calendar.test.mjs`、`tests/calculator-loader.test.mjs`、`tests/date-parts.test.mjs`：香港天文台日期夹具、输入边界、周岁／虚岁差异、闰日生日、加载恢复和英文日期分段输入；当前共23项测试。

虚岁 = 受孕农历年 − 出生农历年 + 1。年龄页同时显示目标日期的公历周岁；2月29日生日在非闰年以3月1日为周岁增加日，页面明确说明此展示约定。预产期模式减266天得到估算受孕日。闰月使用同编号月份并明确提示，此为本站约定。图表支持虚岁18至45，不对超范围年龄做钳制。完整MIT和字体许可保存在 `THIRD-PARTY-NOTICES.md`，同时随网站发布文本副本。

## 设计

公开页面是面向准父母和家庭的英文产品，不展示内部设计思路、工程实现、SEO词表或评审话术。用法、实际来源、娱乐性质及隐私说明必须让访客能理解。技术细节保存在仓库文档。日期输入使用显式英文Month／Day／Year；不能依赖浏览器原生日期框或单独设置lang来保证英文。验收必须包含中文Chrome、手机及两种计算器的真实输入与错误焦点。

工具优先，Cormorant Garamond 标题与 Manrope 正文均自托管；暖奶油白底色、玫瑰粉主色，淡蓝和淡粉区分图表及预测结果。十二个月刻度与实际农历年龄形成首页的视觉识别，刻度不是月相。圆角按面板、输入控件与图标分别设置。全站固定明亮主题，不跟随系统暗色偏好。当前设计参数：变化7、动效4、密度4；仅交互反馈，无自动播放动画，尊重减少动态效果设置。公开评审维度和本轮检查见 [品质基准](AWARDS-BENCHMARK.md)及[品质验收](DESIGN-QUALITY-2026-10-09.md)。

原始月亮静物图为本项目生成，内容为奶油白婴儿房背景、粉色圆球与浅蓝装饰。网页使用适配尺寸的 WebP，保留原 JPEG 和 PNG fallback；纸卡完整预览采用无损 WebP，目录和首页使用小尺寸版本。所有字体、图标、图片本地托管。CSS 在生产构建时压缩。无GA4/AdSense或第三方追踪脚本，后续接入前更新隐私文本；事件不得携带日期或出生相关信息。

## 发布与运营配置

1. 确认域名并设置 `SITE_URL`，核验正式页面可索引。
2. 将项目连接实际 Vercel 账号；最终发布后用真实站点检查安全头及404。
3. 使用真实运营者身份与联系渠道完善 About/Privacy，不填虚构医生或审核身份。
4. Search Console 域名所有权已于2026-10-09验证；08:00 的 HTTPS `/sitemap.xml` 报告读取成功，发现当时的10个网址。新版本正式构建包含11个网址，新指南的 Google 收录不能由构建或 sitemap 推断。用户选择先只用 Search Console，未接入 GA4 或行为统计；广告账号尚未配置。
5. 如接广告，先设计不遮挡计算器的广告位并更新实际数据政策。

浏览器功能与静态输出验收记录见 [QA](QA.md)。

## 重新生成打印资料

常规网站构建使用已保存的 PDF 和图片，不依赖 Python。更新资料时，安装 Python 的 `reportlab`、`Pillow` 及 Poppler `pdftoppm` 后执行：

```bash
python3 scripts/generate-printables.py
```

`NODE` 和 `PDFTOPPM` 可指定工具路径。完整生成器读取同一 `src/chart.mjs` 与 `src/calendar.mjs`，输出18份PDF、6张页面预览和1张分享图片；PDF 合计46页。只更新游戏与民俗表时使用以下命令，避免无关年度 PDF 或分享图变化：

```bash
python3 scripts/generate-printables.py --only games folklore
```

本轮4份年度 PDF 共8页保持原文件不变，14份游戏／民俗 PDF 共38页已逐页渲染核对。Bingo 共8张不同排列的卡片，word scramble 共10题并附主持人答案；生成器检查卡片唯一性与题目／答案字母一致。修改后仍须重新核对实际数据、纸张规格和版式，不以生成成功代替视觉验收。浏览器下载和生产回执见 [QA](QA.md)。

PNG 预览或原始月亮图改变后，安装 WebP 工具并重新生成网页专用版本，再核对细字、比例和裁切：

```bash
bash scripts/optimize-web-images.sh
```

`CWEBP` 可指定可执行文件的绝对路径。这个准备步骤输出12张纸卡 WebP 和2张月亮 WebP；常规 Vercel 构建读取已保存资产，不需要 WebP 工具。原始图片及 PDF 不由此脚本修改。
