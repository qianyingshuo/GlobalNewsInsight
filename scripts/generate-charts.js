import { execSync } from 'child_process';

const chartConfigs = [
  {
    tool: 'generate_bar_chart',
    args: {
      title: '2026年AI公司IPO估值排行榜',
      theme: 'dark',
      width: 800,
      height: 500,
      data: [
        { category: 'SpaceX/xAI', value: 1750 },
        { category: 'OpenAI', value: 1000 },
        { category: 'Anthropic', value: 900 },
        { category: 'Databricks', value: 134 },
        { category: 'Cerebras', value: 56 },
        { category: 'Stripe', value: 90 },
        { category: 'Anduril', value: 60 },
        { category: 'Sierra AI', value: 15 }
      ],
      axisYTitle: '估值 (十亿美元)',
      axisXTitle: '公司',
      style: {
        palette: ['#4F46E5', '#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6']
      }
    }
  },
  {
    tool: 'generate_line_chart',
    args: {
      title: '中国AI芯片自给率增长趋势 (2021-2030预测)',
      theme: 'dark',
      width: 800,
      height: 500,
      data: [
        { time: '2021', value: 10 },
        { time: '2022', value: 15 },
        { time: '2023', value: 20 },
        { time: '2024', value: 33 },
        { time: '2025', value: 41 },
        { time: '2026', value: 50 },
        { time: '2027', value: 60 },
        { time: '2028', value: 70 },
        { time: '2029', value: 78 },
        { time: '2030', value: 85 }
      ],
      axisXTitle: '年份',
      axisYTitle: '自给率 (%)',
      style: {
        lineWidth: 3,
        palette: ['#10B981']
      }
    }
  }
];

for (const chart of chartConfigs) {
  const payload = JSON.stringify(chart);
  console.log(`Generating: ${chart.args.title}`);
  try {
    const result = execSync(`node /data/user/skills/chart-visualization/scripts/generate.js '${payload.replace(/'/g, "\\'")}'`, {
      encoding: 'utf-8'
    });
    console.log(result);
  } catch (error) {
    console.error(`Error:`, error.message);
  }
  console.log('---');
}
