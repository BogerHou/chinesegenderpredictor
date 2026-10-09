# 站点验收记录

更新日期：2026-10-09（Asia/Shanghai）。11页网站的品质升级、响应式网页资产优化与正式域名验收已完成。下面保留第二轮内容、首版、上一轮10页版本和08:00 Cloudflare迁移的历史证据。DNS／HTTPS状态见 [部署记录](DEPLOYMENT.md)。

## 2026-10-09 品质升级

- 已完成三轮设计／交互复核，以及发布后的性能修正和最后独立资产审查。十二个月与实际农历年龄形成原创视觉识别；手机保持表单优先，结果焦点、图表焦点、菜单Escape、减少动态效果和错误恢复已检查。桌面、矮笔记本、平板、手机均验收。
- 正式配置19项测试、11页及595个内部路径／资源检查通过；正式域名20/20，50项静态资源可用；14个WebP、CSS及client.js共16项响应与本地构建一致。PNG/JPEG fallback及原始PDF保留，真实A4整套下载与源码一致。
- [最终官方PageSpeed报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/3i75gj5021?form_factor=mobile)，09:53：首页手机97／100／100／100，LCP1.961s、TBT0ms、CLS0；桌面四项100。CrUX无数据；不是全站现场数据或奖项认证。
- Cloudflare当前域名RUM彻底禁用；同源CSP保留，外部报告的统计脚本错误消失。完整发布、检查、环境与边界见 [品质验收](DESIGN-QUALITY-2026-10-09.md)。

## 2026-10-09 第二轮内容版本（历史）

### 已完成的源码与本地检查

- 使用正式 `SITE_URL=https://chinesegenderpredictor.net` 和 `VERCEL_ENV=production` 执行 `npm run build:verified`：19项测试、11页构建及518个内部路径／资源检查通过。该结果是本地正式配置验证，不代表远程部署成功。
- 年龄工具现在同时显示同一目标日期的公历周岁和传统虚岁。新增生日、春节及2月29日边界检查；2000-06-01出生者在2026-02-17应为周岁25／虚岁27，在2026-06-01为周岁26／虚岁27。
- 方法页的2026-05-16／17月底和2027-02-05／06春节对照由同一农历转换器生成，并增加香港天文台日期夹具。准确性回答、受孕农历月份、2027主工具入口及相关内链已纳入静态锚点检查。
- 游戏页由3种扩展至5种：预测卡、团队投票、名字竞赛、Bingo和word scramble。Bingo提供8张不同排列卡片，word scramble提供10题及主持人答案；每项含实际预览、玩法、单项下载及两种纸张规格。整套游戏PDF每份9页。
- 新民俗指南覆盖8种说法，逐项说明来源与证据局限。晨吐研究中的群体关联如实保留，不当作个人判断规则；空白娱乐表不要求填写医疗数值、私人日期或任何观察，允许跳过或写Surprise。来源范围见 [来源核对](OLD-WIVES-TALES-SOURCES.md)。
- 新增或更新的14份游戏／民俗PDF共38页已逐页渲染并核对布局，A4与US Letter均已检查。Bingo卡片唯一性及word scramble字母／答案对应由生成器校验；4份年度PDF共8页与上一版逐字节一致，沿用先前数据及渲染验收。当前合计18份PDF、46页；未测试实体打印机。
- 本地预览服务器补全PNG与PDF的正确MIME类型。日期计算仍在浏览器本地进行，页面链接不携带生日、受孕日或预测结果；测量范围仍为Search Console。

### 本轮浏览器与生产回执

- 本地Chrome实测：生日2000-06-01，目标2026-02-17显示周岁25／虚岁27；改到2026-06-01显示周岁26／虚岁27；Start over清空结果。2027按钮跳至首页#predictor，主工具示例仍为Boy／虚岁32／农历三月十五。
- 390×844手机视口下游戏与民俗页没有页面横向溢出（根scrollWidth375px）；新预览305×432px保持纸张比例，民俗表只在自身容器内横向滚动。手机导航展开、跳转及收起正常；本轮控制台未出现error或warn。
- 18/18线上PDF均HTTP200，逐文件SHA256与源码一致（首次18路并行校验出现瞬时TLS连接重置，改为3路并行重试后全部完成）。Chrome正式域名实测年龄工具返回周岁25／虚岁27，手机民俗指南无页面横向溢出、预览比例正确且没有问卷表单。新游戏页显示5种游戏及九页整套下载；实际下载A4整套文件SHA256为`a769e11751c37c99f5ce50a4553231e0f960b417b961b4051c355f599fd489df`，与源码文件一致。
- 功能发布提交：[`ff63611`](https://github.com/BogerHou/chinesegenderpredictor/commit/ff636116966f9be7f82b8082620f79bd5e3a35f2)。[GitHub CI](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37868539857)成功，包含生产构建和preview noindex检查；[Vercel生产部署](https://vercel.com/simonhou/chinesegenderpredictor/ygCFjt78VsSTv4jyXASLM5WREdQT)状态success。
- 正式域名 `npm run verify:live`：20/20通过。11页均HTTP200、一个H1、自引用canonical、index/follow及有效JSON-LD；sitemap含11个正确网址，35个静态资源（含18份PDF）通过。真实404及安全头、HTTP／www到根域跳转均通过；移除的Vercel项目域名仍404。
- 已关闭本轮唯一验收标签页、恢复临时视口并停止本轮本地预览服务。38张逐页渲染图、8张审核拼图、合并后的文案草稿、旧投票预览图和测试下载均移入任务废纸篓。仅保留私有打印核对记录、两张纸张规格拼图、生产检查日志、线上PDF哈希记录和一张上线截图；源码及可下载最终文件保留。

新增指南的Google收录及搜索表现需后续Search Console真实报告；构建通过或sitemap包含网址不能作为收录回执。

## 2026-10-09 上一轮10页版本本地验收（历史）

- `npm test`：17 项通过。保留首版 12 项日历测试，新增字段归属与日历模块成功、失败、超时、缺失导出的回归检查。
- 正式构建：10 页、416 个内部链接／资源检查通过；新增 canonical、robots、sitemap、唯一元素 ID／描述和 404 noindex 检查。
- 生日输入 `1800-01-01`：错误现在聚焦生日字段，生日带 `aria-invalid` 和错误说明关联，目标日期不再被错误标记。
- 阻止日历模块下载时：出现可读取的失败说明及 Reload calculator 按钮；恢复网络并重载后，示例得到 Boy / 虚岁 32 / 农历三月，恢复路径有效。
- 6 份 A4／US Letter PDF 共 14 页已逐页渲染检查；4 份年度 PDF 的 336 个图表格分别核对，2026／2027 全部月界与香港天文台资料核对。未测试实体打印机。
- 新版手机 390×844 视口：首页、年度页和游戏页的内容宽与 scrollWidth 均为 375 CSS px，无页面横向溢出；首页提交按钮 top 735／bottom 784，较旧版约 top 827 上移。农历年龄示例 2000-06-01 → 2026-02-17 实测得到 27。
- Vercel 实际执行 `npm run build:verified`，先测试、再构建及检查；GitHub workflow 另验 preview noindex，已成功。
- Search Console 域名所有权于 00:11 在当前个人账号验证成功；本轮 sitemap 提交、读取及首页收录状态见文末。

以下首版记录保留当时的 8 页、12 项测试和 226 个内部路径结果，不代表改进版生产验收。

## 2026-10-08 首版自动检查

- `npm test`：12 项通过。覆盖官方农历日期、春节年龄边界、春节前出生、日期顺序、预产期减 266 天、图表数据、闰月、18/45 岁边界、2099 年末、无效日期、跨夏令时日期和 2027 全年月份区间。
- `npm run build`：生成 8 个页面、独立 404、静态资源与 robots。
- `npm run check`：8 个页面具有独立元数据、一个 H1、有效 JSON-LD；226 个内部链接、锚点和资源路径通过检查；无脚本时表单不提交日期。
- 锁文件更新时 npm audit：0 个已知漏洞。

## 浏览器功能

| 项目 | 实际结果 |
| --- | --- |
| 受孕日模式 | 示例生日 1995-06-15、受孕日 2026-05-01：虚岁 32、农历三月十五、Boy，与固定矩阵相符 |
| 预产期模式 | 2027-01-22 倒推至 2026-05-01，展示估算说明；切换模式清除旧结果与日期 |
| 农历年龄工具 | 2000-06-01 出生，在 2026-02-17 得到虚岁 27，并展示计算公式 |
| 重置与错误 | Start over 清除表单和结果；空提交显示错误并聚焦缺失字段 |
| 表格定位 | 手机端可定位至虚岁 32、月份 10 的高亮单元格；纵向和横向均滚动到目标 |
| 结果复制 | 实际复制文本包含猜测、娱乐说明和站点地址，不含生日、受孕日、预产期或农历年龄；测试后恢复空剪贴板 |
| 移动布局 | 390×844 视口下，首页和 2027 文章页面宽度与根元素滚动宽度均为 375 CSS px（另有浏览器滚动条）；宽表格仅在自身容器内滚动 |
| 桌面布局 | 1440×1000 视口下，两列工具正常；页面无横向溢出 |
| 导航与主题 | 手机导航展开及跳转正常；现为固定明亮的奶油白、玫瑰粉主题，已移除旧暗色切换 |
| FAQ | 可展开读取答案 |
| 无 JavaScript | 显示启用脚本提示；提交按钮禁用；静态正文和表格仍在 HTML 中 |
| 打印 | print 媒体模拟中隐藏表单与导航，保留 B/G 图例、28 行完整表格和说明；未测试实体打印机 |
| 浏览器控制台 | 最后功能验收未出现 error；同源 CSP 下计算器正常运行 |

修复了验收中发现的 2027 文章移动端溢出、结果单元格横向定位、2099 年末辅助日期越界及打印图例遗漏。提高日期输入框边界对比度。

## 隐私与部署配置

- 对一次示例计算观察 Network.requestWillBeSent：没有计算触发的网络请求。日期输入无表单 name，提交按钮在本地事件绑定完成后才启用。
- 本地服务器复用 vercel.json 的安全响应头，200 和 404 均返回 CSP、nosniff、Referrer-Policy 和 Permissions-Policy；Vercel 生产别名的实际响应也已验证。
- 用示例 HTTPS origin 模拟 Production：canonical 正确，index/follow，sitemap 包含 8 个正式路由。
- 同一 origin 模拟 Vercel Preview：noindex/nofollow，robots 禁止抓取，无 sitemap。
- 发布前已用正式 SITE_URL 构建，本地与生产 canonical 和 sitemap 均指向 `https://chinesegenderpredictor.net`。

## Vercel 线上验收

- `https://chinesegenderpredictor.net` 的 16 项 HTTP 检查通过，覆盖 8 个页面、canonical、索引指令、JSON-LD、robots、8 URL sitemap、静态资源、真实 404、安全响应头及 HTTP / www 跳转。
- Chrome 线上示例计算返回 Boy / 虚岁 32 / 农历三月十五；重置正常；未出现控制台 error。
- www HTTPS 返回 308 至根域；Vercel 根域和 www 均显示 Valid Configuration，正式根域浏览器访问正常，SSL 有效。默认 `.vercel.app` 项目域名已按用户最新要求移除。

## 搜索数据与测量边界

Cloudflare 迁移、DNSSEC 与首页收录已在下方最终回执中验证。其他页面的实际收录、搜索词、展示和点击仍需后续 Search Console 数据；未把提交或发现网址当作全部收录。

2026-10-08 23:43 的[官方 PageSpeed Insights 报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/d2vifh7syr?form_factor=mobile)已成功取得：首页移动端 Performance 99，Accessibility／Best Practices／SEO 均 100；LCP 1.9s、FCP 1.2s、TBT 20ms、CLS 0.001，桌面四项均 100。此前匿名 API 的 429 不是最终测量状态。该报告是本轮改动前首页的实验室测量；CrUX 无数据，不能据此宣称全站真实用户 Core Web Vitals 达标或搜索排名。

该首版阶段没有对搜索量、关键词难度或收益做独立数值验证；当时的研究结论与来源边界见 [竞品核验](COMPETITOR-ANALYSIS.md)。2026-10-09后续已记录用户指定Semrush／Similarweb的可见估算，见 [关键词方案](SEO-OPPORTUNITIES-2026-10-09.md)，仍不代表本站流量或收益。About 已关联实际维护者BogerHou的GitHub和项目Issues，并提醒不要公开个人日期信息。

## 首版留存与清理

- 保留源码、锁文件、许可证、压缩素材和可继续使用的本地预览产物。
- 仅保留两张验收截图：[桌面](preview-desktop.jpg)、[手机结果](preview-mobile.jpg)。它们使用示例数据。
- 生成插图的高清原件保留于 Codex generated_images；临时 PNG 副本已核对哈希后移入废纸篓。
- 临时下载的矩阵源码和许可证副本在内容及许可完成归档后移入废纸篓。
- 测试用脚本禁用、打印模拟、网络监听和视口覆盖均已恢复；验收与重复预览标签页已关闭。

## 2026-10-08 晚间视觉修订

- 按用户反馈去除森林绿和自动暗色主题；重新生成浅色月亮插图，更新 favicon、品牌图标、按钮、图表及所有支持页面配色。
- 男孩结果使用淡蓝背景，女孩结果使用淡粉背景；实测两种结果和重置均正常，控制台无 error。
- 手机390×844视口下页面无横向溢出（内容宽和scrollWidth均375 CSS px，剩余为滚动条）；移动导航正常。桌面及手机截图已替换为新版本。
- 独立核算的正文、辅助文字、链接、按钮、图表文字对比度通过4.5:1；表单边界通过3:1。修复粉底链接4.46:1不足和空结果文字透明度导致的3.68:1不足。
- 根域已通过16项线上HTTP检查；公共 DoH 返回根域 A 为216.198.79.1、NS 为 Spaceship，网站无 SERVFAIL。虽然部分查询未返回 DS，23:43 审查仍观察到一个 Google 缓存节点保留旧 DS、TTL 18750 秒；不能宣称全网旧 DS 已清空。
- 已在 Vercel Domains 移除默认项目域名 `chinesegenderpredictor.vercel.app`，仅保留自有根域和 www。同步移除多余的应用重定向配置。

## 2026-10-09 发布回执

- 提交 `e3ea934` 已发布，Vercel 生产部署 `FnUsb4qBeCwjYN1TqB73kzLXanY2` 为 Ready；构建日志确认运行测试、构建和静态检查。
- [GitHub CI](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37807127830) 成功，含 17 项测试、生产构建和 preview noindex 验证。
- `npm run verify:live`：19/19 通过，含 10 页、10 URL sitemap、6 份 PDF、资源、安全头、404、HTTP/www 跳转；默认 Vercel 项目域名仍为 404。
- 正式域名示例返回 Boy、虚岁 32、农历三月十五，控制台无 error。
- HTTPS sitemap 提交已接受，最初报告无法抓取；00:15:58 的 Google 实时检查抓取成功，重新提交过一次。07:40 复查报告已转为“成功”，上次读取 2026-10-09、发现 10 个网页、0 个视频；保留 `.qa/optimization/gsc-sitemap-success.png` 私有回执。读取成功不等于页面已收录。
- 普通请求和 Googlebot User-Agent 请求均取得 sitemap HTTP 200、application/xml、10 个 URL，无重定向或 noindex。早期 Google DS 查询仍有旧记录缓存，当时 TTL 16784 秒；没有证据将其认定为报告延迟的原因。当时仍遵守原等待窗口，之后用户明确改为立即迁移。
- 用户选择先使用 Search Console 观察搜索词、展示和点击，暂不新增访客行为统计脚本。
- 首页索引请求已获 Google 确认，加入优先抓取队列；这不是已收录回执。首页、农历年龄页及 2027 年度页的已存储索引检查均显示 Google 无法识别网址、未收录，Google 选定 canonical 为“不适用”；2027 页于 07:39 复核。未对年龄页或年度页重复请求索引。这里记录的是 Google 报告状态，正式 HTML 的自引用 canonical 已通过生产检查。
- PDF 渲染中间文件、未使用的年度预览图、临时 DNS 截图和被新脚本替代的旧验收脚本已移入废纸篓；保留发布源资产、PDF 和必要 Google 回执。浏览器网络拦截与手机视口模拟已恢复。

## 2026-10-09 Cloudflare 最终验收

以下 08:00 回执取代上述早期“首页未收录”及迁移等待状态。用户已明确要求现在迁移并开启橙云，覆盖原 23:20 排期。

- Spaceship NS 已成功保存为 `ashley.ns.cloudflare.com`、`jeremy.ns.cloudflare.com`；Google DoH 返回新 NS，Google 所有权 TXT 保留。Cloudflare zone 与 Universal SSL 证书均 Active，SSL 模式为 Full (strict)，根域 A 与 www CNAME 均为 Proxied。
- Cloudflare DNSSEC 已启用，Spaceship 新 DS 保存成功（2371 / 13 / 2）；Google 和 Cloudflare 公共 DoH 的新 DS 回答均 AD=true，无 SERVFAIL。控制台显示 DNSSEC Success；完整 digest 见部署记录。
- 08:00:33 的 [Globalping 原始回执](https://api.globalping.io/v1/measurements/21Vp3uPkyli2dkRb800021HX6)：美国 Buffalo／HostPapa 与德国 Falkenstein／Hetzner 均为根域 HTTPS 200、server=cloudflare、cf-cache-status=DYNAMIC；TLS 1.3 验证通过，证书 SAN 包含根域及通配子域。CF-Ray 分别为 `a4791b11c8832029-IAD`、`a4791b11c9a471d2-FRA`。仅证明这两处实际代理正常，未测量全球性能。
- www HTTPS 实测 308 至根域，server=cloudflare，CF-Ray `a479183608f84383-LAX`。本机根域仍可因网络路由缓存直达 Vercel；未修改用户系统代理，远端回执用于补足橙云路径验证。
- 迁移后 `npm run verify:live` 19/19 通过，覆盖 10 页、10 URL sitemap、6 PDF、20 项资源、安全头、真实 404、HTTP/www 跳转及已移除 Vercel 项目别名的 404。这一检查覆盖可访问性与 SEO 配置，实际代理路径由上述外部回执证明。
- Privacy 提交 `d2664e6` 已发布：[Vercel 部署](https://vercel.com/simonhou/chinesegenderpredictor/CfyvhQrpnmCdU8yY8SfTm84NLL3G) success，[GitHub CI](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37861456963) success；正式构建的 17 项测试和 416 个内部路径检查通过。生产隐私正文包含 Cloudflare 请求/IP/安全日志处理，日期与结果仍在浏览器本地计算。
- 浏览器正式站示例返回 Boy / 虚岁 32 / 农历三月十五，无控制台 error；游戏 A4 PDF 实际下载与源文件 SHA-256 一致（`1747535588034341942cb7712cf44e992e516ff8116109252ad53dd3237ccca9`）。
- Search Console 存储报告显示首页“已收录到 Google／已编入索引”，最后 Googlebot 智能手机抓取为 00:19:55，Google canonical 为所检查的正式根域。08:00:42 迁移后实时测试显示“网址可编入 Google 索引”、抓取成功、允许抓取和索引。其他页面的实际收录仍需后续报告。sitemap 独立报告仍为成功、发现 10 页；首页旧存储报告的 sitemap 临时处理提示没有覆盖该独立成功回执。
- Cache Level 为 Standard，Browser Cache TTL 为 Respect Existing Headers。Web Analytics/RUM、Speed Brain、Rocket Loader 关闭；没有增加行为统计或强制全站缓存。
- 已删除 `chinese-gender-predictor-dns` 旧晚间自动任务。Cloudflare、Spaceship、Search Console 与线上测试任务标签页均已关闭；用户原有无关标签页保留。测试下载和多余缓存设置截图移入本任务废纸篓目录；保留源码、6 PDF、唯一迁移与 Google 验收回执于私有 `.qa/migration/`。
