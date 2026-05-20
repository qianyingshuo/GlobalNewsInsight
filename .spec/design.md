### 1. 动态数据源注册表 (`sources.csv`)
数据源必须从根目录下的 `sources.csv` 动态加载，方便未来直接编辑。

### 2. 目录结构与数据流向
``` mermaid
graph TD
    classDef process fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef file fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef error fill:#ffebee,stroke:#b71c1c,stroke-width:2px;

    Sources[sources.csv]:::file
    Agent(agent-browser 访问):::process
    PhaseA[Phase A: /public/data/raw/YYYY-MM-DD/]:::file
    Judge{解析成功/失败判定}:::process
    PhaseB[Phase B: daily_intelligence.json]:::file
    ErrorLog[/写入 /error.log 历史追加/]:::error
    PhaseD[Phase D: 生成 /public/data/processed/YYYY-MM-DD/run_status.json]:::file

    Sources --> Agent
    Agent --> PhaseA
    PhaseA --> Judge
    
    Judge -- 成功 --> PhaseB
    Judge -- 失败 --> ErrorLog
    
    PhaseB --> PhaseD
    ErrorLog --> PhaseD
```

### 3. 数据输出格式标准
* **情报数据**：必须严格遵循 `DATA_FORMAT.md` 中定义的 JSON Scheme。
* **运行状态数据**：采集任务完成后，在 `/public/data/processed/[YYYY-MM-DD]/run_status.json` 生成当天的运行报告。格式必须与 `DATA_FORMAT.md` 中的追加格式完全吻合（包含 `run_date`、`stats` 统计、以及包含 `error_type` 和 `error_message` 的 `failures` 数组）。