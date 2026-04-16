import { useState, useEffect, useCallback } from 'react'
export function useRouter() {
  const [currentView, setCurrentView] = useState(() => window.location.hash.slice(1) || 'dashboard')
  useEffect(() => {
    const handle = () => setCurrentView(window.location.hash.slice(1) || 'dashboard')
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [])
  const navigate = useCallback((view) => { window.location.hash = view; setCurrentView(view) }, [])
  return { currentView, navigate }
}
