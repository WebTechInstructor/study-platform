import { useContent } from './context/ContentContext.jsx'
import { useProgress } from './context/ProgressContext.jsx'
import { useRouter } from './hooks/useRouter.js'
import { NavBar } from './components/NavBar.jsx'
import { LoadingScreen, ErrorScreen } from './components/index.jsx'
import { Welcome } from './views/Welcome/index.jsx'
import { Dashboard } from './views/Dashboard/index.jsx'
import { Quiz } from './views/Quiz/index.jsx'
import { Flashcards } from './views/Flashcards/index.jsx'
import { Media } from './views/Media/index.jsx'
import { Results } from './views/Results/index.jsx'

const VIEWS = { dashboard: Dashboard, quiz: Quiz, flashcards: Flashcards, media: Media, results: Results }

export default function App() {
  const { appCfg, subject, questions, media, loading, error } = useContent()
  const { progress, sessions, prefs, saveAttempt, saveSession, savePrefs } = useProgress()
  const { currentView, navigate } = useRouter()

  if (loading) return <LoadingScreen />
  if (error)   return <ErrorScreen onRetry={() => window.location.reload()} />

  const isFirstRun = Object.keys(progress.questionHistory).length === 0 && sessions.length === 0
  const appConfig  = { ...appCfg.app, subjectTitle: subject.title }

  if (isFirstRun && currentView === 'dashboard') {
    return (
      <>
        <NavBar currentView={currentView} onNavigate={navigate} user={null} appConfig={appConfig} />
        <main className="app-main">
          <Welcome subject={subject} onStart={() => navigate('dashboard')} />
        </main>
      </>
    )
  }

  const ViewComponent = VIEWS[currentView] ?? Dashboard

  return (
    <>
      <NavBar currentView={currentView} onNavigate={navigate} user={null} appConfig={appConfig} />
      <main className="app-main">
        <ViewComponent
          subject={subject} questions={questions} media={media}
          progress={progress} sessions={sessions} prefs={prefs}
          onSaveAttempt={saveAttempt} onSaveSession={saveSession}
          onSavePrefs={savePrefs} onNavigate={navigate}
        />
      </main>
    </>
  )
}
