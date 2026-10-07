# Morphe Creatives

Nuxt 4 (Options API) site for Morphe Creatives, deployed as a single Cloudflare Worker.
The `/api/contact` route sends inquiries over SMTP.

## Setup

```bash
npm install
cp .env.example .env   # then fill in SMTP_PASS
```

`.env` holds local secrets and is gitignored. Never commit it.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Nuxt dev server on Node at http://localhost:3000. Reads `.env` and sends mail with nodemailer |
| `npm run preview` | Builds and runs the real Worker locally with `wrangler dev`. Reads `.env` and sends mail with worker-mailer |
| `npm run deploy` | Builds and deploys to Cloudflare Workers |
| `npm run secrets` | Pushes secrets from `.env` (`SMTP_PASS`) to the deployed Worker |

## First deploy

```bash
npx wrangler login     # once per machine
npm run deploy         # creates the "morphe" Worker
npm run secrets        # uploads SMTP_PASS as an encrypted Worker secret
```

After that, `npm run deploy` is all you need. Run `npm run secrets` again only when the
password changes.

Non-secret settings (SMTP host and port, sender, recipient, auto-reply) are in the
`vars` block of [wrangler.jsonc](wrangler.jsonc). To use the morphe.co.ke domain, uncomment
`routes` there once the domain is on Cloudflare.

## Contact form

- Options and validation are in [shared/contact.js](shared/contact.js), and the form and API both use them. Edit services, follow-up questions, budgets and timelines there.
- [server/api/contact.post.js](server/api/contact.post.js) validates the inquiry, filters spam (honeypot field, minimum time to fill in, rate limit) and sends two emails:
  - a notification to `CONTACT_TO`, with Reply-To set to the person who filled in the form
  - a confirmation to the sender, unless `CONTACT_AUTOREPLY=false`
- Email templates are in [server/utils/inquiry-email.js](server/utils/inquiry-email.js).

## Brand and generated assets

- `python3 scripts/generate-brand.py design/morphe-logo-source.png public` regenerates the logo variants and icons (needs `pip install pillow numpy potracer`).
- `node scripts/generate-animated.mjs` regenerates the animated section illustrations.
