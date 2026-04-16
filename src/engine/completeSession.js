export function completeSession(sessionId, results, questions, config, weakThreshold) {
  const correct = results.filter(r => r.correct).length
  const total   = results.length
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0
  const questionMap = questions.reduce((acc, q) => { acc[q.id] = q; return acc }, {})
  const byTopic = results.reduce((acc, r) => {
    const topicId = questionMap[r.questionId]?.topicId ?? 'unknown'
    acc[topicId] = acc[topicId] ?? []
    acc[topicId].push(r)
    return acc
  }, {})
  const topicScores = Object.entries(byTopic).map(([topicId, rs]) => ({
    topicId, correct: rs.filter(r => r.correct).length, total: rs.length,
    pct: Math.round(rs.filter(r => r.correct).length / rs.length * 100),
  }))
  return {
    id: sessionId, subjectId: config.subjectId, mode: config.mode,
    topicIds: config.topicId ? [config.topicId] : null,
    questionIds: results.map(r => r.questionId),
    score: { correct, total, pct }, topicScores,
    weakTopics: topicScores.filter(t => t.pct < weakThreshold).map(t => t.topicId),
    missedQuestionIds: results.filter(r => !r.correct).map(r => r.questionId),
    completedAt: new Date().toISOString(),
  }
}
