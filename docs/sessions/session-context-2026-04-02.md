# Study platform — session context
**Date:** April 2, 2026
**Session:** 2 of ongoing

---

## Decisions made this session

### Resolved from session 1 open questions

- **`weakTopicThreshold`** — configurable per subject in `subject.json`. No platform fallback. Subject authors set it explicitly alongside `passThreshold`.
- **Flashcard self-rating** — binary only: got it / missed it. Feeds into same `questionHistory` as quiz attempts.
- **Dashboard streak logic** — one study day = 24 hours.
- **Results screen explanations** — show explanation for all answers, correct and incorrect.

### Navigation
- Top nav on both mobile and desktop
- Desktop: full label row with account initials circle on the right
- Mobile: hamburger menu, drops down as a stacked list
- One `NavBar` component handles both breakpoints via CSS media query at 640px
- Anonymous users see a person icon + "Sign in" label — never a gate, always a value prompt
- Subject name displayed alongside app name in nav (e.g. "Cru · WSET L3") — useful when multiple subjects are supported

### Dependencies (lean list)
| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI |
| `react-markdown` | Render explanation markdown |
| `vite` | Build tool |
| `tailwindcss` | Styling |

No React Router, no Redux, no Zustand, no fetch abstraction library.

### Routing
- Custom `useRouter` hook using the browser History API
- Exposes `navigate(view)` and `currentView`
- ~30 lines of code, no external dependency

### State management
- Two React Contexts only:
  - `ContentContext` — loaded once on mount, read only (questions, topics, media)
  - `ProgressContext` — read/write, owns all localStorage interaction
- Convenience hooks: `useContent()` and `useProgress()` wrap the contexts

---

## subject.json config block (updated)

Three engine-shaping values in every subject pack:
```json
{
  "passThreshold": 65,
  "weakTopicThreshold": 60,
  "examDurationMins": 120
}
```

---

## File structure

```
study-platform/
├── index.html                        # Vite entry point
├── vite.config.js
├── tailwind.config.js
├── package.json
├── .gitignore
├── README.md
├── docs/
│   └── sessions/                     # Session context files
│
├── public/
│   ├── content/
│   │   ├── subjects.json             # Subject index — array of available packs
│   │   └── wset-l3/
│   │       ├── subject.json
│   │       ├── questions.json
│   │       └── media.json
│   ├── icons/                        # PWA icons, favicon
│   └── manifest.json                 # PWA manifest — ready for later
│
└── src/
    ├── main.jsx                      # React DOM render, context wrappers
    ├── App.jsx                       # Content fetch, router outlet
    │
    ├── engine/                       # Pure functions — zero React imports
    │   ├── buildSession.js
    │   ├── evaluateAnswer.js
    │   ├── recordAttempt.js
    │   ├── completeSession.js
    │   ├── shuffle.js
    │   ├── sampleProportional.js
    │   └── engine.test.js            # Unit tests — Vitest
    │
    ├── context/
    │   ├── ContentContext.jsx
    │   └── ProgressContext.jsx
    │
    ├── hooks/
    │   ├── useRouter.js
    │   ├── useProgress.js
    │   └── useContent.js
    │
    ├── views/
    │   ├── Dashboard/
    │   │   └── index.jsx
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
    │
    ├── components/                   # Shared across views
    │   ├── NavBar.jsx
    │   ├── ScoreRing.jsx
    │   ├── TopicBadge.jsx
    │   ├── MarkdownRenderer.jsx
    │   └── EmptyState.jsx
    │
    └── styles/
        └── index.css                 # Tailwind directives, CSS custom properties
```

### subjects.json index file
```json
[
  { "id": "wset-l3", "title": "WSET Level 3 Award in Wines" }
]
```
Adding a new subject = create a new folder under `public/content/` and add an entry here. No code changes required.

---

## Component architecture

### App.jsx responsibilities
- Fetch `subjects.json` and the active subject's three JSON files on mount
- Populate `ContentContext`
- Render `NavBar` + current view via `useRouter`

### NavBar.jsx props
```js
{ currentView, onNavigate, user }
// user is null for anonymous sessions
```

### Engine function locations
All in `src/engine/` — no React imports anywhere in this folder.

| File | Signature |
|---|---|
| `buildSession.js` | `(config, questions, history) → string[]` |
| `evaluateAnswer.js` | `(question, selectedOptionId) → AnswerResult` |
| `recordAttempt.js` | `(result, sessionId) → void` — only side-effectful function |
| `completeSession.js` | `(sessionId, results, questions) → SessionSummary` |

---

## Carried forward from session 1

See `session-context-2026-04-01.md` for full schema snapshots and engine function designs.

---

## Where we stopped

File structure confirmed. Ready to move into individual view components.

### Next up
1. **View components** — Dashboard, Quiz, Flashcards, Media, Results
2. **Shared components** — NavBar, ScoreRing, MarkdownRenderer, TopicBadge, EmptyState
3. **Context implementations** — ContentContext, ProgressContext
4. **useRouter hook** — History API implementation

---

## Open questions for future sessions

- Flashcard swipe direction convention — right = got it, left = missed it?
- Dashboard — how many days to show in streak / history view?
- Account creation flow — where and when to prompt anonymous users?
- `EmptyState` — what does a first-run experience look like before any progress exists?
- Error states — what does the app show if a content JSON file fails to load?
