# MHAK FC — GitHub + Cloudflare deployment handoff (v1.5)

## What is actually complete
- A **staging-only**, framework-free static website for MHAK FC, which still truthfully describes an emerging club.
- Cloudflare Pages Function at `functions/api/enquiry.js`, designed to fail closed when production variables are absent.
- GitHub Actions **CI only** workflow at `.github/workflows/validate.yml` (tests, audits, builds and uploads a temporary review artifact; **never deploys**).
- Node commands: `npm run check`, `npm run build:staging`, `npm run build:public`, `npm run build:enquiries`, `npm run verify:live`.

## GitHub repository
The existing repository `Kallon-Tech-savvy/mhak-fc` was found to be **empty** on 2026-11-03. Import these files into that repository, keeping `public/`, `functions/`, `scripts/`, `tests/`, `.github/workflows/` and `package.json` at the root. **Do not import any real .env file, API keys, customer information or approved-private evidence.**

Recommended first commands from your local computer after extracting this ZIP:

```bash
npm run check
# When ready to initialise the existing empty GitHub repository:
git init
git branch -M main
git remote add origin https://github.com/Kallon-Tech-savvy/mhak-fc.git
git add .
git commit -m "chore(mhak): initialize safe staging site and CI gates"
git push -u origin main
```

Before the first push, check `git status` and inspect the staged files. If the repository ceases to be empty, use a clone-and-merge workflow instead of blindly pushing.

## Cloudflare Pages — don't accidentally publish
- The CI workflow **does not deploy**. Connecting the GitHub repository to Cloudflare Pages separately may auto-deploy builds; leave public launch disabled until approval and configure Cloudflare Access for preview URLs.
- If creating a new Pages project with Git integration, set build command to `npm run build:staging` and output directory `release/staging` for **protected staging only**. Use the project root as root directory, with `functions/` outside the output directory.
- `mhak.alhajikallon.com` is the **planned** production custom domain. Attach it in Pages > Custom domains **only after** verifying the right Pages project. Never guess the `<project>.pages.dev` target.
- When later using `npm run build:public`, provide private `launch-evidence.json` and a human-approved `approved-privacy.html` in the trusted build environment. Do **not** commit these to GitHub. The build rejects missing evidence.
- To enable enquiries later, also pass the Turnstile public site key during build, configure the Pages environment secrets, deploy Pages Functions through Git integration or Wrangler, rate limit `/api/enquiry`, and run real send/receive/reply tests. A green CI run does not prove production mail works.
- As documented by Cloudflare, the dashboard drag-and-drop uploader does not compile a `functions/` folder; use Git integration or Wrangler when the backend is needed.

## Domain and mailbox checks (still blocked)
- Real DNS, TLS and page content checks: `npm run verify:live` from a networked environment.
- Verify mail receipt at `mhak@alhajikallon.com` with a message from an external sender **and** an outbound reply. An MX record alone does not prove the inbox works.
- Verify the production Turnstile hostname, action, token replay rejection, actual mail provider message ID and arrival at the mailbox.

**Do not label the club site live, public or available for enquiries until all relevant launch gates pass.**
