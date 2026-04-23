import { useState } from 'react'
import { MarkdownRenderer, TopicBadge } from '../../components/index.jsx'

function barColor(pct, wt) {
  if (pct >= wt + 20) return 'var(--accent)'
  if (pct >= wt)      return 'var(--warn)'
  return 'var(--danger)'
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ResultsSummary({ summary, questions, topics, subject, onRetryMissed, onNewSession, onNavigate, onSavePrefs, onStudyTopic }) {
  const [tab, setTab] = useState('summary')
  const [expanded, setExpanded] = useState(() => new Set(summary.missedQuestionIds))
  const { score } = summary
  const passed = score.pct >= subject.passThreshold
  const weakTopic = summary.weakTopics.length === 1 ? topics.find(t => t.id === summary.weakTopics[0]) : null

  function toggle(id) { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="tab-row">
        {['summary','review'].map(t => <div key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t==='summary'?'Summary':'Review answers'}</div>)}
      </div>

      {tab === 'summary' && (
        <>
          <div className="score-hero">
            <div><span className="score-big">{score.correct}</span><span className="score-denom"> / {score.total}</span></div>
            <div className="score-pct">{score.pct}%</div>
            <div className={`score-badge ${passed?'pass':'fail'}`}>{passed ? `Pass · above ${subject.passThreshold}%` : `Below ${subject.passThreshold}% pass mark`}</div>
            <div className="score-meta">{formatDate(summary.completedAt)}</div>
          </div>

          <div className="stat-grid">
            <div className="stat-card"><div className="stat-val correct">{score.correct}</div><div className="stat-lbl">Correct</div></div>
            <div className="stat-card"><div className="stat-val wrong">{score.total - score.correct}</div><div className="stat-lbl">Incorrect</div></div>
            <div className="stat-card"><div className="stat-val">{score.total}</div><div className="stat-lbl">Total</div></div>
          </div>

          {summary.topicScores?.length > 1 && (
            <>
              <div className="section-label">By topic</div>
              <div className="card" style={{ padding: '4px 14px' }}>
                {summary.topicScores.map((ts, i) => {
                  const topic = topics.find(t => t.id === ts.topicId)
                  const color = barColor(ts.pct, subject.weakTopicThreshold)
                  return (
                    <div key={ts.topicId} className="breakdown-row">
                      <div style={{ flex: 1 }}>
                        <div className="breakdown-name">{topic?.title ?? ts.topicId}</div>
                        <div className="breakdown-count">{ts.correct}/{ts.total} correct</div>
                      </div>
                      {ts.pct < subject.weakTopicThreshold && <span className="needs-work">needs work</span>}
                      <div style={{ width: 64, flexShrink: 0 }}>
                        <div className="bar-track"><div className="bar-fill" style={{ width: `${ts.pct}%`, background: color }} /></div>
                        <div className="bar-pct" style={{ color }}>{ts.pct}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 8 }}>
            <button style={{ flex: 1 }} onClick={() => setTab('review')}>Review answers</button>
            {weakTopic && (
              <button className="btn-info" style={{ flex: 1 }} onClick={() => onStudyTopic(weakTopic.id)}>
                Study {weakTopic.title}
              </button>
            )}
            {summary.weakTopics.length > 1 && (
              <button className="btn-info" style={{ flex: 1 }} onClick={() => onStudyTopic(summary.weakTopics[0])}>
                Study weak topics
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {summary.missedQuestionIds.length > 0 && (
              <button style={{ flex: 1 }} onClick={() => onRetryMissed(summary.missedQuestionIds)}>Retry missed</button>
            )}
            <button style={{ flex: 1 }} onClick={onNewSession}>New session</button>
          </div>
        </>
      )}

      {tab === 'review' && summary.questionIds.map(qId => {
        const question = questions.find(q => q.id === qId)
        if (!question) return null
        const isCorrect = !summary.missedQuestionIds.includes(qId)
        const isExpanded = expanded.has(qId)
        return (
          <div key={qId} className="review-card">
            <div className="review-header" onClick={() => toggle(qId)}>
              <div className={`review-badge ${isCorrect?'correct':'wrong'}`}>{isCorrect?'✓':'✕'}</div>
              <div className="review-stem">{question.stem}</div>
              <div className="review-toggle">{isExpanded?'−':'+'}</div>
            </div>
            {isExpanded && (
              <div className="review-body">
                <TopicBadge topicId={question.topicId} topics={topics} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '10px 0' }}>
                  {question.options.map(opt => {
                    const isCorrectOpt = opt.id === question.correctOptionId
                    return (
                      <div key={opt.id} className={`review-option ${isCorrectOpt?'correct':''}`}>
                        <div className={`review-opt-dot ${isCorrectOpt?'correct':''}`} />
                        {opt.text}
                      </div>
                    )
                  })}
                </div>
                <div className="explanation-block">
                  <div className="explanation-label">Explanation</div>
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
