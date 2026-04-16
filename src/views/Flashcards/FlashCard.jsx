import { useState } from 'react'
import { MarkdownRenderer, TopicBadge } from '../../components/index.jsx'

export function FlashCard({ question, topics, onGotIt, onMissedIt }) {
  const [flipped,  setFlipped]  = useState(false)
  const [exiting,  setExiting]  = useState(null)

  function rate(outcome) {
    setExiting(outcome === 'got' ? 'left' : 'right')
    setTimeout(() => { setFlipped(false); setExiting(null); outcome === 'got' ? onGotIt() : onMissedIt() }, 280)
  }

  return (
    <div>
      <div className="flash-hint-row">
        <span className="flash-hint got">← Got it</span>
        <span className="flash-hint missed">Missed it →</span>
      </div>

      <div style={{ position: 'relative', marginBottom: -8 }}>
        <div className="flash-stack-1" /><div className="flash-stack-2" />
      </div>

      <div style={{ perspective: 1000, marginBottom: 14 }}>
        <div onClick={() => !exiting && setFlipped(f => !f)} style={{
          position: 'relative', width: '100%', height: 220,
          transformStyle: 'preserve-3d',
          transition: exiting ? 'transform 0.28s ease-in, opacity 0.28s ease-in' : 'transform 0.4s cubic-bezier(.4,0,.2,1)',
          transform: exiting === 'left' ? 'translateX(-120%) rotate(-8deg)' : exiting === 'right' ? 'translateX(120%) rotate(8deg)' : flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          opacity: exiting ? 0 : 1, cursor: 'pointer',
        }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', flexDirection: 'column' }}>
            <div className="flash-face-label">Question</div>
            <TopicBadge topicId={question.topicId} topics={topics} />
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.55, flex: 1, margin: '10px 0 0' }}>{question.stem}</p>
            <p className="flash-hint-small">Tap to reveal answer</p>
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', flexDirection: 'column' }}>
            <div className="flash-face-label back">Answer</div>
            <TopicBadge topicId={question.topicId} topics={topics} />
            <div style={{ flex: 1, margin: '10px 0 0' }}><MarkdownRenderer content={question.explanation} /></div>
            <p className="flash-hint-small">Swipe or use buttons below</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-got" onClick={() => rate('got')}>← Got it</button>
        <button className="btn-missed" onClick={() => rate('missed')}>Missed it →</button>
      </div>
    </div>
  )
}
