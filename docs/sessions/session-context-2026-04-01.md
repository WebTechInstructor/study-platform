# Study platform — session context
**Date:** April 1, 2026
**Session:** 1 of ongoing

---

## Project overview

A multi-modal, mobile-friendly web app to help students prepare for the WSET Level 3 certification exam. The broader goal is a reusable studying platform — a content engine that can be fed JSON data for any subject. All decisions should keep accessibility, usability, and flexibility in mind.

---

## Core principles

- Content layer is fully decoupled from the presentation layer
- Everything is JSON-driven and subject-agnostic
- Pure functions wherever possible — side effects isolated to a single boundary
- Schema decisions made with future extensibility in mind, not over-engineered for launch

---

## Architecture: three layers

### 1. Content layer (JSON schemas)
Static files hosted in the GitHub repo. Fully swappable per subject.

- `subject.json` — subject pack config and metadata
- `questions.json` — question objects
- `topics.json` — topic hierarchy (nested via `parentId`)
- `media.json` — audio, video, PDF references
- Flashcards reuse question content — no separate schema needed

### 2. Study engine (pure functions)
- `buildSession(config, questions, history)` — resolves question pool, shuffles, returns ordered ID array
- `evaluateAnswer(question, selectedOptionId)` — scores a single answer, returns result object, no side effects
- `recordAttempt(result, sessionId)` — **only function that writes to localStorage**, flags `syncStatus: "pending"` for backend sync
- `completeSession(sessionId, results, questions)` — computes score, topic breakdown, weak areas

### 3. Presentation layer (React PWA)
Five UI sections:
- **Quiz** — timed, practice, exam modes
- **Flashcards** — flip/swipe, self-rate, feeds same `questionHistory` as quiz
- **Media library** — audio, video, maps, PDFs linked by `topicId`
- **Dashboard** — progress, topics, streaks
- **Results & review** — score, per-question explanations, weak area callouts

---

## Key decisions

### Storage & sync
- **Strategy:** localStorage first, optional backend sync unlocked by account creation
- **Anonymous sessions:** `userId: null`, `deviceId: uuid-local`
- **Sync flag:** `syncStatus: "local" | "synced" | "pending"` on progress object
- **On account creation:** flip `userId`, set `syncStatus: "pending"`, push existing localStorage data up — no data loss

### Auth
- Anonymous by default, accounts are a value-add not a gate
- Accounts unlock cross-device sync and long-term progress tracking

### Hosting
- Static site on GitHub Pages
- Lightweight stateless serverless functions (Vercel or Netlify) for optional backend
- No traditional database required at launch — Supabase free tier or JSON file storage via GitHub API are both viable
- Backend never receives question content — only progress data

### Offline support
- Always-online for now
- Schema and architecture do not preclude adding PWA service workers later
- Content as static JSON makes future caching straightforward

### Question types
- **Launch:** MCQ only
- Every question has a `type` field (`"mcq"` | `"short-answer"` | `"image"`) for future extensibility
- Adding short-answer later requires new rendering and scoring logic only — schema and progress tracking unchanged

### Question selection
- **Launch:** pure random within topic
- **v2:** weighted — unseen and previously missed questions surface first
- **v3 hook:** `nextReviewAt` field already present in `questionHistory` for SM-2 spaced repetition

### Exam mode
- Fixed question count
- Timed
- Show correct answer and explanation after each question (not deferred to end)
- Questions sampled proportionally across all topics via `sampleProportional()`

### Media
- Absolute URLs only — app does not care where files are hosted
- `sourceType` field (`"spotify"` | `"youtube"` | `"self-hosted"` | `"pdf"` | `"image"`) for future native embedding
- Loose enum — never strictly validated so new sources never break anything
- Media items linked to `topicId` for contextual surfacing alongside study content

---

## Schema snapshots

### subject.json
```json
{
  "id": "wset-l3",
  "version": "1.0.0",
  "title": "WSET Level 3 Award in Wines",
  "passThreshold": 65,
  "weakTopicThreshold": 60,
  "examDurationMins": 120,
  "topics": [
    { "id": "wines-of-france", "title": "Wines of France", "parentId": null, "order": 1 },
    { "id": "bordeaux", "title": "Bordeaux", "parentId": "wines-of-france", "order": 1 }
  ]
}
```

### questions.json (single question)
```json
{
  "id": "q-bx-001",
  "subjectId": "wset-l3",
  "topicId": "bordeaux",
  "type": "mcq",
  "difficulty": 2,
  "stem": "Which grape variety dominates red Bordeaux blends?",
  "media": null,
  "options": [
    { "id": "a", "text": "Merlot" },
    { "id": "b", "text": "Cabernet Sauvignon" },
    { "id": "c", "text": "Cabernet Franc" },
    { "id": "d", "text": "Malbec" }
  ],
  "correctOptionId": "b",
  "explanation": "Cabernet Sauvignon dominates on the Left Bank...",
  "tags": ["grapes", "left-bank", "blending"]
}
```
- `explanation` supports markdown
- `difficulty` is author-assigned (1 easy → 3 hard), not computed
- `media` field present for future image-based questions

### progress.json (localStorage)
```json
{
  "subjectId": "wset-l3",
  "subjectVersion": "1.0.0",
  "deviceId": "uuid-local",
  "userId": null,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "questionHistory": {
    "q-bx-001": {
      "attempts": [
        {
          "answeredAt": "2026-04-01T14:22:00Z",
          "selectedOptionId": "b",
          "correct": true,
          "sessionId": "sess-001"
        }
      ],
      "nextReviewAt": "2026-04-08T00:00:00Z"
    }
  }
}
```

### sessions.json (localStorage)
```json
{
  "id": "sess-001",
  "subjectId": "wset-l3",
  "mode": "practice",
  "topicIds": ["bordeaux"],
  "questionIds": ["q-bx-001"],
  "startedAt": "2026-04-01T14:20:00Z",
  "completedAt": "2026-04-01T14:35:00Z",
  "score": { "correct": 18, "total": 20, "pct": 90 }
}
```

### media.json (single item)
```json
{
  "id": "media-001",
  "subjectId": "wset-l3",
  "topicId": "burgundy",
  "type": "podcast",
  "title": "Burgundy's Grand Cru Hierarchy Explained",
  "description": "...",
  "url": "https://open.spotify.com/episode/...",
  "sourceType": "spotify",
  "durationMins": 34,
  "tags": ["burgundy", "classification", "pinot-noir"]
}
```

---

## Where we stopped

Schema and quiz engine logic are complete. Next session picks up with:

1. **React component architecture** — how the UI consumes the engine
2. **Results & review screen** — design deferred until after schema/engine were solid
3. **Flashcard UI** — flip/swipe interaction, self-rating feeding into `questionHistory`
4. **Dashboard** — progress visualization, weak area recommendations

---

## Open questions for future sessions

- `weakTopicThreshold` (currently 60%) — make configurable per subject or keep as a platform default?
- Flashcard self-rating scale — binary (got it / missed it) or 3-point (easy / hard / missed)?
- Dashboard streak logic — define what counts as a study day
- Results screen — show explanations for correct answers or only incorrect?
