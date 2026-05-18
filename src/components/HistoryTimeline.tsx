import { Clock, Calendar } from 'lucide-react';

interface HistoryTimelineProps {
  dates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

function HistoryTimeline({ dates, selectedDate, onDateSelect }: HistoryTimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDayOfWeek = (dateStr: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return today === dateStr;
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-neon-cyan" />
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          历史记录
        </h3>
      </div>
      
      {dates.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-sm">
          暂无历史数据
        </div>
      ) : (
        <div className="space-y-1">
          {dates.map((date, index) => {
            const isSelected = selectedDate === date;
            const isLatest = index === dates.length - 1;
            
            return (
              <button
                key={date}
                onClick={() => onDateSelect(date)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-blue/10 border-glow animate-pulse-glow' 
                    : 'hover:bg-cyber-card/50 border border-transparent hover:border-cyber-border'
                  }
                `}
              >
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${isSelected ? 'bg-neon-cyan w-3 h-3' : 'bg-text-muted'}
                `} />
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isSelected ? 'text-neon-cyan' : 'text-text-primary'}`}>
                      {formatDate(date)}
                    </span>
                    {isLatest && isSelected && (
                      <span className="px-2 py-0.5 text-xs bg-neon-cyan/20 text-neon-cyan rounded-full">
                        最新
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted">
                    {getDayOfWeek(date)}
                    {isToday(date) && <span className="text-neon-green ml-1">• 今日</span>}
                  </span>
                </div>
                
                <Clock className={`w-4 h-4 transition-colors ${isSelected ? 'text-neon-cyan' : 'text-text-muted'}`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryTimeline;
