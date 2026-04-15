import { useState, useCallback, useMemo } from 'react'
import { FlashCard } from './FlashCard.jsx'
import { evaluateAnswer } from '../../engine/evaluateAnswer.js'
import { EmptyState } from '../../components/index.jsx'

function generateSessionId() {
  return 'flash-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
}

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function SessionComplete({ gotIt, missed, onRestart, onReview, onNavigate }) {
  const total = gotIt + missed
  const pct = total > 0 ? Math.round((gotIt / total) * 100) : 0

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '24px 14px', textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 48, fontWeight: 500, color: '#1a1a1a', lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>got it this session</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#1d9e75' }}>{gotIt}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Got it</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#e24b4a' }}>{missed}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Missed</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a' }}>{total}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Total</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={onRestart} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, fontWeight: 500, color: '#1a1a1a', cursor: 'pointer' }}>
          Shuffle again
        </button>
        {missed > 0 && (
          <button onClick={onReview} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#e6f1fb', fontSize: 13, fontWeight: 500, color: '#185fa5', cursor: 'pointer' }}>
            Review missed ({missed})
          </button>
        )}
      </div>
      <button onClick={() => onNavigate('dashboard')} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, color: '#1a1a1a', cursor: 'pointer' }}>
        Back to dashboard
      </button>
    </div>
  )
}

function StatsBar({ gotIt, missed, remaining }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 14 }}>
      {[
        { val: gotIt,     label: 'Got it',    color: '#1d9e75' },
        { val: missed,    label: 'Missed',    color: '#e24b4a' },
        { val: remaining, label: 'Remaining', color: '#1a1a1a' },
      ].map(stat => (
        <div key={stat.label} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: stat.color }}>{stat.val}</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export function Flashcards({ subject, questions, onSaveAttempt, onNavigate }) {
  const [sessionId]    = useState(generateSessionId)
  const [deck,  setDeck]  = useState(() => shuffle(questions))
  const [index, setIndex] = useState(0)
  const [gotIt,  setGotIt]  = useState(0)
  const [missed, setMissed] = useState(0)
  const [phase, setPhase]   = useState('active') // 'active' | 'complete'
  const [missedCards, setMissedCards] = useState([])

  const remaining = deck.length - index

  const handleGotIt = useCallback(() => {
    const question = deck[index]
    // Record as correct — use correctOptionId as selectedOptionId
    const result = evaluateAnswer(question, question.correctOptionId)
    onSaveAttempt(result, sessionId)
    setGotIt(n => n + 1)
    if (index + 1 >= deck.length) {
      setPhase('complete')
    } else {
      setIndex(i => i + 1)
    }
  }, [deck, index, sessionId, onSaveAttempt])

  const handleMissedIt = useCallback(() => {
    const question = deck[index]
    // Record as wrong — use a dummy wrong answer
    const wrongOptionId = question.options.find(o => o.id !== question.correctOptionId)?.id ?? 'x'
    const result = evaluateAnswer(question, wrongOptionId)
    onSaveAttempt(result, sessionId)
    setMissed(n => n + 1)
    setMissedCards(prev => [...prev, question])
    if (index + 1 >= deck.length) {
      setPhase('complete')
    } else {
      setIndex(i => i + 1)
    }
  }, [deck, index, sessionId, onSaveAttempt])

  const handleRestart = useCallback(() => {
    setDeck(shuffle(questions))
    setIndex(0)
    setGotIt(0)
    setMissed(0)
    setMissedCards([])
    setPhase('active')
  }, [questions])

  const handleReviewMissed = useCallback(() => {
    setDeck(shuffle(missedCards))
    setIndex(0)
    setGotIt(0)
    setMissed(0)
    setMissedCards([])
    setPhase('active')
  }, [missedCards])

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No flashcards available"
        message="Add questions to the content pack to start studying."
        action="Go to dashboard"
        onAction={() => onNavigate('dashboard')}
      />
    )
  }

  if (phase === 'complete') {
    return (
      <SessionComplete
        gotIt={gotIt}
        missed={missed}
        onRestart={handleRestart}
        onReview={handleReviewMissed}
        onNavigate={onNavigate}
      />
    )
  }

  const currentQuestion = deck[index]

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <StatsBar gotIt={gotIt} missed={missed} remaining={remaining} />

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 4, background: '#f0eeea', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, background: '#185fa5',
            width: `${Math.round(((gotIt + missed) / deck.length) * 100)}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
          {gotIt + missed} of {deck.length}
        </span>
      </div>

      <FlashCard
        key={currentQuestion.id}
        question={currentQuestion}
        topics={subject.topics}
        onGotIt={handleGotIt}
        onMissedIt={handleMissedIt}
      />
    </div>
  )
}
