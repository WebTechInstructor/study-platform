import { shuffle } from './shuffle.js'
import { sampleProportional } from './sampleProportional.js'
export function buildSession(config, questions) {
  const { topicId, mode, difficulty, count } = config
  if (mode === 'exam') return sampleProportional(questions, count).map(q => q.id)
  let pool = topicId ? questions.filter(q => q.topicId === topicId) : questions
  if (difficulty != null) pool = pool.filter(q => q.difficulty === difficulty)
  if (pool.length === 0) return []
  return shuffle(pool).slice(0, count).map(q => q.id)
}
