# MHAK FC — Cloudflare staging handoff

## Current verified state (3 November 2026)
- GitHub repository: https://github.com/Kallon-Tech-savvy/mhak-fc
- Existing PR: https://github.com/Kallon-Tech-savvy/mhak-fc/pull/1
- Source branch: `feat/digital-launch-v1-5`; base: `main`; PR remains **open and unmerged**.
- GitHub Actions staging validation passed: https://github.com/Kallon-Tech-savvy/mhak-fc/actions/runs/41656458955
- Website target: `mhak.alhajikallon.com`; mail target: `mhak@alhajikallon.com`. Neither is verified.
- This repository does **not** deploy to Cloudflare automatically. No Cloudflare account actions have been performed.

## Safe staging deployment handoff

**Important:** A Cloudflare Pages Git connection may immediately create publicly reachable `*.pages.dev` deployments. Staging `noindex` is not access control. Do not use preview URLs to share private material until Cloudflare Access restrictions are confirmed. This repository contains no live credentials, customer data, or approved private launch evidence.

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages**. Check whether a Pages project for MHAK already exists before creating one; do not connect to an unrelated existing project.
2. If creating a new Pages project, select **Connect to Git**, authenticate GitHub, and grant Cloudflare access only to `Kallon-Tech-savvy/mhak-fc` as appropriate.
3. Use the **repository root**. Build command: `npm run build:staging`. Build output directory: `release/staging`. No framework preset is necessary. Node.js 22 is used in repository CI.
4. Choose branch controls deliberately. `main` currently contains only a starter README, so a production build from `main` cannot run this project yet. Do **not** silently designate the PR branch as a public production site. Review the branch and initial-deployment settings before clicking Deploy. For a PR-based review, enable previews for `feat/digital-launch-v1-5`; do not merge PR #1 as part of initial preview setup.
5. Immediately enable **Settings → General → Enable access policy** to protect Pages preview deployments. This **does not by itself protect the root `<project>.pages.dev` or a custom hostname**. If the production `*.pages.dev` hostname is reachable, follow Cloudflare's documented additional Access-app procedure. Verify access control in a signed-out browser before sharing links.
6. Check that the deployed preview displays a staging banner; is `noindex`; has no sitemap; serves assets; and the adult enquiry form remains disabled. Inspect deployment status and the HTTP response headers.
7. Check whether GitHub displays a Cloudflare Pages deployment check and preview URL on [PR #1](https://github.com/Kallon-Tech-savvy/mhak-fc/pull/1). Do not invent a `pages.dev` URL; use the one Cloudflare provides.
8. Leave `mhak.alhajikallon.com` **unattached** until the public release's identity, content, DNS, privacy, safeguarding and mailbox checks have been approved. Leave Cloudflare email secrets, `ENQUIRIES_ENABLED` and form activation unset during staging.

## Release commands and safeguards
- `npm run check`: test, audit, build and verify safe staging.
- `npm run build:staging`: generates `release/staging` with `noindex` and a disabled form.
- `npm run build:public` and `npm run build:enquiries`: require real, private release evidence and an approved privacy notice. **Never fabricate these inputs or commit them.**
- Cloudflare Pages Function: `functions/api/enquiry.js` stays at the repo root and is fail-closed without approved environment configuration.
- Use Git integration or Wrangler for Pages Functions; dashboard drag-and-drop does not deploy the Functions directory.

## Acceptance evidence to record (without secrets)
- Actual Pages project name and deployment URL.
- Deployed branch and commit SHA, successful build log.
- Protected preview tested while signed out.
- Browser and mobile checks (navigation, accessibility, assets, form disabled).
- `robots.txt` and X-Robots-Tag verified from HTTP response.
- Proof that production custom domain and contact form were not activated prematurely.

## References
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/platform/known-issues/
- https://developers.cloudflare.com/pages/get-started/git-integration/

**Gate:** Protected staging deployment only. Public launch and live enquiries remain separate approvals.
