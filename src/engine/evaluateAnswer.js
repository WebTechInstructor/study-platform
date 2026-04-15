/**
 * Scores a single MCQ answer.
 * Pure — no side effects, no storage writes.
 *
 * @param {Object} question        - full question object from content
 * @param {string} selectedOptionId - the option ID the student chose
 * @returns {Object} AnswerResult
 */
export function evaluateAnswer(question, selectedOptionId) {
  const correct = question.correctOptionId === selectedOptionId

  return {
    questionId:       question.id,
    selectedOptionId,
    correctOptionId:  question.correctOptionId,
    correct,
    explanation:      question.explanation,
    answeredAt:       new Date().toISOString(),
  }
}
