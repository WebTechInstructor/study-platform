import { useState, useMemo } from 'react'
import { buildSession } from '../../engine/buildSession.js'

const DIFFICULTIES = [
  { value: null, label: 'All' },
  { value: 1,    label: 'Easy' },
  { value: 2,    label: 'Medium' },
  { value: 3,    label: 'Hard' },
]

const s = {
  label: { fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '12px 14px', marginBottom: 0 },
}

export function SessionConfig({ subject, questions, savedPrefs, onStart }) {
  const [topicId,    setTopicId]    = useState(savedPrefs.topicId    ?? null)
  const [difficulty, setDifficulty] = useState(savedPrefs.difficulty ?? null)
  const [open,       setOpen]       = useState(false)

  const pool = useMemo(() =>
    buildSession({ topicId, difficulty, mode: 'practice', count: 9999 }, questions),
    [topicId, difficulty, questions]
  )

  const topicOptions = [
    { id: null, title: 'All topics' },
    ...subject.topics.filter(t => !t.parentId),
  ]

  const selectedTopicLabel = topicOptions.find(t => t.id === topicId)?.title ?? 'All topics'

  function handleStart() {
    if (pool.length === 0) return
    onStart({
      topicId,
      difficulty,
      mode: 'practice',
      count: Math.min(20, pool.length),
      subjectId: subject.id,
    })
  }

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>

      {/* Topic selector */}
      <div style={s.label}>Topic</div>
      <div style={s.card}>
        <div
          onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, color: '#1a1a1a' }}
        >
          <span>{selectedTopicLabel}</span>
          <span style={{ color: '#888', fontSize: 11 }}>{open ? '▴' : '▾'}</span>
        </div>
        {open && (
          <div style={{ marginTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 8 }}>
            {topicOptions.map(t => (
              <div
                key={String(t.id)}
                onClick={() => { setTopicId(t.id); setOpen(false) }}
                style={{
                  padding: '8px 4px', fontSize: 13, cursor: 'pointer', borderRadius: 6,
                  color: topicId === t.id ? '#185fa5' : '#444',
                  fontWeight: topicId === t.id ? 500 : 400,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f6f3'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {t.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty filter */}
      <div style={s.label}>Difficulty</div>
      <div style={s.card}>
        <div style={{ display: 'flex', gap: 6 }}>
          {DIFFICULTIES.map(d => (
            <div
              key={String(d.value)}
              onClick={() => setDifficulty(d.value)}
              style={{
                flex: 1, textAlign: 'center', padding: '8px 0',
                borderRadius: 8, fontSize: 12, cursor: 'pointer',
                border: '0.5px solid',
                borderColor: difficulty === d.value ? 'transparent' : 'rgba(0,0,0,0.15)',
                background: difficulty === d.value ? '#e6f1fb' : 'transparent',
                color: difficulty === d.value ? '#185fa5' : '#666',
                fontWeight: difficulty === d.value ? 500 : 400,
                transition: 'all 0.12s',
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleStart}
          disabled={pool.length === 0}
          style={{
            width: '100%', padding: 12, borderRadius: 8,
            background: pool.length > 0 ? '#185fa5' : '#f0eeea',
            color: pool.length > 0 ? '#fff' : '#aaa',
            border: 'none', fontSize: 14, fontWeight: 500,
            cursor: pool.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.15s',
          }}
        >
          {pool.length > 0 ? `Start quiz` : 'No questions match'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 8 }}>
          {pool.length} question{pool.length !== 1 ? 's' : ''} available
          {pool.length > 20 ? ' · 20 per session' : ''}
        </p>
      </div>

    </div>
  )
}
