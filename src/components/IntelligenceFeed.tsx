import { useState } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp, AlertCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import type { IntelligenceItem } from '@/types';

interface IntelligenceFeedProps {
  items: IntelligenceItem[];
}

function IntelligenceFeed({ items }: IntelligenceFeedProps) {
  const [expandedDeepDive, setExpandedDeepDive] = useState<string | null>(null);
  const [expandedConfidence, setExpandedConfidence] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'IPO & Finance': 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
      'AI & Tech': 'bg-neon-green/20 text-neon-green border-neon-green/30',
      'Policy': 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      'Finance': 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
      'AI & Auto': 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
      'Legal': 'bg-neon-red/20 text-neon-red border-neon-red/30',
      'AI & Social': 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
      'AI & Hardware': 'bg-teal-400/20 text-teal-400 border-teal-400/30',
      'AI & Web': 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      'Open Source': 'bg-neon-green/20 text-neon-green border-neon-green/30',
    };
    return colors[category] || 'bg-text-muted/20 text-text-muted border-text-muted/30';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 50) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  const getConfidenceBarColor = (score: number) => {
    if (score >= 80) return 'bg-neon-green';
    if (score >= 50) return 'bg-neon-yellow';
    return 'bg-neon-red';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 rounded-lg border border-neon-pink/30">
            <Search className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">情报流</h2>
            <span className="text-xs text-text-muted">{items.length} 条情报</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article 
            key={item.id} 
            className="bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border/50 overflow-hidden transition-all duration-300 hover:border-neon-cyan/30"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-text-muted">{'⭐'.repeat(item.importance)}</span>
                </div>
                <span className="text-xs text-text-muted">{formatTime(item.published_at)}</span>
              </div>
              
              <h3 className="text-base font-semibold text-text-primary mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs text-text-muted">来源:</span>
                {item.sources?.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-cyber-dark/50 text-text-secondary rounded-md hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors"
                  >
                    {source.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )) || (
                  <span className="text-xs text-text-secondary">{item.source}</span>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setExpandedDeepDive(expandedDeepDive === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-3 bg-cyber-dark/30 rounded-lg hover:bg-cyber-dark/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-neon-yellow" />
                    <span className="text-sm font-medium text-text-primary">深入研究 Deep Dive</span>
                  </div>
                  {expandedDeepDive === item.id ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                
                {expandedDeepDive === item.id && item.deep_dive && (
                  <div className="ml-6 pl-4 border-l border-neon-yellow/30 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-neon-yellow uppercase tracking-wider mb-1">底层逻辑</h4>
                      <p className="text-sm text-text-secondary">{item.deep_dive.underlying_logic}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neon-yellow uppercase tracking-wider mb-1">跨界关联</h4>
                      <p className="text-sm text-text-secondary">{item.deep_dive.cross_boundary_links}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neon-yellow uppercase tracking-wider mb-2">探索方向</h4>
                      <ul className="space-y-1">
                        {item.deep_dive.exploration_directions.map((dir, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="text-neon-cyan mt-1">-</span>
                            {dir}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedConfidence(expandedConfidence === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-3 bg-cyber-dark/30 rounded-lg hover:bg-cyber-dark/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${getConfidenceColor(item.confidence_score)}`} />
                    <span className="text-sm font-medium text-text-primary">置信度评估</span>
                    <span className={`text-sm font-semibold ${getConfidenceColor(item.confidence_score)}`}>
                      {item.confidence_score}%
                    </span>
                  </div>
                  {expandedConfidence === item.id ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                
                {expandedConfidence === item.id && item.confidence_explanation && (
                  <div className="ml-6 pl-4 border-l border-neon-green/30 space-y-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-text-muted mb-1">
                        <span>置信度</span>
                        <span>{item.confidence_score}%</span>
                      </div>
                      <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getConfidenceBarColor(item.confidence_score)} transition-all duration-500`}
                          style={{ width: `${item.confidence_score}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-semibold text-text-primary">信源层级</h4>
                          <p className="text-sm text-text-secondary">{item.confidence_explanation.source_level}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-semibold text-text-primary">交叉验证</h4>
                          <p className="text-sm text-text-secondary">{item.confidence_explanation.cross_validation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-neon-yellow mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-semibold text-text-primary">证据支撑</h4>
                          <p className="text-sm text-text-secondary">{item.confidence_explanation.evidence_support}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default IntelligenceFeed;
