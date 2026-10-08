# 部署记录

状态更新：2026-10-09（Asia/Shanghai）。首版已上线；本轮 10 页改进版的生产发布回执待补充，不能以本地验收代替远程发布。

## 已完成

- 正式站点：[chinesegenderpredictor.net](https://chinesegenderpredictor.net/)，Spaceship 注册。
- 公开仓库：[BogerHou/chinesegenderpredictor](https://github.com/BogerHou/chinesegenderpredictor)，默认分支 `main`。README 和 About Website 已发布首个项目外链，不等于已被搜索引擎收录或带来排名提升。
- Vercel：当前个人账号的 `simonhou/chinesegenderpredictor`，Hobby；GitHub main 自动部署已接通，首个生产部署来自 `116f955`。配置 Other、`dist`、Node 22、Production `SITE_URL=https://chinesegenderpredictor.net`。
- 默认项目域名 `chinesegenderpredictor.vercel.app` 已移除，实际请求返回 404。Domains 仅保留根域生产绑定和 www 到根域的 308 跳转；后续不得重新添加默认项目域名。平台自动生成的部署预览地址仍属于 Vercel 的部署机制。
- 奶油白、玫瑰粉、淡蓝和月亮插图已在首版后发布，全站固定浅色。
- 本轮本地验收：17 项测试、10 页、416 个内部路径／资源检查通过。仓库 Vercel 构建命令改为 `npm run build:verified`，远程发布时还需确认日志实际执行测试与检查。
- Search Console 域名属性 `sc-domain:chinesegenderpredictor.net` 已于 2026-10-09 00:11 在当前个人账号验证成功。新版 HTTPS sitemap 尚未提交；所有权验证不等于收录。属性内现存 HTTP sitemap 是历史记录（2014-08-26 提交、2019-01-02 最后读取、0 URL），不属于本次上线，保留且不冒充本次回执。
- 2026-10-09 已检查 Search Console「人工处置」与「安全问题」，两项均显示「未检测到任何问题」。
- Cloudflare Free zone 已创建，仍为 Pending；分配 NS 为 `ashley.ns.cloudflare.com`、`jeremy.ns.cloudflare.com`。当前权威 NS 仍是 `launch1.spaceship.net`、`launch2.spaceship.net`。

## 两侧均已保存的 DNS 记录

| 类型 | 主机 | 值 | 设置 |
| --- | --- | --- | --- |
| A | @ | `216.198.79.1` | Spaceship TTL 30 分钟；Cloudflare DNS only / Auto |
| CNAME | www | `bf2432657c1d912c.vercel-dns-017.com` | Spaceship TTL 30 分钟；Cloudflare DNS only / Auto |
| TXT | @ | `google-site-verification=rHIH8Uezi9gE1QQxhrO8xtJqhVzNX7_3LW3GeC6kmeQ` | Google 所有权验证记录；两侧均保留 |

Google 和 Cloudflare 公共 DoH 均已查到验证 TXT。Cloudflare 目前共三条上述记录，未启用反向代理；没有配置邮箱。NS 切换前重新核对完整记录和 Vercel 目标，不只依赖本文历史值。

## DNSSEC 迁移窗口

原 DS：key tag 50762、algorithm 13、digest type 2，观察到原 TTL 86400 秒。经用户明确批准，2026-10-08 23:03 前（保守记录）已在 Spaceship 关闭 DNSSEC。

部分公共查询已无 DS，但 2026-10-08 23:43 审查仍观察到一个 Google 缓存节点保留旧 DS、TTL 18750 秒；不能据此认为全球缓存已经清空。当前站点 A／NS 查询和 HTTPS 正常，无已观察到的 SERVFAIL。

不得早于 **2026-10-09 23:05（Asia/Shanghai）** 切换 NS。现有自动继续任务安排在 **2026-10-09 23:20**，需要电脑、应用和相关登录可用；执行前仍要复核解析。

迁移顺序：确认 Cloudflare 完整保留 A、CNAME 和 Google TXT；再切换 NS；待 Cloudflare Active 后启用其 DNSSEC，将实际新 DS 保存到 Spaceship，并验证信任链、解析和 HTTPS。A／CNAME 继续使用 DNS only。

参考：[Cloudflare DNSSEC](https://developers.cloudflare.com/dns/dnssec/) · [Vercel 与 Cloudflare](https://vercel.com/kb/guide/cloudflare-with-vercel)

## 验收记录与待办

- 2026-10-08 首版生产环境通过 16 项 HTTP 检查，覆盖 8 页、canonical、index/follow、JSON-LD、robots、8 URL sitemap、资源、安全头、404 和跳转；浏览器 Boy／Girl 计算与重置正常。此结果属于旧版本。
- 当晚 23:43 的[官方 PSI 首页报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/d2vifh7syr?form_factor=mobile)：移动性能 99，其余三项 100；LCP 1.9s、FCP 1.2s、TBT 20ms、CLS 0.001；桌面四项 100。CrUX 无数据。这是本轮改动前的实验室结果，已取代此前 API 429 所导致的“无报告”状态。
- 本轮生产部署后运行 `npm run verify:live`，检查 10 个页面及 6 份 PDF，再提交正式 sitemap；记录 Search Console 回执，单独跟踪收录结果。
- 今晚按上述窗口完成 Cloudflare／DNSSEC 迁移后，再跑线上复验。

管理入口：[Vercel Domains](https://vercel.com/simonhou/chinesegenderpredictor/settings/domains) · [Cloudflare DNS](https://dash.cloudflare.com/48086aaf656e35bbf0b6ea2a8ac7ea86/chinesegenderpredictor.net/dns/records) · [Spaceship DNS](https://www.spaceship.com/zh/application/advanced-dns-application/manage/chinesegenderpredictor.net/)

## 迁移验收条件

- Cloudflare Active，公开 NS 与分配值一致，Google TXT 仍可查询。
- 根域和 www 正确指向 Vercel，www 永久跳转根域；默认项目别名保持移除。
- 新 DNSSEC 信任链有效，外部解析无 SERVFAIL，HTTPS 正常。
- 正式 HTML index/follow、canonical 使用主域名；robots 和 10 URL sitemap 正常。
- 10 个页面、6 份 PDF、计算器和资源正常，404 返回真实 404 状态。
