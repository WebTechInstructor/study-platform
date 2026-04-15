import { shuffle } from './shuffle.js'
import { sampleProportional } from './sampleProportional.js'

/**
 * Resolves which questions are in play for a session.
 * Returns an ordered array of question IDs — no side effects.
 *
 * @param {Object} config
 * @param {string|null} config.topicId   - null means all topics
 * @param {string}      config.mode      - 'practice' | 'timed' | 'exam'
 * @param {number|null} config.difficulty - 1 | 2 | 3 | null means all
 * @param {number}      config.count     - max questions in session
 * @param {Array}       questions        - full question array from content
 * @returns {string[]} ordered array of question IDs
 */
export function buildSession(config, questions) {
  const { topicId, mode, difficulty, count } = config

  // Exam mode — sample proportionally across all topics
  if (mode === 'exam') {
    return sampleProportional(questions, count).map(q => q.id)
  }

  // Filter by topic
  let pool = topicId
    ? questions.filter(q => q.topicId === topicId)
    : questions

  // Filter by difficulty
  if (difficulty != null) {
    pool = pool.filter(q => q.difficulty === difficulty)
  }

  // Guard — empty pool
  if (pool.length === 0) return []

  // Shuffle and slice to requested count
  return shuffle(pool).slice(0, count).map(q => q.id)
}
