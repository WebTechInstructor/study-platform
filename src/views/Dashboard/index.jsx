import { useMemo } from 'react'

function computeStreak(sessions) {
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), dateStr: d.toISOString().slice(0,10), isToday: i === 0, studied: false })
  }
  sessions.forEach(s => { const day = days.find(d => d.dateStr === s.completedAt?.slice(0,10)); if (day) day.studied = true })
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].studied) streak++
    else if (i === days.length - 1) continue
    else break
  }
  return { days, streak }
}

function computeTopicScores(topics, questions, questionHistory) {
  return topics.map(topic => {
    const qs = questions.filter(q => q.topicId === topic.id)
    let correct = 0, attempted = 0, lastStudied = null
    qs.forEach(q => {
      const h = questionHistory[q.id]
      if (!h || !h.attempts.length) return
      attempted++
      const latest = h.attempts[h.attempts.length - 1]
      if (latest.correct) correct++
      if (!lastStudied || latest.answeredAt > lastStudied) lastStudied = latest.answeredAt
    })
    return { ...topic, pct: attempted > 0 ? Math.round((correct / attempted) * 100) : null, attempted, total: qs.length, lastStudied }
  })
}

function lastStudiedLabel(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'yesterday'
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
}

function barColor(pct, wt) {
  if (pct === null) return 'var(--text-3)'
  if (pct >= wt + 20) return 'var(--accent)'
  if (pct >= wt) return 'var(--warn)'
  return 'var(--danger)'
}

const MODES = [
  { id: 'quiz',       label: 'Quiz',       desc: 'Practice by topic',      bg: 'var(--info-bg)',   dot: 'var(--info)'   },
  { id: 'flashcards', label: 'Flashcards', desc: 'Flip and self-rate',     bg: 'var(--warn-bg)',   dot: 'var(--warn)'   },
  { id: 'media',      label: 'Media',      desc: 'Podcasts, maps, guides', bg: 'var(--accent-bg)', dot: 'var(--accent)' },
  { id: 'quiz',       label: 'Exam mode',  desc: 'Timed, full subject',    bg: 'var(--danger-bg)', dot: 'var(--danger)' },
]

export function Dashboard({ subject, questions, progress, sessions, onNavigate }) {
  const { days, streak } = useMemo(() => computeStreak(sessions), [sessions])
  const topicScores = useMemo(() => computeTopicScores(subject.topics, questions, progress.questionHistory), [subject.topics, questions, progress.questionHistory])
  const topLevel = topicScores.filter(t => !t.parentId)

  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>

      <div className="section-label">This week</div>
      <div className="streak-card">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 14 }}>
          <span className="streak-count">{streak}</span>
          <span className="streak-unit">day streak</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {days.map(day => (
            <div key={day.dateStr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`day-dot ${day.isToday ? 'today' : day.studied ? 'studied' : ''}`} />
              <div className="day-name">{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label">Start studying</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {MODES.map((m, i) => (
          <div key={i} className="mode-card" onClick={() => onNavigate(m.id)}>
            <div className="mode-icon" style={{ background: m.bg }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: m.dot }} />
            </div>
            <div className="mode-title">{m.label}</div>
            <div className="mode-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Topics</div>
      <div className="card" style={{ padding: '4px 14px' }}>
        {topLevel.map(topic => {
          const isWeak = topic.pct !== null && topic.pct < subject.weakTopicThreshold
          const color  = barColor(topic.pct, subject.weakTopicThreshold)
          const last   = lastStudiedLabel(topic.lastStudied)
          return (
            <div key={topic.id} className="topic-row" onClick={() => onNavigate('quiz')}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="topic-name">{topic.title}</div>
                <div className="topic-meta">{topic.total} questions{last ? ` · last studied ${last}` : ' · not started'}</div>
              </div>
              {isWeak && <span className="needs-work">needs work</span>}
              <div style={{ width: 60, flexShrink: 0 }}>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${topic.pct ?? 0}%`, background: color }} /></div>
                <div className="bar-pct" style={{ color: topic.pct !== null ? color : 'var(--text-3)' }}>{topic.pct !== null ? `${topic.pct}%` : '—'}</div>
              </div>
              <div style={{ fontSize: 16, color: 'var(--text-3)' }}>›</div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
