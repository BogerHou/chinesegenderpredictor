# 竞品核验

核验日期：2026-10-08。方法：公开页面和搜索索引抓取；未使用浏览器提交表单，未测试输出结果，也未审计竞品算法、隐私实现或全部页面。下表的“有工具”指可核对到输入表单及预测入口，不等于已验证运行成功。

| 网站与证据 | 可核对的工具与内容 | 对本项目的启示 |
| --- | --- | --- |
| [ChineseGenderCalendar.net](https://chinesegendercalendar.net/) | 母亲生日；受孕、末次月经、IVF、预产期输入方式；正文说明农历年龄与月份转换；18–45 岁文本图表；声明浏览器本地计算 | 是功能较完整的直接竞品；不能把“有计算器”“自动农历转换”或“本地计算”作为独家能力 |
| [ChineseGenderPredictor.org](https://chinesegenderpredictor.org/) | 受孕年龄和受孕月份下拉框，Predict、结果区和重置；正文也讨论生日与农历换算 | 表单与解释必须一致；不要让用户自行猜测应填实际年龄还是农历年龄 |
| [The Bump](https://www.thebump.com/chinese-gender-chart) | 搜索索引显示受孕月、年龄两个下拉框和预测按钮；作者、医学审核与事实核查署名 | 工具与信任信息结合。直接打开本次重定向至首页，故仅确认索引中的功能，不断言实时交互可用 |
| [Huggies US](https://www.huggies.com/en-us/resources/pregnancy/gender-prediction/gender-prediction-calculator) | 受孕月、母亲受孕年龄、Calculate；解释内容与相关孕期工具 | 抓取同时包含错误状态文案，可能是预置状态，不能据此断言服务故障 |
| [Pampers US](https://www.pampers.com/en-us/pregnancy/chinese-gender-predictor) | 受孕年龄、预产期、预测入口；说明与 FAQ | 预产期是有用的替代输入；相关内容应指向同一主工具，而不是复制工具落地页 |

原计划核对 BabyCenter，但该域名被抓取工具的 robots 规则阻断；以可访问的 Pampers 替代，未推断 BabyCenter 当前功能。

## 搜索意图与机会

以下是基于页面样本和非品牌查询的推断，不是搜索量报告：

1. **即时工具**：predictor、calendar、chart、birth chart 高度重叠，应集中到首页。
2. **输入解释**：lunar age、lunar conception month、due date 等问题，可由独立农历年龄工具和方法页承担。
3. **年度查询**：用户需要当年公历与农历月界，以及可阅读／打印图表。年度页应有实际日期差异，不能只换年份标题。
4. **可信度与冲突**：accuracy、不同网站结果不一致、闰月处理，适合有明确证据的解释。

可做的体验改进是清楚标注输入、展示转换过程、突出当前表格坐标、提供手机和打印视图，并公开本项目的规则。已有竞品也提供部分能力，必须通过实际质量竞争，不作唯一性声明。

## 事实边界与独立参考

- 图表是民俗娱乐。不能从“农历转换更规范”推导出“预测更准确”。[2010 年研究](https://pubmed.ncbi.nlm.nih.gov/20618730/)使用 2,840,755 次单胎出生，结论是不优于随机猜测；[大学存档全文](https://deepblue.lib.umich.edu/bitstream/handle/2027.42/79303/j.1365-3016.2010.01129.x.pdf)可作为备用入口。
- 农历换算使用[香港天文台对照表](https://www.hko.gov.hk/en/gts/time/conversion1_text.htm)作独立依据；[2027 年政府数据目录](https://data.gov.hk/en-data/dataset/hk-hko-rss-gregorian-lunar-calendar-conversion-table/resource/bc159cbb-e99c-435b-881e-74d4b03bd60a)提供当年数据入口。
- 未获取竞品真实流量、搜索量、KD、域名权重、收益或完整反链数据。原对话中的相关数字未独立验证，不在计划中当作事实引用。
- 搜索索引可能包含旧页面版本；尤其 ChineseGenderCalendar.net 的新旧抓取内容有差异。引用当前功能时保留核验日期，不混用旧文案。

本次为有边界的功能与意图研究，不是完整技术 SEO、商业尽调或算法正确性审计。
