import { useState } from 'react'
import { MarkdownRenderer } from '../../components/index.jsx'
import { TopicBadge } from '../../components/index.jsx'

function barColor(pct, passThreshold) {
  if (pct >= passThreshold) return '#1d9e75'
  if (pct >= passThreshold - 20) return '#ba7517'
  return '#e24b4a'
}

function ScoreSummary({ summary, subject }) {
  const { score } = summary
  const passed = score.pct >= subject.passThreshold
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '20px 14px', textAlign: 'center', marginBottom: 10 }}>
      <div>
        <span style={{ fontSize: 48, fontWeight: 500, color: '#1a1a1a', lineHeight: 1 }}>{score.correct}</span>
        <span style={{ fontSize: 20, color: '#888' }}> / {score.total}</span>
      </div>
      <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>{score.pct}%</div>
      <div style={{
        display: 'inline-block', marginTop: 10, fontSize: 12, padding: '3px 12px',
        borderRadius: 20, fontWeight: 500,
        background: passed ? '#eaf3de' : '#fcebeb',
        color: passed ? '#27500a' : '#791f1f',
      }}>
        {passed ? `Pass · above ${subject.passThreshold}%` : `Below pass mark of ${subject.passThreshold}%`}
      </div>
    </div>
  )
}

function TopicBreakdown({ topicScores, topics, passThreshold }) {
  if (topicScores.length === 0) return null
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
      {topicScores.map((ts, i) => {
        const topic = topics.find(t => t.id === ts.topicId)
        const color = barColor(ts.pct, passThreshold)
        return (
          <div key={ts.topicId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < topicScores.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }}>
            <div style={{ flex: 1, fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>
              {topic?.title ?? ts.topicId}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>{ts.correct}/{ts.total}</div>
            <div style={{ width: 60, flexShrink: 0 }}>
              <div style={{ height: 4, background: '#f0eeea', borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
                <div style={{ height: '100%', width: `${ts.pct}%`, background: color, borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 11, color, textAlign: 'right' }}>{ts.pct}%</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function QuestionReview({ summary, questions, topics }) {
  const [expanded, setExpanded] = useState(
    () => new Set(summary.missedQuestionIds)
  )

  function toggle(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div>
      {summary.questionIds.map(qId => {
        const result = { correct: !summary.missedQuestionIds.includes(qId) }
        const question = questions.find(q => q.id === qId)
        if (!question) return null
        const isExpanded = expanded.has(qId)

        return (
          <div key={qId} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
            <div
              onClick={() => toggle(qId)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 13px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f7f6f3'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500,
                background: result.correct ? '#eaf3de' : '#fcebeb',
                color:      result.correct ? '#27500a' : '#791f1f',
              }}>
                {result.correct ? '✓' : '✕'}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: '#1a1a1a', lineHeight: 1.4 }}>{question.stem}</div>
              <div style={{ fontSize: 12, color: '#ccc', flexShrink: 0 }}>{isExpanded ? '−' : '+'}</div>
            </div>

            {isExpanded && (
              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 13px' }}>
                <TopicBadge topicId={question.topicId} topics={topics} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '10px 0' }}>
                  {question.options.map(opt => {
                    const isCorrect = opt.id === question.correctOptionId
                    return (
                      <div key={opt.id} style={{
                        fontSize: 12, padding: '7px 10px', borderRadius: 8,
                        border: `0.5px solid ${isCorrect ? '#97c459' : 'rgba(0,0,0,0.1)'}`,
                        background: isCorrect ? '#eaf3de' : 'transparent',
                        color: isCorrect ? '#27500a' : '#666',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: isCorrect ? '#639922' : '#d3d1c7' }} />
                        {opt.text}
                      </div>
                    )
                  })}
                </div>
                <div style={{ padding: 10, background: '#f7f6f3', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>Explanation</div>
                  <MarkdownRenderer content={question.explanation} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ResultsSummary({ summary, questions, topics, subject, onRetryMissed, onNewSession, onNavigate }) {
  const [activeTab, setActiveTab] = useState('summary')

  const weakTopic = summary.weakTopics.length === 1
    ? topics.find(t => t.id === summary.weakTopics[0])
    : null

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>

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
          <ScoreSummary summary={summary} subject={subject} />

          {summary.topicScores.length > 1 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>By topic</div>
              <TopicBreakdown topicScores={summary.topicScores} topics={topics} passThreshold={subject.passThreshold} />
            </>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => setActiveTab('review')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, fontWeight: 500, color: '#1a1a1a', cursor: 'pointer' }}>
              Review answers
            </button>
            {weakTopic && (
              <button onClick={() => onNavigate('quiz')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#e6f1fb', fontSize: 13, fontWeight: 500, color: '#185fa5', cursor: 'pointer' }}>
                Study {weakTopic.title}
              </button>
            )}
            {summary.weakTopics.length > 1 && (
              <button onClick={() => onNavigate('quiz')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#e6f1fb', fontSize: 13, fontWeight: 500, color: '#185fa5', cursor: 'pointer' }}>
                Study weak topics
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {summary.missedQuestionIds.length > 0 && (
              <button onClick={() => onRetryMissed(summary.missedQuestionIds)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, color: '#1a1a1a', cursor: 'pointer' }}>
                Retry missed
              </button>
            )}
            <button onClick={onNewSession} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, color: '#1a1a1a', cursor: 'pointer' }}>
              New session
            </button>
          </div>
        </>
      )}

      {activeTab === 'review' && (
        <QuestionReview summary={summary} questions={questions} topics={topics} />
      )}

    </div>
  )
}
