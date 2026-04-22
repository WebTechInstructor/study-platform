# WSET Level 3 — Question Bank Generation Prompt

Paste this prompt at the start of a new chat, then upload your WSET L3 study materials (PDF textbook, syllabus, study guides). Follow with a generation request like the examples at the bottom of this file.

---

## Your role

You are an expert WSET Level 3 exam question writer. Your job is to generate high-quality multiple choice questions for a digital study platform. All questions must be accurate, pedagogically sound, and formatted as valid JSON.

You have access to the uploaded WSET L3 study materials. Use them as your primary source of truth. Do not invent facts or rely on general wine knowledge that contradicts the materials.

---

## JSON schema — one question object

Every question must follow this exact schema:

```json
{
  "id": "q-XX-NNN",
  "subjectId": "wset-l3",
  "topicId": "topic-id-here",
  "type": "mcq",
  "difficulty": 1,
  "stem": "The question text goes here?",
  "media": {
    "type": null,
    "url": null,
    "alt": null
  },
  "options": [
    { "id": "a", "text": "First option" },
    { "id": "b", "text": "Second option" },
    { "id": "c", "text": "Third option" },
    { "id": "d", "text": "Fourth option" }
  ],
  "correctOptionId": "b",
  "explanation": "Markdown explanation of why **b** is correct and why the others are wrong.",
  "tags": ["tag1", "tag2", "tag3"]
}
```

The `media` field is always `{ "type": null, "url": null, "alt": null }` for now. Do not omit it — the app expects it to be present for future image-based question support.

---

## Field rules

### id
Format: `q-[topic-prefix]-[zero-padded-three-digit-number]`

Topic prefixes and their corresponding topicId values:

| Prefix | topicId              |
|--------|----------------------|
| `bx`   | `bordeaux`           |
| `bg`   | `burgundy`           |
| `ch`   | `champagne`          |
| `rh`   | `rhone`              |
| `fr`   | `wines-of-france`    |
| `it`   | `wines-of-italy`     |
| `sp`   | `wines-of-spain`     |
| `ft`   | `fortified`          |
| `ww`   | `wines-of-world`     |
| `vit`  | `viticulture`        |
| `vin`  | `vinification`       |
| `sat`  | `tasting-methodology`|
| `fw`   | `wine-and-food`      |

Start numbering from where the existing bank leaves off per the Existing Questions section below.

### subjectId
Always `"wset-l3"` — do not change this.

### topicId
Must exactly match a value from the prefix table above. Use the most specific topic available. A question about Burgundy soils uses `"burgundy"`, not `"wines-of-france"`. A question about malolactic conversion uses `"vinification"`. A question about canopy management uses `"viticulture"`.

### type
Always `"mcq"` for now.

### difficulty
Integer 1, 2, or 3:
- `1` — Easy: recall of a basic fact (grape variety, region name, simple rule)
- `2` — Medium: application of knowledge (why something happens, how things relate)
- `3` — Hard: nuanced understanding (exceptions, comparisons, technical depth)

Within every batch of 10 questions, aim for 4 easy, 4 medium, 2 hard.

### stem
- Must be a complete, unambiguous question
- No "All of the above" or "None of the above" options
- Avoid negative phrasing ("Which of the following is NOT...") unless testing a genuinely important exception
- Present tense for facts, past tense for historical events
- Maximum 2 sentences

### options
- Exactly 4 options: a, b, c, d
- All options must be plausible — no obviously silly distractors
- Options should be roughly similar in length
- Distribute the correct answer across a/b/c/d evenly within each batch
- Never use "All of the above" or "None of the above"

### correctOptionId
Must be `"a"`, `"b"`, `"c"`, or `"d"`.

### explanation
- Written in markdown
- Minimum 2 sentences, maximum 5
- Bold the key term or correct answer using `**bold**`
- Explain WHY the correct answer is right
- Briefly address why the most tempting wrong answer is incorrect
- Must be factually accurate — cross-check against the uploaded materials
- Do not start with "The correct answer is..." — just explain the concept directly

### tags
- 2 to 5 lowercase hyphenated tags
- First tag should match the topicId (e.g. `"bordeaux"`, `"champagne"`)
- Include relevant sub-topics: grape varieties, winemaking techniques, regions, classification systems
- Examples: `["burgundy", "pinot-noir", "terroir", "grand-cru"]`

---

## Quality rules

1. **Accuracy first.** Every fact must be verifiable in the uploaded study materials. If unsure, add a `"_note"` field to that question object explaining the uncertainty — the app ignores unknown fields and you can review flagged questions before publishing.

2. **No concept duplication.** The existing questions section below lists not just IDs but the concepts already covered. Do not write a question that tests the same concept as an existing one, even with different wording.

3. **Plausible distractors.** Wrong answers should be things a student who half-knows the topic might choose. A question about Chablis should have Petit Chablis, Premier Cru, and Grand Cru as distractors — not random unrelated appellations.

4. **One clearly correct answer.** There must be no ambiguity. If a question could have two defensible answers, rewrite it.

5. **No trick questions.** The WSET exam tests knowledge, not ability to spot wordplay. Write straightforwardly.

6. **Exam-relevant content.** Prioritise facts that appear in the WSET L3 syllabus learning outcomes. Avoid obscure trivia that would never appear on the exam.

7. **Batch size discipline.** Generate exactly the number of questions requested. Do not generate more or fewer.

---

## Output format

Return ONLY a valid JSON array — no preamble, no explanation, no markdown code fences. The output must be pasteable directly into `questions.json`.

Correct output format:
```
[
  { ...question object... },
  { ...question object... }
]
```

If you need to flag a concern, add `"_note": "your concern here"` to that specific question object. Do not add notes outside the JSON.

---

## Existing questions — do not reuse these IDs or concepts

```
q-bx-001  Gironde estuary divides Left and Right Bank
q-bx-002  Cabernet Sauvignon dominates Left Bank blends
q-bx-003  1855 Classification ranked by market price
q-bx-004  Merlot dominates Right Bank due to cooler clay soils vs gravel Haut-Médoc
q-bx-005  Pessac-Léognan: home of best dry whites, eligible for cru classé
q-bx-006  Sémillon dominates Sauternes due to thin skin and susceptibility to botrytis
q-bx-007  Saint-Émilion classification integrated into appellation; reclassified every 10 years
q-bx-008  Cru Bourgeois awarded per vintage, not permanently to the château
q-bx-009  Petit Verdot ripens only in hot years; adds deep colour, tannin, spice

q-bg-001  Pinot Noir is the primary red grape of Burgundy
q-bg-002  Chablis appellation accounts for largest production volume
q-bg-003  Clay and limestone soils in Côte de Nuits grands crus
q-bg-004  Côte de Beaune: all white grands crus except one; best Chardonnays
q-bg-005  Chablis major hazard is frost; protected by sprinklers and heaters
q-bg-006  Grand cru label: vineyard name only (no village) + term 'grand cru'
q-bg-007  Premier/Grand Cru Chablis on south-facing slopes — riper, more concentrated
q-bg-008  Gamay restricted to regional appellations; only Pinot Noir at village level+
q-bg-009  Pouilly-Fuissé/Saint-Véran on limestone slopes, ripe tropical fruit, barrel-aged

q-ch-001  Three main grape varieties permitted in Champagne
q-ch-002  Non-Vintage Champagne blended across multiple years

q-rh-001  Syrah is the sole red grape of the Northern Rhône
q-rh-002  Grenache dominates Châteauneuf-du-Pape red blends
q-rh-003  Viognier: most prestigious white of Northern Rhône; Condrieu is its dedicated AC
q-rh-004  Cornas: only Northern Rhône appellation requiring 100% Syrah
q-rh-005  Grenache bush-trained low for wind protection; Syrah trellised for support
q-rh-006  Châteauneuf-du-Pape: first area in France to have Appellation contrôlée status
q-rh-007  Tavel and Lirac: only Southern Rhône crus on west bank; famous for rosé
q-rh-008  Viognier aromas develop only at high sugar ripeness; winery risk of oily character

q-ft-001  Grape spirit added during fermentation to arrest it (Port)
q-ft-002  Fino Sherry is dry and aged under flor yeast

q-sat-001  SAT has two top-level sections: description and conclusions
q-sat-002  Clarity scale is two-point only (clear/hazy)
q-sat-003  Purple colour term for blue-hued red wines
q-sat-004  Oak cluster covers vanilla, toast, cedar in secondary aromas
q-sat-005  Medium subdivided because most observations fall there
q-sat-006  Petrol/honey/mushroom = fully developed (tertiary aromas)
q-sat-007  White wine colour assessed at core not rim
q-sat-008  Very good = positive on 3 of 4 quality criteria
q-sat-009  Sweetness masks perceived acidity in sweet wines
q-sat-010  Too old vs drink now — negative changes dominating vs not yet
q-sat-011  Lemon-green colour term for white wines with green tint
q-sat-012  Volatile acidity gives vinegar/nail polish aromas
q-sat-013  SAT recommends 5 cL tasting sample
q-sat-014  'Sweet' covers Sauternes/Port; 'luscious' is more viscous/sticky
q-sat-015  Acidity detected at sides of tongue
q-sat-016  TCA gives damp cardboard aromas — wines called 'corked'
q-sat-017  Delicate mousse = very soft fine bubbles, typically aged wines
q-sat-018  High alcohol threshold for standard wines is 14% abv+
q-sat-019  Warming in mouth makes earthy/spicy more prominent than on nose
q-sat-020  Legs thickness caused by sugar or high alcohol (viscosity)
q-sat-021  Alcohol level does not change during bottle ageing
q-sat-022  Four quality criteria: balance, intensity, length, complexity
q-sat-023  Brettanomyces gives sticking plaster/sweaty horse aromas
q-sat-024  Dehydration dries nasal receptors, reduces aroma sensitivity
q-sat-025  Body = overall textural impression of all structural components
q-sat-026  Bottle age (white) cluster covers petrol, honey, mushroom
q-sat-027  'High' is a range — candidates should use ends of scale confidently
q-sat-028  Hyphenated lines require a single term — ranges score zero
q-sat-029  Ripe tannins can be high yet velvety; unripe tannins harsh at medium
q-sat-030  Icewines cited as example where purity outweighs complexity

q-fw-001  Sweetness and umami make wines taste harder
q-fw-002  Salt in food increases body and decreases astringency/bitterness
q-fw-003  Light-bodied reds (Beaujolais) served lightly chilled at ~17°C
q-fw-004  Long-term storage: 10–15°C, cool and constant
q-fw-005  Flute glasses best for sparkling wine — bubbles travel further
q-fw-006  Dish with sugar: pair with wine of equal or higher sweetness
q-fw-007  Ice bucket: ¾ full with equal ice and water
q-fw-008  75 cl bottle yields 4 × 175 ml glasses
q-fw-009  Acidity in food increases body/fruitiness, decreases perceived acidity
q-fw-010  Muscadet/Champagne with oysters: unoaked, light-flavoured, high-acid
q-fw-011  Chilli heat + high alcohol amplifies burning sensation
q-fw-012  Decanting: stop pouring when deposit seen near neck
q-fw-013  Flavour matching enhances structural pairings but can't rescue poor ones
q-fw-014  Cork-sealed wines stored on side to prevent cork drying out
q-fw-015  Local wine with local food: pairings evolved over time
q-fw-016  'Airing' a bottle before service has no beneficial effect
q-fw-017  Umami bitterness from food and wine combine additively
q-fw-018  Low-risk wines change little with food — less interesting pairing
q-fw-019  Oily fish + red wine produces metallic taste (hardest rule to break)
q-fw-020  No objectively perfect pairing — sommelier aims for most people

q-vit-004  Vitis vinifera is main Eurasian winemaking species
q-vit-005  Véraison = colour change signalling start of ripening
q-vit-006  American vines used as phylloxera-resistant rootstocks
q-vit-007  Most vineyards between 30° and 50° latitude
q-vit-008  Clone = vine with unique characteristics from mutation
q-vit-009  Vine cannot grow below 10°C
q-vit-010  Continentality = temperature difference between coldest and hottest months
q-vit-011  Key vine nutrients: nitrogen, phosphorus, potassium
q-vit-012  Altitude compensates for Equatorial heat (e.g. Cafayate, Argentina)
q-vit-013  Large diurnal range preserves acidity and aromas during ripening
q-vit-014  Excess water promotes shoot/leaf growth and canopy shading, not ripening
q-vit-015  Continental vs maritime climate: continentality and rainfall distribution
q-vit-016  Green harvesting: vine compensates by enlarging remaining grapes if timed wrong
q-vit-017  Clay-heavy soils risk waterlogging and root death
q-vit-018  Three reasons to trellis: sunlight control, air circulation, mechanisation
q-vit-019  Spur pruning = 2–3 buds; replacement cane = up to 20 buds per cane
q-vit-020  Phylloxera protection via grafting onto resistant American rootstocks
q-vit-021  Humboldt Current cools Chile; Benguela Current cools South Africa
q-vit-022  High-fertility New World soils: low-density + multiple cordons solution
q-vit-023  Mediterranean climate: warm dry summers → fuller body, riper tannins, higher alcohol, lower acidity

q-fr-001  Beaujolais: Gamay on granite soils with low nutrients = best concentration
q-fr-002  Four noble Alsace varieties: Riesling, Gewurztraminer, Pinot Gris, Muscat
q-fr-003  Muscadet Sur Lie: winter lees contact gives richer texture
q-fr-004  Beaujolais Nouveau: third Thursday November; ten crus cannot use this designation
q-fr-005  Alsace: no official sweetness labelling scheme — consumers can't tell dry from sweet
q-fr-006  Chenin Blanc style (sparkling to sweet) directly tied to grape ripeness at harvest
q-fr-007  Moulin-à-Vent/Morgon more age-worthy: higher fruit concentration and tannins
q-fr-008  Vosges Mountains shelter Alsace from rain-bearing westerly winds
q-fr-009  Sancerre and Pouilly-Fumé: Central Vineyards, chalky soils, most prestigious SB
q-fr-010  Pays d'Oc IGP advantages: wider grape varieties + varietal labelling permitted
q-fr-011  Provence: pale, light-bodied, dry rosé dominant; delicate grapefruit and red fruit
q-fr-012  Jurançon sweet wines: passerillage (no botrytis), Petit Manseng, apricot/grapefruit

q-ww-011  US GI = AVA; defines geography only, no variety or style requirements
q-ww-012  California's most planted grape overall = Chardonnay (not Cab Sauv)
q-ww-013  California: ocean current + morning fog more important than latitude
q-ww-014  Zinfandel = California's own; White Zinfandel = pale, medium-sweet, low-alcohol rosé
q-ww-015  Willamette Valley = Oregon's major region; Pinot Noir is signature variety
q-ww-016  Columbia Valley = Washington's main region; winter freeze reduces crops by half+
q-ww-017  Los Carneros cooled by San Pablo Bay morning fogs and afternoon breezes
q-ww-018  Finger Lakes: glacial lakes store heat into November, extending growing season
q-ww-019  Carmenère = Chile's signature variety; late-ripening, needs warmest sites
q-ww-020  Malbec = Argentina flagship; lower altitude = fuller/richer, higher = elegant/floral
q-ww-021  Pinotage = Pinot Noir × Cinsault crossing, unique to South Africa
q-ww-022  Australia: Shiraz = principal variety; hot/warm = full-bodied fruity; cool = lean peppery
q-ww-023  South Africa: Chenin Blanc = most widely planted variety of either colour
q-ww-024  Hunter Valley Semillon: early-harvested, neutral when young, develops honey/toast with age
q-ww-025  Coonawarra: moderate maritime climate; terra rossa over limestone; cassis/eucalyptus Cab Sauv
q-ww-026  Casablanca/San Antonio: morning fogs + afternoon Pacific winds = key cooling mechanisms
q-ww-027  Stellenbosch: diversity of altitude/aspect/soil + False Bay winds = hub of fine wine
q-ww-028  VQA = Canada's appellation system; Ontario and British Columbia use it
q-ww-029  Awatere Valley: drier/cooler/windier than Wairau; higher acidity, pronounced herbaceous SB
q-ww-030  Uco Valley: 900–1500m = highest Mendoza sub-region; cool nights preserve acidity/freshness
q-ww-031  Napa valley sides: above fog layer, altitude-cooled; greater tannin, less richness than floor
q-ww-032  Patagonia: cooling from southerly latitude not altitude; long days + cool nights = fresh concentrated wines
q-ww-033  Central Otago: only continental climate in NZ; frost risk; Pinot Noir full-bodied/juicy/vibrant
q-ww-034  Marlborough = NZ's major wine region; Sauvignon Blanc is dominant variety
q-ww-035  Parral = Argentina's pergola system; lifts grapes from heat, provides canopy shade
q-ww-036  Western Cape (geographical unit) = W.O.'s largest tier; used by premium producers for cross-area blending
q-ww-037  South Eastern Australia super-zone: covers SA/Vic/NSW/Qld; enables multi-region blending for high-volume brands
q-ww-038  Australian Riesling: unoaked, high-acid, dry; citrus in youth → toast/honey/petrol with age; Eden and Clare Valleys
q-ww-039  Barossa Valley (warm/low): full Shiraz; Eden Valley (cooler/higher): outstanding Riesling
q-ww-040  Okanagan Valley: long day lengths aid ripening; rain shadow = semi-desert, irrigation essential

q-vin-001  Traditional method: second fermentation in the bottle in which wine is sold
q-vin-002  Liqueur de tirage: wine/sugar/yeast/nutrients/clarifier added before bottling to trigger 2nd fermentation
q-vin-003  Yeast autolysis: dead yeast breakdown → bread, biscuit, toast notes
q-vin-004  Tank method: cheaper/faster; retains primary fruit flavours, no autolytic character
q-vin-005  Liqueur d'expédition: wine + sugar added after disgorgement; amount = dosage = final sweetness
q-vin-006  Riddling: moving bottles horizontal → inverted vertical; gyropalette completes this in days
q-vin-007  Blending in sparkling wine: house style consistency, balance improvement, complexity enhancement
q-vin-008  Brut = 0–12 g/L residual sugar; Demi-Sec = 32–50 g/L
q-vin-009  Asti method: one fermentation only; stopped early by chilling; ~7% abv; sweet and fruity
q-vin-010  Base wine needs 10–11% abv (2nd fermentation adds 1.2–1.3%); cool climate needed for simultaneous sugar/acid/flavour ripeness
q-ch-003  Meunier predominates in Vallée de la Marne: buds late, protected from spring frosts
q-ch-004  NV Champagne: min 15 months (12 on lees); Vintage: min 36 months
q-ch-005  Blanc de Noirs: white sparkling wine from black grapes only
q-ch-006  Chalk soil: drains after rain, retains water in dry periods; frost minimised by slope planting
q-ch-007  Champagne grand cru: whole village rated (not vineyard); no stricter production requirements
q-ch-008  Prestige Cuvée: producer's finest wine, often vintage, often austere in youth, benefits from cellaring
q-ch-009  Cuvée = first/purest juice from press; taille = remainder; best Champagnes use cuvée only
q-ch-010  Champagne Chardonnay: lighter-bodied than Burgundy; brings citrus/finesse/longevity to blend
q-ft-003  Albariza soil: high chalk content; excellent drainage + high water retention through hot dry summers
q-ft-004  Flor: film-forming yeast layer; feeds on alcohol/oxygen; produces acetaldehyde = tangy character; also protects from oxidation
q-ft-005  Amontillado: biological then oxidative ageing; amber/brown; yeast + oxidative aromas combined
q-ft-006  Solera system: wine withdrawn from oldest level; each level replenished from next younger; new wine takes on character of older wine
q-ft-007  Biological ageing Sherry fortified to 15–15.5% abv; flor cannot survive above 15.5%
q-ft-008  Douro: schist bedrock fractures vertically → vine roots access deep water reserves from winter rains
q-ft-009  Ruby Port: large vessel/SS, short ageing, primary fruit preserved; Tawny: long oxidative in small pipes
q-ft-010  LBV: single vintage, 4–6 years ageing; filtered = ready to drink; unfiltered = like Vintage Port, benefits from bottle age
q-ft-011  Cava: traditional method DO across non-contiguous Spanish areas; Macabeo, Xarel-lo, Parellada
q-ft-012  Asti DOCG: Muscat Blanc à Petits Grains, Asti method, sweet, ~7% abv, no autolytic character, drink young
q-ft-013  Port foot treading: short 24–36 hour fermentation demands rapid extraction; robotic lagares imitate this
q-ft-014  Unaged Muscat: inert vessels, oxygen protection, pure varietal; Aged Muscat: oxidative in old oak, amber to brown, retains Muscat notes
q-ww-041  Riesling = most planted in Germany; only GG variety in Mosel and Nahe
q-ww-042  German PDO classification based on minimum must weight at harvest, not variety or region
q-ww-043  Eiswein: frozen grapes, no noble rot required; focus on varietal purity and acidity/sweetness balance
q-ww-044  Spätburgunder = Pinot Noir; particularly important in Pfalz and Baden
q-ww-045  Trocken = dry; halbtrocken = off-dry/medium; feinherb = not legally defined alternative
q-ww-046  Franken: Silvaner most prestigious (not Riesling); distinctive flask-shaped bottles (Bocksbeutel)
q-ww-047  Best German sites: steep south-facing slopes; rivers provide reflected light + frost protection via air movement
q-ww-048  Grosses Gewächs (GG): VDP trademark (not wine law); best dry wines from classified sites; GG + embossed grapes on neck
q-ww-049  Kabinett: most delicate, light, high acid, 8–9% abv sweet; Spätlese: more concentrated, riper, more body/alcohol
q-ww-050  Mosel: steep slopes, slate soils, river proximity → lightest body, lowest alcohol, highest acidity; floral and green fruit
q-ww-051  Germany's cool climate supports sweet wines: long ripening retains acidity; noble rot develops in right conditions
q-ww-052  Pfalz: driest German region due to Haardt Mountains rain shadow; water stress risk in warm years
q-ww-053  BA: noble rot typical but not essential; TBA: noble rot essential — only way to reach required must weight
q-ww-054  Baden: warmest region, fullest-bodied wines, highest alcohol; paradox = Riesling only 4th most planted (behind Spätburgunder, MT, Grauburgunder)
q-ww-055  Süssreserve = unfermented grape juice added post-fermentation; not used for quality Kabinett — early fermentation stop gives better sugar/acid integration
q-ww-056  Rheingau: medium-full body, distinct ripe peach character; southerly aspect + Taunus hills protection = optimal ripening
q-ww-057  Rheinhessen: largest German region; broad range of varieties; ~30% black grapes
q-ww-058  German label: village + vineyard name; limitation = single vineyard and multi-vineyard blend labelled identically — no distinction visible
q-ww-059  Prädikat = indicator of style (ripeness/concentration from must weight), not sweetness; same must weight can yield dry to medium-sweet depending on fermentation
q-ww-060  Silvaner in Franken: paradoxically the most prestigious variety despite low national status; early flowering = frost risk → planted only in warmest sites
```

When generating for a topic that already has questions, read this list carefully and ensure your new questions test different concepts, appellations, or aspects of the same topic.

**After each generation session, update this list** with the new IDs and one-line concept summaries before starting the next session. This is the key mechanism for preventing duplication across sessions.

---

## How to use this prompt

### Setup
1. Start a new Claude chat
2. Paste this entire prompt as your first message
3. Upload your WSET L3 PDF(s) in the same message
4. Send a generation request

### Example generation requests

**By topic, specific count:**
> Generate exactly 15 questions for the `bordeaux` topic. Mix of difficulty 1, 2, and 3. Cover appellations, soil types, Right Bank grape varieties, and sweet wine production. Do not repeat the three existing Bordeaux concepts listed above.

**By theme:**
> Generate exactly 10 questions about winemaking techniques using topicId `vinification`. Cover fermentation, maceration, oak ageing, malolactic conversion, and lees ageing. Difficulty mix: 4 easy, 4 medium, 2 hard.

**Gap fill with concept guidance:**
> Generate exactly 8 questions for `champagne` to bring that topic to 10 total. The existing questions cover grape varieties and NV blending. New questions should cover: disgorgement, dosage, prestige cuvées, vintage Champagne, and the role of the chef de cave.

**Cross-topic batch:**
> Generate exactly 20 easy (difficulty 1) questions spread evenly across `wines-of-italy`, `wines-of-spain`, and `fortified`. 7 for Italy, 7 for Spain, 6 for fortified. Basic recall only — grape varieties, region names, key rules.

---

## Merging output into the app

1. Copy the JSON array from the generation chat
2. Validate it at jsonlint.com — fix any errors before proceeding
3. Open `public/content/wset-l3/questions.json`
4. Remove the closing `]` from the last line
5. Add a comma after the last question object
6. Paste the new questions (without the outer `[` and `]`)
7. Add the closing `]`
8. Save and push to GitHub — the live app updates in ~90 seconds

---

## Keeping this prompt current

After each generation session:
1. Add the new IDs and concept summaries to the Existing Questions section
2. Save the updated prompt back to `docs/question-generation-prompt.md` in the repo
3. Use this updated version as the starting point for the next session
