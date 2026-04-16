import { describe, it, expect } from 'vitest'
import { shuffle } from './shuffle.js'
import { sampleProportional } from './sampleProportional.js'
import { buildSession } from './buildSession.js'
import { evaluateAnswer } from './evaluateAnswer.js'
import { completeSession } from './completeSession.js'

const questions = [
  { id: 'q1', topicId: 'bordeaux',  difficulty: 1, correctOptionId: 'a', explanation: 'Ex 1', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q2', topicId: 'bordeaux',  difficulty: 2, correctOptionId: 'b', explanation: 'Ex 2', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q3', topicId: 'bordeaux',  difficulty: 3, correctOptionId: 'c', explanation: 'Ex 3', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q4', topicId: 'burgundy',  difficulty: 1, correctOptionId: 'a', explanation: 'Ex 4', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q5', topicId: 'burgundy',  difficulty: 2, correctOptionId: 'b', explanation: 'Ex 5', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q6', topicId: 'burgundy',  difficulty: 3, correctOptionId: 'c', explanation: 'Ex 6', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q7', topicId: 'champagne', difficulty: 1, correctOptionId: 'a', explanation: 'Ex 7', options: [{id:'a'},{id:'b'},{id:'c'}] },
  { id: 'q8', topicId: 'champagne', difficulty: 2, correctOptionId: 'b', explanation: 'Ex 8', options: [{id:'a'},{id:'b'},{id:'c'}] },
]

describe('shuffle', () => {
  it('returns same length', () => expect(shuffle(questions).length).toBe(questions.length))
  it('does not mutate input', () => { const o = [...questions]; shuffle(questions); expect(questions).toEqual(o) })
  it('contains all elements', () => expect(shuffle(questions)).toEqual(expect.arrayContaining(questions)))
  it('handles empty', () => expect(shuffle([])).toEqual([]))
  it('handles single', () => expect(shuffle([questions[0]])).toEqual([questions[0]]))
})

describe('sampleProportional', () => {
  it('returns requested count', () => expect(sampleProportional(questions, 6).length).toBe(6))
  it('does not exceed available', () => expect(sampleProportional(questions, 100).length).toBeLessThanOrEqual(questions.length))
  it('samples multiple topics', () => expect(new Set(sampleProportional(questions, 6).map(q => q.topicId)).size).toBeGreaterThan(1))
  it('handles count of 1', () => expect(sampleProportional(questions, 1).length).toBe(1))
})

describe('buildSession', () => {
  it('returns IDs', () => { const ids = buildSession({ mode:'practice', topicId:null, difficulty:null, count:5 }, questions); expect(ids).toHaveLength(5); ids.forEach(id => expect(typeof id).toBe('string')) })
  it('filters by topic', () => { const ids = buildSession({ mode:'practice', topicId:'bordeaux', difficulty:null, count:10 }, questions); questions.filter(q => ids.includes(q.id)).forEach(q => expect(q.topicId).toBe('bordeaux')) })
  it('filters by difficulty', () => { const ids = buildSession({ mode:'practice', topicId:null, difficulty:1, count:10 }, questions); questions.filter(q => ids.includes(q.id)).forEach(q => expect(q.difficulty).toBe(1)) })
  it('returns empty for unknown topic', () => expect(buildSession({ mode:'practice', topicId:'unknown', difficulty:null, count:5 }, questions)).toEqual([]))
  it('respects count', () => expect(buildSession({ mode:'practice', topicId:null, difficulty:null, count:3 }, questions).length).toBeLessThanOrEqual(3))
  it('handles count > pool', () => expect(buildSession({ mode:'practice', topicId:'bordeaux', difficulty:null, count:100 }, questions).length).toBeLessThanOrEqual(3))
  it('exam mode proportional', () => expect(buildSession({ mode:'exam', topicId:null, difficulty:null, count:6 }, questions).length).toBe(6))
})

describe('evaluateAnswer', () => {
  const q = questions[0]
  it('correct: true for right answer', () => expect(evaluateAnswer(q, 'a').correct).toBe(true))
  it('correct: false for wrong answer', () => expect(evaluateAnswer(q, 'b').correct).toBe(false))
  it('includes IDs', () => { const r = evaluateAnswer(q, 'b'); expect(r.questionId).toBe('q1'); expect(r.selectedOptionId).toBe('b'); expect(r.correctOptionId).toBe('a') })
  it('includes explanation and timestamp', () => { const r = evaluateAnswer(q, 'a'); expect(r.explanation).toBe('Ex 1'); expect(typeof r.answeredAt).toBe('string') })
  it('does not mutate question', () => { const o = {...q}; evaluateAnswer(q, 'a'); expect(q).toEqual(o) })
})

describe('completeSession', () => {
  const results = [
    { questionId:'q1', correct:true,  selectedOptionId:'a' },
    { questionId:'q2', correct:false, selectedOptionId:'a' },
    { questionId:'q4', correct:true,  selectedOptionId:'a' },
    { questionId:'q5', correct:false, selectedOptionId:'a' },
    { questionId:'q7', correct:false, selectedOptionId:'b' },
  ]
  const config = { subjectId:'wset-l3', mode:'practice', topicId:null }
  const summary = completeSession('sess-001', results, questions, config, 60)

  it('correct score', () => { expect(summary.score.correct).toBe(2); expect(summary.score.total).toBe(5); expect(summary.score.pct).toBe(40) })
  it('identifies weak topics', () => expect(summary.weakTopics.length).toBeGreaterThan(0))
  it('missed question IDs', () => { expect(summary.missedQuestionIds).toContain('q2'); expect(summary.missedQuestionIds).not.toContain('q1') })
  it('completedAt timestamp', () => expect(typeof summary.completedAt).toBe('string'))
  it('all correct', () => { const s = completeSession('s2', results.map(r=>({...r,correct:true})), questions, config, 60); expect(s.score.pct).toBe(100); expect(s.weakTopics).toEqual([]) })
  it('all wrong', () => { const s = completeSession('s3', results.map(r=>({...r,correct:false})), questions, config, 60); expect(s.score.pct).toBe(0) })
  it('empty results', () => { const s = completeSession('s4', [], questions, config, 60); expect(s.score.pct).toBe(0); expect(s.score.total).toBe(0) })
})
