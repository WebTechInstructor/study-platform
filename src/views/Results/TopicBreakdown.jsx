function barColor(pct, weakThreshold) {
  if (pct >= weakThreshold + 20) return '#1d9e75'
  if (pct >= weakThreshold)      return '#ba7517'
  return '#e24b4a'
}

export function TopicBreakdown({ topicScores, topics, weakThreshold }) {
  if (!topicScores || topicScores.length === 0) return null

  return (
    <div style={{
      background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
      borderRadius: 12, padding: '12px 14px', marginBottom: 10,
    }}>
      {topicScores.map((ts, i) => {
        const topic = topics.find(t => t.id === ts.topicId)
        const color = barColor(ts.pct, weakThreshold)
        const isWeak = ts.pct < weakThreshold

        return (
          <div key={ts.topicId} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0',
            borderBottom: i < topicScores.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                {topic?.title ?? ts.topicId}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
                {ts.correct} of {ts.total} correct
              </div>
            </div>

            {isWeak && (
              <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 20,
                background: '#fcebeb', color: '#a32d2d', flexShrink: 0,
              }}>
                needs work
              </span>
            )}

            <div style={{ width: 64, flexShrink: 0 }}>
              <div style={{
                height: 4, background: '#f0eeea',
                borderRadius: 2, overflow: 'hidden', marginBottom: 3,
              }}>
                <div style={{
                  height: '100%', width: `${ts.pct}%`,
                  background: color, borderRadius: 2,
                }} />
              </div>
              <div style={{ fontSize: 11, color, textAlign: 'right' }}>{ts.pct}%</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
