# 站点结构

更新日期：2026-10-09。首页品牌／功能标题为 **Chinese Gender Predictor**。本轮由首发 8 个路由扩展为 10 个；7 个承担独立搜索任务，3 个提供信任与政策支持。本地已完成，生产发布状态见 [部署记录](DEPLOYMENT.md)。

| 路由 | 建议页面标题 | 关键词与独有任务 |
| --- | --- | --- |
| `/` | Chinese Gender Predictor · Free Lunar Calendar Tool | 唯一主工具；同时自然覆盖 Chinese gender calendar、chart、birth chart；提供常年完整图表和简短 FAQ |
| `/lunar-age-calculator/` | Lunar Age Calculator · Find Your Chinese Age | lunar age calculator、Chinese age calculator；出生日期＋目标日期计算，解释农历年份与年龄 |
| `/chinese-gender-calendar-2026/` | Chinese Gender Calendar 2026 · Chart & PDF | 2026 真实公历／农历月界、全年图表及 A4／Letter PDF；承接当年与跨年受孕日期任务 |
| `/chinese-gender-calendar-2027/` | Chinese Gender Calendar 2027 · Chart & PDF | 2027 真实月界、全年图表、跨年案例及 A4／Letter PDF；不声称年份提升预测准确性 |
| `/gender-reveal-games/` | 3 Free Printable Gender Reveal Games · PDF Kit | 三种有实际预览、材料、人数与玩法的活动；A4／Letter PDF 直接下载，不采集邮箱 |
| `/how-it-works/` | How the Chinese Gender Predictor Works | how to use Chinese gender chart、lunar month of conception；演算例子、图表来源、年龄规则与闰月约定 |
| `/accuracy/` | Is the Chinese Gender Predictor Accurate? | accuracy、does it work；直接解释研究结论与科学局限，链接原始证据 |
| `/about/` | About Chinese Gender Predictor | 真实维护者、项目目的、方法维护和校正渠道；不争抢核心工具关键词 |
| `/privacy/` | Privacy Policy | 根据实际技术说明输入、分析、广告和数据处理；不虚构第三方服务状态 |
| `/terms/` | Terms of Use | 娱乐用途、使用条件及内容范围；简洁准确 |

标题是职责示例，可按实际品牌样式调整，不必在每页堆砌完整关键词组。

## 导航与内链

- 桌面主导航：Predictor、Lunar Age、2027 Calendar、Printable Games、Accuracy；手机导航及页脚同时提供方法页和 2026 年度页。
- 首页在工具说明、FAQ 和资料区连接方法、准确性、农历年龄、两年日历与可打印游戏；结果区保留查表入口。
- 农历年龄工具提供返回主工具的明确入口；方法页以演算例子连接主工具和年度页。
- 2026／2027 年度页互链，并链接主工具、农历年龄及方法；年度 PDF 和游戏 PDF 直接挂在相应正文中，不另建空下载页。准确性页链接原始研究。
- 页脚提供全部支持页；Logo／站名返回首页。避免所有正文段落反复链接相同关键词。

## URL 与索引规则

1. 正式页面使用以上固定路径和统一尾斜杠规范；每页 canonical 指向其生产 URL。
2. 不另建 `/chinese-gender-predictor/`、`/chinese-gender-calendar/`、`/chinese-gender-chart/` 等重复首页。
3. 计算、结果和复制属于页面内交互，不生成结果页、参数页或年龄／月份组合索引页。生日及其他日期不写进 URL。
4. sitemap 只包含正式 canonical 页面；不包含预览域名、构建产物、参数或交互状态。
5. 不增设独立 FAQ、男孩页、女孩页、薄年度存档或综合孕期博客。游戏页有独立活动任务和实物下载，不是预测器同义页。
6. 两个年度页提供各自真实日期、跨年案例与完整图表，保持静态可读。未来年份同样需要独有内容，避免只替换年份重复发布。

## 资料依据

页面分工来自 2026-10-08 的[竞品核验](COMPETITOR-ANALYSIS.md)，是搜索意图判断，不是搜索量证明。2027 日期以[香港天文台官方资料](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2027e.pdf)为核对依据；准确性页引用[原始研究](https://pubmed.ncbi.nlm.nih.gov/20618730/)。

## 静态资料

`public/downloads/` 保存 2026、2027、games 各两种纸张规格的 6 份 PDF；预览图片与 1200×630 分享图本地托管。PDF 不填入个人计算器输入，也不加入 HTML sitemap。
