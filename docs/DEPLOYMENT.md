# 部署记录

状态更新：2026-10-09（Asia/Shanghai）。第二轮11页内容版本已通过本地正式构建，远程部署及浏览器验收待补回执。此前08:00的10页生产版本及Cloudflare迁移已完成验收：橙云、严格HTTPS与新DNSSEC信任链均已启用，美国及德国外部探针确认代理HTTP 200；Google当时确认首页已收录、sitemap读取成功并发现10个网址。用户即时迁移要求已替代原晚间排期，原23:20自动任务已删除。

## 第二轮内容版本待发布

- 本地 `SITE_URL=https://chinesegenderpredictor.net VERCEL_ENV=production npm run build:verified` 已通过：19项测试、11页、518个内部路径／资源检查。
- 当前源码包含增强年龄对照、准确性／方法问题、2027主工具入口、五种可打印游戏及新增民俗指南。18份PDF共46页，其中4份年度PDF保持上一版原文件不变。
- GitHub CI、Vercel生产部署、正式域名新内容、11网址sitemap及18份PDF下载需要本轮发布后的实际回执，不能由本地构建结果推断。
- 既有Cloudflare、DNSSEC、Vercel域名和Search Console测量范围沿用08:00已验收配置。本轮未授权新增行为统计，亦不应重新添加默认`.vercel.app`项目域名。

具体功能与打印资料检查见 [QA](QA.md)。

## 上一轮生产及基础设施已完成

- 正式站点：[chinesegenderpredictor.net](https://chinesegenderpredictor.net/)，Spaceship 注册。
- 公开仓库：[BogerHou/chinesegenderpredictor](https://github.com/BogerHou/chinesegenderpredictor)，默认分支 `main`。README 和 About Website 已发布首个项目外链，不等于已被搜索引擎收录或带来排名提升。
- Vercel：当前个人账号的 `simonhou/chinesegenderpredictor`，Hobby；GitHub main 自动部署已接通，首个生产部署来自 `116f955`。配置 Other、`dist`、Node 22、Production `SITE_URL=https://chinesegenderpredictor.net`。
- 默认项目域名 `chinesegenderpredictor.vercel.app` 已移除，实际请求返回 404。Domains 仅保留根域生产绑定和 www 到根域的 308 跳转；后续不得重新添加默认项目域名。平台自动生成的部署预览地址仍属于 Vercel 的部署机制。
- 奶油白、玫瑰粉、淡蓝和月亮插图已在首版后发布，全站固定浅色。
- 上一轮验收：17项测试、10页、416个内部路径／资源检查通过。Vercel实际日志确认执行 `npm run build:verified`，GitHub CI成功；第二轮结果另记于上方。
- Search Console 域名属性 `sc-domain:chinesegenderpredictor.net` 已于 2026-10-09 00:11 在当前个人账号验证成功。新版 HTTPS sitemap 已提交，读取状态见下文；所有权验证不等于收录。属性内现存 HTTP sitemap 是历史记录（2014-08-26 提交、2019-01-02 最后读取、0 URL），不属于本次上线。
- 2026-10-09 已检查 Search Console「人工处置」与「安全问题」，两项均显示「未检测到任何问题」。
- Cloudflare Free zone 已激活；Spaceship NS 已改为 `ashley.ns.cloudflare.com`、`jeremy.ns.cloudflare.com`，Google DoH 返回相同新 NS，Google 验证 TXT 保留。根域 A 与 www CNAME 均为 Proxied；不能据此认定所有递归缓存均已更新。
- Cloudflare SSL/TLS 的 Full (strict) 已保存。Privacy 更新 `d2664e6` 已推送，Vercel 部署状态 success；文案包含 Cloudflare 处理普通网络请求、IP 与安全日志，同时保留日期／结果不上传和不做行为统计的边界。

## 当前 Cloudflare DNS 记录

| 类型 | 主机 | 值 | 设置 |
| --- | --- | --- | --- |
| A | @ | `216.198.79.1` | Proxied / Auto；源站为 Vercel |
| CNAME | www | `bf2432657c1d912c.vercel-dns-017.com` | Proxied / Auto；308 跳转根域 |
| TXT | @ | `google-site-verification=rHIH8Uezi9gE1QQxhrO8xtJqhVzNX7_3LW3GeC6kmeQ` | Google 所有权验证记录；两侧均保留 |

Google 和 Cloudflare 公共 DoH 均已查到验证 TXT。Cloudflare 目前共三条上述记录；TXT 为 DNS only，网站记录开启反向代理，没有配置邮箱。Spaceship 原 DNS 记录保留作历史副本，权威 DNS 已由 Cloudflare 提供。后续修改前仍需核对完整记录和 Vercel 目标，不只依赖本文历史值。

## Cloudflare／DNSSEC 迁移进度

原 DS：key tag 50762、algorithm 13、digest type 2，观察到原 TTL 86400 秒。经用户明确批准，2026-10-08 23:03 前（保守记录）已在 Spaceship 关闭 DNSSEC。

2026-10-08 23:43 审查曾观察到一个 Google 缓存节点保留旧 DS、TTL 18750 秒，因此最初保守安排在 10 月 9 日 23:20 迁移。该记录仅描述历史状态。2026-10-09 07:45 后重新检查：Spaceship DNSSEC 页面显示已禁用，Google 与 Cloudflare 公共 DoH 均无旧 DS。

用户最新明确授权**现在迁移并开启 Cloudflare 橙云**，不必等到晚上，已替代原“不得早于 23:05”及“23:20 继续”的时间限制。Spaceship NS 已成功保存为 Cloudflare 分配值；07:49 Google DoH 已查到新 NS 和保留的 Google 验证 TXT。迁移验收完成后已删除 `chinese-gender-predictor-dns` 自动任务，今晚不再重复执行。

已依次确认 Cloudflare zone Active、Universal SSL 证书 Active、Full (strict)，再启用根域和 www 橙云。Cloudflare DNSSEC 已启用，新 DS 已成功保存到 Spaceship：key tag `2371`、algorithm `13`、digest type `2`、digest `C564D51E9609CD5D41D6AF23588F6FB7868F039D7DD37DE30A2EF6FA1D92C838`。Google 和 Cloudflare 公共 DoH 均返回此 DS 且 AD=true，无 SERVFAIL；Cloudflare DNS 页面显示 DNSSEC Success。部分本机域名路由缓存仍直达 Vercel，因此另用美国、德国远端探针确认实际代理，未修改本机代理设置。

缓存级别为 Standard，Browser Cache TTL 为 Respect Existing Headers，源站 `public, max-age=0, must-revalidate` 得以保留；没有 Cache Everything 或强制长缓存规则。Rocket Loader、Web Analytics/RUM 与 Speed Brain 均关闭，HTTP/2、HTTP/3、TLS 1.3 保持启用。未添加缓存或改写 `/.well-known/vercel/*`、`/.well-known/acme-challenge/*` 的规则。

参考：[Cloudflare DNSSEC](https://developers.cloudflare.com/dns/dnssec/) · [Vercel 与 Cloudflare](https://vercel.com/kb/guide/cloudflare-with-vercel)

## 上一轮生产验收记录（历史）

- 2026-10-08 首版生产环境通过 16 项 HTTP 检查，覆盖 8 页、canonical、index/follow、JSON-LD、robots、8 URL sitemap、资源、安全头、404 和跳转；浏览器 Boy／Girl 计算与重置正常。此结果属于旧版本。
- 当晚 23:43 的[官方 PSI 首页报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/d2vifh7syr?form_factor=mobile)：移动性能 99，其余三项 100；LCP 1.9s、FCP 1.2s、TBT 20ms、CLS 0.001；桌面四项 100。CrUX 无数据。这是本轮改动前的实验室结果，已取代此前 API 429 所导致的“无报告”状态。
- 迁移后 `npm run verify:live` 19/19 通过，覆盖 10 个页面、6 份 PDF、资源、安全头、真实 404 和跳转。本机根域请求仍可受旧网络缓存影响；代理验收另由外部探针和 Google 实时抓取证明。
- 08:00:33 美国 Buffalo 与德国 Falkenstein 探针均得到根域 HTTPS 200、`server: cloudflare`、`cf-cache-status: DYNAMIC`，TLS 1.3 证书验证通过。[原始回执](https://api.globalping.io/v1/measurements/21Vp3uPkyli2dkRb800021HX6)。这证明两地代理正常，不代表全球性能均已测量。

### 2026-10-09 上一轮10页发布更新

代码 `e3ea934` 已推送并完成 Vercel 生产部署 `FnUsb4qBeCwjYN1TqB73kzLXanY2`，GitHub CI 成功。实际 Vercel 日志确认执行测试、构建和静态检查；线上 19/19 检查通过，包含 10 页、6 份 PDF 和已移除项目域名的 404。

HTTPS sitemap 提交后最初显示“无法抓取”、发现 0 页；Google 00:15:58 实时检查抓取成功，重新提交过一次。07:40 复查报告已为“成功”，上次读取时间 2026-10-09，已发现 10 个网页、0 个视频，无需重复提交。普通请求和 Googlebot User-Agent 请求亦均为 HTTP 200、application/xml、10 URL。早期 Google DS 查询仍有旧缓存（00:15 左右 TTL 16784 秒），没有证据将其认定为报告延迟的原因。站点地图读取成功不等于页面已收录。

用户已选择先只用 Search Console 观察搜索词、展示和点击，不新增行为分析脚本。完整验收记录见 [QA](QA.md)。

08:00 复查首页的存储索引报告显示“网址已收录到 Google／网页已编入索引”，Google 选定 canonical 为所检查的正式根域网址，最近一次 Googlebot 抓取为 2026-10-09 00:19:55。08:00:42 迁移后实时检查又显示“网址可编入 Google 索引”，抓取和索引许可均为“是”、网页抓取“成功”。未对已收录首页重复请求索引；其他页面收录仍待后续真实报告。

管理入口：[Vercel Domains](https://vercel.com/simonhou/chinesegenderpredictor/settings/domains) · [Cloudflare DNS](https://dash.cloudflare.com/48086aaf656e35bbf0b6ea2a8ac7ea86/chinesegenderpredictor.net/dns/records) · [Spaceship DNS](https://www.spaceship.com/zh/application/advanced-dns-application/manage/chinesegenderpredictor.net/)

## 08:00已通过的迁移验收条件（历史）

- Cloudflare zone 和 Universal SSL 证书均 Active，公开 NS 与分配值一致，Google TXT 仍可查询。
- 根域和 www 均开启橙云，实际 HTTPS 响应可确认经过 Cloudflare；SSL/TLS 保持 Full (strict)。
- 根域和 www 正确指向 Vercel，www 永久跳转根域；默认项目别名保持移除。
- 新 DNSSEC 信任链有效，外部解析无 SERVFAIL，HTTPS 正常。
- 正式 HTML index/follow、canonical 使用主域名；robots 和 10 URL sitemap 正常。
- 10 个页面、6 份 PDF、计算器和资源正常，404 返回真实 404 状态。
