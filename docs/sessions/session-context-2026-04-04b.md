# Study platform — session context
**Date:** April 4, 2026
**Session:** 3 of ongoing (second file — afternoon)

---

## Decisions made this session

### Quiz view
- Student configures: topic + difficulty filter
- Tab order: Question → Feedback → Configure (configure last — student-oriented, not process-oriented)
- Answer feedback appears inline below the question
- After answering: wrong selection highlighted red, correct answer always highlighted green, other options dimmed
- Feedback block uses left border accent for readability
- "No questions match these filters" state disables start button when pool is empty
- Quiz state machine: `config` → `active` → `complete`

### Flashcards view
- Swipe direction: left = got it, right = missed it
- Tap card to flip (front → answer)
- Binary rating only: got it / missed it
- Both callbacks write to `recordAttempt` with `correct: true/false` — same as quiz
- Stacked cards behind active card give physical sense of remaining deck
- Session stats (got it / missed it / remaining) update in real time
- Swipe direction hints persist above card on both front and back faces
- `FlashCard.jsx` owns flip state locally via `useState`
- `Flashcards/index.jsx` owns deck order, current index, session tallies

### Media view
- Organised by type: Podcasts, Maps, PDFs in separate groups
- Inline player — expands within the list, one item open at a time
- Expanding a new item collapses the previous one
- `sourceType` field drives player rendering in `MediaPlayer.jsx`:
  - `spotify` / `youtube` → iframe embed
  - `self-hosted` → native `<audio>` or `<video>` element
  - `pdf` → open in browser + download actions
  - `image` / SVG map → inline preview + full screen + download
- `source-badge` shown in player (e.g. "via Spotify") — transparency for student
- Maps: full screen opens URL in new tab, download triggers native fetch
- PDFs: open in browser or download — no inline render

### Results view
- Two tabs: Summary and Review answers
- Summary shows: score (correct / total), percentage, pass/fail badge, time taken, session metadata, topic breakdown, action buttons
- Pass/fail badge compares score against `passThreshold` from `subject.json`
- Topic breakdown bar color: green above `weakTopicThreshold`, amber in middle band, red below — same logic as dashboard
- "needs work" badge on topics below `weakTopicThreshold`
- Action buttons:
  - "Study [weak topic]" — dynamically generated from `weakTopics` in `SessionSummary`
  - If multiple weak topics → "Study weak topics" navigating to quiz config pre-filtered
  - If no weak topics → button does not render
  - "Retry missed only" — calls `buildSession` with pool of incorrect question IDs from this session
  - "Review answers" — switches to review tab
  - "New session" — returns to quiz config
- Review tab: incorrect answers default expanded, correct answers default collapsed
- All answers show explanation (correct and incorrect) via `MarkdownRenderer`
- Student's wrong answer labelled "your answer" for clarity

---

## All five views now designed

| View | File | Status |
|---|---|---|
| Dashboard | `views/Dashboard/index.jsx` | Complete |
| Quiz | `views/Quiz/index.jsx` + 4 sub-components | Complete |
| Flashcards | `views/Flashcards/index.jsx` + `FlashCard.jsx` | Complete |
| Media | `views/Media/index.jsx` + `MediaCard.jsx` + `MediaPlayer.jsx` | Complete |
| Results | `views/Results/index.jsx` + `QuestionReview.jsx` + `TopicBreakdown.jsx` | Complete |

---

## Carried forward from sessions 1–3

See previous session context files for:
- Full schema snapshots (`session-context-2026-04-01.md`)
- Engine function designs (`session-context-2026-04-01.md`)
- Full file structure (`session-context-2026-04-02.md`)
- Component architecture and dependency list (`session-context-2026-04-02.md`)
- Dashboard design and nav config (`session-context-2026-04-04.md`)

---

## Where we stopped

All five views are designed. The full app is now specced from schema through to every screen.

### Next up
1. **Shared components** — `NavBar`, `ScoreRing`, `TopicBadge`, `MarkdownRenderer`, `EmptyState`
2. **Context implementations** — `ContentContext`, `ProgressContext`
3. **useRouter hook** — History API implementation (~30 lines)
4. **useLogo hook** — SVG inline / image tag / text fallback
5. **Engine unit tests** — Vitest tests for all four pure functions
6. **Build scaffolding** — Vite + Tailwind + project init
7. **Content authoring** — first WSET L3 question set in JSON

---

## Open questions for future sessions

- `EmptyState` — what does first-run look like before any progress exists?
- Error states — what does the app show if a content JSON file fails to load?
- Account creation flow — where and when to prompt anonymous users?
- Should the quiz config remember the last used topic and difficulty between sessions?
- Retry missed only — should missed questions from flashcard sessions also be included?
