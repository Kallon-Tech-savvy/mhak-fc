# MHAK FC — Launch gate v1.4

## Current gate: NO-GO for public release

**Supported facts:** MHAK's preferred domain and mailbox have been entered in the project. The original staging preview is disabled for forms and indexing.

**Not verified:** actual live DNS/HTTPS, cloud hosting, mailbox creation/reception, reply sending, Resend DNS verification, production Turnstile, WAF configuration, privacy/safeguarding approval, rights to photographs, and real delivery.

## Staged process

**Gate 1 — Publish website (form closed):** Confirm club identity/copy, logo approval, host/DNS/TLS, two-way mailbox, adult enquiries policy and approved actual privacy policy. Generate a public build through `npm run build:public` with all documented evidence flags true.

**Gate 2 — Activate online enquiries:** Confirm Resend sender/transport, Turnstile hostname/action/token verification, WAF/rate limits, mailbox access and retention, real delivery and failure-path test. Generate through `npm run build:enquiries`; set production `ENQUIRIES_ENABLED=true` and `PRIVACY_NOTICE_APPROVED=true` only after those tests.

**Gate 3 — Search and public stories:** Verify canonical/OG URLs from actual host, sitemap/robots, share thumbnail permissions, mobile accessibility/performance, and truthful progress reporting. Do not imply players, coaches, matches or training programmes exist if unconfirmed.

Staging is not safe merely because search indexing is disabled; protect preview access where appropriate.

## GitHub CI gate (v1.5)
- The existing `Kallon-Tech-savvy/mhak-fc` GitHub repository is empty; local package is ready to be imported, but no GitHub commit or Cloudflare deployment has been made by this kit.
- `.github/workflows/validate.yml` performs validation and builds staging only; it does not deploy.
- A successful Actions build is not a domain, TLS, mailbox, or live-enquiry test.
- Public release must be separately approved and built using the human evidence gates above.
