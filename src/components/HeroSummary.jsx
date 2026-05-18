import './HeroSummary.css'

function HeroSummary({ charts }) {
  return (
    <section className="hero-summary">
      <div className="section-header">
        <span className="section-icon">📈</span>
        <h2 className="section-title">数据看板</h2>
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart.id} className="chart-card">
            <div className="chart-placeholder">
              <div className="chart-icon">📊</div>
              <span className="chart-title">{chart.title}</span>
            </div>
            <div className="chart-content">
              <div className="mini-chart">
                <div className="chart-bar" style={{ height: '60%', animationDelay: '0s' }}></div>
                <div className="chart-bar" style={{ height: '85%', animationDelay: '0.1s' }}></div>
                <div className="chart-bar" style={{ height: '45%', animationDelay: '0.2s' }}></div>
                <div className="chart-bar" style={{ height: '90%', animationDelay: '0.3s' }}></div>
                <div className="chart-bar" style={{ height: '70%', animationDelay: '0.4s' }}></div>
                <div className="chart-bar" style={{ height: '95%', animationDelay: '0.5s' }}></div>
                <div className="chart-bar" style={{ height: '65%', animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroSummary