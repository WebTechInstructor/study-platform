import { useState, useMemo } from 'react'
import { buildSession } from '../../engine/buildSession.js'

const DIFFS = [{ value: null, label: 'All' }, { value: 1, label: 'Easy' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Hard' }]

export function SessionConfig({ subject, questions, savedPrefs, onStart }) {
  const [topicId,    setTopicId]    = useState(savedPrefs.topicId    ?? null)
  const [difficulty, setDifficulty] = useState(savedPrefs.difficulty ?? null)
  const [open,       setOpen]       = useState(false)

  const pool = useMemo(() => buildSession({ topicId, difficulty, mode: 'practice', count: 9999 }, questions), [topicId, difficulty, questions])
  const topicOptions = [{ id: null, title: 'All topics' }, ...subject.topics.filter(t => !t.parentId)]
  const selectedLabel = topicOptions.find(t => t.id === topicId)?.title ?? 'All topics'

  function handleStart() {
    if (!pool.length) return
    onStart({ topicId, difficulty, mode: 'practice', count: Math.min(20, pool.length), subjectId: subject.id })
  }

  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="section-label">Topic</div>
      <div className="card">
        <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, color: 'var(--text)' }}>
          <span>{selectedLabel}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{open ? '▴' : '▾'}</span>
        </div>
        {open && (
          <div style={{ marginTop: 10, borderTop: '0.5px solid var(--border)', paddingTop: 8 }}>
            {topicOptions.map(t => (
              <div key={String(t.id)} onClick={() => { setTopicId(t.id); setOpen(false) }}
                style={{ padding: '9px 4px', fontSize: 13, cursor: 'pointer', borderRadius: 6, color: topicId === t.id ? 'var(--info)' : 'var(--text-2)', fontWeight: topicId === t.id ? 500 : 400 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >{t.title}</div>
            ))}
          </div>
        )}
      </div>

      <div className="section-label">Difficulty</div>
      <div className="card">
        <div className="pill-row">
          {DIFFS.map(d => (
            <div key={String(d.value)} className={`pill ${difficulty === d.value ? 'active' : ''}`} onClick={() => setDifficulty(d.value)}>{d.label}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn-primary" onClick={handleStart} disabled={!pool.length}>
          {pool.length > 0 ? 'Start quiz' : 'No questions match'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
          {pool.length} question{pool.length !== 1 ? 's' : ''} available{pool.length > 20 ? ' · 20 per session' : ''}
        </p>
      </div>
    </div>
  )
}
