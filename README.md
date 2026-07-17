# Chisholm Brother Ingest

A production-ready lead ingest and estimate intake page for Chisholm Brothers Painting.

## Included

- Responsive customer estimate form
- Vercel-compatible Next.js application
- Server-side validation with Zod
- Customer confirmation email through Resend
- Internal lead notification email to `bid@chismbrothers.com`
- Generic CRM webhook for Pipedrive, HubSpot, Jobber, or automation tools
- Lead reference number
- Environment-driven branding and contact details

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Email setup

1. Create a Resend account.
2. Verify the sending domain.
3. Add `RESEND_API_KEY`.
4. Set `FROM_EMAIL`, `INTERNAL_NOTIFICATION_EMAIL`, and `REPLY_TO_EMAIL`.

By default, internal lead notifications are addressed to `bid@chismbrothers.com`.
Use a `FROM_EMAIL` address from a verified Resend sending domain before sending real traffic.

During testing, Resend's onboarding sender can only send to the account owner's verified email.

## CRM setup

Set `CRM_WEBHOOK_URL` to a Zapier, Make, n8n, Pipedream, or custom API endpoint.

The form sends:

```json
{
  "event": "estimate.created",
  "reference": "CB-20260717-ABC123",
  "pipelineStage": "New Inquiry",
  "payload": {}
}
```

Use the webhook to:

1. Find or create the contact.
2. Create a deal/opportunity.
3. Add it to the correct pipeline.
4. Create a follow-up task.
5. Return a 2xx status.

## Deploy to Vercel

1. Create a new GitHub repository named `chisholm-brother-ingest`.
2. Push this project into it.
3. In Vercel, choose **Add New → Project**.
4. Import the GitHub repository.
5. Add every value from `.env.example`.
6. Deploy.

## GitHub commands

```bash
git init
git add .
git commit -m "Initial Chisholm Brothers ingest form"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/chisholm-brother-ingest.git
git push -u origin main
```

## Vercel CLI alternative

```bash
npm install -g vercel
vercel
vercel --prod
```

## Before publishing

Replace the placeholder phone, email, privacy URL, and sending domain. Confirm the exact company spelling and approved branding before driving traffic to the page.
