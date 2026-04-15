import { MarkdownRenderer } from '../../components/index.jsx'
import { TopicBadge } from '../../components/index.jsx'

const s = {
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '16px 14px' },
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ flex: 1, height: 4, background: '#f0eeea', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#185fa5', borderRadius: 2, transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{current} of {total}</span>
    </div>
  )
}

function OptionButton({ option, state, onClick, disabled }) {
  const colors = {
    default:  { bg: '#fff',     border: 'rgba(0,0,0,0.15)', color: '#1a1a1a' },
    correct:  { bg: '#eaf3de', border: '#97c459',           color: '#27500a' },
    wrong:    { bg: '#fcebeb', border: '#f09595',           color: '#791f1f' },
    dimmed:   { bg: '#fafaf9', border: 'rgba(0,0,0,0.08)', color: '#bbb'    },
  }
  const style = colors[state] ?? colors.default

  const indicator = {
    correct: '✓',
    wrong:   '✕',
    default: option.id.toUpperCase(),
    dimmed:  option.id.toUpperCase(),
  }[state] ?? option.id.toUpperCase()

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 12px', borderRadius: 8,
        border: `0.5px solid ${style.border}`,
        background: style.bg, color: style.color,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 13, transition: 'all 0.15s',
        opacity: state === 'dimmed' ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = state === 'default' ? '#f7f6f3' : style.bg }}
      onMouseLeave={e => { e.currentTarget.style.background = style.bg }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 500,
        background: state === 'correct' ? '#97c459' : state === 'wrong' ? '#f09595' : '#f0eeea',
        color:      state === 'correct' ? '#27500a' : state === 'wrong' ? '#791f1f' : '#888',
      }}>
        {indicator}
      </div>
      {option.text}
    </div>
  )
}

export function QuestionCard({ question, topics, questionNumber, totalQuestions, result, onAnswer, onNext }) {
  const answered = result !== null

  function getOptionState(option) {
    if (!answered) return 'default'
    if (option.id === result.correctOptionId) return 'correct'
    if (option.id === result.selectedOptionId) return 'wrong'
    return 'dimmed'
  }

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div style={s.card}>
        <TopicBadge topicId={question.topicId} topics={topics} />
        <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, margin: '10px 0 16px' }}>
          {question.stem}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {question.options.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              state={getOptionState(option)}
              onClick={() => onAnswer(option.id)}
              disabled={answered}
            />
          ))}
        </div>

        {/* Inline feedback */}
        {answered && (
          <div style={{
            marginTop: 14,
            borderLeft: `3px solid ${result.correct ? '#97c459' : '#f09595'}`,
            paddingLeft: 12,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
              color: result.correct ? '#27500a' : '#791f1f', marginBottom: 5,
            }}>
              {result.correct ? 'Correct' : 'Incorrect'}
            </div>
            <MarkdownRenderer content={result.explanation} />
          </div>
        )}

        {/* Next button */}
        {answered && (
          <button
            onClick={onNext}
            style={{
              width: '100%', marginTop: 14, padding: '10px 0',
              borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)',
              background: '#fff', fontSize: 13, fontWeight: 500,
              color: '#1a1a1a', cursor: 'pointer',
            }}
          >
            {questionNumber < totalQuestions ? 'Next question →' : 'See results →'}
          </button>
        )}
      </div>
    </div>
  )
}
