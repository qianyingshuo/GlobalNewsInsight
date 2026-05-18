import { useState } from 'react'
import './IntelligenceFeed.css'

function IntelligenceFeed({ items }) {
  const [expandedDeepDive, setExpandedDeepDive] = useState(null)
  const [expandedConfidence, setExpandedConfidence] = useState(null)

  const getCategoryColor = (category) => {
    const colors = {
      'IPO & Finance': '#f59e0b',
      'AI & Tech': '#10b981',
      'Policy': '#8b5cf6',
      'Finance': '#f59e0b',
      'AI & Auto': '#3b82f6',
      'Legal': '#ef4444',
      'AI & Social': '#ec4899',
      'AI & Hardware': '#14b8a6',
      'AI & Web': '#8b5cf6',
      'Open Source': '#10b981'
    }
    return colors[category] || '#64748b'
  }

  const getConfidenceColor = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#f59e0b'
    return '#ef4444'
  }

  const getStars = (importance) => {
    return '⭐'.repeat(importance)
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <section className="intelligence-feed">
      <div className="section-header">
        <span className="section-icon">🔍</span>
        <h2 className="section-title">情报流</h2>
        <span className="section-count">{items.length} 条情报</span>
      </div>
      <div className="feed-list">
        {items.map((item) => (
          <article key={item.id} className="intelligence-card">
            <div className="card-header">
              <div className="category-tag" style={{ backgroundColor: getCategoryColor(item.category) }}>
                {item.category}
              </div>
              <div className="importance-stars">{getStars(item.importance)}</div>
              <span className="publish-time">{formatTime(item.published_at)}</span>
            </div>
            <h3 className="card-title">{item.title}</h3>
            <p className="card-summary">{item.summary}</p>
            <div className="card-source">来源: {item.source}</div>
            
            <div className="card-accordions">
              <button 
                className={`accordion-button ${expandedDeepDive === item.id ? 'expanded' : ''}`}
                onClick={() => setExpandedDeepDive(expandedDeepDive === item.id ? null : item.id)}
              >
                <span className="accordion-icon">🔘</span>
                <span className="accordion-label">深入研究 Deep Dive</span>
                <span className="accordion-arrow">{expandedDeepDive === item.id ? '▲' : '▼'}</span>
              </button>
              {expandedDeepDive === item.id && item.deep_dive && (
                <div className="accordion-content">
                  <div className="deep-dive-section">
                    <h4>底层逻辑</h4>
                    <p>{item.deep_dive.underlying_logic}</p>
                  </div>
                  <div className="deep-dive-section">
                    <h4>跨界关联</h4>
                    <p>{item.deep_dive.cross_boundary_links}</p>
                  </div>
                  <div className="deep-dive-section">
                    <h4>探索方向</h4>
                    <ul>
                      {item.deep_dive.exploration_directions.map((dir, idx) => (
                        <li key={idx}>{dir}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <button 
                className={`accordion-button ${expandedConfidence === item.id ? 'expanded' : ''}`}
                onClick={() => setExpandedConfidence(expandedConfidence === item.id ? null : item.id)}
              >
                <span className="accordion-icon">🛡️</span>
                <span className="accordion-label">置信度评估</span>
                <span className="confidence-score" style={{ color: getConfidenceColor(item.confidence_score) }}>
                  {item.confidence_score}%
                </span>
                <span className="accordion-arrow">{expandedConfidence === item.id ? '▲' : '▼'}</span>
              </button>
              {expandedConfidence === item.id && item.confidence_explanation && (
                <div className="accordion-content confidence-content">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ 
                        width: `${item.confidence_score}%`,
                        backgroundColor: getConfidenceColor(item.confidence_score)
                      }}
                    ></div>
                  </div>
                  <div className="confidence-details">
                    <div className="confidence-item">
                      <span className="confidence-label">信源层级</span>
                      <span className="confidence-value">{item.confidence_explanation.source_level}</span>
                    </div>
                    <div className="confidence-item">
                      <span className="confidence-label">交叉验证</span>
                      <span className="confidence-value">{item.confidence_explanation.cross_validation}</span>
                    </div>
                    <div className="confidence-item">
                      <span className="confidence-label">证据支撑</span>
                      <span className="confidence-value">{item.confidence_explanation.evidence_support}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default IntelligenceFeed