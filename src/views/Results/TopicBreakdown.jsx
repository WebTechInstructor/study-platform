function barColor(pct, wt) {
  if (pct >= wt + 20) return 'var(--accent)'
  if (pct >= wt)      return 'var(--warn)'
  return 'var(--danger)'
}
export function TopicBreakdown({ topicScores, topics, weakThreshold }) {
  if (!topicScores?.length) return null
  return (
    <div className="card" style={{ padding:'4px 14px', marginBottom:10 }}>
      {topicScores.map((ts, i) => {
        const topic = topics.find(t => t.id === ts.topicId)
        const color = barColor(ts.pct, weakThreshold)
        return (
          <div key={ts.topicId} className="breakdown-row">
            <div style={{ flex:1 }}>
              <div className="breakdown-name">{topic?.title ?? ts.topicId}</div>
              <div className="breakdown-count">{ts.correct} of {ts.total} correct</div>
            </div>
            {ts.pct < weakThreshold && <span className="needs-work">needs work</span>}
            <div style={{ width:64, flexShrink:0 }}>
              <div className="bar-track"><div className="bar-fill" style={{ width:`${ts.pct}%`, background:color }} /></div>
              <div className="bar-pct" style={{ color }}>{ts.pct}%</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
