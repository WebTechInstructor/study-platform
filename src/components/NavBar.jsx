import { useState } from 'react'
import { useLogo } from '../hooks/useLogo.js'

const VIEWS = [
  { id: 'dashboard',  label: 'Dashboard'  },
  { id: 'quiz',       label: 'Quiz'       },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'media',      label: 'Media'      },
  { id: 'results',    label: 'Results'    }, 
]

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function AccountIndicator({ user }) {
  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
    return <div className="navbar-account">{initials}</div>
  }
  return <div className="navbar-account anon" title="Sign in"><PersonIcon /></div>
}

export function NavBar({ currentView, onNavigate, user, appConfig }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const svgContent = useLogo(appConfig?.logoUrl)

  function handleNavigate(view) { onNavigate(view); setMenuOpen(false) }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          {svgContent
            ? <span className="navbar-logo-svg" dangerouslySetInnerHTML={{ __html: svgContent }} />
            : appConfig?.logoUrl
            ? <img src={appConfig.logoUrl} className="navbar-logo-img" alt={appConfig.name} />
            : <span className="navbar-logo-text">{appConfig?.name}</span>
          }
        </div>
        {appConfig?.subjectTitle && <div className="navbar-subject">{appConfig.subjectTitle}</div>}
        <div className="navbar-items navbar-desktop-only">
          {VIEWS.map(v => (
            <div key={v.id} className={`navbar-item ${currentView === v.id ? 'active' : ''}`} onClick={() => handleNavigate(v.id)}>
              {v.label}
            </div>
          ))}
        </div>
        <div className="navbar-spacer" />
        <AccountIndicator user={user} />
        <div className={`navbar-hamburger navbar-mobile-only ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </div>
      </nav>
      <div className={`navbar-menu navbar-mobile-only ${menuOpen ? 'open' : ''}`}>
        <div className="navbar-menu-inner">
          {VIEWS.map(v => (
            <div key={v.id} className={`navbar-menu-item ${currentView === v.id ? 'active' : ''}`} onClick={() => handleNavigate(v.id)}>
              <div className={`menu-pip ${currentView === v.id ? 'active' : ''}`} />
              {v.label}
            </div>
          ))}
          <div className="navbar-menu-divider" />
          <div className="navbar-menu-account">
            <AccountIndicator user={user} />
            {user ? `${user.name} · Account` : 'Sign in'}
          </div>
        </div>
      </div>
    </>
  )
}
