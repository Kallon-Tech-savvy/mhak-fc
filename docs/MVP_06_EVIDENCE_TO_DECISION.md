# MHAK FC — MVP 06: evidence to decision, offline

**Status:** Tools tested with synthetic records only. **No real participant interviews or usability results were carried out in this work.** The MVP is still unaccepted, and hosting remains paused.

## Why this step exists

Automated page checks establish that links work and layouts reflow, not that an aspiring footballer understands the message. MVP 05 supplied a facilitator tool and neutral tasks. MVP 06 helps the founder **summarise and prioritise actual observed issues**, without creating false claims of demand or statistical certainty.

## Start with the browser (no coding required)

1. Conduct short, consent-based sessions with adult participants using `qa/offline_usability_lab.html` and the local `public/index.html` website.
2. Save each participant's anonymous observations and **export JSON** from the facilitator tool. Export before closing the page; it does not persist sessions.
3. Open `qa/offline_findings_review.html` locally in a browser.
4. Select one or more exported JSON files, press **Review findings**, examine the five-task summary and prioritised review queue, then **Export decision memo**.
5. Before modifying the site, read the original anonymous observations locally, challenge interpretations, and retest the smallest correction.

The browser reviewer and lab have **no accounts, tracking, external scripts, network requests or automatic storage**. They live outside `public/` and are not deployed as website files.

**Input format:** JSON exported by the MHAK MVP 05 lab (study `MHAK FC offline first-click pilot`, `schemaVersion: 1`). CSV exports are not supported in the browser reviewer. Use unique anonymous participant IDs across multiple JSON files; duplicate IDs are rejected rather than silently counted twice.

## Optional developer CLI

The dependency-free CLI accepts the same export format:

```bash
node qa/summarise_usability.mjs qa/exports/pilot-a.json qa/exports/pilot-b.json --output research-reports/mhak-pilot.md
```

The input files are read locally; no HTTP connections are made. By default, the report prints to standard output unless `--output` is supplied. Its report excludes raw participant notes and does not claim that imported records represent real people.

`qa/exports/`, `qa/results/`, `research-exports/` and `research-reports/` are gitignored to reduce accidental publishing of private notes. Keep observations anonymous, secure and short-lived. Do not commit participant data.

## Interpreting results

Prioritise in this order:

1. **Misleading safety or recruitment assumptions:** Any visitor who believes trials, team places or registrations are available when they are not. Investigate and fix before acceptance.
2. **Blocked core task:** Participants cannot identify the current club status or find essential information.
3. **Repeated major friction:** Confusing labels, wrong first clicks or difficulty opening a founding story.
4. **Minor friction or preference:** Review later unless it prevents comprehension.

The tools use a *triage score*, which is deliberately not an MVP quality score or a measure of product-market fit. Do not calculate demand percentages or an acceptance percentage from five to eight qualitative sessions.

## Verification completed

- Browser reviewer: headless Chromium at 320, 390, 768 and 1280 CSS pixels.
- Synthetic JSON import, task counting, error queue, markdown export, reset, and invalid-file rejection passed.
- Automated Node test suite checks input validation, duplicate IDs, raw quote exclusion, misconception priority, CLI execution and fail-closed invalid input.
- GitHub CI runs the site tests, static source audit, staging safety checks and release build.

**Outstanding:** Real consenting adult sessions, Android/iOS hands-on check of the offline workflow, facilitator interpretation, factual content review and explicit product-owner acceptance.

**Not in scope:** Hosting, Cloudflare, DNS, production contact processing, player registrations or real recruitment.
