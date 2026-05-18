import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Zap } from 'lucide-react';

interface ExecutiveBriefingProps {
  briefing: string;
}

function ExecutiveBriefing({ briefing }: ExecutiveBriefingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!briefing) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < briefing.length) {
        setDisplayedText(briefing.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [briefing]);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 rounded-lg border border-neon-cyan/30">
          <FileText className="w-5 h-5 text-neon-cyan" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary">高管简报</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Executive Briefing</span>
            <div className="flex items-center gap-1 text-neon-green">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs">实时更新</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-blue/5 rounded-xl" />
        
        <div className="relative p-6 bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border/50">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-neon-purple/10 rounded-lg border border-neon-purple/30">
              <TrendingUp className="w-6 h-6 text-neon-purple" />
            </div>
            
            <div className="flex-1">
              <p className="text-text-primary leading-relaxed text-base">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-2 h-5 ml-1 bg-neon-cyan animate-pulse" />
                )}
              </p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cyber-border/50">
                <div className="flex items-center gap-2 text-text-muted">
                  <Zap className="w-4 h-4 text-neon-yellow" />
                  <span className="text-xs">AI 生成摘要</span>
                </div>
                <span className="text-xs text-text-muted">
                  最后更新: {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExecutiveBriefing;
