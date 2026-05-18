# 情报中心数据格式说明文档

本文档详细说明情报中心前端应用所需的所有 JSON 数据文件格式，以及添加新数据的完整流程。

---

## 目录结构

```
public/data/processed/
├── history_index.json              # 日期索引文件（必须手动维护）
└── 2026-05-18/                     # 日期文件夹（格式：YYYY-MM-DD）
    └── daily_intelligence.json     # 当日完整情报数据
```

---

## 1. history_index.json — 日期索引文件

### 作用
前端通过此文件获取所有可用日期列表，用于渲染侧边栏时间线。

### 文件位置
`public/data/processed/history_index.json`

### 格式
```json
["2026-05-17", "2026-05-18"]
```

### 字段说明
| 字段 | 类型 | 说明 |
|------|------|------|
| 数组元素 | string | 日期字符串，格式必须为 `YYYY-MM-DD` |

### 注意事项
- 日期必须按升序排列（旧 → 新）
- 添加新日期数据后，**必须**将此日期追加到数组末尾
- 删除日期文件夹时，也必须同步移除此数组中的对应项

---

## 2. daily_intelligence.json — 每日情报数据文件

### 作用
存储单日的完整情报数据，包括高管简报、图表配置和所有情报条目。

### 文件位置
`public/data/processed/{YYYY-MM-DD}/daily_intelligence.json`

### 根对象结构

```json
{
  "date": "2026-05-18",
  "generated_at": "2026-05-18T12:00:00Z",
  "executive_briefing": "过去24小时，AI与资本市场呈现两大主线...",
  "charts": [...],
  "intelligence_items": [...]
}
```

### 字段详解

#### 根级别字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | string | ✅ | 数据日期，格式 `YYYY-MM-DD`，必须与文件夹名一致 |
| `generated_at` | string | ✅ | 数据生成时间，ISO 8601 格式（如 `2026-05-18T12:00:00Z`） |
| `executive_briefing` | string | ✅ | 高管简报，300-500字的中文摘要，概述当日核心主线 |
| `charts` | ChartData[] | ✅ | 图表配置数组，用于 HeroSummary 组件 |
| `intelligence_items` | IntelligenceItem[] | ✅ | 情报条目数组，每条为一个独立情报 |

---

### 2.1 ChartData 对象

用于配置数据看板中的图表。

```json
{
  "id": "ipo_trend",
  "title": "IPO热度趋势",
  "path": "/assets/ipo_trend.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 图表唯一标识，如 `ipo_trend`、`ai_market_share` |
| `title` | string | ✅ | 图表标题，显示在图表上方 |
| `path` | string | ✅ | 图表图片路径，相对于 public 目录 |

**当前支持的图表 ID：**
- `ipo_trend` — IPO 热度趋势（渐变面积图）
- `ai_market_share` — AI 市场份额变化（雷达图）

---

### 2.2 IntelligenceItem 对象

单条情报的完整数据结构。

```json
{
  "id": "1",
  "title": "SpaceX计划6月8日启动全球路演",
  "summary": "SpaceX计划于下周公开其IPO招股说明书...",
  "category": "IPO & Finance",
  "source": "新浪财经 / Tech Times",
  "published_at": "2026-05-18T02:41:00Z",
  "importance": 5,
  "confidence_score": 95,
  "confidence_explanation": {
    "source_level": "一手官方文件(S-1) + 主流财经媒体交叉报道",
    "cross_validation": "新浪财经、Tech Times等多个独立渠道均有报道",
    "evidence_support": "有具体财务数据(49.4亿美元亏损、186.7亿美元营收)支撑"
  },
  "sources": [
    {"name": "新浪财经", "url": "https://finance.sina.com.cn"},
    {"name": "Tech Times", "url": "https://techtimes.com"}
  ],
  "deep_dive": {
    "underlying_logic": "SpaceX将xAI纳入IPO主体...",
    "cross_boundary_links": "xAI合并将AI能力注入航天领域...",
    "exploration_directions": [
      "关注Starlink盈利能力变化",
      "追踪xAI技术在航天领域的具体应用"
    ]
  }
}
```

#### 基础字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识，建议用数字字符串（"1", "2", ...） |
| `title` | string | ✅ | 情报标题，简洁明了 |
| `summary` | string | ✅ | 情报摘要，100-200字，概括核心内容 |
| `category` | string | ✅ | 分类标签，见下方【支持的分类】 |
| `source` | string | ✅ | 来源名称（纯文本，用于显示） |
| `published_at` | string | ✅ | 发布时间，ISO 8601 格式 |
| `importance` | number | ✅ | 重要性评分，1-5 星，≥4 星会进入操作指南 |
| `confidence_score` | number | ✅ | 置信度分数，0-100，决定颜色显示 |

#### 支持的分类（category）

| 分类值 | 显示颜色 | 说明 |
|--------|----------|------|
| `IPO & Finance` | 🟡 黄色 | IPO 与金融 |
| `AI & Tech` | 🟢 绿色 | AI 与技术 |
| `Policy` | 🟣 紫色 | 政策法规 |
| `Finance` | 🟡 黄色 | 金融快讯 |
| `AI & Auto` | 🔵 蓝色 | AI 与汽车 |
| `Legal` | 🔴 红色 | 法律诉讼 |
| `AI & Social` | 🩷 粉色 | AI 与社会公益 |
| `AI & Hardware` | 🩵 青色 | AI 与硬件 |
| `AI & Web` | 🟣 紫色 | AI 与 Web |
| `Open Source` | 🟢 绿色 | 开源生态 |

#### confidence_explanation 对象（必填）

```json
{
  "source_level": "一手官方文件(S-1) + 主流财经媒体交叉报道",
  "cross_validation": "新浪财经、Tech Times等多个独立渠道均有报道",
  "evidence_support": "有具体财务数据(49.4亿美元亏损、186.7亿美元营收)支撑"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `source_level` | string | 信源层级说明：一手官方、主流媒体报道、匿名爆料等 |
| `cross_validation` | string | 交叉验证说明：多个独立渠道是否印证 |
| `evidence_support` | string | 证据支撑说明：是否有具体数据、文档、图表 |

#### sources 数组（可选但强烈推荐）

用于生成可点击的来源链接标签。

```json
[
  {"name": "新浪财经", "url": "https://finance.sina.com.cn"},
  {"name": "Tech Times", "url": "https://techtimes.com"}
]
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 来源名称，显示在标签上 |
| `url` | string | 完整 URL，点击后在新标签页打开 |

**注意：** 如果不提供 `sources` 数组，前端会回退显示 `source` 字段的纯文本。

#### deep_dive 对象（可选，但 ≥4 星情报建议填写）

```json
{
  "underlying_logic": "SpaceX将xAI纳入IPO主体，体现马斯克对AI业务的战略重视...",
  "cross_boundary_links": "xAI合并将AI能力注入航天领域，可能催生卫星AI应用新场景...",
  "exploration_directions": [
    "关注Starlink盈利能力变化",
    "追踪xAI技术在航天领域的具体应用",
    "分析IPO定价对AI估值体系的影响"
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `underlying_logic` | string | 底层逻辑：技术/宏观原理分析，建议 ≥200 字 |
| `cross_boundary_links` | string | 跨界关联：连锁反应分析，建议 ≥200 字 |
| `exploration_directions` | string[] | 探索方向：可执行的行动建议列表 |

---

## 3. 添加新数据的完整流程

### 步骤 1：创建日期文件夹

在 `public/data/processed/` 下创建新文件夹，名称格式为 `YYYY-MM-DD`：

```bash
mkdir public/data/processed/2026-05-19
```

### 步骤 2：创建 daily_intelligence.json

在新建文件夹中创建 `daily_intelligence.json`，按照上述格式填写数据。

### 步骤 3：更新 history_index.json

在 `history_index.json` 中追加新日期：

```json
["2026-05-17", "2026-05-18", "2026-05-19"]
```

### 步骤 4：验证数据格式

确保 JSON 格式正确，所有必填字段已填写。

### 步骤 5：刷新页面查看

- **开发模式**：Vite 会自动热更新，刷新浏览器即可看到新数据
- **生产模式**：需要重新运行 `npm run build`

---

## 4. 自动化辅助脚本

### sync-index.js — 自动同步日期索引

在项目根目录创建 `scripts/sync-index.js`：

```javascript
import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../public/data/processed');

// 读取所有文件夹（排除文件）
const dirs = readdirSync(dataDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort(); // 按字母序排列（即日期升序）

// 写入索引文件
writeFileSync(
  join(dataDir, 'history_index.json'),
  JSON.stringify(dirs, null, 2) + '\n'
);

console.log(`✅ 已同步 ${dirs.length} 个日期: ${dirs.join(', ')}`);
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "sync-index": "node scripts/sync-index.js",
    "build": "node scripts/sync-index.js && vite build"
  }
}
```

使用方式：

```bash
# 手动同步索引
npm run sync-index

# 构建时自动同步
npm run build
```

---

## 5. 完整示例

### 示例：添加 2026-05-19 的数据

**1. 创建文件夹：**

```bash
mkdir -p public/data/processed/2026-05-19
```

**2. 创建 daily_intelligence.json：**

```json
{
  "date": "2026-05-19",
  "generated_at": "2026-05-19T10:00:00Z",
  "executive_briefing": "今日AI领域重点关注...",
  "charts": [
    {"id": "ipo_trend", "title": "IPO热度趋势", "path": "/assets/ipo_trend.png"}
  ],
  "intelligence_items": [
    {
      "id": "1",
      "title": "示例情报标题",
      "summary": "这是情报摘要...",
      "category": "AI & Tech",
      "source": "示例来源",
      "published_at": "2026-05-19T08:00:00Z",
      "importance": 5,
      "confidence_score": 90,
      "confidence_explanation": {
        "source_level": "一手官方数据",
        "cross_validation": "多个来源确认",
        "evidence_support": "有具体数据支撑"
      },
      "sources": [
        {"name": "来源A", "url": "https://example.com/a"},
        {"name": "来源B", "url": "https://example.com/b"}
      ],
      "deep_dive": {
        "underlying_logic": "底层逻辑分析...",
        "cross_boundary_links": "跨界关联分析...",
        "exploration_directions": ["行动建议1", "行动建议2"]
      }
    }
  ]
}
```

**3. 更新 history_index.json：**

```json
["2026-05-18", "2026-05-19"]
```

**4. 同步并构建（如果使用脚本）：**

```bash
npm run sync-index
npm run build
```

---

## 6. 常见问题

### Q: 日期文件夹名和 JSON 中的 date 字段不一致会怎样？
A: 前端以文件夹名为准加载数据，JSON 中的 `date` 字段仅用于显示。建议保持一致。

### Q: 可以删除旧日期数据吗？
A: 可以。删除文件夹后，务必同步更新 `history_index.json`。

### Q: sources 数组和 source 字段有什么区别？
A: `source` 是纯文本显示字段；`sources` 是结构化数组，用于生成可点击的链接标签。建议同时提供两者。

### Q: importance 和 confidence_score 的评分标准？

**importance（重要性）：**
- ⭐⭐⭐⭐⭐ (5): 行业重大事件，影响深远
- ⭐⭐⭐⭐ (4): 重要动态，值得关注
- ⭐⭐⭐ (3): 一般性新闻
- ⭐⭐ (2): 次要信息
- ⭐ (1): 参考信息

**confidence_score（置信度）：**
- 90-100%: 一手官方数据，多源交叉验证
- 70-89%: 主流媒体报道，有数据支撑
- 50-69%: 单一来源，待进一步验证
- <50%: 传闻或未经证实消息

---

## 7. TypeScript 类型定义参考

```typescript
// src/types/index.ts

export interface ConfidenceExplanation {
  source_level: string;
  cross_validation: string;
  evidence_support: string;
}

export interface DeepDive {
  underlying_logic: string;
  cross_boundary_links: string;
  exploration_directions: string[];
}

export interface Source {
  name: string;
  url: string;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  published_at: string;
  importance: number;
  confidence_score: number;
  confidence_explanation: ConfidenceExplanation;
  deep_dive?: DeepDive;
  sources?: Source[];
}

export interface ChartData {
  id: string;
  title: string;
  path: string;
}

export interface DailyIntelligence {
  date: string;
  generated_at: string;
  executive_briefing: string;
  charts: ChartData[];
  intelligence_items: IntelligenceItem[];
}
```