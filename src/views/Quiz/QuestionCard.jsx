import { MarkdownRenderer, TopicBadge } from '../../components/index.jsx'

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${Math.round((current/total)*100)}%` }} /></div>
      <span className="progress-label">{current} of {total}</span>
    </div>
  )
}

function OptionButton({ option, state, onClick, disabled }) {
  const indicator = { correct: '✓', wrong: '✕', default: option.id.toUpperCase(), dimmed: option.id.toUpperCase() }[state]
  return (
    <div className={`q-option ${state !== 'default' ? state : ''} ${disabled ? 'answered' : ''}`} onClick={disabled ? undefined : onClick}>
      <div className={`opt-indicator ${state === 'correct' || state === 'wrong' ? state : ''}`}>{indicator}</div>
      {option.text}
    </div>
  )
}

export function QuestionCard({ question, topics, questionNumber, totalQuestions, result, onAnswer, onNext }) {
  const answered = result !== null
  function getState(opt) {
    if (!answered) return 'default'
    if (opt.id === result.correctOptionId) return 'correct'
    if (opt.id === result.selectedOptionId) return 'wrong'
    return 'dimmed'
  }
  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      <ProgressBar current={questionNumber} total={totalQuestions} />
      <div className="card">
        <TopicBadge topicId={question.topicId} topics={topics} />
        <p className="q-stem">{question.stem}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {question.options.map(opt => <OptionButton key={opt.id} option={opt} state={getState(opt)} onClick={() => onAnswer(opt.id)} disabled={answered} />)}
        </div>
        {answered && (
          <div className={`feedback-block ${result.correct ? '' : 'wrong'}`}>
            <div className={`feedback-label ${result.correct ? '' : 'wrong'}`}>{result.correct ? 'Correct' : 'Incorrect'}</div>
            <MarkdownRenderer content={result.explanation} />
          </div>
        )}
        {answered && (
          <button onClick={onNext} style={{ width: '100%', marginTop: 14 }}>
            {questionNumber < totalQuestions ? 'Next question →' : 'See results →'}
          </button>
        )}
      </div>
    </div>
  )
}
