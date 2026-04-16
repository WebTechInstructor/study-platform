export function evaluateAnswer(question, selectedOptionId) {
  return {
    questionId: question.id,
    selectedOptionId,
    correctOptionId: question.correctOptionId,
    correct: question.correctOptionId === selectedOptionId,
    explanation: question.explanation,
    answeredAt: new Date().toISOString(),
  }
}
