# @ecom — Drop-in E-Commerce for Next.js

A complete e-commerce backend, admin dashboard, analytics, and email marketing system you can plug into any Next.js project. One config file and you're live.

---

## Table of Contents

- [Quick Start (5 minutes)](#quick-start)
- [Full Configuration](#full-configuration)
- [Environment Variables & API Keys](#environment-variables--api-keys)
- [Analytics (GA4, Meta, TikTok)](#analytics)
- [Email (Transactional + Marketing)](#email)
- [Custom Auth](#custom-auth)
- [Admin Dashboard](#admin-dashboard)
- [API Reference](#api-reference)
- [Packages](#packages)
- [Database](#database)
- [Development](#development)

---

## Quick Start

### 1. Install

```bash
npm install @ecom/next @ecom/db @ecom/admin @ecom/react
```

### 2. Create the config file

```ts
// lib/ecom.ts
import { createEcom } from '@ecom/next';

export const ecom = createEcom({
  databaseUrl: process.env.DATABASE_URL!,
});
```

### 3. Add the API route

```ts
// app/api/[...ecom]/route.ts
import { createEcomRouteHandler } from '@ecom/next';
import '../../../lib/ecom';

export const dynamic = 'force-dynamic';
export const { GET, POST, PATCH, DELETE } = createEcomRouteHandler();
```

### 4. Add middleware

```ts
// middleware.ts
import { createEcomMiddleware } from '@ecom/next';

export default createEcomMiddleware();
export const config = {
  matcher: ['/admin/:path*', '/api/ecom/admin/:path*'],
};
```

### 5. Add analytics to your layout (optional)

```tsx
// app/layout.tsx
import { EcomAnalytics } from '@ecom/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <EcomAnalytics />
      </body>
    </html>
  );
}
```

### 6. Create the database tables

```bash
npx drizzle-kit push
```

### 7. Start your app

```bash
npm run dev
```

Visit `/api/ecom/products` to verify the API is working. Visit `/admin` for the dashboard.

---

## Full Configuration

Everything beyond `databaseUrl` is optional. Add only what you need.

```ts
// lib/ecom.ts
import { createEcom } from '@ecom/next';

export const ecom = createEcom({
  // ── Required ──────────────────────────────────────────────
  databaseUrl: process.env.DATABASE_URL!,

  // ── Route Paths (optional) ────────────────────────────────
  // Change these if you already use /admin or /api/ecom
  apiBasePath: '/api/ecom',       // default
  adminBasePath: '/admin',        // default

  // ── Analytics (optional) ──────────────────────────────────
  // Add any or all. Pixels auto-load, events auto-fire.
  analytics: {
    google: {
      measurementId: process.env.GA_MEASUREMENT_ID!,
      apiSecret: process.env.GA_API_SECRET,           // for server-side events
    },
    meta: {
      pixelId: process.env.META_PIXEL_ID!,
      accessToken: process.env.META_ACCESS_TOKEN,      // for Conversions API
    },
    tiktok: {
      pixelId: process.env.TIKTOK_PIXEL_ID!,
      accessToken: process.env.TIKTOK_ACCESS_TOKEN,    // for Events API
    },
  },

  // ── Email (optional) ──────────────────────────────────────
  // Enables transactional emails + marketing campaigns via AWS SES
  email: {
    provider: 'ses',
    region: process.env.AWS_SES_REGION!,
    fromEmail: process.env.FROM_EMAIL!,
    fromName: 'My Store',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },

  // ── Auth (optional) ───────────────────────────────────────
  // Bring your own auth. If omitted, built-in auth is used.
  auth: {
    validateToken: async (token) => {
      const session = await yourAuth.getSession(token);
      if (!session) return null;
      return {
        id: session.userId,
        email: session.email,
        role: 'admin',
        firstName: session.name,
        lastName: null,
      };
    },
  },
});
```

---

## Environment Variables & API Keys

Create a `.env` file in your project root. Only `DATABASE_URL` is required — everything else is optional.

### Required

```env
# PostgreSQL connection string
# Get from: Supabase, Neon, Railway, Vercel Postgres, or local install
DATABASE_URL=postgresql://user:password@localhost:5432/mystore
```

### Payments

```env
# Stripe — https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal — https://developer.paypal.com/dashboard/applications
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### Analytics

```env
# Google Analytics 4
# Get from: https://analytics.google.com → Admin → Data Streams → Measurement ID
GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Get from: GA4 Admin → Data Streams → Measurement Protocol API secrets
GA_API_SECRET=...

# Meta / Facebook Pixel
# Get from: https://business.facebook.com/events_manager → your pixel
META_PIXEL_ID=1234567890
# Get from: Events Manager → Settings → Generate access token
META_ACCESS_TOKEN=...

# TikTok Pixel
# Get from: https://ads.tiktok.com → Events → Web Events
TIKTOK_PIXEL_ID=CXXXXXXXXX
# Get from: TikTok for Business → Marketing API
TIKTOK_ACCESS_TOKEN=...
```

### Email (AWS SES)

```env
# AWS credentials — https://console.aws.amazon.com/iam → Users → Security credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
# The AWS region where you verified your domain
AWS_SES_REGION=us-east-1
# Must be verified in SES — https://console.aws.amazon.com/ses
FROM_EMAIL=orders@yourstore.com
```

### What happens if keys are missing?

| Missing | Result |
|---------|--------|
| `DATABASE_URL` | App won't start |
| Stripe/PayPal keys | Payments disabled, everything else works |
| Analytics keys | No pixels load, no tracking, no CAPI calls |
| AWS/SES keys | No emails sent (order confirmations, marketing, etc.) |
| Custom auth | Built-in auth system used (PBKDF2 + Bearer tokens) |

Nothing crashes. Missing optional config is silently skipped.

---

## Analytics

When configured, analytics works automatically with zero code changes.

### What fires automatically

| User Action | GA4 Event | Meta Pixel | TikTok Pixel | Server CAPI |
|------------|-----------|------------|-------------|-------------|
| Page load | `page_view` | `PageView` | `Pageview` | - |
| View product | `view_item` | `ViewContent` | `ViewContent` | - |
| Add to cart | `add_to_cart` | `AddToCart` | `AddToCart` | - |
| Start checkout | `begin_checkout` | `InitiateCheckout` | `InitiateCheckout` | - |
| Complete purchase | `purchase` | `Purchase` | `CompletePayment` | All platforms |

Page views, product views, cart, and checkout events fire from the browser via pixels.
Purchase events also fire server-side via Conversion APIs (Meta CAPI, Google Measurement Protocol, TikTok Events API) — these can't be blocked by ad blockers.

### Manual tracking in your components

```tsx
import { useAnalytics } from '@ecom/react';

function ProductPage({ product }) {
  const { productViewed, addToCart } = useAnalytics();

  useEffect(() => {
    productViewed(product.id, { productName: product.title, price: product.price });
  }, []);

  return (
    <button onClick={() => addToCart(product.variantId, 1, { price: product.price })}>
      Add to Cart
    </button>
  );
}
```

### Available hook methods

```ts
const { track, productViewed, addToCart, checkoutStarted, orderCompleted } = useAnalytics();

track('custom_event', { key: 'value' });
productViewed(productId, { productName, price });
addToCart(variantId, quantity, { price });
checkoutStarted(cartId);
orderCompleted(orderId, totalInCents);
```

---

## Email

When configured, transactional emails fire automatically on events. Marketing campaigns and automations are managed from the admin dashboard.

### Automatic transactional emails

| Event | Email Sent | Template |
|-------|-----------|----------|
| Customer places order | Order confirmation | Order #, items, total, shipping address |
| Order ships | Shipping confirmation | Tracking number, carrier |
| Customer registers | Welcome email | Welcome + shop CTA |
| Return approved | Return confirmation | Return ID, items, next steps |
| Refund processed | Refund notification | Order #, refund amount |
| Cart abandoned (2hrs) | Recovery email | Cart items, total, checkout link |

All templates are built-in and work out of the box. Customize them anytime from the admin UI under Email > Templates.

### Email marketing (from admin dashboard)

- **Contacts**: Auto-synced from customers. Import/export supported.
- **Segments**: Rule-based groups (e.g., "customers who spent > $100")
- **Templates**: Drag-and-drop editor with `{{variable}}` support
- **Campaigns**: Create, schedule, send to lists/segments. Track opens, clicks, bounces.
- **Automations**: Trigger-based flows (e.g., "when customer registers → wait 3 days → send welcome series")

### SES setup checklist

1. [Verify your domain](https://console.aws.amazon.com/ses) in AWS SES
2. [Request production access](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html) (sandbox limits you to verified emails only)
3. Create an IAM user with `ses:SendEmail` and `ses:SendRawEmail` permissions
4. Add the credentials to your `.env`

---

## Custom Auth

By default, @ecom includes a built-in auth system:
- PBKDF2 password hashing (100k iterations, SHA-256)
- Bearer token sessions (30-day expiry)
- Login, register, logout endpoints
- Role-based access (admin, staff, customer)

If you already use **NextAuth**, **Clerk**, **Supabase Auth**, or similar — plug it in:

```ts
import { createEcom, type AuthAdapter } from '@ecom/next';

const myAuth: AuthAdapter = {
  // Required — called on every admin API request
  validateToken: async (token) => {
    const session = await clerk.verifySession(token);
    if (!session) return null;
    return {
      id: session.userId,
      email: session.emailAddress,
      role: 'admin',            // 'admin' | 'staff' | 'customer'
      firstName: session.firstName,
      lastName: session.lastName,
    };
  },

  // Optional — only if you want the built-in /auth/login endpoint
  login: async (email, password) => { /* ... */ },
  register: async (input) => { /* ... */ },
  logout: async (token) => { /* ... */ },
};

export const ecom = createEcom({
  databaseUrl: process.env.DATABASE_URL!,
  auth: myAuth,
});
```

When using custom auth, the built-in `/auth/login`, `/auth/register`, and `/auth/logout` endpoints return 501 unless you implement them on the adapter.

---

## Admin Dashboard

The admin dashboard is a set of React pages you copy into your project and restyle to match your site.

### Setup

1. Copy `apps/demo/src/app/admin/` from this repo into your project's `app/admin/`
2. Copy `apps/demo/src/app/admin/[[...slug]]/` — this is the catch-all route
3. Adjust styles, colors, branding to match your design

### Pages included (30+)

| Section | Pages |
|---------|-------|
| Dashboard | Live stats, recent orders, revenue chart |
| Orders | List, detail, fulfill, cancel |
| Products | List, create, edit, delete, variants, images |
| Customers | List, detail, addresses |
| Inventory | Levels, adjustments, bulk edit, locations |
| Returns | List, create, approve, receive, refund |
| Draft Orders | List, create, edit, convert to order |
| Categories | List, create, edit (hierarchical) |
| Collections | List, create, edit |
| Discounts | List, create (percentage, fixed, free shipping) |
| Email | Contacts, segments, templates, campaigns, automations, deliverability |
| Webhooks | List, create, detail, test delivery |
| Settings | General, payments, checkout, shipping, taxes, staff |
| Staff | List, create, permissions |
| Analytics | Date range picker, revenue, sessions, top products |
| Activity Log | Filterable audit trail |
| Abandoned Checkouts | List with recovery status |
| Import/Export | Bulk CSV operations |

---

## Embedding in an Existing Dashboard

If you already have a dashboard (e.g., a portal with training courses, CMS, analytics) and want e-commerce as one section inside it — you don't need the full admin shell. The page components are self-contained and can be dropped into any layout.

### How it works

Every admin page is an independent client component that fetches its own data from the API. They don't depend on the ecom sidebar, topbar, or routing. You import them individually and render them inside your existing layout.

### Step by step

**1. Copy just the page components (not the whole admin folder)**

```
From this repo, copy:
  apps/demo/src/app/admin/[[...slug]]/_pages/

Into your project:
  src/components/ecommerce/
```

This gives you all the client components: `OrdersListClient`, `ProductsListClient`, `DashboardClient`, etc.

**2. Add e-commerce to your existing sidebar**

```tsx
// Your existing portal sidebar — just add an E-Commerce section
const SIDEBAR_NAV = [
  { label: 'Dashboard', href: '/portal', icon: HomeIcon },
  { label: 'Training Courses', href: '/portal/courses', icon: BookIcon },

  // E-Commerce section — uses @ecom page components
  { label: 'E-Commerce', children: [
    { label: 'Orders', href: '/portal/ecommerce/orders' },
    { label: 'Products', href: '/portal/ecommerce/products' },
    { label: 'Customers', href: '/portal/ecommerce/customers' },
    { label: 'Inventory', href: '/portal/ecommerce/inventory' },
    { label: 'Discounts', href: '/portal/ecommerce/discounts' },
    { label: 'Returns', href: '/portal/ecommerce/returns' },
    { label: 'Email Marketing', href: '/portal/ecommerce/email' },
  ]},

  { label: 'Settings', href: '/portal/settings', icon: SettingsIcon },
];
```

**3. Render ecom pages inside your layout**

```tsx
// app/portal/ecommerce/[[...slug]]/page.tsx
import { OrdersListClient, OrderDetailClient } from '@/components/ecommerce/orders-client';
import { ProductsListClient, ProductFormClient } from '@/components/ecommerce/products-client';
import { CustomersListClient } from '@/components/ecommerce/customers-client';
import { DashboardClient } from '@/components/ecommerce/dashboard-client';
import { InventoryDashboardClient } from '@/components/ecommerce/inventory-client';
import { DiscountsListClient } from '@/components/ecommerce/discounts-client';
import { ReturnsListClient } from '@/components/ecommerce/returns-client';
import { EmailOverviewClient } from '@/components/ecommerce/email-client';

export default async function EcommercePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = slug?.[0];
  const sub = slug?.[1];

  // Your existing portal layout wraps this automatically
  switch (page) {
    case undefined: return <DashboardClient />;
    case 'orders':
      if (sub) return <OrderDetailClient order={{ id: sub } as any} />;
      return <OrdersListClient />;
    case 'products':
      if (sub === 'new') return <ProductFormClient product={null} />;
      return <ProductsListClient />;
    case 'customers': return <CustomersListClient />;
    case 'inventory': return <InventoryDashboardClient />;
    case 'discounts': return <DiscountsListClient />;
    case 'returns': return <ReturnsListClient />;
    case 'email': return <EmailOverviewClient />;
    default: return <div>Page not found</div>;
  }
}
```

That's it. The ecom pages render inside your portal's layout — your sidebar, your header, your design. The ecom components handle their own data fetching, state, and interactivity.

### Handling overlap

| Area | How it works |
|------|-------------|
| **Users / Auth** | Plug in your existing auth via the `auth` adapter in `createEcom()`. Your users table stays separate from `ecom_customers`. |
| **Analytics** | Ecom analytics tracks commerce events only (orders, products, carts). Your portal's own analytics are independent. Use the same GA4 measurement ID in both if you want unified reporting. |
| **Settings** | Ecom settings are commerce-specific (payments, shipping, taxes). They don't conflict with your portal settings. |
| **Email** | Ecom emails are transactional (order confirmation, shipping, etc.) and marketing (campaigns). Your portal's notification emails are separate. |
| **Customers vs Users** | Your portal has users (who log in). Ecom has customers (who buy). They can be linked via the auth adapter or kept separate. |

---

## API Reference

### Storefront endpoints (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ecom/products` | List products (search, filter, paginate) |
| GET | `/api/ecom/products/:slug` | Get product by slug |
| POST | `/api/ecom/cart` | Create new cart |
| GET | `/api/ecom/cart/:id` | Get cart |
| POST | `/api/ecom/cart/:id/items` | Add item to cart |
| PATCH | `/api/ecom/cart/:id/items/:itemId` | Update item quantity |
| DELETE | `/api/ecom/cart/:id/items/:itemId` | Remove item |
| POST | `/api/ecom/checkout` | Create checkout |
| PATCH | `/api/ecom/checkout/:id` | Update checkout (shipping address) |
| POST | `/api/ecom/checkout/:id/complete` | Complete purchase |
| GET | `/api/ecom/orders` | List orders |
| GET | `/api/ecom/orders/:id` | Get order detail |
| POST | `/api/ecom/auth/login` | Login |
| POST | `/api/ecom/auth/register` | Register |
| POST | `/api/ecom/auth/logout` | Logout |

### Admin endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ecom/admin/orders` | List orders (search, filter, paginate) |
| GET | `/api/ecom/admin/orders/:id` | Order detail |
| PATCH | `/api/ecom/admin/orders/:id/fulfill` | Mark fulfilled |
| PATCH | `/api/ecom/admin/orders/:id/cancel` | Cancel order |
| GET | `/api/ecom/admin/products` | List products |
| POST | `/api/ecom/admin/products` | Create product |
| PATCH | `/api/ecom/admin/products/:id` | Update product |
| DELETE | `/api/ecom/admin/products/:id` | Delete product |
| GET | `/api/ecom/admin/customers` | List customers |
| GET | `/api/ecom/admin/customers/:id` | Customer detail |
| GET/POST | `/api/ecom/admin/discounts` | List / create discounts |
| PATCH/DELETE | `/api/ecom/admin/discounts/:id` | Update / delete discount |
| GET | `/api/ecom/admin/inventory/levels` | Inventory levels |
| GET | `/api/ecom/admin/inventory/locations` | Warehouse locations |
| POST | `/api/ecom/admin/inventory/adjust` | Adjust stock |
| GET/POST | `/api/ecom/admin/returns` | List / create returns |
| PATCH | `/api/ecom/admin/returns/:id/approve` | Approve return |
| PATCH | `/api/ecom/admin/returns/:id/refund` | Process refund |
| GET/POST | `/api/ecom/admin/drafts` | List / create draft orders |
| POST | `/api/ecom/admin/drafts/:id/convert` | Convert to real order |
| GET/POST | `/api/ecom/admin/categories` | List / create categories |
| GET/POST | `/api/ecom/admin/collections` | List / create collections |
| GET/POST | `/api/ecom/admin/webhooks` | List / create webhooks |
| GET/PATCH | `/api/ecom/admin/settings/:section` | Get / update settings |
| GET/POST | `/api/ecom/admin/staff` | List / create staff |
| GET | `/api/ecom/admin/analytics` | Dashboard analytics |
| GET | `/api/ecom/admin/activity-log` | Activity log |
| GET | `/api/ecom/admin/abandoned-checkouts` | Abandoned checkouts |

### Analytics endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ecom/analytics/config` | Client-safe pixel IDs (no secrets) |
| POST | `/api/ecom/analytics/track` | Store client-side event |

---

## Packages

| Package | What it does | Install size |
|---------|-------------|-------------|
| `@ecom/core` | Types, money utils, errors, calculators. Zero deps. | Tiny |
| `@ecom/db` | 50+ PostgreSQL tables (Drizzle ORM), all prefixed `ecom_*` | Small |
| `@ecom/server` | 19 services, event bus, middleware, auth | Medium |
| `@ecom/next` | `createEcom()`, route handler, middleware, server actions | Small |
| `@ecom/react` | `EcomAnalytics`, `useAnalytics`, `useCart`, `useProducts`, `useAuth` | Small |
| `@ecom/admin` | Dashboard components, admin hooks, auth context | Medium |
| `@ecom/ui` | DataTable, Sidebar, PageHeader, StatCard, StatusBadge | Small |
| `@ecom/integrations` | Stripe, PayPal, shipping/tax provider interfaces | Small |
| `@ecom/email` | AWS SES client, templates, campaigns, automations, transactional | Medium |
| `@ecom/analytics` | Event collector, session manager, queries, attribution, CAPI clients | Medium |

### Dependency graph

```
@ecom/core (zero deps)
  |
  +-- @ecom/db
  +-- @ecom/react
  +-- @ecom/ui
  +-- @ecom/integrations
  |
  +-- @ecom/server (core + db + integrations)
  |     |
  |     +-- @ecom/next (core + server + email)
  |     +-- @ecom/email (core + db + integrations)
  |     +-- @ecom/analytics (core + db)
  |
  +-- @ecom/admin (core + ui + react)
```

---

## Database

All 50+ tables are prefixed with `ecom_` so they never collide with your existing tables:

`ecom_products`, `ecom_product_variants`, `ecom_orders`, `ecom_order_line_items`, `ecom_customers`, `ecom_carts`, `ecom_checkouts`, `ecom_users`, `ecom_sessions`, `ecom_discounts`, `ecom_categories`, `ecom_collections`, `ecom_inventory_levels`, `ecom_inventory_locations`, `ecom_returns`, `ecom_draft_orders`, `ecom_webhooks`, `ecom_email_contacts`, `ecom_email_campaigns`, `ecom_email_templates`, `ecom_analytics_events`, `ecom_analytics_sessions`, and 30+ more.

**ORM**: Drizzle ORM with PostgreSQL (`postgres` driver).

```bash
npx drizzle-kit push      # Create tables (dev)
npx drizzle-kit generate  # Generate migration files (prod)
npx drizzle-kit migrate   # Run migrations
```

### Money

All monetary values are **integer cents**. `$19.99` = `1999`.

```ts
import { formatMoney, toCents, toDollars } from '@ecom/core';

formatMoney(1999);  // "$19.99"
toCents(19.99);     // 1999
toDollars(1999);    // 19.99
```

---

## Development

### Running the demo app

```bash
git clone https://github.com/your-org/ecom-reusable.git
cd ecom-reusable
pnpm install
pnpm build
pnpm dev          # http://localhost:3000
pnpm test         # 40 tests
```

### CLI scaffolding

```bash
npx create-ecom-app
```

Creates the 3 required files (`lib/ecom.ts`, `app/api/[...ecom]/route.ts`, `middleware.ts`) and a `.env.example`.

### Requirements

- Node.js >= 20
- PostgreSQL
- Next.js >= 15
- React >= 18

---

## License

MIT
