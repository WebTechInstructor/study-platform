import { useState, useCallback } from 'react'
import { FlashCard } from './FlashCard.jsx'
import { evaluateAnswer } from '../../engine/evaluateAnswer.js'
import { EmptyState } from '../../components/index.jsx'

function genId(p) { return `${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }
function shuffle(arr) { const o=[...arr]; for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}return o }

function SessionComplete({ gotIt, missed, onRestart, onReview, onNavigate }) {
  const total = gotIt + missed
  const pct = total > 0 ? Math.round((gotIt/total)*100) : 0
  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="score-hero">
        <div className="score-big">{pct}<span style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-2)' }}>%</span></div>
        <div className="score-pct">got it this session</div>
      </div>
      <div className="stat-grid" style={{ marginTop: 10 }}>
        <div className="stat-card"><div className="stat-val correct">{gotIt}</div><div className="stat-lbl">Got it</div></div>
        <div className="stat-card"><div className="stat-val wrong">{missed}</div><div className="stat-lbl">Missed</div></div>
        <div className="stat-card"><div className="stat-val">{total}</div><div className="stat-lbl">Total</div></div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 8 }}>
        <button style={{ flex: 1 }} onClick={onRestart}>Shuffle again</button>
        {missed > 0 && <button className="btn-info" style={{ flex: 1 }} onClick={onReview}>Review missed ({missed})</button>}
      </div>
      <button style={{ width: '100%' }} onClick={() => onNavigate('dashboard')}>Back to dashboard</button>
    </div>
  )
}

export function Flashcards({ subject, questions, onSaveAttempt, onNavigate }) {
  const [sessionId]   = useState(() => genId('flash'))
  const [deck,  setDeck]   = useState(() => shuffle(questions))
  const [index, setIndex]  = useState(0)
  const [gotIt,  setGotIt]  = useState(0)
  const [missed, setMissed] = useState(0)
  const [phase,  setPhase]  = useState('active')
  const [missedCards, setMissedCards] = useState([])

  const advance = useCallback((isGot) => {
    if (isGot) setGotIt(n => n+1); else { setMissed(n => n+1); setMissedCards(p => [...p, deck[index]]) }
    if (index + 1 >= deck.length) setPhase('complete'); else setIndex(i => i+1)
  }, [deck, index])

  const handleGotIt = useCallback(() => {
    onSaveAttempt(evaluateAnswer(deck[index], deck[index].correctOptionId), sessionId)
    advance(true)
  }, [deck, index, sessionId, onSaveAttempt, advance])

  const handleMissedIt = useCallback(() => {
    const wrongId = deck[index].options.find(o => o.id !== deck[index].correctOptionId)?.id ?? 'x'
    onSaveAttempt(evaluateAnswer(deck[index], wrongId), sessionId)
    advance(false)
  }, [deck, index, sessionId, onSaveAttempt, advance])

  const handleRestart = useCallback(() => { setDeck(shuffle(questions)); setIndex(0); setGotIt(0); setMissed(0); setMissedCards([]); setPhase('active') }, [questions])
  const handleReview  = useCallback(() => { setDeck(shuffle(missedCards)); setIndex(0); setGotIt(0); setMissed(0); setMissedCards([]); setPhase('active') }, [missedCards])

  if (!questions.length) return <EmptyState title="No flashcards" message="Add questions to get started." action="Dashboard" onAction={() => onNavigate('dashboard')} />
  if (phase === 'complete') return <SessionComplete gotIt={gotIt} missed={missed} onRestart={handleRestart} onReview={handleReview} onNavigate={onNavigate} />

  const remaining = deck.length - index
  const progress = Math.round(((gotIt + missed) / deck.length) * 100)

  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <div className="stat-card"><div className="stat-val correct">{gotIt}</div><div className="stat-lbl">Got it</div></div>
        <div className="stat-card"><div className="stat-val wrong">{missed}</div><div className="stat-lbl">Missed</div></div>
        <div className="stat-card"><div className="stat-val">{remaining}</div><div className="stat-lbl">Remaining</div></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
        <span className="progress-label">{gotIt + missed} of {deck.length}</span>
      </div>
      <FlashCard key={deck[index].id} question={deck[index]} topics={subject.topics} onGotIt={handleGotIt} onMissedIt={handleMissedIt} />
    </div>
  )
}
