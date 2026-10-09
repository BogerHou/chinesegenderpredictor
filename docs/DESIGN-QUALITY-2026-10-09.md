# 网站品质提升与验收

日期：2026-10-09。评审维度与官方来源见 [品质基准](AWARDS-BENCHMARK.md)。这是本站设计和功能的内部验收，不是三个奖项的评委评分或获奖认证。

## 用户发现问题后的产品修正

之前的验收遗漏了中文Chrome中的原生日期提示，并未充分审查公开文案是否面向实际访客。这说明原有检查不能视为完整的产品验收。用户指出后，追加下列修正与真实验证；前文品质基准也补入语言和受众要求。

- 原 `type=date` 会按浏览器语言显示日期格式，即使页面本身为英文；[MDN日期输入说明](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date)明确描述了这个行为。主预测器和年龄计算器均改为显式英文Month、Day、Year，月份为Jan至Dec，年份可直接输入；不依赖原生日期框的显示语言。
- 6个日期控件保持完整无障碍名称、无name的提交保护、本地计算和错误焦点。月份／日／年份不完整分别提示；1900至2099年份范围、闰日及真实历日由严格校验处理，不默默修改无效日期。
- 中文Chrome实际填写Jun15,1995／May1,2026，键盘Enter得到Boy／32／month3；Feb30保留原选择并聚焦Day，1800聚焦Year；Due模式只清目标日期，示例Jan22,2027得到同一结果；Start over清空6项并恢复受孕模式及Month焦点。年龄页Feb29,2000／Mar1,2026为传统27／regular26。
- 390×844手机无页面溢出，主要按钮bottom约741px；941×707窄桌面约683px，Month／Day完整可见；768平板及年龄工具均无日期组溢出。手机字体16px。自有Phosphor下拉箭头不改变select语义、点击或键盘，独立源码复查通过。
- 11页访客文案已审查，清理coordinates、matrix、代码版本、库与时区实现、内部设计／审查原则及research instrument等措辞；改成实际用途、年龄、月份、准确性和玩法。必要研究来源、娱乐边界、隐私透明及授权条款保留。网页可见文本检查未发现中文汉字或所列内部术语。
- 正式配置23项测试、11页及596个内部路径／资源检查通过。[功能发布e3c64d0](https://github.com/BogerHou/chinesegenderpredictor/commit/e3c64d0b661fc3b761381d7838c811d27f7331a5)，[CI成功](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37873689415)，[Vercel成功](https://vercel.com/simonhou/chinesegenderpredictor/9VMUvWtc92yMZ6Mx9mLJ9ZpbJPK2)。正式站20/20检查通过，11页HTML和CSS／client.js共13项与本地构建一致；Chrome正式站两工具均已验证英文控件和正常计算，控制台无error/warn。
- 四份年度PDF也去掉代码版本、库名和revision说明，改为Calendar references；八页重新渲染，矩阵、日期表、纸张规格、页数和完整MIT许可与上一版一致，其他42项公开资产未变。最终发布[`7410cba`](https://github.com/BogerHou/chinesegenderpredictor/commit/7410cbaf9ecbbf662a5b71ebba444fd4841a18b5)，[CI成功](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37874345179)，[Vercel成功](https://vercel.com/simonhou/chinesegenderpredictor/FWUSFPndouRgMHfduDCuC4WPrWnD)。11页HTML、CSS／client.js及四份年度PDF共17项线上响应与本地文件一致。本次没有以旧性能报告冒充新的测量。
- 最终 `verify:live` 20/20通过，含50项静态资源。原先50路并行下载在本机对未修改的投票Letter PDF两次出现ECONNRESET；单独请求HTTP200且与源码一致。资产检查改为最多3路后完整通过；仍按实际失败返回非零状态，不把网络异常当成功。
- 私有 `.qa/english-input/` 保留桌面与手机正式站截图、构建／生产／文件比对记录及两张PDF规格拼图。8张PDF渲染中间图移入本任务废纸篓；本轮预览服务已停止，任务标签页及临时视口均已清理。

## 设计方向

面向准父母和家庭的温暖工具与日历资料。采用原有奶油白、柔玫瑰和粉蓝配色；用 Cormorant Garamond 标题呼应传统日历和纸质纪念卡，Manrope 保持输入、数据及长文的清楚阅读。设计参数为变化度7、动态强度4、密度4；使用原生CSS与现有静态架构。固定浅色是本项目已有品牌选择。

原创识别来自十二个月刻度和农历年龄的组合。月份刻度代表图表的12列，不代表月相；选中月份和中心年龄来自实际转换结果。闰月继续沿用原有编号约定与说明。现有月亮标记增加同样的月份刻度，并同步favicon，保留文字品牌、主导航标签和路由。

## 三轮检查与修正

| 轮次 | 发现 | 已落实的修正 |
| --- | --- | --- |
| 首轮源码与视觉审查 | 重复的粗体标题／面板，资源缺少浏览入口，长文缺少章节导航；手机菜单Escape和结果焦点不完整 | 编辑式排版，首页资源书架、五种游戏真实缩略图，自动生成章节导航、最多三项相关指南；增强手机文字与44px菜单点击区 |
| 第一版浏览器复核 | 手机Grid将结果排在表单前面，较矮笔记本按钮过深 | 恢复表单优先；压缩小屏幕首屏。390×844主要按钮bottom约738px，941×707为约692px，均在首屏内；长屏桌面保持舒展构图 |
| 第二轮独立审查与第三版修正 | 原图和真实换算没有视觉联系；可选动画异常可中断结果；图表跳转未完成键盘焦点；标题播报缺少上下文 | 十二个月／年龄坐标仪表，结果完整可访问名称，图表区域焦点与选中位置说明；动画受减少动态效果控制且异常不会影响计算和重置 |
| 发布后的性能复核与最终独立检查 | Google报告指出预览图片下载量偏大；Cloudflare自动注入统计脚本而被CSP拦截 | 两种尺寸纸卡WebP及月亮裁切，生产CSS压缩，srcset路径检查；Cloudflare当前域名RUM彻底禁用。最终审查确认fallback、尺寸与刻度计算正常，修复预览MIME和纸卡双旋转 |

没有使用自动声音、滚动劫持、假进度条、虚构用户评价或虚构准确率。日期不放进链接，计算仍在浏览器本地完成。

## 本地和实际浏览器证据

- 正式配置 `build:verified`：19项日历／加载测试、11页构建、595项内部路径和资源检查通过（包含响应式图片候选路径）；独立页面元数据、canonical、sitemap、索引策略、404及无脚本表单保护通过。
- Chrome桌面1440×1000、笔记本941×707、平板768×1024、手机390×844均检查；手机与平板根scrollWidth分别375、753px（浏览器滚动条之外），没有页面横向溢出。长表格在自己的容器滚动。
- 空提交给出错误并聚焦生日；键盘Enter可提交。受孕示例返回Boy／虚岁32／农历三月；预产期2027-01-22对应相同坐标，保留估算说明。月份仪表与结果数据一致。
- 结果标题的可访问名称包括传统猜测、年龄、月份和娱乐边界；年龄工具名称包括虚岁与周岁。激活图表链接后焦点进入有完整匹配说明的图表区域。
- 手机菜单Escape关闭并返回按钮；重置清空日期、恢复受孕模式及中立仪表，焦点回生日。
- 实际仿真 `prefers-reduced-motion: reduce`：匹配为true、CSS动画为none，预产期计算和重置正常。测试后恢复媒体和视口设置。
- 计算阶段Network观察到的站点请求只涉及滚动触发的静态预览图片，没有携带日期或结果的请求；浏览器扩展自身请求不属于本站行为。
- 游戏目录五张实际预览均成功加载；长指南、章节导航、平板阅读与自定义404实际浏览器检查完成；本轮站点控制台未出现error/warn。
- 18份PDF与原版本保持一致，沿用此前逐页渲染和源数据核对，纸张规格、页数与下载链接准确；本轮没有测试实体打印机。
- 普通关键文字对比度经独立源码核对为4.96至6.10:1；粉蓝和玫瑰之外仍有文字标签传达B/G。新增字体23KB，本地加载；NPM安装后审计0已知漏洞。未加入重型动画库。

## 此前品质升级的发布与性能回执（历史）

- 设计与交互发布：[`1e142d5`](https://github.com/BogerHou/chinesegenderpredictor/commit/1e142d5c90b0980cd40964e16cf58bfa9120ffa5)。最终网页资产发布：[`c884cb3`](https://github.com/BogerHou/chinesegenderpredictor/commit/c884cb3ba8bc3f7dd1421e50add2324efc07e818)；[GitHub CI](https://github.com/BogerHou/chinesegenderpredictor/actions/runs/37871853054)成功，[Vercel生产部署](https://vercel.com/simonhou/chinesegenderpredictor/H6tsyQYAAKwvi4dX3H5fcPZBPPhb)状态success。
- 正式域名 `verify:live` 20/20通过：11页、11网址sitemap、50项静态资源（含18份PDF）、真实404、安全头、HTTP／www跳转及旧Vercel项目域名404。一轮HTTP连接曾中断，完整重试后通过；不是已确认的跳转缺陷。
- 14张新WebP、生产CSS及client.js共16项实际HTTP响应与本地构建逐字节一致；WebP全部返回image/webp。Chrome正式站完成示例、手机结果、五项游戏WebP目录及实际整套A4下载；下载文件与源码一致，测试副本移入废纸篓。
- 新版第一份09:39报告：手机性能93、无障碍100、最佳实践92、SEO100，LCP2.7s。根据其图片诊断完成优化；未降低同源CSP。Cloudflare RUM由未配置状态明确切换为“RUM is currently disabled for this zone”，不改变安全日志、DNSSEC或SSL设置；用户测量范围保持Search Console。
- [最终Google PageSpeed报告](https://pagespeed.web.dev/analysis/https-chinesegenderpredictor-net/3i75gj5021?form_factor=mobile)，2026-10-09 09:53:25：手机性能97、无障碍100、最佳实践100、SEO100，FCP1.361s、LCP1.961s、TBT0ms、CLS0、Speed Index3.834s；桌面四项均100，LCP0.302s、TBT0ms、CLS0.01。Lighthouse13.5／HeadlessChromium153，手机Moto G Power／低速4G模拟；外部报告的控制台错误已消失。
- 首页圆盘与两张纸卡在本轮桌面1×实际选用WebP，总文件体积从280831减至27674字节（约90.1%）；高DPR可能选择更大的纸卡候选。6张完整纸卡WebP与PNG像素一致；缩略图均小于12KB。原始PNG、JPEG及18份PDF保持不变。
- CrUX显示无真实用户数据。报告只证明此次首页实验室测量；不能据此声称全站现场INP或Core Web Vitals合格，也不能承诺排名或奖项结果。渲染阻塞提示仍有CSS，但性能及LCP达到本轮要求，未为追求分数改变稳定的首屏加载方式。

本轮已按公开设计、内容、交互、响应式、无障碍和性能维度完成内部验收；没有未修复的已确认发布阻塞。作品是否达到实际获奖水平仍由正式评委决定。本轮未付费报名，也没有伪造奖项徽章或评委分数。

## 留存与清理

源码、字体许可证、最终PDF及必要验收证据保留于项目和私有 `.qa/quality/`。最终桌面、手机结果、游戏目录、Cloudflare关闭回执及构建／生产／资产核对记录保留。旧迭代截图、未使用的斜体字体和测试下载移入本任务废纸篓；最后停止本轮预览服务并关闭任务标签页，保留用户无关页面。
