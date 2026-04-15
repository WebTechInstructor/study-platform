import { createContext, useContext, useState, useEffect } from 'react'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let attempts = 0
    const base = import.meta.env.BASE_URL

    async function load() {
      try {
        const [appCfg, subject, questions, media] = await Promise.all([
          fetch(`${base}content/subjects.json`).then(r => { if (!r.ok) throw new Error('subjects'); return r.json() }),
          fetch(`${base}content/wset-l3/subject.json`).then(r => { if (!r.ok) throw new Error('subject'); return r.json() }),
          fetch(`${base}content/wset-l3/questions.json`).then(r => { if (!r.ok) throw new Error('questions'); return r.json() }),
          fetch(`${base}content/wset-l3/media.json`).then(r => { if (!r.ok) throw new Error('media'); return r.json() }),
        ])
        setContent({ appCfg, subject, questions, media })
        setLoading(false)
      } catch (err) {
        if (attempts === 0) {
          attempts++
          setTimeout(load, 1500) // silent retry once
        } else {
          setError(err)
          setLoading(false)
        }
      }
    }

    load()
  }, [])

  return (
    <ContentContext.Provider value={{ ...content, loading, error }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext)
