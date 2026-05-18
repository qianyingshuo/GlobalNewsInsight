import { Activity, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const ipoTrendData = [
  { month: '1月', value: 45 },
  { month: '2月', value: 52 },
  { month: '3月', value: 38 },
  { month: '4月', value: 68 },
  { month: '5月', value: 85 },
  { month: '6月', value: 95 },
];

const aiMarketShareData = [
  { subject: 'Anthropic', A: 34.4, fullMark: 100 },
  { subject: 'OpenAI', A: 32.1, fullMark: 100 },
  { subject: 'Google', A: 18.5, fullMark: 100 },
  { subject: 'Meta', A: 10.2, fullMark: 100 },
  { subject: 'Others', A: 4.8, fullMark: 100 },
];

interface HeroSummaryProps {
  charts: { id: string; title: string; path: string }[];
}

function HeroSummary({ charts }: HeroSummaryProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { month: string } }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-border rounded-lg">
          <p className="text-text-secondary text-xs">{payload[0].payload.month}</p>
          <p className="text-text-primary font-semibold">{payload[0].value} 起</p>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload }: { active?: boolean; payload?: { subject: string; A: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-border rounded-lg">
          <p className="text-text-secondary text-xs">{payload[0].subject}</p>
          <p className="text-text-primary font-semibold">{payload[0].A}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg border border-neon-blue/30">
          <Activity className="w-5 h-5 text-neon-blue" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">数据看板</h2>
          <span className="text-xs text-text-muted">Analytics Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">{charts.find(c => c.id === 'ipo_trend')?.title || 'IPO热度趋势'}</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ipoTrendData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4facfe" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00f2fe"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-neon-purple" />
            <h3 className="text-sm font-semibold text-text-primary">{charts.find(c => c.id === 'ai_market_share')?.title || 'AI市场份额'}</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={aiMarketShareData}>
                <PolarGrid stroke="#1e1e2e" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 40]} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name="市场份额"
                  dataKey="A"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-lg p-4 border border-neon-cyan/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-text-muted">IPO数量</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">15</p>
          <span className="text-xs text-neon-green">+23% 较昨日</span>
        </div>
        
        <div className="bg-gradient-to-br from-neon-purple/10 to-transparent rounded-lg p-4 border border-neon-purple/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-text-muted">AI融资</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">$300亿</p>
          <span className="text-xs text-neon-green">+45% 较上周</span>
        </div>
        
        <div className="bg-gradient-to-br from-neon-yellow/10 to-transparent rounded-lg p-4 border border-neon-yellow/20">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-neon-yellow" />
            <span className="text-xs text-text-muted">情报条目</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">15</p>
          <span className="text-xs text-neon-green">+5 较昨日</span>
        </div>
        
        <div className="bg-gradient-to-br from-neon-green/10 to-transparent rounded-lg p-4 border border-neon-green/20">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-text-muted">平均置信度</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">92%</p>
          <span className="text-xs text-neon-green">+3% 较昨日</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSummary;
