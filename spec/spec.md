### 1. 业务背景与时间窗口
* **时区统一**：在抓取不同信息源时，必须在内部统一转换为 UTC 时间进行比对。
* **绝对时间窗口**：严格限制在 `[当前执行时间 - 30小时, 当前执行时间]` 范围内的新闻与更新。

### 2. 用户故事 (User Story)
* *As a* 资深投研人员/决策者, *I want* 在每日系统运行后清晰直观地了解哪些数据源抓取成功、哪些失败了以及失败的具体原因, *So that* 我可以评估当日情报的覆盖率和完整度。

### 3. 验收标准 (Acceptance Criteria - EARS 语法)
* **WHEN** 启动数据采集时, **THE SYSTEM SHALL** 从项目根目录下的 `sources.csv` 中读取数据源列表。
* **WHEN** 执行抓取时, **THE SYSTEM SHALL** 仅调用 `agent-browser` 直接访问对应的 Web 地址或 API [2]。
* **WHEN** 任意数据源访问失败时, **THE SYSTEM SHALL** 将失败信息追加写入根目录的 `error.log`，并不得触发任何搜索引擎接口 [2]。
* **WHEN** 整个采集与分析流程结束时, **THE SYSTEM SHALL** 生成一份符合 `DATA_FORMAT.md` 规范的 `/public/data/processed/[YYYY-MM-DD]/run_status.json` 文件，用于记录该次运行的健康指标与失败详情。

### 4. 本次迭代的 Non-Goals (非目标)
* 不支持通过第三方二次转载网站（如 CSDN、今日头条、非官方自媒体等）获取数据 。
* 运行状态监控暂不接入任何第三方监控平台（如 Sentry），仅通过本地 JSON 与日志承载。