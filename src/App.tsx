import { useState, useEffect } from 'react';
import { Activity, Clock, Globe } from 'lucide-react';
import HistoryTimeline from '@/components/HistoryTimeline';
import ExecutiveBriefing from '@/components/ExecutiveBriefing';
import HeroSummary from '@/components/HeroSummary';
import IntelligenceFeed from '@/components/IntelligenceFeed';
import ActionableInsights from '@/components/ActionableInsights';
import type { DailyIntelligence } from '@/types';

function App() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [intelligenceData, setIntelligenceData] = useState<DailyIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const BASE = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`${BASE}data/processed/history_index.json`)
      .then(res => res.json())
      .then(data => {
        setDates(data);
        if (data.length > 0) {
          setSelectedDate(data[data.length - 1]);
        }
      })
      .catch(err => console.error('Failed to load dates:', err));
  }, [BASE]);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      fetch(`${BASE}data/processed/${selectedDate}/daily_intelligence.json`)
        .then(res => res.json())
        .then(data => {
          setIntelligenceData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load intelligence data:', err);
          setLoading(false);
        });
    }
  }, [selectedDate, BASE]);

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-gradient-to-b from-cyber-dark to-cyber-darker border-r border-cyber-border/50 flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto">
        <div className="p-5 border-b border-cyber-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 rounded-xl border border-neon-cyan/30">
              <Activity className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-cyan">IntelCenter</h1>
              <p className="text-xs text-text-muted">AI Intelligence Hub</p>
            </div>
          </div>
          
          <div className="bg-cyber-card/50 rounded-lg p-3 border border-cyber-border/50">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>当前时间</span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              {currentTime.toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          
          <div className="mt-3 bg-cyber-card/50 rounded-lg p-3 border border-cyber-border/50">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>数据时间窗口</span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              过去 30 小时
            </p>
          </div>
        </div>

        <HistoryTimeline 
          dates={dates} 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />

        <div className="mt-auto p-4 border-t border-cyber-border/50">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span>实时同步中</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-6 lg:p-8 min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-cyber-border rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-3 border-neon-cyan/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            </div>
            <p className="mt-4 text-text-muted">正在加载情报数据...</p>
          </div>
        ) : intelligenceData ? (
          <>
            <ExecutiveBriefing briefing={intelligenceData.executive_briefing} />
            <HeroSummary charts={intelligenceData.charts} />
            <IntelligenceFeed items={intelligenceData.intelligence_items} />
            <ActionableInsights items={intelligenceData.intelligence_items} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-text-muted">暂无数据，请选择其他日期</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
