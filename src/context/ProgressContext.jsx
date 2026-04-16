import { createContext, useContext, useState, useCallback } from 'react'
import { recordAttempt } from '../engine/recordAttempt.js'
const STORAGE_KEY  = 'studyplatform:progress'
const SESSIONS_KEY = 'studyplatform:sessions'
const PREFS_KEY    = 'studyplatform:prefs'
function load(key, fallback) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback } }
const ProgressContext = createContext(null)
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => load(STORAGE_KEY, { questionHistory: {}, syncStatus: 'local', userId: null, deviceId: crypto.randomUUID() }))
  const [sessions, setSessions] = useState(() => load(SESSIONS_KEY, []))
  const [prefs,    setPrefs]    = useState(() => load(PREFS_KEY, {}))
  const saveAttempt = useCallback((result, sessionId) => { recordAttempt(result, sessionId); setProgress(load(STORAGE_KEY, { questionHistory: {} })) }, [])
  const saveSession = useCallback((session) => { setSessions(prev => { const u = [...prev, session]; try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(u)) } catch(e){} return u }) }, [])
  const savePrefs   = useCallback((patch) => { setPrefs(prev => { const u = {...prev, ...patch}; try { localStorage.setItem(PREFS_KEY, JSON.stringify(u)) } catch(e){} return u }) }, [])
  return <ProgressContext.Provider value={{ progress, sessions, prefs, saveAttempt, saveSession, savePrefs }}>{children}</ProgressContext.Provider>
}
export const useProgress = () => useContext(ProgressContext)
