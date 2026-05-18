import './HistoryTimeline.css'

function HistoryTimeline({ dates, selectedDate, onDateSelect }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDayOfWeek = (dateStr) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const date = new Date(dateStr)
    return days[date.getDay()]
  }

  return (
    <div className="timeline-container">
      <h3 className="timeline-title">📅 历史记录</h3>
      <div className="timeline-list">
        {dates.length === 0 ? (
          <p className="empty-timeline">暂无历史数据</p>
        ) : (
          dates.map((date, index) => (
            <button
              key={date}
              className={`timeline-item ${selectedDate === date ? 'active' : ''}`}
              onClick={() => onDateSelect(date)}
            >
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <span className="timeline-date">{formatDate(date)}</span>
                <span className="timeline-day">{getDayOfWeek(date)}</span>
              </div>
              {index === dates.length - 1 && selectedDate === date && (
                <span className="timeline-badge">最新</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default HistoryTimeline