# Study platform — session context
**Date:** April 7, 2026
**Session:** 4 of ongoing

---

## Decisions made this session

### First-run experience
- Welcome screen with subject overview and a "Start studying" CTA
- `subject.json` already has `description` field — add optional `heroImage` field
- `heroImage` follows same pattern as `logoUrl`: absolute URL, inline SVG if `.svg`, image tag otherwise

### Error states
- Silently retry content JSON fetch once after 1500ms
- If retry fails, show error state
- Retry logic lives in `ContentContext` / `ContentProvider`
- Known issue: `finally` block sets `loading: false` before retry fires — fix before production

### Quiz config persistence
- Persist last used topic and difficulty in localStorage
- Stored under `studyplatform:prefs` keyed by `subjectId`
- Managed via `savePrefs` method on `ProgressContext`

### Routing — important change
- Switched from History API to **hash-based routing**
- URLs: `/#dashboard`, `/#quiz`, `/#flashcards`, `/#media`, `/#results`
- Eliminates GitHub Pages 404 problem entirely — no `404.html` workaround needed
- `useRouter` reads/writes `window.location.hash`

---

## Shared components

### TopicBadge — `components/TopicBadge.jsx`
- Props: `{ topicId, topics }`
- Resolves `topicId` string to display label
- Returns `null` if topic not found
- Used in: QuestionCard, QuestionReview, MediaCard, FlashCard

### MarkdownRenderer — `components/MarkdownRenderer.jsx`
- Props: `{ content, className }`
- Single import point for `react-markdown` — never import directly in views
- Applies `.markdown` CSS class for prose styles (font size, line height, bold, lists)

### ScoreRing — `components/ScoreRing.jsx`
- Props: `{ pct, size = 80, passThreshold }`
- SVG ring, green if `pct >= passThreshold`, red otherwise
- `passThreshold` comes from `subject.json` via `useContent()`
- Used in: Dashboard topic rows, Results summary

### EmptyState — `components/EmptyState.jsx`
- Props: `{ title, message, action, onAction }`
- Used anywhere content is absent
- Optional CTA via `action` label + `onAction` handler

### NavBar — `components/NavBar.jsx`
- **Not yet implemented — next session**
- Desktop: full label row, account initials circle on right
- Mobile: hamburger, stacked dropdown menu
- One component, two breakpoints via CSS media query at 640px
- Props: `{ currentView, onNavigate, user }`

---

## Hooks

### useRouter — `hooks/useRouter.js`
- Hash-based: reads/writes `window.location.hash`
- Exposes: `{ currentView, navigate }`
- Initial view defaults to `'dashboard'` if hash is empty
- Listens to `popstate` for browser back/forward

### useLogo — `hooks/useLogo.js`
- Props: `logoUrl`
- If URL ends in `.svg`: fetches, returns raw SVG string for `dangerouslySetInnerHTML`
- Otherwise returns null (NavBar falls back to `<img>` or text)
- Safe to use `dangerouslySetInnerHTML` — source is always `public/icons/`

### useContent — `hooks/useContent.js`
- Convenience wrapper: `export const useContent = () => useContext(ContentContext)`

### useProgress — `hooks/useProgress.js`
- Convenience wrapper: `export const useProgress = () => useContext(ProgressContext)`

---

## Contexts

### ContentContext — `context/ContentContext.jsx`
- Fetches on mount: `subjects.json`, `subject.json`, `questions.json`, `media.json`
- Exposes: `{ appCfg, subject, questions, media, loading, error }`
- Silent retry: catches fetch error, waits 1500ms, retries once
- All four files fetched in parallel via `Promise.all`
- Read only — never mutated after load

### ProgressContext — `context/ProgressContext.jsx`
Three localStorage keys, three concerns:

| Key | Contents | Synced to backend? |
|---|---|---|
| `studyplatform:progress` | `questionHistory`, `syncStatus` | Yes (when accounts added) |
| `studyplatform:sessions` | completed session records | No — local only |
| `studyplatform:prefs` | last quiz topic, difficulty | No — local only |

Exposes:
- `progress` — question history, sync status
- `sessions` — array of completed session records
- `prefs` — last used quiz config per subject
- `saveAttempt(result, sessionId)` — calls `recordAttempt`, re-syncs state
- `saveSession(session)` — appends to sessions array, persists
- `savePrefs(patch)` — merges patch into prefs, persists

---

## localStorage structure (complete)

```
studyplatform:progress  → { questionHistory, syncStatus, userId, deviceId }
studyplatform:sessions  → [ ...sessionRecords ]
studyplatform:prefs     → { "wset-l3": { topicId, difficulty } }
```

---

## subject.json (updated fields)

```json
{
  "id": "wset-l3",
  "version": "1.0.0",
  "title": "WSET Level 3 Award in Wines",
  "description": "...",
  "heroImage": "/icons/hero.svg",
  "passThreshold": 65,
  "weakTopicThreshold": 60,
  "examDurationMins": 120
}
```

---

## Carried forward from sessions 1–3

See previous session context files for:
- Full schema snapshots (`session-context-2026-04-01.md`)
- Engine function designs (`session-context-2026-04-01.md`)
- Full file structure (`session-context-2026-04-02.md`)
- Component architecture and dependency list (`session-context-2026-04-02.md`)
- Dashboard, Quiz, Flashcards, Media, Results view designs (`session-context-2026-04-04.md`, `session-context-2026-04-04b.md`)

---

## Where we stopped

Shared components (all except NavBar), both contexts, and all hooks are designed.
NavBar is the only remaining shared component — deferred to next session.

### Next up
1. **NavBar** — desktop + mobile, logo rendering, active state, anonymous vs account
2. **App.jsx** — content fetch, context wrappers, router outlet, welcome screen, error state
3. **main.jsx** — React DOM render, provider nesting order
4. **Welcome screen** — first-run experience using `subject.description` and `heroImage`
5. **Engine unit tests** — Vitest tests for all four pure functions
6. **Build scaffolding** — Vite + Tailwind project init, `vite.config.js` base path

---

## Open questions for future sessions

- Account creation flow — where and when to prompt anonymous users?
- Retry missed only in Results — should missed flashcard attempts be included alongside quiz misses?
- NavBar — should the active view indicator be a bottom border on the nav item, or a background pill?
- Welcome screen — does the heroImage sit above the description, or as a full-width banner?
- Multi-subject support — when a second subject is added, does the nav show a subject switcher or a separate subject selection screen?
