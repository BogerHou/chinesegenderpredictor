# FAQ 问题词调研与整合

调研日期：2026-10-09。使用用户已登录的 [SEO 工具站](https://sem.seogroup.club/home/) 中的 Semrush Keyword Magic，选择美国数据库、Questions、Broad match。检查 Chinese gender predictor、Chinese gender calendar、lunar age、lunar month conception 四个种子，保存首个结果页表格中实际呈现的数据。完整相关词筛选结果见 [26 个问题词](faq-keywords-2026-10-09.csv)。这不是全部问句的穷尽调查。

搜索量是工具的月度估算，不是本站流量。多数完整指标显示“1 个月”；一些小词的 KD 和更新日期不可用，界面显示“刷新”，本次没有付费刷新。不同同义词的搜索量不能直接相加为可获得的流量；KD 也是 Semrush 指标，不能保证排名。

| 问题词 | 美国月搜索量估算 | KD | 本站处理 |
| --- | ---: | ---: | --- |
| what's my lunar age | 880 | 21 | 年龄页承接，首页提供简短入口 |
| how accurate is the chinese gender calendar | 590 | 18 | 保留证据回答，合并准确性同义问句 |
| how to use chinese calendar baby gender | 390 | 44 | 首页增加操作问答，方法页给出步骤 |
| how accurate is chinese gender predictor | 320 | 22 | 与日历准确性合并，不另建重复页面 |
| how does the chinese gender calendar work | 260 | 37 | 定义回答与方法页共同解释 |
| how to calculate lunar age | 260 | 29 | 年龄页增加直接的计算回答 |
| how to find out my lunar age | 140 | 11 | 并入年龄主题，避免重复 FAQ |
| how to calculate lunar conception month | 50 | 不可用 | 首页说明，方法页保留真实月界示例 |
| does the chinese gender calendar change every year | 40 | 41 | 首页和 2026／2027 年度页回答 |
| how to calculate lunar month of conception | 30 | 不可用 | 合并受孕月份主题 |
| can the chinese gender calendar predict twins | 20 | 不可用 | 准确性页简短说明限制 |

## 访客内容安排

首页从 6 问扩充为 9 问：定义、使用图表、准确性、农历年龄、受孕农历月份、只有预产期怎么办、年度变化、不同结果、隐私。每个问题只负责一个主题；详细解释通过明确锚点链接到年龄、方法、准确性或年度页。公开内容全部为自然英文，不展示调研数据、SEO 词表、开发说明或内部策略。

方法页保留原有日历来源、示例和闰月说明，增加明确操作步骤及受孕日／预产期区分；年龄页直接回答如何计算和是否只加一岁；两个年度页解释本网站图表不变而农历日期改变；准确性页说明本图不提供双胞胎分别预测。没有增加重复落地页或 FAQ 结构化数据，也没有承诺搜索富媒体展示。

## 事实与范围

- 年龄和月份规则以本站实际计算方式为准，年度变化的回答限定为本网站使用的图表。
- 预产期减 266 天是近似估算。[MSD Manual](https://www.msdmanuals.com/home/women-s-health-issues/normal-pregnancy/pregnancy-test-and-due-date) 说明受孕至分娩平均 266 天；不能当成实际受孕日期。
- 准确性页继续引用原始研究，不给图表科学有效或医学预测的承诺；双胞胎说明描述工具限制，不将单胎研究结论当作双胎研究结果。
- 日期和结果仍在访客设备上计算；不新增分析脚本。后续流量表现用 Search Console 实际查询、展示和点击判断。
- 私有原始表格证据保留在 `.qa/faq-research-20261009/semrush-visible-questions.json`，不进入公开仓库，未记录账号凭据或代理会话参数。

## 验收与发布

本地正式配置：23 项测试、11 页构建、606 条内部路径／资源检查通过。中文 Chrome 实测 FAQ 键盘展开、使用步骤和受孕月份链接；手机 390×844 下 FAQ 与方法页无页面横向溢出、未出现中文。修复了原有 CSS 层叠导致手机 FAQ 仍为两列的问题：标题和问答改为单列，问题行高 62–86px，答案可用宽度 331px。桌面保留两列布局。详细生产回执见 [QA](QA.md) 和 [部署记录](DEPLOYMENT.md)。
