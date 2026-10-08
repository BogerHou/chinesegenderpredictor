# 部署记录

状态更新：2026-10-08（Asia/Shanghai）。本文件区分已经完成的操作和仍待验证的步骤。

## 已完成

- 正式域名：`https://chinesegenderpredictor.net`，注册商 Spaceship。
- 代码仓库：[BogerHou/chinesegenderpredictor](https://github.com/BogerHou/chinesegenderpredictor)，公开，默认分支 `main`。
- 首个外链：GitHub 仓库 About 的 Website，以及 README 中的真实项目介绍和站点链接。链接已发布；不等于获得搜索引擎收录或排名提升。
- Vercel 项目：个人账号下 `simonhou/chinesegenderpredictor`，Hobby；GitHub `main` 自动部署已接通。首个生产部署来自 `116f955`。
- 唯一正式站点：[chinesegenderpredictor.net](https://chinesegenderpredictor.net/)。按用户要求，已在 Vercel Domains 移除 `chinesegenderpredictor.vercel.app` 项目域名绑定。生产环境 `SITE_URL=https://chinesegenderpredictor.net`，Other / `npm run build` / `dist` / Node 22。
- 正式构建已用实际域名通过本地检查：8 个页面、226 个内部路径与资源、生产 canonical 和 sitemap。
- Cloudflare Free 站点已创建，待激活；分配 NS 为 `ashley.ns.cloudflare.com`、`jeremy.ns.cloudflare.com`。
- 原 Spaceship 自定义 DNS 记录数为 0；现已添加下表两项。原 NS 为 `launch1.spaceship.net`、`launch2.spaceship.net`，尚未切换 NS。
- Vercel 已绑定根域生产环境，以及 www 到根域的 308 永久跳转；Domains 当前仅保留这两个自有域名。
- 新版奶油白、玫瑰粉、淡蓝配色和婴儿房月亮插图已发布；全站固定浅色。

## 已保存的 DNS 记录

以下值直接取自本项目 Vercel 域名配置，已分别保存到 Spaceship 与 Cloudflare：

| 类型 | 主机 | 目标 | Spaceship TTL | Cloudflare |
| --- | --- | --- | --- | --- |
| A | @ | `216.198.79.1` | 30 分钟 | DNS only / Auto |
| CNAME | www | `bf2432657c1d912c.vercel-dns-017.com` | 30 分钟 | DNS only / Auto |

Cloudflare 只有这两条站点记录，未启用代理，仍处于 Pending。未配置邮箱服务。NS 切换前重新检查记录，不能仅依赖本文历史值。

## DNSSEC 迁移窗口

域名原本启用了 DNSSEC。Google 和 Cloudflare 的外部 HTTPS DNS 查询确认原 DS 有效，key tag 50762、algorithm 13、digest type 2；观察到原始 TTL 86400 秒。

经用户明确批准，2026-10-08 23:03 前（保守记录）已在 Spaceship 关闭 DNSSEC。随后 Google DNS 回执为 Status 0、无 DS Answer，并标明来自 .net 权威服务器。部分递归解析器仍可能缓存原 DS。

不得早于 **2026-10-09 23:05（Asia/Shanghai）** 切换 NS。已安排本聊天于 **2026-10-09 23:20** 自动继续迁移，执行前复核实际状态和 Vercel DNS 目标。需要电脑开机、应用运行及浏览器账号登录可用。

最终流程：先让 Cloudflare 记录与当前生产站点一致，再切 NS；Cloudflare Active 后启用其 DNSSEC，将实际新 DS 写回 Spaceship，并验证解析和 HTTPS。根域和 www 使用 DNS only，不叠加 Cloudflare 反向代理。

官方参考：[Cloudflare DNSSEC](https://developers.cloudflare.com/dns/dnssec/) · [Vercel 与 Cloudflare](https://vercel.com/kb/guide/cloudflare-with-vercel)

## 本轮线上验收与待办

- 正式根域的 16 项 HTTP 检查通过：8 页 200、独立 H1、有效 JSON-LD、正式 canonical、index/follow、robots、8 URL sitemap、静态资源、404/noindex、安全响应头，以及 HTTP / www 跳转。
- 浏览器实测 Boy / 虚岁 32 / 农历三月十五与 Girl 两种结果及重置正常，无控制台 error。
- 根域和 www 均为 Valid Configuration，SSL 有效。23:27 左右刷新公共 DNS 缓存后，Google 与 Cloudflare 公共 DoH 均返回 A 216.198.79.1、Spaceship NS、无 DS、无 SERVFAIL；本机浏览器根域 HTTPS 正常。
- PSI 移动端官方 API 返回 429 RESOURCE_EXHAUSTED（匿名每日配额不可用），未取得 Lighthouse 结果；没有性能分数或真实用户 Core Web Vitals 数据。
- 用户明确要求不要 Vercel 后缀域名，因此已移除默认项目别名；后续部署与迁移不要重新添加该别名或其跳转配置。Vercel 自动生成的部署预览地址属于平台内部部署机制，并非项目正式域名。
- 明晚完成 Cloudflare NS / DNSSEC 迁移及下方验收；搜索引擎收录与 Search Console 尚未验证或提交。

管理入口：[Vercel Domains](https://vercel.com/simonhou/chinesegenderpredictor/settings/domains) · [Cloudflare DNS](https://dash.cloudflare.com/48086aaf656e35bbf0b6ea2a8ac7ea86/chinesegenderpredictor.net/dns/records) · [Spaceship DNS](https://www.spaceship.com/zh/application/advanced-dns-application/manage/chinesegenderpredictor.net/)

本地 `.qa/launch/live-check.mjs` 留供迁移后复验（未纳入公开仓库）。代码与最终预览资产保留；已完成的 GitHub 授权、Spaceship 和 Cloudflare 操作标签页已关闭。

## 迁移验收条件

- Cloudflare 状态 Active；公开 NS 与分配值一致。
- 根域和 www 正确指向 Vercel；www 永久跳转至根域。
- 新 DNSSEC 信任链有效，无 SERVFAIL。
- 正式 HTML 为 index/follow，canonical 均使用正式域名；robots 和 sitemap 可访问。
- 8 个页面可直接访问，404 返回正确状态；计算器及静态资源正常。
