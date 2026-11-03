# MHAK FC — Digital Launch v1.5

**Status:** Safe, staging-only website + GitHub CI preparation. **No confirmed production deployment or verified mailbox.**

- Planned website: `https://mhak.alhajikallon.com`
- Planned contact: `mhak@alhajikallon.com`
- Primary identity: MHAK FC; Obsidian Blue / Dark Orange / Steel Grey / Black / White.

## Local checks
```bash
npm run check
```
This runs 18+ tests, validates site references, creates a safe `release/staging/` output and checks that it remains **noindex** with online enquiries disabled.

## CI and deploy path
- `.github/workflows/validate.yml` runs tests and creates a **review artifact only**. No automatic deploy action is included.
- `GITHUB_CLOUDFLARE_HANDOFF.md` explains how to import the project into `Kallon-Tech-savvy/mhak-fc` and configure a protected staging Pages site.
- `DEPLOYMENT_MHAK_DOMAIN.md` documents custom domain and email requirements.
- `LAUNCH_GATE.md` lists independent approvals needed before making the production site public.
- `launch-evidence.example.json` is a template, **not** real evidence.
- `approved-privacy.html` and `launch-evidence.json` must remain private until a reviewed release. No actual customer messages are stored by this kit.

Cloudflare Access (or another access restriction) is required for a **private** preview. `noindex` is not a security control.

Preview locally after `npm run build:staging` by serving `release/staging/` over HTTP, e.g. `python -m http.server 8000 --directory release/staging`, then visit `http://localhost:8000`. This remains a **staging** preview.