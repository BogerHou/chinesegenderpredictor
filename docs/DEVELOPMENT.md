# Chinese Gender Predictor

英文清宫图娱乐工具站，静态生成，适合部署至 Vercel。所有日期运算在浏览器内完成，不上传生日、受孕日期或预产期。

## 本地运行

```bash
npm ci
npm run dev
```

预览地址：`http://127.0.0.1:4321/`。静态预览不自动热更新，修改后运行 `npm run build` 并刷新页面。`PORT` 可覆盖端口。

```bash
npm test
npm run build
npm run check
```

## 部署到 Vercel

- Framework Preset：**Other**。
- Build Command：`npm run build`。
- Output Directory：`dist`。
- Install Command：默认 `npm install`，仓库已包含锁文件。
- Node.js：22 LTS。
- 根目录已有 `vercel.json`，提供静态路由、安全响应头和构建设置。

上线正式域名前，在 Vercel **Production** 环境设置 `SITE_URL` 为你实际拥有的 HTTPS 主域名，`https://chinesegenderpredictor.net`。不要填写竞品域名。重新部署后检查 canonical、robots 和 sitemap。不要把 `.env.example` 的示例当真实域名。

未配置 `SITE_URL` 的构建会主动输出 `noindex,nofollow` 和禁止抓取的 robots，不生成 sitemap；正式环境配置后才打开索引。Vercel Preview 即使继承域名仍保持 noindex。此行为是为了避免测试站抢先收录。脚本不自行加载 `.env`；本地可通过 shell 环境变量或 `node --env-file=.env scripts/build.mjs` 验证正式构建。

部署架构：Spaceship 注册，Cloudflare DNS，Vercel 托管，GitHub 保存代码。发布状态见 [部署记录](DEPLOYMENT.md)。用户要求只使用自有域名；Vercel Domains 仅保留根域和 www（308 跳转至根域），不要重新添加默认 `.vercel.app` 项目域名。

## 页面与关键词

| 路由 | 用途 |
|---|---|
| `/` | 唯一主预测器，覆盖 predictor / calendar / chart |
| `/lunar-age-calculator/` | 独立农历年龄计算器 |
| `/chinese-gender-calendar-2027/` | 2027 公历农历月份对照与打印 |
| `/how-it-works/` | 公式、实例、矩阵来源和闰月约定 |
| `/accuracy/` | 原始研究与准确性说明 |
| `/about/`、`/privacy/`、`/terms/` | 网站说明、隐私与使用边界 |

完整调研与规划在 `docs/`，其中搜索量/KD没有重新核实，不能当收入承诺。

## 架构与计算规则

- `src/templates.mjs`：静态布局、首页、表单和28×12表格。
- `src/pages.mjs`：方法、证据、年度对照与支持页面。
- `src/calendar.mjs`：严格日期校验、农历转换、虚岁与结果。
- `src/chart.mjs`：固定版本的传统矩阵；不是统一官方原本。
- `src/client.mjs`：交互，农历模块只在计算器页面按需加载。
- `scripts/build.mjs`：预渲染8页、打包、robots/sitemap/canonical。
- `tests/calendar.test.mjs`：香港天文台日期夹具及边界用例。

虚岁 = 受孕农历年 − 出生农历年 + 1。预产期模式减266天得到估算受孕日。闰月使用同编号月份并明确提示，此为本站约定。图表支持虚岁18至45，不对超范围年龄做钳制。完整MIT和字体许可保存在 `THIRD-PARTY-NOTICES.md`，同时随网站发布文本副本。

## 设计

工具优先，Manrope 自托管字体，暖奶油白底色、玫瑰粉主色，淡蓝和淡粉区分图表及预测结果。圆角分工：主面板20px、表单控件8至10px、品牌和图标按钮圆形。全站固定明亮主题，不跟随系统暗色偏好；已移除旧主题切换与本地主题读取。设计参数：变化4、动效2、密度4；仅交互反馈，无自动播放动画。

原始月亮静物图为本项目生成，现已改为奶油白婴儿房背景、粉色圆球与浅蓝装饰，交付使用67 KB压缩JPEG。所有字体、图标、图片本地托管。无GA4/AdSense或第三方追踪脚本，后续接入前更新隐私文本；事件不得携带日期或出生相关信息。

## 上线前的实际配置

1. 确认域名并设置 `SITE_URL`，核验正式页面可索引。
2. 将项目连接实际 Vercel 账号；最终发布后用真实站点检查安全头及404。
3. 使用真实运营者身份与联系渠道完善 About/Privacy，不填虚构医生或审核身份。
4. 验证 Search Console 域名并提交 `/sitemap.xml`。GA4、广告账号在需要时单独配置。
5. 如接广告，先设计不遮挡计算器的广告位并更新实际数据政策。

浏览器功能与静态输出验收记录见 [QA](QA.md)。
