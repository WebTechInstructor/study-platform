import { describe, it, expect } from 'vitest'
import { shuffle } from './shuffle.js'
import { sampleProportional } from './sampleProportional.js'
import { buildSession } from './buildSession.js'
import { evaluateAnswer } from './evaluateAnswer.js'
import { completeSession } from './completeSession.js'

// ── Fixtures ─────────────────────────────────────────────────────────────────

const questions = [
  { id: 'q1', topicId: 'bordeaux',  difficulty: 1, correctOptionId: 'a', explanation: 'Ex 1' },
  { id: 'q2', topicId: 'bordeaux',  difficulty: 2, correctOptionId: 'b', explanation: 'Ex 2' },
  { id: 'q3', topicId: 'bordeaux',  difficulty: 3, correctOptionId: 'c', explanation: 'Ex 3' },
  { id: 'q4', topicId: 'burgundy',  difficulty: 1, correctOptionId: 'a', explanation: 'Ex 4' },
  { id: 'q5', topicId: 'burgundy',  difficulty: 2, correctOptionId: 'b', explanation: 'Ex 5' },
  { id: 'q6', topicId: 'burgundy',  difficulty: 3, correctOptionId: 'c', explanation: 'Ex 6' },
  { id: 'q7', topicId: 'champagne', difficulty: 1, correctOptionId: 'a', explanation: 'Ex 7' },
  { id: 'q8', topicId: 'champagne', difficulty: 2, correctOptionId: 'b', explanation: 'Ex 8' },
]

// ── shuffle ───────────────────────────────────────────────────────────────────

describe('shuffle', () => {
  it('returns same length array', () => {
    expect(shuffle(questions).length).toBe(questions.length)
  })

  it('does not mutate the input array', () => {
    const original = [...questions]
    shuffle(questions)
    expect(questions).toEqual(original)
  })

  it('contains all original elements', () => {
    const result = shuffle(questions)
    expect(result).toEqual(expect.arrayContaining(questions))
  })

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles single element', () => {
    expect(shuffle([questions[0]])).toEqual([questions[0]])
  })
})

// ── sampleProportional ────────────────────────────────────────────────────────

describe('sampleProportional', () => {
  it('returns requested count', () => {
    const result = sampleProportional(questions, 6)
    expect(result.length).toBe(6)
  })

  it('does not exceed available questions', () => {
    const result = sampleProportional(questions, 100)
    expect(result.length).toBeLessThanOrEqual(questions.length)
  })

  it('samples from multiple topics', () => {
    const result = sampleProportional(questions, 6)
    const topicIds = new Set(result.map(q => q.topicId))
    expect(topicIds.size).toBeGreaterThan(1)
  })

  it('handles count of 1', () => {
    const result = sampleProportional(questions, 1)
    expect(result.length).toBe(1)
  })
})

// ── buildSession ──────────────────────────────────────────────────────────────

describe('buildSession', () => {
  it('returns array of question IDs', () => {
    const ids = buildSession({ mode: 'practice', topicId: null, difficulty: null, count: 5 }, questions)
    expect(ids).toHaveLength(5)
    ids.forEach(id => expect(typeof id).toBe('string'))
  })

  it('filters by topicId', () => {
    const ids = buildSession({ mode: 'practice', topicId: 'bordeaux', difficulty: null, count: 10 }, questions)
    const returned = questions.filter(q => ids.includes(q.id))
    returned.forEach(q => expect(q.topicId).toBe('bordeaux'))
  })

  it('filters by difficulty', () => {
    const ids = buildSession({ mode: 'practice', topicId: null, difficulty: 1, count: 10 }, questions)
    const returned = questions.filter(q => ids.includes(q.id))
    returned.forEach(q => expect(q.difficulty).toBe(1))
  })

  it('returns empty array when pool is empty', () => {
    const ids = buildSession({ mode: 'practice', topicId: 'unknown', difficulty: null, count: 5 }, questions)
    expect(ids).toEqual([])
  })

  it('returns at most count questions', () => {
    const ids = buildSession({ mode: 'practice', topicId: null, difficulty: null, count: 3 }, questions)
    expect(ids.length).toBeLessThanOrEqual(3)
  })

  it('handles count larger than pool', () => {
    const ids = buildSession({ mode: 'practice', topicId: 'bordeaux', difficulty: null, count: 100 }, questions)
    expect(ids.length).toBeLessThanOrEqual(3)
  })

  it('exam mode samples proportionally', () => {
    const ids = buildSession({ mode: 'exam', topicId: null, difficulty: null, count: 6 }, questions)
    expect(ids.length).toBe(6)
  })
})

// ── evaluateAnswer ────────────────────────────────────────────────────────────

describe('evaluateAnswer', () => {
  const question = questions[0] // correctOptionId: 'a'

  it('returns correct: true for right answer', () => {
    const result = evaluateAnswer(question, 'a')
    expect(result.correct).toBe(true)
  })

  it('returns correct: false for wrong answer', () => {
    const result = evaluateAnswer(question, 'b')
    expect(result.correct).toBe(false)
  })

  it('includes questionId, selectedOptionId, correctOptionId', () => {
    const result = evaluateAnswer(question, 'b')
    expect(result.questionId).toBe('q1')
    expect(result.selectedOptionId).toBe('b')
    expect(result.correctOptionId).toBe('a')
  })

  it('includes explanation and answeredAt', () => {
    const result = evaluateAnswer(question, 'a')
    expect(result.explanation).toBe('Ex 1')
    expect(typeof result.answeredAt).toBe('string')
  })

  it('does not mutate the question object', () => {
    const original = { ...question }
    evaluateAnswer(question, 'a')
    expect(question).toEqual(original)
  })
})

// ── completeSession ───────────────────────────────────────────────────────────

describe('completeSession', () => {
  const results = [
    { questionId: 'q1', correct: true,  selectedOptionId: 'a' },
    { questionId: 'q2', correct: false, selectedOptionId: 'a' },
    { questionId: 'q4', correct: true,  selectedOptionId: 'a' },
    { questionId: 'q5', correct: false, selectedOptionId: 'a' },
    { questionId: 'q7', correct: false, selectedOptionId: 'b' },
  ]

  const config = { subjectId: 'wset-l3', mode: 'practice', topicId: null }
  const summary = completeSession('sess-001', results, questions, config, 60)

  it('computes correct score', () => {
    expect(summary.score.correct).toBe(2)
    expect(summary.score.total).toBe(5)
    expect(summary.score.pct).toBe(40)
  })

  it('identifies weak topics below threshold', () => {
    expect(summary.weakTopics.length).toBeGreaterThan(0)
  })

  it('lists missed question IDs', () => {
    expect(summary.missedQuestionIds).toContain('q2')
    expect(summary.missedQuestionIds).toContain('q5')
    expect(summary.missedQuestionIds).toContain('q7')
    expect(summary.missedQuestionIds).not.toContain('q1')
  })

  it('includes completedAt timestamp', () => {
    expect(typeof summary.completedAt).toBe('string')
  })

  it('handles all correct answers', () => {
    const allCorrect = results.map(r => ({ ...r, correct: true }))
    const s = completeSession('sess-002', allCorrect, questions, config, 60)
    expect(s.score.pct).toBe(100)
    expect(s.weakTopics).toEqual([])
  })

  it('handles all wrong answers', () => {
    const allWrong = results.map(r => ({ ...r, correct: false }))
    const s = completeSession('sess-003', allWrong, questions, config, 60)
    expect(s.score.pct).toBe(0)
    expect(s.missedQuestionIds.length).toBe(results.length)
  })

  it('handles empty results array', () => {
    const s = completeSession('sess-004', [], questions, config, 60)
    expect(s.score.pct).toBe(0)
    expect(s.score.total).toBe(0)
  })
})
