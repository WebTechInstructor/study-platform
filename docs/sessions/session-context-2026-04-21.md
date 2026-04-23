# Study platform — session context
**Date:** April 21, 2026
**Session:** 9 of ongoing

---

## Status: live, content authoring in progress

**Live URL:** https://webtechinstructor.github.io/study-platform/

---

## Completed this session

### Question bank workflow established
- Generation prompt created and refined: `docs/question-generation-prompt.md`
- Prompt reviewed by external model — all four flagged gaps addressed:
  1. Concept list added to existing questions section (not just IDs)
  2. Full prefix → topicId mapping table added (ww, vit, vin, sat now included)
  3. Batch size discipline added — "generate exactly N questions"
  4. `media` field stubbed as `{ "type": null, "url": null, "alt": null }` for future image questions
- Workflow: paste prompt + upload PDF → generate → validate at jsonlint.com → merge into questions.json → push

### subject.json updated with new topics
Four new topics added to support questions generated with new topicIds:
```json
{ "id": "wines-of-world",      "title": "Wines of the World",  "parentId": null, "order": 5 },
{ "id": "viticulture",         "title": "Viticulture",          "parentId": null, "order": 6 },
{ "id": "vinification",        "title": "Vinification",         "parentId": null, "order": 7 },
{ "id": "tasting-methodology", "title": "Tasting methodology",  "parentId": null, "order": 8 }
```
Full topic list now: wines-of-france, bordeaux, burgundy, champagne, rhone, wines-of-italy, wines-of-spain, fortified, wines-of-world, viticulture, vinification, tasting-methodology

### media.json rebuilt (22 entries)
- 10 maps: France, Italy, Spain, Germany, Austria, Portugal, Greece, South Africa, Argentina, North America
- 6 podcast stubs: wines-of-france, wines-of-italy, wines-of-spain, fortified, vinification, wines-of-world
- 6 PDF stubs: tasting-methodology (SAT grid), wines-of-france, wines-of-italy, wines-of-spain, viticulture, vinification
- All stubs have `REPLACE WITH...` placeholders for URLs, titles, descriptions

**Note on South Africa map filename:** uploaded as `south-america.png` — should be renamed to `south-africa.png` on Drive to avoid confusion. URL in media.json uses current filename.

**Google Drive image URL format for inline preview:**
```
https://drive.google.com/uc?export=view&id=FILE_ID
```
Use `export=view` not `export=download` for inline image rendering. Warning: Drive may redirect larger files through a virus scan page — if images fail to load, consider hosting in `public/icons/` instead.

### MediaPlayer.jsx — map preview fixed
- Previous: placeholder div showing "Map preview" text
- Fixed: renders actual `<img>` tag using item URL
- Image is tappable — opens full screen in new tab
- `onError` handler hides broken image and shows "Image unavailable" fallback
- File: `src/views/Media/MediaPlayer.jsx`

---

## Content authoring status

### Question bank
- 12 starter questions in place across bordeaux, burgundy, champagne, rhone, fortified
- Additional questions generated this session (exact count unknown — added by user)
- Cleanup pass deferred until full question bank is complete
- Cleanup checklist (for future session):
  - Validate all topicIds against subject.json
  - Check for concept duplicates
  - Verify difficulty distribution per topic (target: 40% easy, 40% medium, 20% hard)
  - Confirm ID format consistency (q-[prefix]-[NNN])
  - Remove any `_note` fields left from generation
  - Final JSON validation at jsonlint.com

### Media
- 10 maps ready — need real Google Drive URLs substituted
- 6 podcast stubs — need real URLs, titles, descriptions, durations
- 6 PDF stubs — need real URLs, titles, descriptions

---

## Key file locations

| File | Purpose |
|---|---|
| `public/content/wset-l3/questions.json` | Question bank — edit to add questions |
| `public/content/wset-l3/media.json` | Media library — edit to add/update media |
| `public/content/wset-l3/subject.json` | Subject config, topics list |
| `public/content/subjects.json` | App config, subject index |
| `docs/question-generation-prompt.md` | Reusable prompt for question generation sessions |
| `src/views/Media/MediaPlayer.jsx` | Map/audio/video/PDF player component |

---

## Deployment reminder

```bash
git add .
git commit -m "describe what changed"
git push
```
GitHub Actions deploys automatically. Live in ~90 seconds.

---

## Carried forward

See previous session context files for full architecture, component inventory, engine design, and UI decisions. All prior decisions stand.

---

## Where we stopped

Content authoring in progress. Media.json rebuilt and deployed. Map preview fixed.

### Next up (priority order)
1. **Finish question bank** — continue generating questions by topic using the prompt
2. **Substitute real URLs** into media.json (Drive links for maps, podcast links, PDF links)
3. **Question bank cleanup pass** — validate, deduplicate, check difficulty distribution
4. **README** — setup instructions, content authoring guide, how to add subjects
5. **Results in nav** — decision still pending: add as top-level nav item?

---

## Open questions
- Should Results appear as a top-level nav item?
- Custom domain for GitHub Pages?
- README target audience — developers, content authors, or both?
- Rename `south-america.png` to `south-africa.png` on Drive before substituting URL
