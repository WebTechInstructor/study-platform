import { useState } from 'react'
import { MarkdownRenderer } from '../../components/index.jsx'
import { TopicBadge } from '../../components/index.jsx'

export function FlashCard({ question, topics, onGotIt, onMissedIt }) {
  const [flipped, setFlipped] = useState(false)
  const [exiting, setExiting] = useState(null) // 'left' | 'right' | null

  function rate(outcome) {
    setExiting(outcome === 'got' ? 'left' : 'right')
    setTimeout(() => {
      setFlipped(false)
      setExiting(null)
      outcome === 'got' ? onGotIt() : onMissedIt()
    }, 280)
  }

  return (
    <div>
      {/* Swipe hints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#1d9e75', display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Got it
        </span>
        <span style={{ fontSize: 11, color: '#e24b4a', display: 'flex', alignItems: 'center', gap: 4 }}>
          Missed it →
        </span>
      </div>

      {/* Stacked cards illusion */}
      <div style={{ position: 'relative', marginBottom: -8 }}>
        <div style={{ position: 'absolute', left: 10, right: 10, height: 10, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12, top: 0, opacity: 0.5 }} />
        <div style={{ position: 'absolute', left: 6, right: 6, height: 10, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, top: 4, opacity: 0.7 }} />
      </div>

      {/* Card scene */}
      <div style={{ perspective: 1000, marginBottom: 14 }}>
        <div
          onClick={() => !exiting && setFlipped(f => !f)}
          style={{
            position: 'relative', width: '100%', height: 220,
            transformStyle: 'preserve-3d',
            transition: exiting
              ? `transform 0.28s ease-in, opacity 0.28s ease-in`
              : 'transform 0.4s cubic-bezier(.4,0,.2,1)',
            transform: exiting === 'left'
              ? 'translateX(-120%) rotate(-8deg)'
              : exiting === 'right'
              ? 'translateX(120%) rotate(8deg)'
              : flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            opacity: exiting ? 0 : 1,
            cursor: 'pointer',
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
            borderRadius: 12, padding: 20,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#888', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
              Question
            </div>
            <TopicBadge topicId={question.topicId} topics={topics} />
            <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, flex: 1, margin: '10px 0 0' }}>
              {question.stem}
            </p>
            <p style={{ fontSize: 11, color: '#ccc', textAlign: 'center', margin: 0 }}>
              Tap to reveal answer
            </p>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
            borderRadius: 12, padding: 20,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#185fa5', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
              Answer
            </div>
            <TopicBadge topicId={question.topicId} topics={topics} />
            <div style={{ flex: 1, margin: '10px 0 0' }}>
              <MarkdownRenderer content={question.explanation} />
            </div>
            <p style={{ fontSize: 11, color: '#ccc', textAlign: 'center', margin: 0 }}>
              Swipe or use buttons below
            </p>
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => rate('got')}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 8,
            background: '#eaf3de', border: '0.5px solid #97c459',
            color: '#27500a', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          ← Got it
        </button>
        <button
          onClick={() => rate('missed')}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 8,
            background: '#fcebeb', border: '0.5px solid #f09595',
            color: '#791f1f', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          Missed it →
        </button>
      </div>
    </div>
  )
}
