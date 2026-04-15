/**
 * Computes session summary after all questions are answered.
 * Pure — caller is responsible for saving the returned record.
 *
 * @param {string} sessionId
 * @param {Object[]} results      - array of AnswerResult objects
 * @param {Object[]} questions    - full question array from content
 * @param {Object}  config        - session config (mode, topicId, etc.)
 * @param {number}  weakThreshold - from subject.weakTopicThreshold
 * @returns {Object} SessionSummary
 */
export function completeSession(sessionId, results, questions, config, weakThreshold) {
  const correct = results.filter(r => r.correct).length
  const total   = results.length
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0

  // Build a lookup map for quick question → topic resolution
  const questionMap = questions.reduce((acc, q) => {
    acc[q.id] = q
    return acc
  }, {})

  // Group results by topicId
  const byTopic = results.reduce((acc, r) => {
    const topicId = questionMap[r.questionId]?.topicId ?? 'unknown'
    acc[topicId] = acc[topicId] ?? []
    acc[topicId].push(r)
    return acc
  }, {})

  // Score per topic
  const topicScores = Object.entries(byTopic).map(([topicId, rs]) => ({
    topicId,
    correct:  rs.filter(r => r.correct).length,
    total:    rs.length,
    pct:      Math.round(rs.filter(r => r.correct).length / rs.length * 100),
  }))

  // Topics below weak threshold
  const weakTopics = topicScores
    .filter(t => t.pct < weakThreshold)
    .map(t => t.topicId)

  // Question IDs answered incorrectly — for "retry missed" feature
  const missedQuestionIds = results
    .filter(r => !r.correct)
    .map(r => r.questionId)

  return {
    id:               sessionId,
    subjectId:        config.subjectId,
    mode:             config.mode,
    topicIds:         config.topicId ? [config.topicId] : null,
    questionIds:      results.map(r => r.questionId),
    score:            { correct, total, pct },
    topicScores,
    weakTopics,
    missedQuestionIds,
    completedAt:      new Date().toISOString(),
  }
}
