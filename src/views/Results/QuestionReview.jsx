import { useState } from 'react'
import { MarkdownRenderer, TopicBadge } from '../../components/index.jsx'

export function QuestionReview({ summary, questions, topics }) {
  const [expanded, setExpanded] = useState(() => new Set(summary.missedQuestionIds ?? []))
  function toggle(id) { setExpanded(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n }) }
  const questionIds = summary.questionIds ?? []
  if (!questionIds.length) return <p style={{ fontSize:13, color:'var(--text-2)', textAlign:'center', padding:'24px 0' }}>No question data for this session.</p>
  return (
    <div>
      {questionIds.map(qId => {
        const question = questions.find(q => q.id === qId)
        if (!question) return null
        const isCorrect  = !(summary.missedQuestionIds ?? []).includes(qId)
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
                <div style={{ display:'flex', flexDirection:'column', gap:5, margin:'10px 0' }}>
                  {question.options.map(opt => {
                    const ok = opt.id === question.correctOptionId
                    return <div key={opt.id} className={`review-option ${ok?'correct':''}`}><div className={`review-opt-dot ${ok?'correct':''}`}/>{opt.text}</div>
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
