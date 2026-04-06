# Remaining Work

All three items below are now **implemented**. See the analytics and email sections for what's been built.

---

## 1. Third-Party Analytics Integration - DONE

- `EcomAnalytics` React component in `@ecom/react` — auto-loads GA4, Meta Pixel, TikTok Pixel
- `useAnalytics()` hook with `track()`, `productViewed()`, `addToCart()`, `checkoutStarted()`, `orderCompleted()`
- Config in `createEcom()` accepts `analytics.google`, `analytics.meta`, `analytics.tiktok`
- Client-safe config endpoint at `GET /analytics/config`
- `POST /analytics/track` endpoint for server-side event storage
- Server-side Conversion API clients (Meta CAPI, Google Measurement Protocol, TikTok Events API)
- Event bus listeners fire conversions to all platforms on `order.created`

---

## 2. Email Transactional & Automation Wiring - DONE

- Event listeners fire emails automatically:
  - `order.created` → order confirmation
  - `order.fulfilled` → shipping confirmation
  - `customer.created` → welcome email
  - `return.approved` → return confirmation
  - `order.refunded` → refund notification
- 6 default HTML email templates (responsive, inline-CSS)
- `TransactionalEmailService` fetches data, renders template, sends via SES
- Abandoned cart checker (runs every 5 min, sends recovery after 2hr)
- Automation step executor (runs every 60s, processes email/delay/condition steps)
- Automation trigger handler (matches events to active automations, enrolls contacts)
- Email config optional — if not provided, no emails sent

---

## 3. Default Email Templates - DONE

6 built-in templates seeded automatically:
- Order confirmation
- Shipping confirmation
- Welcome email
- Return approved
- Refund notification
- Abandoned cart recovery

Customizable via admin UI — custom templates override defaults.

---

## Future Enhancements

- Google Tag Manager support as alternative to individual pixels
- Segment.io integration
- Email A/B testing
- Advanced automation conditions (purchase history, segment membership)
- Production job queue (BullMQ/Inngest) to replace polling intervals
- Email open/click tracking via SES webhooks
