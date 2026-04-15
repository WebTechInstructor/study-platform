import { useState, useEffect, useCallback } from 'react'

/**
 * Hash-based router using window.location.hash.
 * URLs: /#dashboard, /#quiz, /#flashcards, /#media, /#results
 * Sidesteps GitHub Pages 404 problem — no server config needed.
 */
export function useRouter() {
  const [currentView, setCurrentView] = useState(
    () => window.location.hash.slice(1) || 'dashboard'
  )

  useEffect(() => {
    function handlePop() {
      setCurrentView(window.location.hash.slice(1) || 'dashboard')
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navigate = useCallback((view) => {
    window.location.hash = view
    setCurrentView(view)
  }, [])

  return { currentView, navigate }
}
