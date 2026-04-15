import { createContext, useContext, useState, useCallback } from 'react'
import { recordAttempt } from '../engine/recordAttempt.js'

const STORAGE_KEY  = 'studyplatform:progress'
const SESSIONS_KEY = 'studyplatform:sessions'
const PREFS_KEY    = 'studyplatform:prefs'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() =>
    loadFromStorage(STORAGE_KEY, {
      questionHistory: {},
      syncStatus: 'local',
      userId: null,
      deviceId: crypto.randomUUID(),
    })
  )

  const [sessions, setSessions] = useState(() =>
    loadFromStorage(SESSIONS_KEY, [])
  )

  const [prefs, setPrefs] = useState(() =>
    loadFromStorage(PREFS_KEY, {})
  )

  // Write an answer attempt — calls engine function, re-syncs state
  const saveAttempt = useCallback((result, sessionId) => {
    recordAttempt(result, sessionId)
    setProgress(loadFromStorage(STORAGE_KEY, { questionHistory: {} }))
  }, [])

  // Append a completed session record
  const saveSession = useCallback((session) => {
    setSessions(prev => {
      const updated = [...prev, session]
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('studyplatform: failed to save session', e)
      }
      return updated
    })
  }, [])

  // Persist quiz config preferences keyed by subjectId
  const savePrefs = useCallback((patch) => {
    setPrefs(prev => {
      const updated = { ...prev, ...patch }
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('studyplatform: failed to save prefs', e)
      }
      return updated
    })
  }, [])

  return (
    <ProgressContext.Provider
      value={{ progress, sessions, prefs, saveAttempt, saveSession, savePrefs }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
