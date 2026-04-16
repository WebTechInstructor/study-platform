import { useState } from 'react'
import { QuestionReview } from './QuestionReview.jsx'
import { TopicBreakdown } from './TopicBreakdown.jsx'
import { EmptyState } from '../../components/index.jsx'

function fmt(iso) { return iso ? new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '' }
function duration(a, b) { if(!a||!b) return null; const s=Math.round((new Date(b)-new Date(a))/1000); const m=Math.floor(s/60); return m>0?`${m} min ${s%60} sec`:`${s} sec` }

export function Results({ subject, questions, sessions, onNavigate }) {
  const [selectedId, setSelectedId] = useState(() => sessions.length > 0 ? sessions[sessions.length-1].id : null)
  const [tab, setTab] = useState('summary')

  if (!sessions?.length) return <EmptyState title="No results yet" message="Complete a quiz session to see your results here." action="Start a quiz" onAction={() => onNavigate('quiz')} />

  const summary = sessions.find(s => s.id === selectedId) ?? sessions[sessions.length-1]
  const { score } = summary
  const passed = score.pct >= subject.passThreshold

  return (
    <div style={{ paddingTop:8, paddingBottom:40 }}>

      {sessions.length > 1 && (
        <>
          <div className="section-label">Session</div>
          <div className="card" style={{ padding:0, marginBottom:14, overflow:'hidden' }}>
            {[...sessions].reverse().slice(0,5).map(s => (
              <div key={s.id} className={`session-row ${s.id===summary.id?'active':''}`} onClick={() => { setSelectedId(s.id); setTab('summary') }}>
                <span>{fmt(s.completedAt)}</span>
                <span className={`session-pill ${s.score.pct >= subject.passThreshold ? 'pass' : 'fail'}`}>{s.score.pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="tab-row">
        {['summary','review'].map(t => <div key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t==='summary'?'Summary':'Review answers'}</div>)}
      </div>

      {tab === 'summary' && (
        <>
          <div className="score-hero">
            <div><span className="score-big">{score.correct}</span><span className="score-denom"> / {score.total}</span></div>
            <div className="score-pct">
              {score.pct}%
              {duration(summary.startedAt, summary.completedAt) && ` · ${duration(summary.startedAt, summary.completedAt)}`}
            </div>
            <div className={`score-badge ${passed?'pass':'fail'}`}>{passed ? `Pass · above ${subject.passThreshold}%` : `Below ${subject.passThreshold}% pass mark`}</div>
            <div className="score-meta">{summary.mode === 'exam' ? 'Exam mode' : 'Practice mode'}{summary.completedAt && ` · ${fmt(summary.completedAt)}`}</div>
          </div>

          <div className="stat-grid">
            <div className="stat-card"><div className="stat-val correct">{score.correct}</div><div className="stat-lbl">Correct</div></div>
            <div className="stat-card"><div className="stat-val wrong">{score.total-score.correct}</div><div className="stat-lbl">Incorrect</div></div>
            <div className="stat-card"><div className="stat-val">{score.total}</div><div className="stat-lbl">Total</div></div>
          </div>

          {summary.topicScores?.length > 1 && (
            <>
              <div className="section-label">By topic</div>
              <TopicBreakdown topicScores={summary.topicScores} topics={subject.topics} weakThreshold={subject.weakTopicThreshold} />
            </>
          )}

          <div style={{ display:'flex', gap:8, marginTop:4 }}>
            <button style={{ flex:1 }} onClick={() => setTab('review')}>Review answers</button>
            <button className="btn-info" style={{ flex:1 }} onClick={() => onNavigate('quiz')}>New session</button>
          </div>
        </>
      )}

      {tab === 'review' && <QuestionReview summary={summary} questions={questions} topics={subject.topics} />}
    </div>
  )
}
