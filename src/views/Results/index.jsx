import { useState } from 'react'
import { QuestionReview } from './QuestionReview.jsx'
import { TopicBreakdown } from './TopicBreakdown.jsx'
import { EmptyState } from '../../components/index.jsx'

function formatDate(isoStr) {
  if (!isoStr) return ''
  return new Date(isoStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null
  const secs = Math.round((new Date(completedAt) - new Date(startedAt)) / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m} min ${s} sec` : `${s} sec`
}

function ScoreHero({ summary, subject }) {
  const { score } = summary
  const passed = score.pct >= subject.passThreshold

  return (
    <div style={{
      background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
      borderRadius: 12, padding: '20px 14px',
      textAlign: 'center', marginBottom: 10,
    }}>
      <div>
        <span style={{ fontSize: 48, fontWeight: 500, color: '#1a1a1a', lineHeight: 1 }}>
          {score.correct}
        </span>
        <span style={{ fontSize: 20, color: '#888' }}> / {score.total}</span>
      </div>
      <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
        {score.pct}%
        {summary.startedAt && summary.completedAt && (
          <> · {formatDuration(summary.startedAt, summary.completedAt)}</>
        )}
      </div>
      <div style={{
        display: 'inline-block', marginTop: 10,
        fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 500,
        background: passed ? '#eaf3de' : '#fcebeb',
        color: passed ? '#27500a' : '#791f1f',
      }}>
        {passed
          ? `Pass · above ${subject.passThreshold}%`
          : `Below pass mark of ${subject.passThreshold}%`}
      </div>
      <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>
        {summary.mode === 'exam' ? 'Exam mode' : 'Practice mode'}
        {summary.completedAt && ` · ${formatDate(summary.completedAt)}`}
      </div>
    </div>
  )
}

function StatCards({ summary }) {
  const stats = [
    { val: summary.score.correct, label: 'Correct',   color: '#1d9e75' },
    { val: summary.score.total - summary.score.correct, label: 'Incorrect', color: '#e24b4a' },
    { val: summary.score.total,   label: 'Total',     color: '#1a1a1a' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 10 }}>
      {stats.map(stat => (
        <div key={stat.label} style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: 8, padding: '10px 8px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: stat.color }}>{stat.val}</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function SessionPicker({ sessions, selectedId, onSelect }) {
  if (sessions.length <= 1) return null
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
        Session
      </div>
      <div style={{
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        {[...sessions].reverse().slice(0, 5).map((s, i, arr) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              padding: '10px 13px', cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none',
              background: s.id === selectedId ? '#f0eeea' : '#fff',
              color: s.id === selectedId ? '#1a1a1a' : '#666',
              fontWeight: s.id === selectedId ? 500 : 400,
            }}
            onMouseEnter={e => { if (s.id !== selectedId) e.currentTarget.style.background = '#f7f6f3' }}
            onMouseLeave={e => { if (s.id !== selectedId) e.currentTarget.style.background = '#fff' }}
          >
            <span>{formatDate(s.completedAt)}</span>
            <span style={{
              fontSize: 12, padding: '2px 8px', borderRadius: 20,
              background: s.score.pct >= 65 ? '#eaf3de' : '#fcebeb',
              color: s.score.pct >= 65 ? '#27500a' : '#791f1f',
            }}>
              {s.score.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Results({ subject, questions, sessions, onNavigate }) {
  const [selectedId, setSelectedId] = useState(
    () => sessions.length > 0 ? sessions[sessions.length - 1].id : null
  )
  const [activeTab, setActiveTab] = useState('summary')

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        title="No results yet"
        message="Complete a quiz session to see your results here."
        action="Start a quiz"
        onAction={() => onNavigate('quiz')}
      />
    )
  }

  const summary = sessions.find(s => s.id === selectedId) ?? sessions[sessions.length - 1]

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>

      <SessionPicker
        sessions={sessions}
        selectedId={summary.id}
        onSelect={id => { setSelectedId(id); setActiveTab('summary') }}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['summary', 'review'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, textAlign: 'center', padding: '7px 0', fontSize: 12,
            borderRadius: 8, border: '0.5px solid',
            borderColor: activeTab === tab ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
            background: activeTab === tab ? '#f0eeea' : '#fff',
            color: activeTab === tab ? '#1a1a1a' : '#888',
            fontWeight: activeTab === tab ? 500 : 400,
            cursor: 'pointer',
          }}>
            {tab === 'summary' ? 'Summary' : 'Review answers'}
          </div>
        ))}
      </div>

      {activeTab === 'summary' && (
        <>
          <ScoreHero summary={summary} subject={subject} />
          <StatCards summary={summary} />

          {summary.topicScores?.length > 1 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                By topic
              </div>
              <TopicBreakdown
                topicScores={summary.topicScores}
                topics={subject.topics}
                weakThreshold={subject.weakTopicThreshold}
              />
            </>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              onClick={() => setActiveTab('review')}
              style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, fontWeight: 500, color: '#1a1a1a', cursor: 'pointer' }}
            >
              Review answers
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#e6f1fb', fontSize: 13, fontWeight: 500, color: '#185fa5', cursor: 'pointer' }}
            >
              New session
            </button>
          </div>
        </>
      )}

      {activeTab === 'review' && (
        <QuestionReview
          summary={summary}
          questions={questions}
          topics={subject.topics}
        />
      )}

    </div>
  )
}
