import './ActionableInsights.css'

function ActionableInsights({ items }) {
  const highImportanceItems = items.filter(item => item.importance >= 4)
  
  const insights = highImportanceItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    actionable: item.deep_dive?.exploration_directions?.[0] || '暂无具体行动建议',
    confidence: item.confidence_score
  }))

  return (
    <section className="actionable-insights">
      <div className="section-header">
        <span className="section-icon">🎯</span>
        <h2 className="section-title">操作指南</h2>
        <span className="section-badge">Actionable Insights</span>
      </div>
      <div className="insights-grid">
        {insights.map((insight) => (
          <div key={insight.id} className="insight-card">
            <div className="insight-header">
              <span className="insight-category">{insight.category}</span>
              <span className="insight-confidence">
                <span className="confidence-icon">✓</span>
                {insight.confidence}%
              </span>
            </div>
            <h3 className="insight-title">{insight.title}</h3>
            <p className="insight-action">
              <span className="action-icon">💡</span>
              {insight.actionable}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ActionableInsights