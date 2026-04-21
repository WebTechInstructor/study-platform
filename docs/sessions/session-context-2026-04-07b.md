# Study platform — session context
**Date:** April 7, 2026
**Session:** 5 of ongoing (second file)

---

## Decisions made this session

### NavBar
- Active view indicator: background pill behind active nav item
- Account indicator: initials circle (e.g. TH) when logged in, person icon when anonymous
- Hamburger animates to X via pure CSS transforms — no JS in animation
- `VIEWS` array in NavBar is single source of truth for nav items
- CSS breakpoint classes keep both layouts in DOM — no conditional rendering, no layout flicker
- `.navbar-desktop-only` — `display: flex` above 640px, `display: none` below
- `.navbar-mobile-only` — inverse of above
- Account appears in mobile menu as full row with initials + name + "Account" label
- Anonymous mobile menu shows "Sign in" in account row

### NavBar props
```js
{ currentView, onNavigate, user, appConfig }
// appConfig = { name, logoUrl, subjectTitle }
// user = null for anonymous, { name } for logged in
```

### App.jsx — view resolution
- `VIEWS` object map: `{ dashboard, quiz, flashcards, media, results }`
- Unknown hash values fall back to Dashboard — no blank screen
- Every view receives identical prop shape — adding a view = one line in VIEWS map

### App.jsx — prop shape passed to every view
```js
{
  subject, questions, media,        // from ContentContext
  progress, sessions, prefs,        // from ProgressContext
  onSaveAttempt, onSaveSession,     // write methods
  onSavePrefs, onNavigate           // write + routing
}
```

### First-run detection
- Condition: `questionHistory` is empty AND `sessions` is empty
- Only shown when `currentView === 'dashboard'`
- After "Start studying" CTA → `navigate('dashboard')` — welcome screen never shown again

### Error handling
- `ErrorScreen` retry calls `window.location.reload()` — re-triggers ContentContext fetch from scratch
- `LoadingScreen` shows a simple CSS spinner — no library needed

---

## New components added to file structure

```
src/
├── components/
│   ├── LoadingScreen.jsx       ← new
│   ├── ErrorScreen.jsx         ← new
│   ├── NavBar.jsx              ← complete
│   ├── ScoreRing.jsx           ← complete
│   ├── TopicBadge.jsx          ← complete
│   ├── MarkdownRenderer.jsx    ← complete
│   └── EmptyState.jsx          ← complete
└── views/
    ├── Welcome/
    │   └── index.jsx           ← new
    ├── Dashboard/
    ├── Quiz/
    ├── Flashcards/
    ├── Media/
    └── Results/
```

---

## Complete component status

| File | Status |
|---|---|
| `main.jsx` | Complete |
| `App.jsx` | Complete |
| `components/NavBar.jsx` | Complete |
| `components/ScoreRing.jsx` | Complete |
| `components/TopicBadge.jsx` | Complete |
| `components/MarkdownRenderer.jsx` | Complete |
| `components/EmptyState.jsx` | Complete |
| `components/LoadingScreen.jsx` | Complete |
| `components/ErrorScreen.jsx` | Complete |
| `context/ContentContext.jsx` | Complete |
| `context/ProgressContext.jsx` | Complete |
| `hooks/useRouter.js` | Complete |
| `hooks/useLogo.js` | Complete |
| `hooks/useContent.js` | Complete |
| `hooks/useProgress.js` | Complete |
| `views/Welcome/index.jsx` | Complete |
| `views/Dashboard/index.jsx` | Designed — not yet coded |
| `views/Quiz/` (5 files) | Designed — not yet coded |
| `views/Flashcards/` (2 files) | Designed — not yet coded |
| `views/Media/` (3 files) | Designed — not yet coded |
| `views/Results/` (3 files) | Designed — not yet coded |
| `engine/` (6 files + tests) | Designed — not yet coded |

---

## Full updated file structure

```
study-platform/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── .gitignore
├── README.md
├── docs/
│   └── sessions/
│
├── public/
│   ├── content/
│   │   ├── subjects.json
│   │   └── wset-l3/
│   │       ├── subject.json
│   │       ├── questions.json
│   │       └── media.json
│   ├── icons/
│   └── manifest.json
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── engine/
    │   ├── buildSession.js
    │   ├── evaluateAnswer.js
    │   ├── recordAttempt.js
    │   ├── completeSession.js
    │   ├── shuffle.js
    │   ├── sampleProportional.js
    │   └── engine.test.js
    ├── context/
    │   ├── ContentContext.jsx
    │   └── ProgressContext.jsx
    ├── hooks/
    │   ├── useRouter.js
    │   ├── useProgress.js
    │   ├── useContent.js
    │   └── useLogo.js
    ├── views/
    │   ├── Welcome/index.jsx
    │   ├── Dashboard/index.jsx
    │   ├── Quiz/
    │   │   ├── index.jsx
    │   │   ├── SessionConfig.jsx
    │   │   ├── QuestionCard.jsx
    │   │   ├── AnswerFeedback.jsx
    │   │   └── ProgressBar.jsx
    │   ├── Flashcards/
    │   │   ├── index.jsx
    │   │   └── FlashCard.jsx
    │   ├── Media/
    │   │   ├── index.jsx
    │   │   ├── MediaCard.jsx
    │   │   └── MediaPlayer.jsx
    │   └── Results/
    │       ├── index.jsx
    │       ├── QuestionReview.jsx
    │       └── TopicBreakdown.jsx
    ├── components/
    │   ├── NavBar.jsx
    │   ├── ScoreRing.jsx
    │   ├── TopicBadge.jsx
    │   ├── MarkdownRenderer.jsx
    │   ├── EmptyState.jsx
    │   ├── LoadingScreen.jsx
    │   └── ErrorScreen.jsx
    └── styles/
        └── index.css
```

---

## Carried forward from sessions 1–4

See previous session context files for:
- Full schema snapshots (`session-context-2026-04-01.md`)
- Engine function designs (`session-context-2026-04-01.md`)
- Component architecture and dependency list (`session-context-2026-04-02.md`)
- Dashboard, Quiz, Flashcards, Media, Results view designs (`session-context-2026-04-04b.md`)
- Shared components and contexts (`session-context-2026-04-07.md`)

---

## Where we stopped

All components, contexts, hooks, and views are fully designed.
Design phase is complete. Ready to move into the build phase.

### Next up — build phase
1. **Project scaffolding** — `npm create vite`, Tailwind install, folder structure
2. **Engine first** — write and test all pure functions with Vitest
3. **Contexts** — ContentContext, ProgressContext
4. **Shared components** — in dependency order
5. **Views** — Dashboard first, then Quiz, Flashcards, Media, Results
6. **Content authoring** — first WSET L3 question set in JSON
7. **GitHub Actions** — deployment workflow to GitHub Pages

---

## Open questions for future sessions

- Account creation flow — where and when to prompt anonymous users?
- Retry missed only in Results — include missed flashcard attempts alongside quiz misses?
- Multi-subject — subject switcher in nav or separate selection screen?
- `index.css` — define all Tailwind custom classes and CSS variables before building views
- Engine tests — what edge cases to cover? (empty pool, all wrong, count > pool size)
