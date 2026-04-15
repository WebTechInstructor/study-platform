import { useMemo } from 'react'

function computeStreak(sessions) {
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: d.toISOString().slice(0, 10),
      isToday: i === 0,
      studied: false,
    })
  }
  sessions.forEach(s => {
    const dateStr = s.completedAt?.slice(0, 10)
    const day = days.find(d => d.dateStr === dateStr)
    if (day) day.studied = true
  })
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].studied) { streak++ }
    else if (i === days.length - 1) { continue }
    else { break }
  }
  return { days, streak }
}

function computeTopicScores(topics, questions, questionHistory) {
  return topics.map(topic => {
    const topicQs = questions.filter(q => q.topicId === topic.id)
    let correct = 0, attempted = 0, lastStudied = null
    topicQs.forEach(q => {
      const history = questionHistory[q.id]
      if (!history || history.attempts.length === 0) return
      attempted++
      const latest = history.attempts[history.attempts.length - 1]
      if (latest.correct) correct++
      if (!lastStudied || latest.answeredAt > lastStudied) lastStudied = latest.answeredAt
    })
    return {
      ...topic,
      pct: attempted > 0 ? Math.round((correct / attempted) * 100) : null,
      attempted,
      total: topicQs.length,
      lastStudied,
    }
  })
}

function lastStudiedLabel(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function barColor(pct, weakThreshold) {
  if (pct === null) return '#d3d1c7'
  if (pct >= weakThreshold + 20) return '#1d9e75'
  if (pct >= weakThreshold) return '#ba7517'
  return '#e24b4a'
}

const s = {
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: 14 },
  label: { fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
}

function StreakCard({ days, streak }) {
  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 32, fontWeight: 500, color: '#1a1a1a', lineHeight: 1 }}>{streak}</span>
        <span style={{ fontSize: 13, color: '#888' }}>day streak</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {days.map(day => (
          <div key={day.dateStr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: day.isToday ? '#e6f1fb' : day.studied ? '#eaf3de' : '#f0eeea',
              border: `0.5px solid ${day.isToday ? '#85b7eb' : day.studied ? '#97c459' : '#d3d1c7'}`,
            }} />
            <span style={{ fontSize: 10, color: '#888' }}>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StudyModeGrid({ onNavigate }) {
  const modes = [
    { id: 'quiz',       label: 'Quiz',       desc: 'Practice by topic',      bg: '#e6f1fb', dot: '#378add' },
    { id: 'flashcards', label: 'Flashcards', desc: 'Flip and self-rate',     bg: '#faeeda', dot: '#ba7517' },
    { id: 'media',      label: 'Media',      desc: 'Podcasts, maps, guides', bg: '#eaf3de', dot: '#639922' },
    { id: 'quiz',       label: 'Exam mode',  desc: 'Timed, full subject',    bg: '#fcebeb', dot: '#e24b4a' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {modes.map((mode, i) => (
        <div key={i} onClick={() => onNavigate(mode.id)}
          style={{ ...s.card, cursor: 'pointer', padding: '12px 13px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f7f6f3'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <div style={{ width: 24, height: 24, borderRadius: 6, background: mode.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: mode.dot }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 2 }}>{mode.label}</div>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>{mode.desc}</div>
        </div>
      ))}
    </div>
  )
}

function TopicList({ topicScores, weakThreshold, onNavigate }) {
  const topLevel = topicScores.filter(t => !t.parentId)
  return (
    <div style={s.card}>
      {topLevel.map((topic, i) => {
        const isWeak = topic.pct !== null && topic.pct < weakThreshold
        const color = barColor(topic.pct, weakThreshold)
        const last = lastStudiedLabel(topic.lastStudied)
        return (
          <div key={topic.id}
            onClick={() => onNavigate('quiz')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < topLevel.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 2 }}>{topic.title}</div>
              <div style={{ fontSize: 11, color: '#888' }}>
                {topic.total} questions{last ? ` · last studied ${last}` : ' · not started'}
              </div>
            </div>
            {isWeak && (
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 20, background: '#fcebeb', color: '#a32d2d', flexShrink: 0 }}>
                needs work
              </span>
            )}
            <div style={{ width: 60, flexShrink: 0 }}>
              <div style={{ height: 4, background: '#f0eeea', borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${topic.pct ?? 0}%`, background: color, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: 11, color: topic.pct !== null ? color : '#888', textAlign: 'right' }}>
                {topic.pct !== null ? `${topic.pct}%` : '—'}
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#ccc', flexShrink: 0 }}>›</div>
          </div>
        )
      })}
    </div>
  )
}

export function Dashboard({ subject, questions, progress, sessions, onNavigate }) {
  const { days, streak } = useMemo(() => computeStreak(sessions), [sessions])
  const topicScores = useMemo(
    () => computeTopicScores(subject.topics, questions, progress.questionHistory),
    [subject.topics, questions, progress.questionHistory]
  )

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <div style={s.label}>This week</div>
      <StreakCard days={days} streak={streak} />
      <div style={s.label}>Start studying</div>
      <StudyModeGrid onNavigate={onNavigate} />
      <div style={s.label}>Topics</div>
      <TopicList topicScores={topicScores} weakThreshold={subject.weakTopicThreshold} onNavigate={onNavigate} />
    </div>
  )
}
