# MHAK FC — MVP 04 mobile and cognitive-ease quality audit

**Status:** Browser-based engineering smoke test completed; **not** a user-research or public-launch approval.
**Project:** `Kallon-Tech-savvy/mhak-fc`, branch `feat/mvp-definition-journeys` (stacked PR #3).
**Scope:** Offline staging UI only. No hosting, DNS, email, production release or live enquiries.

## Why this change was made

The earlier mobile layout placed a second large logo visual between the main story and the first substantive status section, even though the logo was already visible in the header. This consumed vertical space without improving the user's ability to tell what the club actually offers today.

The correction preserves the selected symbol in the navigation, removes the duplicate hero artwork on small screens, shortens above-the-fold spacing and narrows the visual emphasis to **one primary hero action**: “See where we stand”.

## Measured improvement

Measured with headless Chromium from the same staging source (CSS pixels from top of page, including a staging-only preview banner):

| Viewport width | Old status section top | After fix | Earlier by |
|---|---:|---:|---:|
| 320 px | 862 px | 675 px | 187 px |
| 390 px | 805 px | 618 px | 187 px |
| 768 px | 924 px | 732 px | 192 px |

At 320 px, the status section now begins inside a 720 px first viewport; its full heading may require a small scroll. The staging-only notice contributes additional height and is intentionally retained for safety.

## Reflow and interactions

- Browser widths checked: **195, 240, 320, 360, 390, 768, 1280 CSS px**.
- **No horizontal overflow** in the main page at those widths following the correction.
- Two founding story pages and draft privacy notice checked at 195, 320 and 390 CSS px, with no overflow following a text-wrapping fix for long addresses in the privacy draft.
- Mobile menu opens with pointer and keyboard; Escape closes it and returns focus to its trigger.
- `<details>` status summary opens using Enter.
- Primary CTA receives a 3 px visible focus outline during keyboard navigation and scrolls to `#status`.
- Reduced-motion preference switches scroll behaviour to `auto`.
- Enquiry form remains **hidden and disabled** in staging. No form data was submitted or collected.

**Narrow 195 CSS px** is an **equivalent-viewport reflow stress test**, not a claim of a real browser's 200% zoom feature. It helps detect layouts that fail under a substantially reduced CSS viewport.

## Verification method and limitations

The exact built staging ZIP was retrieved from the passing GitHub Actions workflow. In this execution environment, direct `file://` navigation was blocked, so the browser rendered the exact HTML with its CSS, brand assets and client script injected into an isolated document. This validates layout and supported DOM interactions, **not** production network routing, live contact delivery, browser-specific zoom behaviour, performance metrics, or a deployed-site screenshot.

To reproduce on a local workstation with Playwright and Chromium:

```bash
python -m pip install playwright
python -m playwright install chromium
python qa/visual_smoke.py
```

The optional visual smoke script does not alter release files or deploy anything. Run `npm run check` separately for the existing Node tests and staged release safety guard.

## Remaining acceptance work

1. Check actual Android and iOS browsers with system text scaling, 200% zoom/reflow and reduced motion.
2. Conduct 5–8 short, adult first-click tests: do people know MHAK is in a founding stage and that trials/registrations are not open?
3. Check screen-reader labels, long-form readability and status freshness with club decision-makers.
4. Confirm any new club claims against real evidence before public use.
5. Do not treat a successful engineering smoke test as evidence of player interest, market demand or operational readiness.

**Decision:** Implementation is ready for hands-on UX review. No public launch or merger is implied.
