import { Target, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import type { IntelligenceItem } from '@/types';

interface ActionableInsightsProps {
  items: IntelligenceItem[];
}

function ActionableInsights({ items }: ActionableInsightsProps) {
  const highImportanceItems = items.filter(item => item.importance >= 4);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'IPO & Finance': 'from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/30',
      'AI & Tech': 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
      'Policy': 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
      'Finance': 'from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/30',
      'AI & Auto': 'from-neon-blue/20 to-neon-blue/5 border-neon-blue/30',
      'Legal': 'from-neon-red/20 to-neon-red/5 border-neon-red/30',
      'AI & Social': 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30',
      'AI & Hardware': 'from-teal-400/20 to-teal-400/5 border-teal-400/30',
      'AI & Web': 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
      'Open Source': 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
    };
    return colors[category] || 'from-text-muted/20 to-text-muted/5 border-text-muted/30';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-neon-green bg-neon-green/10';
    if (score >= 50) return 'text-neon-yellow bg-neon-yellow/10';
    return 'text-neon-red bg-neon-red/10';
  };

  const insights = highImportanceItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    actionable: item.deep_dive?.exploration_directions?.[0] || '暂无具体行动建议',
    confidence: item.confidence_score,
  }));

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 rounded-lg border border-neon-green/30">
          <Target className="w-5 h-5 text-neon-green" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">操作指南</h2>
          <span className="text-xs text-text-muted">Actionable Insights</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`bg-gradient-to-br ${getCategoryColor(insight.category)} backdrop-blur-sm rounded-xl border p-5 hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-cyber-dark/50 text-text-secondary rounded-full">
                {insight.category}
              </span>
              <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(insight.confidence)}`}>
                <CheckCircle className="w-3 h-3" />
                {insight.confidence}%
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-text-primary mb-3 line-clamp-2">
              {insight.title}
            </h3>
            
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 p-1.5 bg-neon-cyan/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-neon-cyan" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">
                  {insight.actionable}
                </p>
              </div>
            </div>
            
            <button className="mt-4 flex items-center gap-2 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors">
              <span>查看详情</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>暂无高优先级操作建议</p>
        </div>
      )}
    </section>
  );
}

export default ActionableInsights;
