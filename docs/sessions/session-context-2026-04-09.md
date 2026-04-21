# Study platform — session context
**Date:** April 9, 2026
**Session:** 6 of ongoing

---

## Status: all views complete

The application is fully built. All five views are implemented with real data — no stubs remaining.

### Build status
- Production build: clean
- Tests: 28 passing
- Bundle: ~106kb gzipped

---

## Views completed this session

### Dashboard — `src/views/Dashboard/index.jsx`
- `computeStreak(sessions)` — 7-day streak from session records, pure JS
- `computeTopicScores(topics, questions, questionHistory)` — per-topic accuracy, pure JS
- `lastStudiedLabel(dateStr)` — human-readable relative date
- `barColor(pct, weakThreshold)` — green / amber / red based on subject threshold
- Top-level topics only shown (filtered by `!parentId`)
- Study mode grid navigates to correct view on tap
- Topic rows navigate to quiz on tap

### Quiz — `src/views/Quiz/` (4 files)
**`index.jsx`** — state machine: `config` → `active` → `complete`
- `handleStart` — calls `buildSession`, saves prefs via `onSavePrefs`
- `handleAnswer` — calls `evaluateAnswer`, writes via `onSaveAttempt`
- `handleNext` — advances index or calls `completeSession` and transitions to complete
- `handleRetryMissed` — rebuilds deck from `missedQuestionIds`
- Session ID generated once on mount: `'sess-' + Date.now() + '-' + random`

**`SessionConfig.jsx`**
- Topic dropdown with all top-level topics + "All topics"
- Difficulty pills: All / Easy / Medium / Hard
- Live pool count via `buildSession` with `count: 9999`
- Disabled start button + "No questions match" when pool empty
- Sessions capped at 20 questions even if pool is larger
- Saves last used topic + difficulty to prefs on start

**`QuestionCard.jsx`**
- Progress bar (current / total)
- TopicBadge per question
- Option states: default / correct / wrong / dimmed after answering
- Inline feedback with left border accent (green correct, red incorrect)
- Explanation rendered via MarkdownRenderer
- Button label: "Next question →" or "See results →" on last question

**`ResultsSummary.jsx`** (inside Quiz flow)
- Summary tab: score hero, stat cards, topic breakdown, action buttons
- Review tab: all questions expandable, missed pre-expanded, correct collapsed
- "Study [weak topic]" button — dynamic from `weakTopics` in SessionSummary
- "Study weak topics" when multiple weak topics
- "Retry missed" — calls `onRetryMissed(missedQuestionIds)`
- "New session" — returns to config phase

### Flashcards — `src/views/Flashcards/` (2 files)
**`FlashCard.jsx`**
- CSS 3D flip on tap (rotateY 180deg)
- Exit animation: slide left (got it) or slide right (missed it), 280ms
- `key={currentQuestion.id}` forces remount between cards — resets flip state cleanly
- Stacked card illusion behind active card
- Got it / Missed it buttons always visible

**`index.jsx`**
- Deck shuffled with Fisher-Yates on mount
- Got it → `evaluateAnswer(question, question.correctOptionId)` → `correct: true`
- Missed it → `evaluateAnswer(question, wrongOptionId)` → `correct: false`
- Both write via `onSaveAttempt` — same `questionHistory` as Quiz
- Session complete screen: score %, got/missed/total, shuffle again, review missed, back to dashboard
- "Review missed" restarts with only missed cards reshuffled
- Empty state handled

### Media — `src/views/Media/` (3 files)
**`index.jsx`**
- Grouped by type: Podcasts → Videos → Maps → PDFs
- Empty groups skipped (no orphan section headers)
- One item open at a time — expanding collapses previous
- Empty state handled

**`MediaCard.jsx`**
- Type icon with color-coded dot (podcast=amber, map=green, pdf=red, video=purple)
- Arrow rotates 90° when open
- First tag shown as topic pill

**`MediaPlayer.jsx`** — switches on `sourceType`:
- `spotify` / `youtube` → iframe embed
- `self-hosted` podcast → native `<audio>` with play/pause, scrub, timestamps
- `image` / map → preview placeholder + open full screen + download links
- `pdf` / `self-hosted` non-podcast → open in browser + download PDF buttons

### Results — `src/views/Results/` (3 files)
**`index.jsx`**
- Session picker: shows last 5 sessions by date with score pill (hidden if only 1 session)
- Defaults to most recent session on mount
- Summary tab: score hero with pass/fail, duration, mode, date; stat cards; topic breakdown; action buttons
- Review tab: delegates to QuestionReview
- "Review answers" tab switch
- "New session" navigates to quiz

**`TopicBreakdown.jsx`**
- Per-topic bar with green/amber/red color encoding
- "needs work" badge below `weakTopicThreshold`
- correct/total label per topic

**`QuestionReview.jsx`**
- Missed questions pre-expanded via `Set(missedQuestionIds)`
- Correct questions collapsed by default
- All options shown, correct answer highlighted green
- Explanation via MarkdownRenderer
- Handles empty `questionIds` gracefully

---

## Key implementation details

### completeSession called twice in Quiz flow
In `Quiz/index.jsx`, `completeSession` is called in `handleNext` (to save the session) and again in the `complete` phase render (to get the summary for display). This is safe because it's a pure function — same inputs, same output. The saved session record comes from `handleNext`; the display summary is recomputed from the same data.

### Flashcard correct/wrong recording
- Got it: passes `question.correctOptionId` as `selectedOptionId` → `correct: true`
- Missed it: passes first non-correct option ID as `selectedOptionId` → `correct: false`
- This integrates cleanly with `questionHistory` and spaced repetition hooks

### Session ID format
```js
'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
// e.g. sess-1712620800000-a3f2k
```
Flashcard sessions use `'flash-'` prefix for easy identification.

---

## Complete file inventory

```
src/
├── App.jsx                           ✓ complete
├── main.jsx                          ✓ complete
├── engine/
│   ├── buildSession.js               ✓ complete + tested
│   ├── evaluateAnswer.js             ✓ complete + tested
│   ├── recordAttempt.js              ✓ complete + tested
│   ├── completeSession.js            ✓ complete + tested
│   ├── shuffle.js                    ✓ complete + tested
│   ├── sampleProportional.js         ✓ complete + tested
│   └── engine.test.js                ✓ 28 tests passing
├── context/
│   ├── ContentContext.jsx            ✓ complete
│   └── ProgressContext.jsx           ✓ complete
├── hooks/
│   ├── useRouter.js                  ✓ complete
│   └── useLogo.js                    ✓ complete
├── components/
│   ├── NavBar.jsx                    ✓ complete
│   ├── index.jsx                     ✓ complete (TopicBadge, MarkdownRenderer,
│   │                                             ScoreRing, EmptyState,
│   │                                             LoadingScreen, ErrorScreen)
├── views/
│   ├── Welcome/index.jsx             ✓ complete
│   ├── Dashboard/index.jsx           ✓ complete
│   ├── Quiz/
│   │   ├── index.jsx                 ✓ complete
│   │   ├── SessionConfig.jsx         ✓ complete
│   │   ├── QuestionCard.jsx          ✓ complete
│   │   └── ResultsSummary.jsx        ✓ complete
│   ├── Flashcards/
│   │   ├── index.jsx                 ✓ complete
│   │   └── FlashCard.jsx             ✓ complete
│   ├── Media/
│   │   ├── index.jsx                 ✓ complete
│   │   ├── MediaCard.jsx             ✓ complete
│   │   └── MediaPlayer.jsx           ✓ complete
│   └── Results/
│       ├── index.jsx                 ✓ complete
│       ├── TopicBreakdown.jsx        ✓ complete
│       └── QuestionReview.jsx        ✓ complete
└── styles/
    └── index.css                     ✓ complete
```

---

## What remains

### Next up
1. **GitHub Actions deployment workflow** — auto-deploy to GitHub Pages on push to main
2. **Content authoring** — expand WSET L3 question set beyond the 12 starter questions
3. **README** — setup and content authoring instructions for the repo

### Known improvements for future sessions
- `completeSession` called twice in Quiz flow — acceptable now, could be memoized later
- `ScoreRing` component built but not yet used in Dashboard or Results (inline SVG used instead) — wire up in a polish pass
- Media iframe embeds will show placeholder content until real URLs are added to `media.json`
- NavBar does not yet show Results as a nav item — Results is accessed via Quiz flow or Dashboard

---

## Open questions for future sessions
- Account creation flow — where and when to prompt anonymous users?
- Should Results appear as a top-level nav item?
- README content — target audience developers or content authors?
- How many additional WSET L3 questions to author before first real use?
