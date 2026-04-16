const STORAGE_KEY = 'studyplatform:progress'
export function recordAttempt(result, sessionId) {
  let progress
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    progress = raw ? JSON.parse(raw) : { questionHistory: {}, syncStatus: 'local' }
  } catch { progress = { questionHistory: {}, syncStatus: 'local' } }
  const existing = progress.questionHistory[result.questionId] ?? { attempts: [] }
  existing.attempts.push({ answeredAt: result.answeredAt, selectedOptionId: result.selectedOptionId, correct: result.correct, sessionId })
  progress.questionHistory[result.questionId] = existing
  progress.syncStatus = 'pending'
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch(e) { console.warn(e) }
}
