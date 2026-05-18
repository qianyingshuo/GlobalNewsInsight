import './ExecutiveBriefing.css'

function ExecutiveBriefing({ briefing }) {
  return (
    <section className="executive-briefing">
      <div className="section-header">
        <span className="section-icon">📊</span>
        <h2 className="section-title">高管简报</h2>
        <span className="section-badge">Executive Briefing</span>
      </div>
      <div className="briefing-content">
        <p className="briefing-text">{briefing}</p>
      </div>
    </section>
  )
}

export default ExecutiveBriefing