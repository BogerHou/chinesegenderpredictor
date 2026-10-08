# 站点验收记录

更新日期：2026-10-09（Asia/Shanghai）。首版已上线，本轮改进已完成本地验收，新的生产部署回执待补充；DNS / HTTPS 状态见 [部署记录](DEPLOYMENT.md)。

## 2026-10-09 改进版本地验收

- `npm test`：17 项通过。保留首版 12 项日历测试，新增字段归属与日历模块成功、失败、超时、缺失导出的回归检查。
- 正式构建：10 页、416 个内部链接／资源检查通过；新增 canonical、robots、sitemap、唯一元素 ID／描述和 404 noindex 检查。
- 生日输入 `1800-01-01`：错误现在聚焦生日字段，生日带 `aria-invalid` 和错误说明关联，目标日期不再被错误标记。
- 阻止日历模块下载时：出现可读取的失败说明及 Reload calculator 按钮；恢复网络并重载后，示例得到 Boy / 虚岁 32 / 农历三月，恢复路径有效。
- 6 份 A4／US Letter PDF 共 14 页已逐页渲染检查；4 份年度 PDF 的 336 个图表格分别核对，2026／2027 全部月界与香港天文台资料核对。未测试实体打印机。
- 新版手机 390×844 视口：首页、年度页和游戏页的内容宽与 scrollWidth 均为 375 CSS px，无页面横向溢出；首页提交按钮 top 735／bottom 784，较旧版约 top 827 上移。农历年龄示例 2000-06-01 → 2026-02-17 实测得到 27。
- Vercel 配置现要求 `npm run build:verified`，先测试、再构建及检查；新增 GitHub workflow 另验 preview noindex。实际远程任务结果在发布后记录。
- Search Console 域名所有权于 00:11 在当前个人账号验证成功；本轮 sitemap 提交和索引结果尚待生产部署后核查。

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

## 仍需正式环境验证

Cloudflare 迁移后的 DNSSEC、本轮生产版本、sitemap 提交及搜索引擎收录尚待验证。Search Console 所有权现已验证。

2026-10-08 23:43 的[官方 PageSpeed Insights 报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/d2vifh7syr?form_factor=mobile)已成功取得：首页移动端 Performance 99，Accessibility／Best Practices／SEO 均 100；LCP 1.9s、FCP 1.2s、TBT 20ms、CLS 0.001，桌面四项均 100。此前匿名 API 的 429 不是最终测量状态。该报告是本轮改动前首页的实验室测量；CrUX 无数据，不能据此宣称全站真实用户 Core Web Vitals 达标或搜索排名。

没有对搜索量、关键词难度或收益做独立数值验证；研究结论与来源边界见 [竞品核验](COMPETITOR-ANALYSIS.md)。About 已关联实际维护者 BogerHou 的 GitHub 和项目 Issues，并提醒不要公开个人日期信息。

## 留存与清理

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
