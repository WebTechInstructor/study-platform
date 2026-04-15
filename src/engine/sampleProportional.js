import { shuffle } from './shuffle.js'

/**
 * Samples questions evenly across topic groups.
 * Used for exam mode to ensure proportional topic coverage.
 * @param {Array} questions
 * @param {number} count
 * @returns {Array}
 */
export function sampleProportional(questions, count) {
  const byTopic = questions.reduce((acc, q) => {
    acc[q.topicId] = acc[q.topicId] ?? []
    acc[q.topicId].push(q)
    return acc
  }, {})

  const groups = Object.values(byTopic)
  const perGroup = Math.ceil(count / groups.length)

  return groups
    .flatMap(qs => shuffle(qs).slice(0, perGroup))
    .slice(0, count)
}
