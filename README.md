# Cru — WSET Level 3 Study Platform

A mobile-friendly web application for preparing for the WSET Level 3 Award in Wines. Built as a content-driven study engine that can be adapted for any subject by swapping JSON content packs.

**Live:** https://webtechinstructor.github.io/study-platform/

---

## Features

- **Quiz** — practice sessions by topic and difficulty, with inline feedback and explanations
- **Flashcards** — flip cards with self-rating (got it / missed it) and session tracking
- **Media library** — maps, podcasts, and PDFs organised by type
- **Results** — session history, topic breakdown, and expandable question review
- **Dashboard** — streak tracking, per-topic accuracy, and study mode entry
- **Dark mode** — automatic, follows system preference
- **Progress tracking** — stored in localStorage, persists across sessions

---

## Running locally

**Requirements:** Node.js 18 or higher

```bash
git clone https://github.com/WebTechInstructor/study-platform.git
cd study-platform
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

```bash
npm run build      # production build
npm run test       # run engine unit tests (28 tests)
npm run preview    # preview production build locally
```

---

## Project structure

```
public/
└── content/
    ├── subjects.json              # app config and subject index
    └── wset-l3/
        ├── subject.json           # subject config, topics, thresholds
        ├── questions.json         # question bank
        └── media.json             # maps, podcasts, PDFs

src/
├── engine/                        # pure functions — no React imports
│   ├── buildSession.js
│   ├── evaluateAnswer.js
│   ├── recordAttempt.js
│   ├── completeSession.js
│   └── engine.test.js
├── context/                       # ContentContext, ProgressContext
├── hooks/                         # useRouter, useLogo
├── views/                         # Dashboard, Quiz, Flashcards, Media, Results, Welcome
├── components/                    # NavBar, shared components
└── styles/
    └── index.css                  # CSS custom properties, dark mode, all styles
```

---

## Adding questions

Questions live in `public/content/wset-l3/questions.json` as a JSON array. Each question follows this schema:

```json
{
  "id": "q-bx-004",
  "subjectId": "wset-l3",
  "topicId": "bordeaux",
  "type": "mcq",
  "difficulty": 1,
  "stem": "Your question text here?",
  "media": { "type": null, "url": null, "alt": null },
  "options": [
    { "id": "a", "text": "Option A" },
    { "id": "b", "text": "Option B" },
    { "id": "c", "text": "Option C" },
    { "id": "d", "text": "Option D" }
  ],
  "correctOptionId": "b",
  "explanation": "Markdown explanation of why **b** is correct.",
  "tags": ["bordeaux", "grapes"]
}
```

### Field reference

| Field | Values |
|---|---|
| `id` | `q-[prefix]-[NNN]` — see prefix table below |
| `topicId` | Must match a topic `id` in `subject.json` |
| `difficulty` | `1` easy · `2` medium · `3` hard |
| `type` | `"mcq"` (only supported type currently) |
| `explanation` | Supports markdown — bold with `**text**`, lists with `-` |

### Topic prefix table

| Prefix | topicId |
|---|---|
| `bx` | `bordeaux` |
| `bg` | `burgundy` |
| `ch` | `champagne` |
| `rh` | `rhone` |
| `fr` | `wines-of-france` |
| `it` | `wines-of-italy` |
| `sp` | `wines-of-spain` |
| `ft` | `fortified` |
| `ww` | `wines-of-world` |
| `vit` | `viticulture` |
| `vin` | `vinification` |
| `sat` | `tasting-methodology` |

### Using the question generation prompt

A reusable prompt for generating questions with Claude is in `docs/question-generation-prompt.md`. To use it:

1. Start a new Claude chat
2. Paste the full prompt
3. Upload your WSET L3 study materials (PDF)
4. Request a batch: *"Generate exactly 15 questions for the `bordeaux` topic..."*
5. Validate the output at [jsonlint.com](https://jsonlint.com)
6. Merge into `questions.json` and push

After each generation session, update the existing questions list in the prompt to prevent concept duplication in future sessions.

---

## Adding media

Media items live in `public/content/wset-l3/media.json`. Each item follows this schema:

```json
{
  "id": "media-001",
  "subjectId": "wset-l3",
  "topicId": "burgundy",
  "type": "podcast",
  "title": "Title of the media item",
  "description": "Brief description.",
  "url": "https://...",
  "sourceType": "spotify",
  "durationMins": 34,
  "tags": ["burgundy", "classification"]
}
```

### sourceType values

| sourceType | Renders as |
|---|---|
| `spotify` | Spotify iframe embed |
| `youtube` | YouTube iframe embed |
| `self-hosted` | Native audio player (podcast) or image preview (map) |
| `pdf` | Open in browser + download buttons |

### Google Drive image URLs

For maps hosted on Google Drive, use the view format:
```
https://drive.google.com/uc?export=view&id=FILE_ID
```
The file must be shared as "Anyone with the link can view".

---

## Adding topics

Topics are defined in `public/content/wset-l3/subject.json`. To add a new topic:

```json
{ "id": "new-topic-id", "title": "Display Name", "parentId": null, "order": 9 }
```

Set `parentId` to an existing topic `id` to create a nested subtopic (e.g. Bordeaux under Wines of France). Only top-level topics (where `parentId` is `null`) appear on the Dashboard.

---

## Adding a new subject

The platform is designed to support multiple subjects. To add one:

1. Create a new folder: `public/content/[subject-id]/`
2. Add `subject.json`, `questions.json`, and `media.json` following the existing WSET L3 structure
3. Add an entry to `public/content/subjects.json`:
   ```json
   { "id": "subject-id", "title": "Subject Display Name" }
   ```

Multi-subject navigation is not yet implemented in the UI — currently the app loads the first subject in `subjects.json` automatically.

---

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via GitHub Actions. The workflow is in `.github/workflows/deploy.yml` and runs the test suite before every deployment.

To deploy manually:
```bash
git add .
git commit -m "describe your changes"
git push
```

The live site updates within ~90 seconds.

---

## Tech stack

| | |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Testing | Vitest |
| Deployment | GitHub Pages via GitHub Actions |
| Font | DM Sans (Google Fonts) |

No routing library. No state management library. No component library.

---

## License

MIT
