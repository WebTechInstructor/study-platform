import { useState } from 'react'
import { MarkdownRenderer } from '../../components/index.jsx'
import { TopicBadge } from '../../components/index.jsx'

export function QuestionReview({ summary, questions, topics }) {
  const [expanded, setExpanded] = useState(
    () => new Set(summary.missedQuestionIds ?? [])
  )

  function toggle(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const questionIds = summary.questionIds ?? []

  if (questionIds.length === 0) {
    return (
      <p style={{ fontSize: 13, color: '#888', textAlign: 'center', padding: '24px 0' }}>
        No question data available for this session.
      </p>
    )
  }

  return (
    <div>
      {questionIds.map(qId => {
        const question = questions.find(q => q.id === qId)
        if (!question) return null

        const isCorrect = !(summary.missedQuestionIds ?? []).includes(qId)
        const isExpanded = expanded.has(qId)

        return (
          <div key={qId} style={{
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
            borderRadius: 12, marginBottom: 8, overflow: 'hidden',
          }}>
            {/* Header row */}
            <div
              onClick={() => toggle(qId)}
              style={{
                display: 'flex', alignItems: 'flex-start',
                gap: 10, padding: '12px 13px', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f7f6f3'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 500,
                background: isCorrect ? '#eaf3de' : '#fcebeb',
                color:      isCorrect ? '#27500a' : '#791f1f',
              }}>
                {isCorrect ? '✓' : '✕'}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: '#1a1a1a', lineHeight: 1.4 }}>
                {question.stem}
              </div>
              <div style={{ fontSize: 12, color: '#ccc', flexShrink: 0 }}>
                {isExpanded ? '−' : '+'}
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 13px' }}>
                <TopicBadge topicId={question.topicId} topics={topics} />

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '10px 0' }}>
                  {question.options.map(opt => {
                    const isCorrectOpt = opt.id === question.correctOptionId
                    return (
                      <div key={opt.id} style={{
                        fontSize: 12, padding: '7px 10px', borderRadius: 8,
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: `0.5px solid ${isCorrectOpt ? '#97c459' : 'rgba(0,0,0,0.1)'}`,
                        background: isCorrectOpt ? '#eaf3de' : 'transparent',
                        color: isCorrectOpt ? '#27500a' : '#666',
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          background: isCorrectOpt ? '#639922' : '#d3d1c7',
                        }} />
                        {opt.text}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div style={{ padding: 10, background: '#f7f6f3', borderRadius: 8 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 500, color: '#888',
                    letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5,
                  }}>
                    Explanation
                  </div>
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
