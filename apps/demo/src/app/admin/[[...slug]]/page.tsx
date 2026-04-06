// Shared components
import { PageHeader } from './_pages/_shared';

// Shared mock data
import { ORDERS, PRODUCTS, CUSTOMERS } from './_pages/_data';

// Static pages (not yet converted to interactive)
import { EmailSegmentFormPage, EmailAutomationDetailPage, EmailAutomationFormPage, EmailCampaignDetailPage } from './_pages/email';
import { AbandonedCheckoutDetailPage } from './_pages/abandoned-checkouts';
import { ImportFormPage, ExportFormPage } from './_pages/import-export';

// Interactive client components — Sprint 5
import { EmailOverviewClient, EmailContactsClient, EmailCampaignsClient, EmailCampaignFormClient, EmailTemplatesClient, EmailTemplateFormClient, EmailAutomationsClient, EmailSegmentsClient, EmailDeliverabilityClient } from './_pages/email-client';
import { WebhooksListClient, WebhookFormClient, WebhookDetailClient } from './_pages/webhooks-client';
import { SettingsGeneralClient, SettingsPaymentsClient, SettingsShippingClient, SettingsTaxClient, SettingsCheckoutClient, SettingsStaffClient } from './_pages/settings-client';
import { StaffListClient, StaffFormClient } from './_pages/staff-client';
import { AnalyticsClient } from './_pages/analytics-client';
import { ActivityLogClient, AbandonedCheckoutsClient, ImportExportClient } from './_pages/remaining-client';
import { PageWrapper } from './_pages/page-wrapper';

// Interactive client components
import { DashboardClient } from './_pages/dashboard-client';
import { OrdersListClient, OrderDetailClient } from './_pages/orders-client';
import { ProductsListClient, ProductFormClient } from './_pages/products-client';
import { CustomersListClient, CustomerDetailClient } from './_pages/customers-client';
import { DiscountsListClient, DiscountFormClient } from './_pages/discounts-client';
import { InventoryDashboardClient, InventoryBulkEditorClient, InventoryAdjustmentHistoryClient } from './_pages/inventory-client';
import { ReturnsListClient, ReturnDetailClient, CreateReturnClient } from './_pages/returns-client';
import { DraftOrdersListClient, DraftOrderFormClient } from './_pages/drafts-client';
import { CategoriesListClient, CategoryFormClient, CollectionsListClient, CollectionFormClient } from './_pages/categories-client';

export const dynamic = 'force-dynamic';

/* ==========================================================================
   SVG ICONS — clean line icons, 20px, stroke-based
   ========================================================================== */

const s = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const I = {
  home:       <svg {...s} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  orders:     <svg {...s} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  drafts:     <svg {...s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  returns:    <svg {...s} viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  abandoned:  <svg {...s} viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  products:   <svg {...s} viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  categories: <svg {...s} viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  collections:<svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  inventory:  <svg {...s} viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  customers:  <svg {...s} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  analytics:  <svg {...s} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  discounts:  <svg {...s} viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  email:      <svg {...s} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  import:     <svg {...s} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  activity:   <svg {...s} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  webhooks:   <svg {...s} viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  settings:   <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  more:       <svg {...s} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

type IconKey = keyof typeof I;

/* ==========================================================================
   SIDEBAR NAVIGATION
   ========================================================================== */

const NAV: Array<{ section: string | null; items: Array<{ label: string; path: string; icon: IconKey; badge?: string }> }> = [
  { section: null, items: [{ label: 'Home', path: '/admin', icon: 'home' }] },
  { section: null, items: [
    { label: 'Orders', path: '/admin/orders', icon: 'orders', badge: '3' },
    { label: 'Drafts', path: '/admin/drafts', icon: 'drafts' },
    { label: 'Returns', path: '/admin/returns', icon: 'returns' },
    { label: 'Abandoned', path: '/admin/abandoned-checkouts', icon: 'abandoned' },
  ]},
  { section: null, items: [
    { label: 'Products', path: '/admin/products', icon: 'products' },
    { label: 'Categories', path: '/admin/categories', icon: 'categories' },
    { label: 'Collections', path: '/admin/collections', icon: 'collections' },
    { label: 'Inventory', path: '/admin/inventory', icon: 'inventory' },
  ]},
  { section: null, items: [
    { label: 'Customers', path: '/admin/customers', icon: 'customers' },
  ]},
  { section: null, items: [
    { label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { label: 'Discounts', path: '/admin/discounts', icon: 'discounts' },
    { label: 'Email', path: '/admin/email', icon: 'email' },
  ]},
  { section: null, items: [
    { label: 'Import/Export', path: '/admin/import-export', icon: 'import' },
    { label: 'Activity Log', path: '/admin/activity-log', icon: 'activity' },
    { label: 'Webhooks', path: '/admin/webhooks', icon: 'webhooks' },
    { label: 'Settings', path: '/admin/settings', icon: 'settings' },
  ]},
];

/* ==========================================================================
   TOPBAR + SIDEBAR
   ========================================================================== */

function Topbar() {
  return (
    <div className="admin-topbar">
      <div className="admin-topbar-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 28, height: 28 }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Demo Store
      </div>
      <input className="admin-topbar-search" placeholder="Search orders, products, customers..." />
      <div className="admin-topbar-right">
        <div className="admin-topbar-avatar">SC</div>
      </div>
    </div>
  );
}

function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="admin-sidebar">
      {NAV.map((group, gi) => (
        <div key={gi}>
          {group.items.map((item) => {
            const active = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <a key={item.path} href={item.path} className={`admin-sidebar-link${active ? ' admin-sidebar-link--active' : ''}`}>
                {I[item.icon]}
                <span>{item.label}</span>
                {item.badge && <span className="admin-sidebar-badge">{item.badge}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

const MOBILE_TABS: Array<{ label: string; path: string; icon: IconKey }> = [
  { label: 'Home', path: '/admin', icon: 'home' },
  { label: 'Orders', path: '/admin/orders', icon: 'orders' },
  { label: 'Products', path: '/admin/products', icon: 'products' },
  { label: 'Customers', path: '/admin/customers', icon: 'customers' },
  { label: 'More', path: '/admin/more', icon: 'more' },
];

const MORE_MENU: Array<{ label: string; path: string; icon: IconKey }> = [
  { label: 'Drafts', path: '/admin/drafts', icon: 'drafts' },
  { label: 'Returns', path: '/admin/returns', icon: 'returns' },
  { label: 'Abandoned', path: '/admin/abandoned-checkouts', icon: 'abandoned' },
  { label: 'Categories', path: '/admin/categories', icon: 'categories' },
  { label: 'Collections', path: '/admin/collections', icon: 'collections' },
  { label: 'Inventory', path: '/admin/inventory', icon: 'inventory' },
  { label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
  { label: 'Discounts', path: '/admin/discounts', icon: 'discounts' },
  { label: 'Email', path: '/admin/email', icon: 'email' },
  { label: 'Import/Export', path: '/admin/import-export', icon: 'import' },
  { label: 'Activity Log', path: '/admin/activity-log', icon: 'activity' },
  { label: 'Webhooks', path: '/admin/webhooks', icon: 'webhooks' },
  { label: 'Settings', path: '/admin/settings', icon: 'settings' },
];

function MobileTabBar({ currentPath }: { currentPath: string }) {
  const isMore = !MOBILE_TABS.slice(0, 4).some(t => currentPath === t.path || (t.path !== '/admin' && currentPath.startsWith(t.path)));

  return (
    <>
      {/* More menu page — shown when on a route not in the 4 main tabs */}
      {currentPath === '/admin/more' && (
        <div className="admin-more-menu">
          <div style={{ padding: '20px 20px 10px', fontSize: '18px', fontWeight: 600 }}>More</div>
          <div className="admin-more-grid">
            {MORE_MENU.map((item) => (
              <a key={item.path} href={item.path} className="admin-more-item">
                <span className="admin-more-icon">{I[item.icon]}</span>
                <span className="admin-more-label">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="admin-bottom-bar">
        {MOBILE_TABS.map((tab) => {
          const active = tab.path === '/admin/more'
            ? isMore || currentPath === '/admin/more'
            : currentPath === tab.path || (tab.path !== '/admin' && currentPath.startsWith(tab.path));
          return (
            <a key={tab.path} href={tab.path} className={`admin-bottom-tab${active ? ' admin-bottom-tab--active' : ''}`}>
              <span className="admin-bottom-tab-icon">{I[tab.icon]}</span>
              <span className="admin-bottom-tab-label">{tab.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}

/* ==========================================================================
   PAGE SHELL + ROUTER
   ========================================================================== */

export default async function AdminCatchAll({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = slug ? `/admin/${slug.join('/')}` : '/admin';

  return (
    <>
      <Sidebar currentPath={path} />
      <Topbar />
      <main className="admin-main"><PageWrapper>{renderPage(slug)}</PageWrapper></main>
      <MobileTabBar currentPath={path} />
    </>
  );
}

function renderPage(slug?: string[]) {
  const page = slug?.[0];
  const sub = slug?.[1];
  const sub2 = slug?.[2];

  switch (page) {
    // --- Dashboard ---
    case undefined: return <DashboardPage />;

    // --- More menu (mobile only — rendered by MobileTabBar) ---
    case 'more': return null;

    // --- Orders ---
    case 'orders':
      if (sub) { const o = ORDERS.find(x => x.id === sub || String(x.num) === sub); return o ? <OrderDetailPage order={o} /> : <NotFound />; }
      return <OrdersPage />;

    // --- Drafts ---
    case 'drafts':
      if (sub === 'new') return <DraftOrderFormClient draft={null} />;
      if (sub) return <DraftOrderFormClient draft={{ id: sub } as any} />;
      return <DraftOrdersListClient />;

    // --- Returns ---
    case 'returns':
      if (sub === 'new') return <CreateReturnClient />;
      if (sub) return <ReturnDetailClient />;
      return <ReturnsListClient />;

    // --- Abandoned Checkouts ---
    case 'abandoned-checkouts':
      if (sub) return <AbandonedCheckoutDetailPage id={sub} />;
      return <AbandonedCheckoutsClient />;

    // --- Products ---
    case 'products':
      if (sub === 'new') return <ProductFormClient product={null} />;
      if (sub) { const p = PRODUCTS.find(x => x.id === sub); return p ? <ProductFormClient product={p as Parameters<typeof ProductFormClient>[0]['product']} /> : <NotFound />; }
      return <ProductsListClient />;

    // --- Categories ---
    case 'categories':
      if (sub === 'new') return <CategoryFormClient category={null} />;
      if (sub) return <CategoryFormClient category={null} />;
      return <CategoriesListClient />;

    // --- Collections ---
    case 'collections':
      if (sub === 'new') return <CollectionFormClient collection={null} />;
      if (sub) return <CollectionFormClient collection={null} />;
      return <CollectionsListClient />;

    // --- Inventory ---
    case 'inventory':
      if (sub === 'bulk-edit') return <InventoryBulkEditorClient />;
      if (sub === 'adjustments') return <InventoryAdjustmentHistoryClient />;
      return <InventoryDashboardClient />;

    // --- Customers ---
    case 'customers':
      if (sub) { const c = CUSTOMERS.find(x => x.id === sub); return c ? <CustomerDetailClient customer={c} /> : <NotFound />; }
      return <CustomersListClient />;

    // --- Analytics ---
    case 'analytics': return <AnalyticsClient />;

    // --- Discounts ---
    case 'discounts':
      if (sub === 'new') return <DiscountFormClient />;
      return <DiscountsListClient />;

    // --- Email Marketing ---
    case 'email':
      if (!sub) return <EmailOverviewClient />;
      if (sub === 'contacts') return <EmailContactsClient />;
      if (sub === 'segments' && sub2 === 'new') return <EmailSegmentFormPage />;
      if (sub === 'segments' && sub2) return <EmailSegmentFormPage id={sub2} />;
      if (sub === 'segments') return <EmailSegmentsClient />;
      if (sub === 'templates' && sub2 === 'new') return <EmailTemplateFormClient />;
      if (sub === 'templates' && sub2) return <EmailTemplateFormClient />;
      if (sub === 'templates') return <EmailTemplatesClient />;
      if (sub === 'campaigns' && sub2 === 'new') return <EmailCampaignFormClient />;
      if (sub === 'campaigns' && sub2) return <EmailCampaignDetailPage id={sub2} />;
      if (sub === 'campaigns') return <EmailCampaignsClient />;
      if (sub === 'automations' && sub2 === 'new') return <EmailAutomationFormPage />;
      if (sub === 'automations' && sub2) return <EmailAutomationDetailPage id={sub2} />;
      if (sub === 'automations') return <EmailAutomationsClient />;
      if (sub === 'deliverability') return <EmailDeliverabilityClient />;
      return <EmailOverviewClient />;

    // --- Import/Export ---
    case 'import-export':
      if (sub === 'import') return <ImportFormPage />;
      if (sub === 'export') return <ExportFormPage />;
      return <ImportExportClient />;

    // --- Activity Log ---
    case 'activity-log': return <ActivityLogClient />;

    // --- Webhooks ---
    case 'webhooks':
      if (sub === 'new') return <WebhookFormClient />;
      if (sub) return <WebhookDetailClient id={sub} />;
      return <WebhooksListClient />;

    // --- Settings ---
    case 'settings':
      return <SettingsLayout sub={sub} />;

    // --- Staff ---
    case 'staff':
      if (sub === 'new') return <StaffFormClient />;
      if (sub) return <StaffFormClient />;
      return <StaffListClient />;

    default: return <NotFound />;
  }
}

function NotFound() {
  return <div className="admin-empty"><div className="admin-empty-title">Page not found</div><div className="admin-empty-desc">The page you&apos;re looking for doesn&apos;t exist.</div><a href="/admin" className="admin-btn admin-btn--primary">Go to Dashboard</a></div>;
}

/* ==========================================================================
   SETTINGS LAYOUT (with left nav)
   ========================================================================== */

function SettingsLayout({ sub }: { sub?: string }) {
  const settingsNav = [
    { label: 'General', key: undefined },
    { label: 'Payments', key: 'payments' },
    { label: 'Checkout', key: 'checkout' },
    { label: 'Shipping', key: 'shipping' },
    { label: 'Taxes', key: 'taxes' },
    { label: 'Staff', key: 'staff' },
  ];

  function content() {
    switch (sub) {
      case 'payments': return <SettingsPaymentsClient />;
      case 'checkout': return <SettingsCheckoutClient />;
      case 'shipping': return <SettingsShippingClient />;
      case 'taxes': return <SettingsTaxClient />;
      case 'staff': return <SettingsStaffClient />;
      default: return <SettingsGeneralClient />;
    }
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="admin-settings-layout">
        <nav className="admin-settings-nav">
          {settingsNav.map(s => (
            <a key={s.label} href={s.key ? `/admin/settings/${s.key}` : '/admin/settings'} className={`admin-settings-nav-link${(sub ?? undefined) === s.key ? ' admin-settings-nav-link--active' : ''}`}>{s.label}</a>
          ))}
        </nav>
        <div className="admin-settings-content">{content()}</div>
      </div>
    </div>
  );
}

/* ==========================================================================
   EXISTING PAGES (Dashboard, Orders, Products, Customers, Discounts, Analytics)
   These remain inline since they reference the shared mock data directly.
   ========================================================================== */

function DashboardPage() {
  return <DashboardClient />;
}

function OrdersPage() {
  return <OrdersListClient />;
}

function OrderDetailPage({ order: o }: { order: typeof ORDERS[0] }) {
  return <OrderDetailClient order={o} />;
}

// ProductsPage replaced by ProductsListClient

// ProductFormPage replaced by ProductFormClient

// CustomersPage + CustomerDetailPage replaced by client components

// DiscountsPage + DiscountFormPage replaced by client components

// AnalyticsPage replaced by AnalyticsClient
