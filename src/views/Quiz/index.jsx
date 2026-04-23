import { useState, useCallback } from 'react'
import { buildSession } from '../../engine/buildSession.js'
import { evaluateAnswer } from '../../engine/evaluateAnswer.js'
import { completeSession } from '../../engine/completeSession.js'
import { SessionConfig } from './SessionConfig.jsx'
import { QuestionCard } from './QuestionCard.jsx'
import { ResultsSummary } from './ResultsSummary.jsx'

function genId(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }

export function Quiz({ subject, questions, progress, prefs, onSaveAttempt, onSaveSession, onSavePrefs, onNavigate }) {
  const [phase, setPhase]             = useState('config')
  const [sessionId]                   = useState(() => genId('sess'))
  const [questionIds, setQuestionIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults]         = useState([])
  const [lastResult, setLastResult]   = useState(null)

  const handleStart = useCallback((config) => {
    onSavePrefs({ [subject.id]: { topicId: config.topicId, difficulty: config.difficulty } })
    setQuestionIds(buildSession(config, questions))
    setCurrentIndex(0); setResults([]); setLastResult(null); setPhase('active')
  }, [questions, subject.id, onSavePrefs])

  const handleAnswer = useCallback((selectedOptionId) => {
    const question = questions.find(q => q.id === questionIds[currentIndex])
    const result = evaluateAnswer(question, selectedOptionId)
    onSaveAttempt(result, sessionId)
    setLastResult(result)
    setResults(prev => [...prev, result])
  }, [questionIds, currentIndex, questions, sessionId, onSaveAttempt])

  const handleNext = useCallback(() => {
    const allResults = [...results, lastResult].filter(Boolean)
    if (currentIndex + 1 >= questionIds.length) {
      onSaveSession(completeSession(sessionId, allResults, questions, { subjectId: subject.id, mode: 'practice', topicId: null }, subject.weakTopicThreshold))
      setPhase('complete')
    } else { setCurrentIndex(i => i + 1); setLastResult(null) }
  }, [currentIndex, questionIds.length, results, lastResult, sessionId, questions, subject, onSaveSession])

  const handleRetryMissed = useCallback((missedIds) => {
    setQuestionIds(questions.filter(q => missedIds.includes(q.id)).map(q => q.id))
    setCurrentIndex(0); setResults([]); setLastResult(null); setPhase('active')
  }, [questions])

  // Saves the weak topic to prefs then resets phase to config — 
  // can't just navigate since hash is already #quiz so router won't re-render
  const handleStudyTopic = useCallback((topicId) => {
    onSavePrefs({ [subject.id]: { topicId, difficulty: null } })
    setPhase('config')
  }, [subject.id, onSavePrefs])

  if (phase === 'config') return <SessionConfig subject={subject} questions={questions} savedPrefs={prefs[subject.id] ?? {}} onStart={handleStart} />
  if (phase === 'active') {
    const question = questions.find(q => q.id === questionIds[currentIndex])
    if (!question) return null
    return <QuestionCard question={question} topics={subject.topics} questionNumber={currentIndex+1} totalQuestions={questionIds.length} result={lastResult} onAnswer={handleAnswer} onNext={handleNext} />
  }
  if (phase === 'complete') {
    const summary = completeSession(sessionId, results, questions, { subjectId: subject.id, mode: 'practice', topicId: null }, subject.weakTopicThreshold)
    return <ResultsSummary summary={summary} questions={questions} topics={subject.topics} subject={subject} onRetryMissed={handleRetryMissed} onNewSession={() => setPhase('config')} onNavigate={onNavigate} onSavePrefs={onSavePrefs} onStudyTopic={handleStudyTopic} />
  }
  return null
}
