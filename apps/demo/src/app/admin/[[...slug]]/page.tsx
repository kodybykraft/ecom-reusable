import { formatMoney } from '@ecom/core';

// Shared components
import { Badge, TwoCol, Card, FormGroup, PageHeader, Tabs, Toolbar, Pagination, StatsGrid, StatCard } from './_pages/_shared';

// Shared mock data
import { ORDERS, PRODUCTS, CUSTOMERS, DISCOUNTS } from './_pages/_data';

// Tier 2 pages
import { ActivityLogPage } from './_pages/activity-log';
import { AbandonedCheckoutsPage, AbandonedCheckoutDetailPage } from './_pages/abandoned-checkouts';
import { WebhooksPage, WebhookFormPage, WebhookDetailPage } from './_pages/webhooks';
import { CategoriesPage, CategoryFormPage, CollectionsPage, CollectionFormPage } from './_pages/categories';
import { StaffListPage, StaffFormPage } from './_pages/staff';
import { SettingsGeneralPage, SettingsPaymentsPage, SettingsShippingPage, SettingsTaxPage, SettingsStaffPage, SettingsCheckoutPage } from './_pages/settings-extended';

// Tier 3 pages
import { InventoryDashboardPage, InventoryBulkEditorPage, InventoryAdjustmentHistoryPage, InventoryLocationFormPage } from './_pages/inventory';
import { ReturnsListPage, ReturnDetailPage, CreateReturnPage } from './_pages/returns';
import { DraftOrdersListPage, DraftOrderFormPage } from './_pages/drafts';
import { ImportExportPage, ImportFormPage, ExportFormPage } from './_pages/import-export';

// Email marketing pages
import { EmailOverviewPage, EmailContactsPage, EmailSegmentListPage, EmailSegmentFormPage, EmailTemplatesPage, EmailTemplateFormPage, EmailCampaignsPage, EmailCampaignFormPage, EmailCampaignDetailPage, EmailAutomationsPage, EmailAutomationDetailPage, EmailAutomationFormPage, EmailDeliverabilityPage } from './_pages/email';

export const dynamic = 'force-dynamic';

/* ==========================================================================
   SIDEBAR NAVIGATION
   ========================================================================== */

const NAV = [
  { section: null, items: [{ label: 'Home', path: '/admin', icon: '🏠' }] },
  { section: null, items: [
    { label: 'Orders', path: '/admin/orders', icon: '📦', badge: '3' },
    { label: 'Drafts', path: '/admin/drafts', icon: '📝' },
    { label: 'Returns', path: '/admin/returns', icon: '↩️' },
    { label: 'Abandoned', path: '/admin/abandoned-checkouts', icon: '🛒' },
  ]},
  { section: null, items: [
    { label: 'Products', path: '/admin/products', icon: '🏷️' },
    { label: 'Categories', path: '/admin/categories', icon: '📂' },
    { label: 'Collections', path: '/admin/collections', icon: '📚' },
    { label: 'Inventory', path: '/admin/inventory', icon: '📊' },
  ]},
  { section: null, items: [
    { label: 'Customers', path: '/admin/customers', icon: '👥' },
  ]},
  { section: null, items: [
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Discounts', path: '/admin/discounts', icon: '🎫' },
    { label: 'Email', path: '/admin/email', icon: '✉️' },
  ]},
  { section: null, items: [
    { label: 'Import/Export', path: '/admin/import-export', icon: '📤' },
    { label: 'Activity Log', path: '/admin/activity-log', icon: '📋' },
    { label: 'Webhooks', path: '/admin/webhooks', icon: '🔗' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
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
        <div key={gi} style={{ marginBottom: '4px' }}>
          {group.items.map((item) => {
            const active = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <a key={item.path} href={item.path} className={`admin-sidebar-link${active ? ' admin-sidebar-link--active' : ''}`}>
                <span>{item.icon} {item.label}</span>
                {'badge' in item && item.badge && <span className="admin-sidebar-badge">{item.badge}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </aside>
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
      <Topbar />
      <div style={{ display: 'flex' }}>
        <Sidebar currentPath={path} />
        <main className="admin-main">{renderPage(slug)}</main>
      </div>
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

    // --- Orders ---
    case 'orders':
      if (sub) { const o = ORDERS.find(x => x.id === sub || String(x.num) === sub); return o ? <OrderDetailPage order={o} /> : <NotFound />; }
      return <OrdersPage />;

    // --- Drafts ---
    case 'drafts':
      if (sub === 'new') return <DraftOrderFormPage />;
      if (sub) return <DraftOrderFormPage id={sub} />;
      return <DraftOrdersListPage />;

    // --- Returns ---
    case 'returns':
      if (sub === 'new') return <CreateReturnPage />;
      if (sub) return <ReturnDetailPage id={sub} />;
      return <ReturnsListPage />;

    // --- Abandoned Checkouts ---
    case 'abandoned-checkouts':
      if (sub) return <AbandonedCheckoutDetailPage id={sub} />;
      return <AbandonedCheckoutsPage />;

    // --- Products ---
    case 'products':
      if (sub === 'new') return <ProductFormPage product={null} />;
      if (sub) { const p = PRODUCTS.find(x => x.id === sub); return p ? <ProductFormPage product={p} /> : <NotFound />; }
      return <ProductsPage />;

    // --- Categories ---
    case 'categories':
      if (sub === 'new') return <CategoryFormPage />;
      if (sub) return <CategoryFormPage id={sub} />;
      return <CategoriesPage />;

    // --- Collections ---
    case 'collections':
      if (sub === 'new') return <CollectionFormPage />;
      if (sub) return <CollectionFormPage id={sub} />;
      return <CollectionsPage />;

    // --- Inventory ---
    case 'inventory':
      if (sub === 'bulk-edit') return <InventoryBulkEditorPage />;
      if (sub === 'adjustments') return <InventoryAdjustmentHistoryPage />;
      if (sub === 'locations' && sub2 === 'new') return <InventoryLocationFormPage />;
      if (sub === 'locations' && sub2) return <InventoryLocationFormPage id={sub2} />;
      return <InventoryDashboardPage />;

    // --- Customers ---
    case 'customers':
      if (sub) { const c = CUSTOMERS.find(x => x.id === sub); return c ? <CustomerDetailPage customer={c} /> : <NotFound />; }
      return <CustomersPage />;

    // --- Analytics ---
    case 'analytics': return <AnalyticsPage />;

    // --- Discounts ---
    case 'discounts':
      if (sub === 'new') return <DiscountFormPage />;
      return <DiscountsPage />;

    // --- Email Marketing ---
    case 'email':
      if (!sub) return <EmailOverviewPage />;
      if (sub === 'contacts') return <EmailContactsPage />;
      if (sub === 'segments' && sub2 === 'new') return <EmailSegmentFormPage />;
      if (sub === 'segments' && sub2) return <EmailSegmentFormPage id={sub2} />;
      if (sub === 'segments') return <EmailSegmentListPage />;
      if (sub === 'templates' && sub2 === 'new') return <EmailTemplateFormPage />;
      if (sub === 'templates' && sub2) return <EmailTemplateFormPage id={sub2} />;
      if (sub === 'templates') return <EmailTemplatesPage />;
      if (sub === 'campaigns' && sub2 === 'new') return <EmailCampaignFormPage />;
      if (sub === 'campaigns' && sub2) return <EmailCampaignDetailPage id={sub2} />;
      if (sub === 'campaigns') return <EmailCampaignsPage />;
      if (sub === 'automations' && sub2 === 'new') return <EmailAutomationFormPage />;
      if (sub === 'automations' && sub2) return <EmailAutomationDetailPage id={sub2} />;
      if (sub === 'automations') return <EmailAutomationsPage />;
      if (sub === 'deliverability') return <EmailDeliverabilityPage />;
      return <EmailOverviewPage />;

    // --- Import/Export ---
    case 'import-export':
      if (sub === 'import') return <ImportFormPage />;
      if (sub === 'export') return <ExportFormPage />;
      return <ImportExportPage />;

    // --- Activity Log ---
    case 'activity-log': return <ActivityLogPage />;

    // --- Webhooks ---
    case 'webhooks':
      if (sub === 'new') return <WebhookFormPage />;
      if (sub) return <WebhookDetailPage id={sub} />;
      return <WebhooksPage />;

    // --- Settings ---
    case 'settings':
      return <SettingsLayout sub={sub} />;

    // --- Staff (from settings) ---
    case 'staff':
      if (sub === 'new') return <StaffFormPage />;
      if (sub) return <StaffFormPage id={sub} />;
      return <StaffListPage />;

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
      case 'payments': return <SettingsPaymentsPage />;
      case 'checkout': return <SettingsCheckoutPage />;
      case 'shipping': return <SettingsShippingPage />;
      case 'taxes': return <SettingsTaxPage />;
      case 'staff': return <SettingsStaffPage />;
      default: return <SettingsGeneralPage />;
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
  const totalSales = ORDERS.filter(o => o.payment === 'paid').reduce((s, o) => s + o.total, 0);
  const unfulfilled = ORDERS.filter(o => o.fulfillment === 'unfulfilled').length;

  return (
    <div>
      <PageHeader title="Dashboard" />
      <StatsGrid>
        <StatCard label="Total sales" value={formatMoney(totalSales)} change={12.4} />
        <StatCard label="Orders" value={String(ORDERS.length)} change={8.2} />
        <StatCard label="Conversion rate" value="3.2%" change={0.4} />
        <StatCard label="Orders to fulfill" value={String(unfulfilled)} />
      </StatsGrid>
      <div className="admin-grid-2">
        <Card title="Recent orders" actions={<a href="/admin/orders" className="admin-btn admin-btn--plain">View all</a>}>
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th style={{ textAlign: 'right' }}>Total</th><th>Status</th></tr></thead>
            <tbody>
              {ORDERS.slice(0, 5).map(o => (
                <tr key={o.id}><td><a href={`/admin/orders/${o.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>#{o.num}</a></td><td>{o.customer}</td><td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td><td><Badge status={o.payment} /></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Top products">
          <table className="admin-table">
            <thead><tr><th>Product</th><th style={{ textAlign: 'right' }}>Inventory</th><th style={{ textAlign: 'right' }}>Price</th></tr></thead>
            <tbody>
              {PRODUCTS.slice(0, 5).map(p => (
                <tr key={p.id}><td><a href={`/admin/products/${p.id}`} style={{ color: 'var(--admin-text)' }}>{p.title}</a></td><td style={{ textAlign: 'right' }}>{p.inventory}</td><td style={{ textAlign: 'right' }}>{formatMoney(p.price)}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" />
      <div className="admin-card">
        <Tabs items={['All', `Unfulfilled (${ORDERS.filter(o => o.fulfillment === 'unfulfilled').length})`, 'Unpaid', 'Completed']} active={0} />
        <Toolbar searchPlaceholder="Search orders..." />
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th style={{ textAlign: 'right' }}>Total</th><th>Payment</th><th>Fulfillment</th></tr></thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id}><td><a href={`/admin/orders/${o.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>#{o.num}</a></td><td style={{ color: 'var(--admin-text-secondary)' }}>{o.date}</td><td>{o.customer}</td><td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td><td><Badge status={o.payment} /></td><td><Badge status={o.fulfillment} /></td></tr>
            ))}
          </tbody>
        </table>
        <Pagination total={ORDERS.length} />
      </div>
    </div>
  );
}

function OrderDetailPage({ order: o }: { order: typeof ORDERS[0] }) {
  return (
    <div>
      <PageHeader title={`#${o.num}`} breadcrumbs={[{ label: 'Orders', href: '/admin/orders' }, { label: `#${o.num}` }]} actions={<><a href="#" className="admin-btn admin-btn--primary">Fulfill items</a><a href="#" className="admin-btn admin-btn--outline">Refund</a></>} />
      <TwoCol
        left={<>
          <Card title={o.fulfillment === 'unfulfilled' ? 'Unfulfilled' : o.fulfillment === 'fulfilled' ? 'Fulfilled' : 'Partially fulfilled'}>
            <table className="admin-table"><tbody>
              {o.items.map((item, i) => (
                <tr key={i}><td><div style={{ fontWeight: 500 }}>{item.title}</div><div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>{item.variant}</div></td><td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatMoney(item.price)} × {item.qty}</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{formatMoney(item.price * item.qty)}</td></tr>
              ))}
            </tbody></table>
            <div style={{ borderTop: '1px solid var(--admin-border)', padding: '12px 0 0', marginTop: '8px', fontSize: '13px' }}>
              {[['Subtotal', o.subtotal], ['Shipping', o.shipping], ['Tax', o.tax]].map(([l, v]) => <div key={String(l)} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ color: 'var(--admin-text-secondary)' }}>{l}</span><span>{formatMoney(v as number)}</span></div>)}
              {o.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: 'var(--admin-success)' }}><span>Discount</span><span>-{formatMoney(o.discount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', paddingTop: '8px', borderTop: '1px solid var(--admin-border)', marginTop: '4px' }}><span>Total</span><span>{formatMoney(o.total)}</span></div>
            </div>
          </Card>
          <Card title="Timeline">
            {o.timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: i < o.timeline.length - 1 ? '1px solid var(--admin-border-light)' : undefined }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--admin-primary)', marginTop: 6, flexShrink: 0 }} />
                <div><div style={{ fontSize: '13px', fontWeight: 500 }}>{t.event}</div>{t.detail && <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>{t.detail}</div>}<div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: 2 }}>{t.time}</div></div>
              </div>
            ))}
          </Card>
        </>}
        right={<>
          <Card title="Customer"><div style={{ fontSize: '13px' }}><div style={{ fontWeight: 500 }}>{o.customer}</div><div style={{ color: 'var(--admin-text-secondary)' }}>{o.email}</div></div></Card>
          <Card title="Shipping address"><div style={{ fontSize: '13px', lineHeight: 1.6 }}>{o.address.name}<br />{o.address.line1}<br />{o.address.city}, {o.address.state} {o.address.zip}</div></Card>
          <Card title="Notes"><textarea className="admin-input" rows={3} placeholder="Add a note..." style={{ resize: 'vertical' }} /></Card>
        </>}
      />
    </div>
  );
}

function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products" actions={<a href="/admin/products/new" className="admin-btn admin-btn--primary">Add product</a>} />
      <div className="admin-card">
        <Tabs items={['All', 'Active', 'Draft', 'Archived']} active={0} />
        <Toolbar searchPlaceholder="Search products..." />
        <table className="admin-table">
          <thead><tr><th style={{ width: 40 }}></th><th>Product</th><th>Status</th><th>Inventory</th><th>Type</th><th>Vendor</th></tr></thead>
          <tbody>
            {PRODUCTS.map(p => (
              <tr key={p.id}><td><div style={{ width: 36, height: 36, background: '#f1f2f3', borderRadius: 'var(--admin-radius-sm)' }} /></td><td><a href={`/admin/products/${p.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{p.title}</a></td><td><Badge status={p.status} /></td><td>{p.inventory} in stock</td><td style={{ color: 'var(--admin-text-secondary)' }}>{p.type}</td><td style={{ color: 'var(--admin-text-secondary)' }}>{p.vendor}</td></tr>
            ))}
          </tbody>
        </table>
        <Pagination total={PRODUCTS.length} />
      </div>
    </div>
  );
}

function ProductFormPage({ product: p }: { product: typeof PRODUCTS[0] | null }) {
  const isNew = !p;
  return (
    <div>
      <PageHeader title={isNew ? 'Add product' : p.title} breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: isNew ? 'Add product' : p.title }]} actions={<><a href="#" className="admin-btn admin-btn--primary">Save</a></>} />
      <TwoCol
        left={<>
          <Card title="Title and description"><FormGroup label="Title"><input className="admin-input" defaultValue={p?.title ?? ''} placeholder="Short sleeve t-shirt" /></FormGroup><FormGroup label="Description"><textarea className="admin-input" rows={4} defaultValue={p?.description ?? ''} style={{ resize: 'vertical' }} /></FormGroup></Card>
          <Card title="Media"><div style={{ border: '2px dashed var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}><div style={{ fontSize: '14px', fontWeight: 500 }}>Drag and drop or click to upload</div></div></Card>
          <Card title="Pricing"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}><FormGroup label="Price"><input className="admin-input" defaultValue={p ? (p.price / 100).toFixed(2) : ''} /></FormGroup><FormGroup label="Compare-at price"><input className="admin-input" defaultValue={p?.compareAt ? (p.compareAt / 100).toFixed(2) : ''} /></FormGroup><FormGroup label="Cost per item"><input className="admin-input" defaultValue={p ? (p.cost / 100).toFixed(2) : ''} /></FormGroup></div></Card>
          <Card title="Inventory"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}><FormGroup label="SKU"><input className="admin-input" defaultValue={p?.sku ?? ''} /></FormGroup><FormGroup label="Quantity"><input className="admin-input" type="number" defaultValue={p?.inventory ?? 0} /></FormGroup></div></Card>
          {p && p.variants.length > 0 && <Card title="Variants"><table className="admin-table"><thead><tr><th>Variant</th><th style={{ textAlign: 'right' }}>Price</th><th style={{ textAlign: 'right' }}>Inventory</th></tr></thead><tbody>{p.variants.map((v, i) => <tr key={i}><td>{v.title}</td><td style={{ textAlign: 'right' }}>{formatMoney(v.price)}</td><td style={{ textAlign: 'right', color: v.inventory <= 5 ? 'var(--admin-critical)' : undefined, fontWeight: v.inventory <= 5 ? 600 : undefined }}>{v.inventory}</td></tr>)}</tbody></table></Card>}
        </>}
        right={<>
          <Card title="Status"><select className="admin-input" defaultValue={p?.status ?? 'draft'}><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select></Card>
          <Card title="Product organization"><FormGroup label="Type"><input className="admin-input" defaultValue={p?.type ?? ''} /></FormGroup><FormGroup label="Vendor"><input className="admin-input" defaultValue={p?.vendor ?? ''} /></FormGroup><FormGroup label="Collections"><input className="admin-input" placeholder="Search collections..." /></FormGroup><FormGroup label="Tags"><input className="admin-input" placeholder="Add tags..." /></FormGroup></Card>
        </>}
      />
    </div>
  );
}

function CustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" />
      <div className="admin-card">
        <Toolbar searchPlaceholder="Search customers..." />
        <table className="admin-table">
          <thead><tr><th>Customer</th><th>Email</th><th>Location</th><th style={{ textAlign: 'right' }}>Orders</th><th style={{ textAlign: 'right' }}>Amount spent</th></tr></thead>
          <tbody>{CUSTOMERS.map(c => <tr key={c.id}><td><a href={`/admin/customers/${c.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{c.name}</a></td><td style={{ color: 'var(--admin-text-secondary)' }}>{c.email}</td><td style={{ color: 'var(--admin-text-secondary)' }}>{c.location}</td><td style={{ textAlign: 'right' }}>{c.orders}</td><td style={{ textAlign: 'right' }}>{formatMoney(c.spent)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerDetailPage({ customer: c }: { customer: typeof CUSTOMERS[0] }) {
  const customerOrders = ORDERS.filter(o => o.email === c.email);
  return (
    <div>
      <PageHeader title={c.name} breadcrumbs={[{ label: 'Customers', href: '/admin/customers' }, { label: c.name }]} />
      <TwoCol
        left={<Card title={`Orders (${customerOrders.length})`}>{customerOrders.length > 0 ? <table className="admin-table"><thead><tr><th>Order</th><th>Date</th><th style={{ textAlign: 'right' }}>Total</th><th>Status</th></tr></thead><tbody>{customerOrders.map(o => <tr key={o.id}><td><a href={`/admin/orders/${o.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>#{o.num}</a></td><td style={{ color: 'var(--admin-text-secondary)' }}>{o.date}</td><td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td><td><Badge status={o.payment} /></td></tr>)}</tbody></table> : <div style={{ color: 'var(--admin-text-muted)', padding: '16px 0' }}>No orders yet</div>}</Card>}
        right={<><Card title="Contact information"><div style={{ fontSize: '13px', lineHeight: 1.8 }}><div>Email: {c.email}</div><div>Phone: {c.phone || 'Not provided'}</div><div style={{ marginTop: 8 }}><strong>Member since</strong> {c.joined}</div><div><strong>Total spent</strong> {formatMoney(c.spent)}</div></div></Card>{c.addresses[0] && <Card title="Default address"><div style={{ fontSize: '13px', lineHeight: 1.6 }}>{c.name}<br />{c.addresses[0].line1}<br />{c.addresses[0].city}, {c.addresses[0].state} {c.addresses[0].zip}</div></Card>}{c.notes && <Card title="Notes"><div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>{c.notes}</div></Card>}</>}
      />
    </div>
  );
}

function DiscountsPage() {
  return (
    <div>
      <PageHeader title="Discounts" actions={<a href="/admin/discounts/new" className="admin-btn admin-btn--primary">Create discount</a>} />
      <div className="admin-card">
        <Tabs items={['All', 'Active', 'Expired']} active={0} />
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used</th><th>Status</th></tr></thead>
          <tbody>{DISCOUNTS.map(d => <tr key={d.id}><td><code style={{ fontWeight: 600, background: 'var(--admin-border-light)', padding: '2px 6px', borderRadius: '4px' }}>{d.code}</code></td><td style={{ textTransform: 'capitalize' }}>{d.type.replace(/_/g, ' ')}</td><td>{d.type === 'percentage' ? `${d.value}%` : d.type === 'fixed_amount' ? formatMoney(d.value) : 'Free shipping'}</td><td>{d.used}{d.limit ? ` / ${d.limit}` : ''}</td><td><Badge status={d.active ? 'active' : 'expired'} /></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function DiscountFormPage() {
  return (
    <div>
      <PageHeader title="Create discount" breadcrumbs={[{ label: 'Discounts', href: '/admin/discounts' }, { label: 'Create discount' }]} actions={<a href="#" className="admin-btn admin-btn--primary">Save discount</a>} />
      <TwoCol
        left={<><Card title="Discount code"><FormGroup label="Code"><input className="admin-input" placeholder="e.g. SUMMER20" style={{ textTransform: 'uppercase' }} /></FormGroup></Card><Card title="Type and value"><FormGroup label="Discount type"><select className="admin-input"><option>Percentage</option><option>Fixed amount</option><option>Free shipping</option></select></FormGroup><FormGroup label="Value"><input className="admin-input" placeholder="10" /></FormGroup></Card><Card title="Usage limits"><FormGroup label="Total usage limit" hint="Leave blank for unlimited"><input className="admin-input" type="number" placeholder="Unlimited" /></FormGroup></Card></>}
        right={<><Card title="Active dates"><FormGroup label="Start date"><input className="admin-input" type="date" /></FormGroup><FormGroup label="End date" hint="Leave blank for no expiry"><input className="admin-input" type="date" /></FormGroup></Card></>}
      />
    </div>
  );
}

function AnalyticsPage() {
  const totalSales = ORDERS.filter(o => o.payment === 'paid').reduce((s, o) => s + o.total, 0);
  const paidOrders = ORDERS.filter(o => o.payment === 'paid');
  return (
    <div>
      <PageHeader title="Analytics" actions={<><a href="#" className="admin-btn admin-btn--outline">Last 7 days</a><a href="#" className="admin-btn admin-btn--outline">Export</a></>} />
      <StatsGrid>
        <StatCard label="Total sales" value={formatMoney(totalSales)} />
        <StatCard label="Online store sessions" value="2,847" />
        <StatCard label="Returning customers" value="38%" />
        <StatCard label="Avg order value" value={formatMoney(paidOrders.length > 0 ? Math.round(totalSales / paidOrders.length) : 0)} />
      </StatsGrid>
      <div className="admin-grid-2">
        <Card title="Sales over time"><div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', borderRadius: 'var(--admin-radius)', background: 'var(--admin-border-light)' }}>Chart placeholder — integrate Recharts</div></Card>
        <Card title="Top referrers"><table className="admin-table"><thead><tr><th>Source</th><th style={{ textAlign: 'right' }}>Sessions</th><th style={{ textAlign: 'right' }}>Orders</th></tr></thead><tbody><tr><td>Direct</td><td style={{ textAlign: 'right' }}>1,240</td><td style={{ textAlign: 'right' }}>42</td></tr><tr><td>Google</td><td style={{ textAlign: 'right' }}>680</td><td style={{ textAlign: 'right' }}>28</td></tr><tr><td>Instagram</td><td style={{ textAlign: 'right' }}>420</td><td style={{ textAlign: 'right' }}>15</td></tr><tr><td>Facebook</td><td style={{ textAlign: 'right' }}>310</td><td style={{ textAlign: 'right' }}>8</td></tr></tbody></table></Card>
      </div>
    </div>
  );
}
