# 站点结构

更新日期：2026-10-09。首页品牌／功能标题为 **Chinese Gender Predictor**。当前源码由上一轮10个路由扩展为11个；8个承担独立搜索任务，3个提供信任与政策支持。正式配置本地构建已通过，第二轮生产发布与浏览器验收状态见 [QA](QA.md) 和 [部署记录](DEPLOYMENT.md)。首发8页及上一轮10页记录保留为历史证据。

| 路由 | 建议页面标题 | 关键词与独有任务 |
| --- | --- | --- |
| `/` | Chinese Gender Predictor · Free Lunar Calendar Tool | 唯一主工具；同时自然覆盖 Chinese gender calendar、chart、birth chart；提供常年完整图表和简短 FAQ |
| `/lunar-age-calculator/` | Lunar Age Calculator · Find Your Chinese Age | lunar age calculator、what is my lunar age、what is a lunar age、Chinese lunar age calculator；出生日期＋目标日期计算，显示虚岁／周岁对照并解释春节与生日边界 |
| `/chinese-gender-calendar-2026/` | Chinese Gender Calendar 2026 · Chart & PDF | 2026 真实公历／农历月界、全年图表及 A4／Letter PDF；承接当年与跨年受孕日期任务 |
| `/chinese-gender-calendar-2027/` | Chinese Gender Calendar 2027 · Chart & PDF | Chinese calendar baby gender 2027、Chinese gender predictor 2027；2027真实月界、全年图表、跨年案例及A4／Letter PDF，正文入口直达主计算器；不声称年份提升预测准确性 |
| `/gender-reveal-games/` | 5 Free Printable Gender Reveal Games · PDF Kit | gender reveal games printable、free printable gender reveal games、gender reveal bingo；五种有实际预览、材料、人数与玩法的活动，单项与九页整套A4／Letter PDF直接下载，不采集邮箱 |
| `/old-wives-tales-gender-prediction/` | Old Wives' Tales Gender Prediction · Myths & Game | old wives tales gender prediction、old wives tales gender reveal game；八种常见民俗逐项核对来源，提供空白、可跳过的娱乐记录表，不做医学或症状判断 |
| `/how-it-works/` | How the Chinese Gender Predictor Works | how to use Chinese calendar baby gender、lunar month of conception；同一转换器生成的月底／春节示例、图表来源、年龄规则与闰月约定 |
| `/accuracy/` | Is the Chinese Gender Predictor Accurate? | calendar／predictor accuracy、does it work；直接解释研究结论与科学局限，链接原始证据 |
| `/about/` | About Chinese Gender Predictor | 真实维护者、项目目的、方法维护和校正渠道；不争抢核心工具关键词 |
| `/privacy/` | Privacy Policy | 根据实际技术说明输入、分析、广告和数据处理；不虚构第三方服务状态 |
| `/terms/` | Terms of Use | 娱乐用途、使用条件及内容范围；简洁准确 |

标题是职责示例，可按实际品牌样式调整，不必在每页堆砌完整关键词组。

## 导航与内链

- 桌面主导航：Predictor、Lunar Age、2027 Calendar、Printable Games、Accuracy；手机导航及页脚同时提供方法页、2026年度页和民俗指南。
- 首页在工具说明、FAQ和资料区连接方法、准确性、农历年龄、两年日历、可打印游戏与民俗指南；准确性FAQ直达答案段落，结果区保留查表入口。
- 农历年龄工具提供返回主工具的明确入口；年龄解释连接方法页的受孕农历月份段落。方法页以演算例子连接主工具和年度页。
- 2026／2027年度页互链，并链接主工具、农历年龄及方法；2027正文增加直达首页 `#predictor` 的入口。年度PDF和游戏PDF直接挂在相应正文中，不另建空下载页。准确性页链接原始研究及民俗指南，游戏与民俗指南互链。
- 页脚提供全部支持页；Logo／站名返回首页。避免所有正文段落反复链接相同关键词。

## URL 与索引规则

1. 正式页面使用以上固定路径和统一尾斜杠规范；每页 canonical 指向其生产 URL。
2. 不另建 `/chinese-gender-predictor/`、`/chinese-gender-calendar/`、`/chinese-gender-chart/` 等重复首页。
3. 计算、结果和复制属于页面内交互，不生成结果页、参数页或年龄／月份组合索引页。生日及其他日期不写进 URL。
4. sitemap 只包含正式 canonical 页面；不包含预览域名、构建产物、参数或交互状态。
5. 不增设独立FAQ、男孩页、女孩页、薄年度存档或综合孕期博客。游戏页有独立活动任务和实物下载；民俗指南逐项解释证据并提供独有记录表，均不是预测器同义页。
6. 两个年度页提供各自真实日期、跨年案例与完整图表，保持静态可读。未来年份同样需要独有内容，避免只替换年份重复发布。

## 资料依据

页面分工来自2026-10-08的[竞品核验](COMPETITOR-ANALYSIS.md)及2026-10-09的[关键词机会方案](SEO-OPPORTUNITIES-2026-10-09.md)。工具估算用于机会排序，本站流量仍由Search Console判断。2027日期以[香港天文台官方资料](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2027e.pdf)为核对依据；准确性页引用[原始研究](https://pubmed.ncbi.nlm.nih.gov/20618730/)，民俗指南的逐项证据见[来源记录](OLD-WIVES-TALES-SOURCES.md)。

## 静态资料

`public/downloads/` 保存18份PDF，共46页：4份年度PDF共8页，14份游戏／民俗PDF共38页。每种纸张规格包含两年年度资料、九页游戏整套、五种单项文件及一页民俗记录表；Bingo单项四页含8张不同卡片，word scramble单项两页含10题与答案。6张实际页面预览与1200×630分享图本地托管。PDF不填入个人计算器输入，也不加入HTML sitemap。
