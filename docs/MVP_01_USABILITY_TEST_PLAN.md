# MHAK FC — MVP Definition 01: usability and evidence test plan

**Companion:** [MVP product definition](MVP_01_PRODUCT_DEFINITION.md)  
**Status:** Proposed field protocol. No participant tests have been performed.  
**Scope:** Offline/locally served prototype, not deployed site or live enquiries.

## Key learning question
Can an aspiring Sierra Leonean footballer or prospective contributor understand MHAK's current reality, judge its promise appropriately, find the real founding story, and identify an honest next step in a short mobile browsing session?

Do **not** equate aesthetic preference, view counts or enthusiastic reactions with demand or trust.

## Participants
- Recruit approximately **5–8** adults with varied interest in local football, primarily aspiring footballers. Include one or two prospective volunteer coaches or community partners if accessible.
- Ask about their real past behaviour and ability to access a mobile browser rather than screening exclusively for fans of the concept.
- For this first pass do not solicit minors or collect identifiers, phone numbers, real biographies or sensitive details.

## Unmoderated setup
Provide a local/offline copy of the site on a phone or use a controlled screen recording with explicit consent. Do **not** enter or transmit real personal data. If testing the contact flow, use a clearly labeled non-submitting demonstration.

## Moderator guide (10–15 minutes per person)

### Opening question (not leading)
'Imagine someone shares this MHAK FC site with you. Browse naturally and tell me what you think the club currently does.'

**Task 1 — Understand**
- In your own words, what is MHAK FC?
- Does it already have a coach, squad or organised training programme? How can you tell?
- What, if anything, does the site seem to promise?
**Observe:** first-click, hesitation, inaccurate claims of established operations, repeated scrolling.

**Task 2 — Explore the story**
- Find the reason the club was started and read more than the summary.
- Find an update about how the identity or club standards are being built.
**Observe:** whether cards look interactive, broken links, dead ends, ability to return.

**Task 3 — Find a next step**
- Imagine you want to explore playing for the club. Show what you would do next.
- Is this an application for trials or an expression of interest?
- What would you expect to happen after contacting them?
**Observe:** misinterpretation, whether disabled contact creates a false promise, under-18 guidance discoverability.

**Task 4 — Assess credibility**
- Find one thing MHAK has actually done and one thing it still plans to do.
- Would you know where to find future progress?
**Observe:** confusion between ambition and evidence.

### Debrief (short)
- What was most convincing? What felt uncertain or exaggerated?
- What information was missing for your personal decision?
- What would make you return or share? Ask for a concrete reason, not a yes/no promise.

## Evidence sheet

| Participant ID | Task | Completed independently? | Time / friction | Exact evidence or quote | Severity | Researcher interpretation |
|---|---|---|---|---|---|---|
| P01 | Understand | not tested | — | — | — | — |

Assign anonymous IDs only. Record participants' exact statements before interpreting them.

Severity: **Blocking** (cannot perform important task), **Major** (material confusion or misinformation), **Minor** (noticeable inconvenience), **Observation** (not yet an issue). Avoid interpreting preferences as a usability failure.

## Decision rules
- **Block acceptance** for any false claim of established trials/coaching, under-18 personal-data collection path, fake submission success, or broken primary journey.
- Fix repeated **major** issues before polishing appearance.
- In a small qualitative sample, one severe issue may be important; do not manufacture statistical confidence from percentages.
- Only record market-demand hypotheses for subsequent interviews/experiments; this usability pass does not validate recruiting interest.

## Local acceptance checks
- [ ] Direct links load all actual stories and return paths.
- [ ] Key status facts are plain, current and traceable to club decisions.
- [ ] Mobile 320 px and 390 px: no horizontal scroll, controls reachable, paragraphs readable.
- [ ] Keyboard: logical order, visible focus, Escape closes mobile nav, skip link reaches main.
- [ ] All meaningful images have useful alt text; decorative images use empty alt.
- [ ] Reader can distinguish planned vs established without colour alone.
- [ ] Enquiries remain blocked if contact approval and delivery are absent.
- [ ] No secret keys, personal records, claims of real user testing, or imaginary success metrics.
- [ ] Visual styling follows Obsidian Blue, Dark Orange, Steel Grey, Black and White.
- [ ] Production hosting, DNS and email are not modified during MVP definition.

## Synthesis report
Produce one page:
1. **Observed** problems with counts, anonymised quotes and reproduction steps.
2. **Interpretation** and alternatives, clearly separate from observations.
3. **Decision**: fix now / validate later / accept a trade-off.
4. **Owner** and next test.

**Exit criterion:** MHAK's core first-time discovery journey can be completed truthfully and without a dead end in the offline prototype. External reach, demand and live contact are separate validations.

## Additional check — cognitive ease and visual priority (MVP 03)

This is a test protocol, **not** evidence of successful user testing. The goal is to see whether visitors can find what matters without extra explanation, not to minimise clicks at the expense of clarity or safety.

**Five-second first impression:** Show the first viewport on a mobile phone for five seconds. Hide the screen and ask:
1. What is MHAK?
2. Is the club already running trials, or still being built?
3. What would you tap first to learn more?

**Unaided first-click tasks:**
- Find the current stage of the club without a prompt to scroll to a particular section.
- Find the complete story behind the club's formation.
- As an aspiring player, locate the next honest step without assuming a trial application is open.
- Find additional detail about confirmed versus planned club capabilities if interested.

**Observe:** first tap/scroll direction, hesitations, backtracks, whether the primary orange action was noticed, whether information in the collapsed status is actually needed to answer the main question, and whether the role cards look like open applications.

**Design hypotheses to validate (not yet established facts):**
- A single visually primary hero action will reduce decision conflict.
- A one-paragraph status summary with optional detail will preserve trust while reducing the effort of scanning four status cards.
- Two complete linked founding notes will be clearer than three equally prominent cards when the third has no documented milestone.
- Hiding an unavailable form will avoid inviting wasted effort.

**Suggested pass criteria:** In a small qualitative round, no participant should interpret the site as offering active trials or guaranteed places; every participant should locate the founding story and identify the next honest action without moderator intervention. Treat confusion as a design problem; do not report small-sample results as statistically representative.

**Manual device checks:** 320 px and 390 px viewport width, long text zoom at 200%, keyboard-only operation, visible focus, native disclosure open/close, touch target usability, no clipped CTA text, no horizontal overflow, and useful page structure when CSS is unavailable. These checks have **not yet been reported as passed**.
