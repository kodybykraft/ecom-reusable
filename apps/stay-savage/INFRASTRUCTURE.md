# Stay Savage — Infrastructure Reference

This file is committed to git. **No secrets here** — all credentials live in `.env.local` (gitignored).

## Services & Accounts

| Service | Purpose | Account | Dashboard |
|---------|---------|---------|-----------|
| **Neon** | PostgreSQL database | TBD | https://console.neon.tech |
| **Vercel** | Hosting (Next.js) | chand-rahmans-projects | https://vercel.com/dashboard |
| **Stripe** | Payments | TBD (client creating) | https://dashboard.stripe.com |
| **AWS SES** | Transactional email | TBD | https://console.aws.amazon.com/ses |
| **Namecheap** | Domain (stay-savage.com) | Client owns | https://www.namecheap.com |
| **Google Analytics** | GA4 tracking | TBD | https://analytics.google.com |
| **Meta Business** | Facebook/Instagram Pixel | TBD | https://business.facebook.com |
| **TikTok Ads** | TikTok Pixel | TBD | https://ads.tiktok.com |

## Environment Variables

All stored in `.env.local` (gitignored). Template:

```
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (AWS SES)
AWS_SES_ACCESS_KEY_ID=
AWS_SES_SECRET_ACCESS_KEY=

# Analytics
GA4_MEASUREMENT_ID=G-...
GA4_API_SECRET=
META_PIXEL_ID=
META_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=https://stay-savage.com
```

## Database

- **Provider:** Neon (serverless PostgreSQL)
- **Region:** eu-west-2 (London)
- **Schema:** Managed by @ecom/db via Drizzle ORM (50+ tables, all prefixed `ecom_`)
- **Push schema:** `npx drizzle-kit push` from monorepo root
- **Migrations:** `npx drizzle-kit generate && npx drizzle-kit migrate`

## Domain

- **Domain:** stay-savage.com
- **Registrar:** Namecheap (client owns)
- **DNS:** Point to Vercel once deployed
- **Email:** orders@stay-savage.com (custom domain, already set up by client)

## Admin Access

- **Admin email:** apex.staysavage@gmail.com
- **Login URL:** https://stay-savage.com/admin
- **Auth:** @ecom/server staff service (Supabase-style JWT)

## Client Details

- **Company:** Stay Savage LTD (#14703196)
- **Address:** 118 Plashet Road, Plaistow, London E13 0QS
- **Contact:** orders@stay-savage.com
- **Instagram:** @staysavageltd
- **TikTok:** @staysavage.ltd

## Tech Stack

- **Framework:** Next.js 15 (App Router, SSR)
- **Backend:** @ecom/* monorepo packages (10 packages)
- **Database:** PostgreSQL via Drizzle ORM
- **Payments:** Stripe (via @ecom/integrations)
- **Email:** AWS SES (via @ecom/email)
- **Analytics:** GA4 + Meta + TikTok (via @ecom/analytics)
- **Hosting:** Vercel
- **Package Manager:** pnpm (monorepo workspace)

## Monorepo Location

```
/E-Com Reusable/
├── apps/
│   ├── stay-savage/    ← THIS PROJECT
│   └── demo/           ← Reference implementation
└── packages/
    └── @ecom/*         ← Shared e-commerce platform
```
