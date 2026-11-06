# MHAK FC — MVP Definition 01: user journeys and information architecture

**Status:** Proposed product specification for review; not market validation or public-launch approval.
**Scope:** Offline/testable MVP only. No hosting, DNS, email provisioning, production releases, or Cloudflare setup in this workstream.
**Source:** Current `public/index.html`, `public/script.js`, `public/contact-config.json` on the `feat/digital-launch-v1-5` branch and the previously agreed MHAK FC brand handoff.

## 1. What is established vs. what is proposed

**Established from current project:** MHAK FC is an emerging Sierra Leone football club; current priority audience is players and aspiring footballers; intended principles are belonging, shared identity, discipline and collective commitment. A standalone symbol was selected and a proposed colour system uses Obsidian Blue, Dark Orange, Steel Grey, Black and White. The current website is a single-page introduction with story, principles, founding-note cards, status and a disabled adult enquiry form. No confirmed coach, training programme, squad or competition has been evidenced in the source.

**Unvalidated hypotheses:** Aspiring footballers will be attracted by MHAK's founding journey; its principles will appear credible and differentiated; some will want to follow progress or express interest. This is not a player recruitment campaign or academy application.

## 2. Product objective

Create a **credible discovery-to-next-step experience** for a first-time visitor, especially an aspiring footballer using a mobile phone:

> Understand what MHAK FC is, distinguish present reality from ambition, see genuine evidence of work in progress, and identify an appropriate next step without being misled into believing trials, coaching or a squad already exist.

The initial MVP is not a player-management platform, media network, or club operations system.

## 3. Users, jobs and scope

| Persona | Question / job | Priority | Honest outcome |
|---|---|---|---|
| Aspiring footballer (adult) | Is MHAK real, what is it building, and is there a legitimate path to learn about opportunities? | P0 | Understand status, follow progress, and locate enquiry route if available |
| Aspiring footballer under 18 | Can I learn about MHAK safely? | P0 guardrail | Read publicly available information; any contact route directs a responsible adult, with no collection of a minor's details |
| Prospective volunteer coach | What standards and responsibilities are intended; is coaching confirmed? | P1 | Review what is known and find the appropriate contact/next-step status |
| Community partner / supporter | What is established; how can I assess credibility and monitor progress? | P1 | Verify current facts and read dated progress updates |
| Internal MHAK editor | How do I maintain the site without exaggerating achievements? | P1 | Publish evidence-backed, reviewable entries in a lightweight content format |

**Non-goals:** trials registration, minor profiles, player dashboards, fixtures, match results, rankings, payments, academy claims, automated scouting, AI chat, and collecting enquiries before an authorised delivery and retention process exists.

## 4. Key journeys and completion states

### Journey A — First-time aspiring player (primary)
Entry (social share or direct visit) → concise MHAK positioning → clearly visible **current status** → what the club intends to offer, with plain disclosure of what is not established → read a genuine founding update → **What can I do now?**

- If no verified contact is available: show a truthful **contact currently unavailable** state, the public progress path and guidance for future opportunities. Do not show a submit-ready form or imply selection.
- When the contact channel is separately verified: show an adult initial-enquiry route, clear consent/notice and confirmation. This is **not** registration and does not guarantee trials.
- Under-18 visitors: public reading only; initial outreach by a responsible adult; no sensitive personal collection.
- **Task completion:** Participant can state what exists, what is planned, and their realistic next action without moderator correction.

### Journey B — Evaluate the club's credibility (partner/supporter)
Entry → Our story → Standards → evidence-backed dated updates → Current status → optional verified contact.
- **Task completion:** Participant can identify one verified fact, one stated ambition and one limitation, and find the update they would return to.

### Journey C — Explore coaching involvement
Entry → Current coaching status → planned principles, responsibilities and expectations (not fabricated job terms) → verified adult contact route when available.
- **Task completion:** Participant understands that no coach has been confirmed and can distinguish an expression of interest from an offer.

### Journey D — Return visitor following progress
Direct link → **From the Ground Up** → newest genuine story first → individual article with date, what happened, what is still unknown, and next milestone → related updates.
- **Task completion:** Participant can read a complete article and find a related update or return to the main archive.

## 5. Recommended information architecture

Initially keep the site **mobile-first and deliberately small**:

```text
Home /
 ├── Hero: club in the making + primary next step
 ├── Where we stand (truthful, date-reviewed status)
 ├── Our story / intended principles
 ├── From the Ground Up (dated founding updates)
 │    ├── /stories/why-mhak.html
 │    ├── /stories/identity-in-progress.html
 │    └── Additional articles ONLY after actual milestones
 ├── Get involved (players / coaches / partners)
 │    └── Availability state: unavailable or VERIFIED adult enquiry
 └── Footer: contact status, privacy notice, identity
Privacy /privacy.html — approved notice only when the site is public
```

**Navigation labels:** `Our Story`, `Progress`, `Get Involved`, and `Current Status` (can be reordered after task testing). Avoid presenting a disabled form under the label **Enquiries** as though that were an available service.

**Content hierarchy:** Hero → Current status → Reasons to believe / founding evidence → Values → Next-step pathways. Make the current-stage disclosure visible before any recruitment-related CTA.

## 6. Experience requirements

- Distinguish *confirmed*, *planned*, *seeking*, and *not yet operational* using plain language, never just colour.
- Turn founding cards into real navigable stories, or explicitly label them as short summaries without click affordances.
- For stories, use title, plain-language summary, publication or recorded date (only when known), status, source/proof if shareable, limitation, next milestone and meaningful related link. Do not invent dates, participant counts, coaching results or affiliations.
- One primary CTA per screen segment; use clear text over ambiguous icons. Possible initial CTA: **Explore our progress**. Use **Contact MHAK** only after verified contact route exists.
- Preserve selected symbol and five-colour system; review dark orange contrast, tap sizes, keyboard navigation, screen-reader headings and reduced-motion behavior.
- Prefer static content and locally inspectable interactions over a CMS, account creation or analytics until real maintenance needs are demonstrated.
- No fake success toast or simulated submission that appears real. An offline prototype may use explicitly labeled task simulations with fictional test data only.

## 7. Implementation slices (in order)

**Slice 1 — Navigation and clarity (P0):**
- Make the main visitor journey obvious in the first viewport.
- Move/show current status before participation invitation; simplify repeated abstractions.
- Add pathways for players, coaches and partners with availability made explicit.

**Slice 2 — Content depth (P0):**
- Convert two actually supported founding notes (club rationale; identity development) into complete individual pages; preserve truth qualifiers.
- Replace the third 'building standards' graphic with an honest work-in-progress note until a substantive update exists.
- Link cards and related pages; check back navigation and heading order.

**Slice 3 — Contact states (P0):**
- Explicitly support unavailable / available states in the UX.
- Keep all data submission disabled until the separate live infrastructure, safeguarding and privacy gates pass.
- Test no-contact journeys without gathering visitor personal data.

**Slice 4 — Quality and evaluation (P0):**
- Test at 320, 390 and desktop widths; no horizontal overflow; readable text and meaningful focus indicators.
- Check keyboard/touch navigation, semantic markup, broken links, slow network content visibility and reduced-motion handling.
- Use the companion offline usability test plan. Record findings and revise before implementation is declared accepted.

## 8. Acceptance definition: product MVP versus launch

**Product MVP prototype is ready for acceptance testing when** all P0 pages and links are functional locally, current-status and age safeguards are accurate, stories are complete and connected, unavailable contact is plainly communicated, and the four journey tasks can be exercised without relying on hosting.

**Product MVP is accepted when** moderated task tests reveal no critical confusion or blocked core journey; factual claims have owner confirmation; accessibility and local link checks pass. Small-sample usability tests find problems, not market demand.

**Public MVP launch is a separate gate:** domain, account security, privacy, rights, contact delivery and production verification remain outside this phase.

## 9. Open decisions (do not silently assume)
1. Can MHAK substantiate and date the first two founding stories with actual decisions or artefacts?
2. Who owns review of each status statement and when should it expire or be rechecked?
3. Will a non-email following path be used before outreach is ready? Do not add subscription without operational infrastructure.
4. When actual opportunities exist, what safeguarding and eligibility process will apply to under-18 footballers?
5. Whether supporters/media become a distinct priority after the player-first MVP is tested.

**Working direction:** A lean, evidence-backed club introduction that turns curiosity into informed interest—not a fictional functioning football club.
