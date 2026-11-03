# MHAK FC — Deployment configuration for the selected domain (v1.3)

## User-selected identifiers
- Intended site: **https://mhak.alhajikallon.com**
- Intended correspondence inbox and outbound sender: **mhak@alhajikallon.com**
- Current status: **not verified or deployed**. Do not announce either as active until separately tested.

## Domain setup (Cloudflare Pages)
1. Deploy via **Cloudflare Pages Git integration or Wrangler CLI**, not dashboard drag-and-drop if enquiry Functions are needed. Keep `functions/` in the project root, not inside the output directory. Dashboard drag-and-drop does not compile Pages Functions. Choose the appropriate release output directory: `release/staging` for a protected preview; `release/public` only after public gates; `release/enquiries` only after the additional enquiry gates. The corresponding build command is `npm run build:staging`, `npm run build:public`, or `npm run build:enquiries`. Do **not** publish the repository root.
   - For Git integration: staging builds can run without private evidence; public builds require secure CI provisioning of the private evidence and approved privacy HTML, rather than committing these records.
   - For Wrangler Direct Upload: run the deploy command **from the project root** so the sibling `functions/` folder is packaged. Example after successful build: `npx wrangler pages deploy release/staging --project-name=<EXISTING_PROJECT_NAME> --branch=staging`. Replace the placeholder with your real project, and use the verified release directory only when all checks have passed. No deployment has been performed by these instructions.
   - Cloudflare documents that a Direct Upload project cannot later be converted to Git integration. Choose the integration model deliberately.
2. In Pages, select **Custom domains > Set up a domain** and register `mhak.alhajikallon.com`. When DNS is outside Cloudflare, create the CNAME that Pages specifies to your real `<project>.pages.dev` hostname. **Do not invent a Pages project hostname or create the CNAME before Pages association.**
3. Verify HTTPS, page loading, TLS certificate, response security headers and all assets. Ensure the custom hostname is active.
4. Keep the preview `noindex` and `robots.txt` block during setup; once all launch gates are met, remove them, add the exact canonical + Open Graph URL, and submit a sitemap.

## Inbox and outbound delivery are TWO separate setup tasks
1. Provision and verify that `mhak@alhajikallon.com` can **receive** an independent external test email and send a reply. Preserve existing mail routing for `alhajikallon.com`; do not overwrite MX records or existing SPF settings accidentally.
2. Verify the **sending** domain with the chosen transactional email service (the server implementation uses Resend). Follow the provider's DNS instructions for the actual sender `mhak@alhajikallon.com` and coordinate DKIM/SPF with the domain's existing email host. Receiving mail does not automatically authorise outbound API sending.
3. Configure the Pages environment variables from `.env.production.example`, substituting real secrets **only inside Cloudflare's secret management**, never into code or public JSON.
4. In Cloudflare Turnstile, create a production widget restricted to `mhak.alhajikallon.com` with action `mhak_enquiry`; assign its public site key to `public/contact-config.json`, and the secret to the Pages environment.
5. Set WAF rate limits for `/api/enquiry`; verify form consent and approved privacy notice, retention/deletion process, and safeguarding procedure. Only then set `ENQUIRIES_ENABLED=true`, `PRIVACY_NOTICE_APPROVED=true` and enable the public form switch.

## Required end-to-end checks
- On the actual production hostname, submit one permitted adult enquiry. Confirm receipt at `mhak@alhajikallon.com`, reply back to the sender, and that the provider returns a nonempty message ID.
- Check Turnstile failure, expired tokens, invalid adult/consent states, forged Origin, unusual request volumes, oversized payloads and email-provider failure.
- Check real iOS/Android browsers, keyboard navigation, page speed, social previews, CSP/security headers, privacy link and footer.
- Remove staging labels, `robots.txt` disallow and `noindex` **only after the above pass**.

## References
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://resend.com/docs/api-reference/emails/send-email
