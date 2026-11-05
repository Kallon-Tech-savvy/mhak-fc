# MHAK FC — MVP 05: first-click usability pilot

**Status:** Ready to facilitate; **no human sessions have been run**. This is a lightweight learning tool, not proof of demand or a launch checklist.

## The question we are testing

Can an adult visiting MHAK FC for the first time:

1. Recognise the club is still being established?
2. Find its actual status without effort?
3. Open and understand a complete founding note?
4. Find an honest next step without believing trials or registration are already available?

Observe behaviour, not whether people say they like the design.

## Files

- `qa/offline_usability_lab.html`: self-contained facilitator tool; no analytics, storage or network requests. Can be opened independently of the website.
- `public/index.html`: locally testable MHAK site, with two linked founding stories and a disabled enquiry form.
- `docs/MVP_01_USABILITY_TEST_PLAN.md`: broader evidence and acceptance protocol.
- `docs/MVP_04_VISUAL_QA.md`: engineering findings from browser checks (not participant research).

The lab is intentionally **outside `public/`** so it does not get included in a website build.

## An 8–12-minute session

- **Before:** Recruit 5–8 adults with varied football interest. A mix of aspiring players, supporters and prospective volunteers is preferable to only testing people who already agree with the idea. Do not recruit minors for this pilot.
- **Permission (30 seconds):** "I'm testing how understandable this website is, not your ability. Is it okay if I observe your navigation and take anonymous notes? No audio/video recording is needed. You may stop at any time." If they decline, end the session.
- **Present the site (5 seconds):** Let the person see the homepage briefly, hide it and read Task 1 from the lab. Record what they say without correcting their interpretation.
- **Let them browse (5–7 minutes):** Read Tasks 2–5 one at a time. Do not steer them to the status section, the story link or the Get Involved cards.
- **Close (1–2 minutes):** Ask "What felt unclear?" and "What evidence would you need to trust this as a real club?" Do not solicit unnecessary personal details.
- **Save:** Use an anonymous ID (P01, P02…), record outcomes and evidence, press **Save this participant**, then **Export JSON** or **Export CSV** before leaving the page. The lab deliberately does not persist to the browser.

If participants use a phone, keep the lab open on a separate facilitator device; do not make participants operate both the site and the research form.

## Practical evaluation rules

| Observation | What it suggests | Decision |
|---|---|---|
| Several visitors miss the club's current status | Information hierarchy is not obvious | Rework first-screen structure and labels |
| Anyone assumes active player trials are open | Potentially misleading content | Treat as major; fix before accepting MVP |
| Person can find the status but cannot open the founding note | Broken story journey | Check link visibility and navigation |
| Person asks where to register after seeing no active application | Weak future-opportunity message | State clearly what the visitor can do now |
| Person says they like the design | Preference only | Do not treat as evidence of interest or credibility |

One critical misleading claim can block acceptance even if other participants complete all tasks. With 5–8 qualitative participants, avoid percentages and statistical confidence claims; discuss repeated patterns, severity and exact observed behaviour.

## Data handling

- Use anonymous codes, not names, emails, phone numbers, full birth dates, medical details, or identifying descriptions.
- Avoid sharing raw quotes that contain private details. If an exported note accidentally includes such information, remove it before sharing and store exports securely.
- The lab stores no data outside in-memory browser state until you explicitly export. A refresh closes the current unsaved session.
- Never present test observations as MHAK player registrations, support commitments or user analytics.
- No hosting, deployment, Cloudflare, DNS or live contact changes are required.

## Findings after 5–8 adults

Create a short evidence-led decision memo:

**Observed:** What did visitors do, where did they hesitate, and which assumptions were wrong? Use anonymous codes and the precise page/element.

**Interpretation:** Why might it have happened? Offer more than one plausible explanation when uncertain.

**Decision:** Fix a blocking issue, test a major issue again, or intentionally accept minor friction with a reason.

**Next experiment:** Change only what is necessary, then repeat the hardest task with a few new adults.

**Important:** The current MVP is not yet accepted; these are preparation materials for real sessions.