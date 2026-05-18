import { useState, useEffect } from 'react'
import HistoryTimeline from './components/HistoryTimeline'
import ExecutiveBriefing from './components/ExecutiveBriefing'
import HeroSummary from './components/HeroSummary'
import IntelligenceFeed from './components/IntelligenceFeed'
import ActionableInsights from './components/ActionableInsights'

function App() {
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [intelligenceData, setIntelligenceData] = useState(null)
  const [loading, setLoading] = useState(true)

  const BASE = import.meta.env.BASE_URL || '/'

  useEffect(() => {
    fetch(`${BASE}data/processed/history_index.json`)
      .then(res => res.json())
      .then(data => {
        setDates(data)
        if (data.length > 0) {
          setSelectedDate(data[data.length - 1])
        }
      })
      .catch(err => console.error('Failed to load dates:', err))
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setLoading(true)
      fetch(`${BASE}data/processed/${selectedDate}/daily_intelligence.json`)
        .then(res => res.json())
        .then(data => {
          setIntelligenceData(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load intelligence data:', err)
          setLoading(false)
        })
    }
  }, [selectedDate])

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">IntelCenter</span>
          </div>
          <div className="date-badge">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '选择日期'}
          </div>
        </div>
        <HistoryTimeline 
          dates={dates} 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
      </aside>

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在加载情报数据...</p>
          </div>
        ) : intelligenceData ? (
          <>
            <ExecutiveBriefing briefing={intelligenceData.executive_briefing} />
            <HeroSummary charts={intelligenceData.charts} />
            <IntelligenceFeed items={intelligenceData.intelligence_items} />
            <ActionableInsights items={intelligenceData.intelligence_items} />
          </>
        ) : (
          <div className="empty-state">
            <p>暂无数据，请选择其他日期</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App