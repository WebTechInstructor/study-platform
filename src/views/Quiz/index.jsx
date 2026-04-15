import { useState, useCallback } from 'react'
import { buildSession } from '../../engine/buildSession.js'
import { evaluateAnswer } from '../../engine/evaluateAnswer.js'
import { completeSession } from '../../engine/completeSession.js'
import { SessionConfig } from './SessionConfig.jsx'
import { QuestionCard } from './QuestionCard.jsx'
import { ResultsSummary } from './ResultsSummary.jsx'

function generateSessionId() {
  return 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
}

export function Quiz({ subject, questions, progress, prefs, onSaveAttempt, onSaveSession, onSavePrefs, onNavigate }) {
  const [phase, setPhase] = useState('config')        // 'config' | 'active' | 'complete'
  const [sessionId]       = useState(generateSessionId)
  const [questionIds, setQuestionIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState([])
  const [lastResult, setLastResult] = useState(null)  // result for current question feedback

  // ── Config → Active ──────────────────────────────────────────────────────
  const handleStart = useCallback((config) => {
    onSavePrefs({ [subject.id]: { topicId: config.topicId, difficulty: config.difficulty } })
    const ids = buildSession(config, questions)
    setQuestionIds(ids)
    setCurrentIndex(0)
    setResults([])
    setLastResult(null)
    setPhase('active')
  }, [questions, subject.id, onSavePrefs])

  // ── Answer submitted ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((selectedOptionId) => {
    const qId = questionIds[currentIndex]
    const question = questions.find(q => q.id === qId)
    const result = evaluateAnswer(question, selectedOptionId)
    onSaveAttempt(result, sessionId)
    setLastResult(result)
    setResults(prev => [...prev, result])
  }, [questionIds, currentIndex, questions, sessionId, onSaveAttempt])

  // ── Next question ────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questionIds.length) {
      // Session complete
      const summary = completeSession(
        sessionId,
        [...results, lastResult].filter(Boolean),
        questions,
        { subjectId: subject.id, mode: 'practice', topicId: null },
        subject.weakTopicThreshold
      )
      onSaveSession(summary)
      setPhase('complete')
    } else {
      setCurrentIndex(i => i + 1)
      setLastResult(null)
    }
  }, [currentIndex, questionIds.length, results, lastResult, sessionId, questions, subject, onSaveSession])

  // ── Retry missed ─────────────────────────────────────────────────────────
  const handleRetryMissed = useCallback((missedIds) => {
    const missedQuestions = questions.filter(q => missedIds.includes(q.id))
    const ids = missedQuestions.map(q => q.id)
    setQuestionIds(ids)
    setCurrentIndex(0)
    setResults([])
    setLastResult(null)
    setPhase('active')
  }, [questions])

  // ── Render ───────────────────────────────────────────────────────────────
  if (phase === 'config') {
    const savedPrefs = prefs[subject.id] ?? {}
    return (
      <SessionConfig
        subject={subject}
        questions={questions}
        savedPrefs={savedPrefs}
        onStart={handleStart}
      />
    )
  }

  if (phase === 'active') {
    const question = questions.find(q => q.id === questionIds[currentIndex])
    if (!question) return null
    return (
      <QuestionCard
        question={question}
        topics={subject.topics}
        questionNumber={currentIndex + 1}
        totalQuestions={questionIds.length}
        result={lastResult}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    )
  }

  if (phase === 'complete') {
    const allResults = results
    const summary = completeSession(
      sessionId, allResults, questions,
      { subjectId: subject.id, mode: 'practice', topicId: null },
      subject.weakTopicThreshold
    )
    return (
      <ResultsSummary
        summary={summary}
        questions={questions}
        topics={subject.topics}
        subject={subject}
        onRetryMissed={handleRetryMissed}
        onNewSession={() => setPhase('config')}
        onNavigate={onNavigate}
      />
    )
  }

  return null
}
