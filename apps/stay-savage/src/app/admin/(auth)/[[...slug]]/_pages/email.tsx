import {
  Badge, Breadcrumb, Card, FormGroup, PageHeader, Pagination,
  StatsGrid, StatCard, Tabs, Toolbar, TwoCol,
} from './_shared';

/* ==========================================================================
   Email Marketing — Mock data & page components
   ========================================================================== */

// ── Contacts ────────────────────────────────────────────────────────────────

const EMAIL_CONTACTS = [
  { id: 'ec1', email: 'sarah.chen@gmail.com', firstName: 'Sarah', lastName: 'Chen', status: 'subscribed' as const, subscribedAt: 'Jan 15, 2026', lists: ['newsletter', 'vip'] },
  { id: 'ec2', email: 'james.wilson@outlook.com', firstName: 'James', lastName: 'Wilson', status: 'subscribed' as const, subscribedAt: 'Feb 3, 2026', lists: ['newsletter'] },
  { id: 'ec3', email: 'amira.patel@yahoo.com', firstName: 'Amira', lastName: 'Patel', status: 'unsubscribed' as const, subscribedAt: 'Feb 18, 2026', lists: ['newsletter'] },
  { id: 'ec4', email: 'lucas.berg@proton.me', firstName: 'Lucas', lastName: 'Berg', status: 'bounced' as const, subscribedAt: 'Mar 1, 2026', lists: ['promotions'] },
  { id: 'ec5', email: 'nina.kowalski@gmail.com', firstName: 'Nina', lastName: 'Kowalski', status: 'subscribed' as const, subscribedAt: 'Dec 20, 2025', lists: ['newsletter', 'vip', 'promotions'] },
  { id: 'ec6', email: 'omar.hassan@gmail.com', firstName: 'Omar', lastName: 'Hassan', status: 'subscribed' as const, subscribedAt: 'Jan 28, 2026', lists: ['newsletter', 'promotions'] },
  { id: 'ec7', email: 'elena.rossi@live.com', firstName: 'Elena', lastName: 'Rossi', status: 'subscribed' as const, subscribedAt: 'Mar 12, 2026', lists: ['newsletter'] },
  { id: 'ec8', email: 'david.kim@proton.me', firstName: 'David', lastName: 'Kim', status: 'unsubscribed' as const, subscribedAt: 'Mar 25, 2026', lists: ['promotions'] },
];

// ── Segments ────────────────────────────────────────────────────────────────

const EMAIL_SEGMENTS = [
  { id: 'seg1', name: 'High Spenders', description: 'Customers who have spent over $200 lifetime', rules: [{ field: 'total_spent', operator: 'greater_than', value: '20000' }], contactCount: 245, lastComputedAt: 'Apr 5, 2026 8:00 am' },
  { id: 'seg2', name: 'New Customers', description: 'Signed up in the last 30 days', rules: [{ field: 'signup_date', operator: 'greater_than', value: '30_days_ago' }], contactCount: 89, lastComputedAt: 'Apr 5, 2026 8:00 am' },
  { id: 'seg3', name: 'Inactive', description: 'No orders in the last 90 days', rules: [{ field: 'last_order', operator: 'greater_than', value: '90_days_ago' }], contactCount: 156, lastComputedAt: 'Apr 4, 2026 8:00 am' },
  { id: 'seg4', name: 'Newsletter Subscribers', description: 'All contacts on the newsletter list', rules: [{ field: 'list', operator: 'equals', value: 'newsletter' }], contactCount: 1203, lastComputedAt: 'Apr 5, 2026 8:00 am' },
];

// ── Templates ───────────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
  { id: 'tpl1', name: 'Welcome Email', subject: 'Welcome to our store, {{first_name}}!', category: 'automation' as const, variables: ['first_name', 'store_name'], updatedAt: 'Apr 1, 2026', previewHtml: '<div style="font-family:sans-serif;padding:20px"><h1>Welcome, {{first_name}}!</h1><p>Thanks for joining {{store_name}}. We are excited to have you.</p></div>' },
  { id: 'tpl2', name: 'Order Confirmation', subject: 'Your order #{{order_number}} has been confirmed', category: 'transactional' as const, variables: ['first_name', 'order_number', 'store_name'], updatedAt: 'Mar 28, 2026', previewHtml: '<div style="font-family:sans-serif;padding:20px"><h1>Order Confirmed</h1><p>Hi {{first_name}}, your order #{{order_number}} is being processed.</p></div>' },
  { id: 'tpl3', name: 'Spring Sale', subject: 'Spring Sale — Up to 30% off everything!', category: 'marketing' as const, variables: ['first_name'], updatedAt: 'Mar 15, 2026', previewHtml: '<div style="font-family:sans-serif;padding:20px;background:#f0faf0"><h1>Spring Sale</h1><p>Hi {{first_name}}, enjoy up to 30% off all products this season.</p></div>' },
  { id: 'tpl4', name: 'Abandoned Cart Reminder', subject: 'You left something in your cart!', category: 'automation' as const, variables: ['first_name', 'store_name'], updatedAt: 'Mar 20, 2026', previewHtml: '<div style="font-family:sans-serif;padding:20px"><h1>Forgot something?</h1><p>Hi {{first_name}}, you still have items in your cart at {{store_name}}.</p></div>' },
  { id: 'tpl5', name: 'Monthly Newsletter', subject: 'What\'s new at {{store_name}} this month', category: 'marketing' as const, variables: ['first_name', 'store_name'], updatedAt: 'Apr 3, 2026', previewHtml: '<div style="font-family:sans-serif;padding:20px"><h1>Monthly Update</h1><p>Hi {{first_name}}, here is what happened at {{store_name}} this month.</p></div>' },
];

// ── Campaigns ───────────────────────────────────────────────────────────────

const EMAIL_CAMPAIGNS = [
  { id: 'cmp1', name: 'Spring Sale Launch', subject: 'Spring Sale — Up to 30% off everything!', status: 'sent' as const, sentAt: 'Mar 15, 2026 10:00 am', stats: { sent: 1180, delivered: 1162, opened: 442, clicked: 128, bounced: 18, complained: 2, unsubscribed: 5 } },
  { id: 'cmp2', name: 'April Newsletter', subject: 'What\'s new this April', status: 'sent' as const, sentAt: 'Apr 1, 2026 9:00 am', stats: { sent: 1203, delivered: 1189, opened: 523, clicked: 187, bounced: 14, complained: 1, unsubscribed: 3 } },
  { id: 'cmp3', name: 'VIP Early Access', subject: 'Exclusive early access for VIP members', status: 'scheduled' as const, sentAt: 'Apr 10, 2026 8:00 am', stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0, unsubscribed: 0 } },
  { id: 'cmp4', name: 'Re-engagement Campaign', subject: 'We miss you! Here\'s 20% off', status: 'draft' as const, sentAt: null, stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0, unsubscribed: 0 } },
  { id: 'cmp5', name: 'Flash Sale Alert', subject: '24-hour flash sale — today only!', status: 'sent' as const, sentAt: 'Mar 25, 2026 12:00 pm', stats: { sent: 980, delivered: 965, opened: 398, clicked: 156, bounced: 15, complained: 3, unsubscribed: 8 } },
];

// ── Automations ─────────────────────────────────────────────────────────────

const EMAIL_AUTOMATIONS = [
  {
    id: 'auto1', name: 'Welcome Series', triggerEvent: 'customer.created', status: 'active' as const, enrolledCount: 342, completedCount: 298,
    steps: [
      { type: 'email' as const, label: 'Welcome email', config: { templateId: 'tpl1' }, stats: { sent: 342, opened: 256 } },
      { type: 'delay' as const, label: 'Wait 2 days', config: { duration: '48h' }, stats: null },
      { type: 'email' as const, label: 'Product recommendations', config: { templateId: 'tpl5' }, stats: { sent: 310, opened: 189 } },
    ],
  },
  {
    id: 'auto2', name: 'Abandoned Cart', triggerEvent: 'checkout.abandoned', status: 'active' as const, enrolledCount: 187, completedCount: 145,
    steps: [
      { type: 'delay' as const, label: 'Wait 1 hour', config: { duration: '1h' }, stats: null },
      { type: 'email' as const, label: 'Cart reminder', config: { templateId: 'tpl4' }, stats: { sent: 187, opened: 112 } },
    ],
  },
  {
    id: 'auto3', name: 'Post-Purchase Follow-up', triggerEvent: 'order.completed', status: 'active' as const, enrolledCount: 520, completedCount: 410,
    steps: [
      { type: 'email' as const, label: 'Order thank you', config: { templateId: 'tpl2' }, stats: { sent: 520, opened: 405 } },
      { type: 'delay' as const, label: 'Wait 7 days', config: { duration: '168h' }, stats: null },
      { type: 'email' as const, label: 'Review request', config: { templateId: 'tpl5' }, stats: { sent: 480, opened: 210 } },
      { type: 'condition' as const, label: 'Has reviewed?', config: { field: 'has_review', operator: 'equals', value: 'true' }, stats: null },
    ],
  },
  {
    id: 'auto4', name: 'Win-back', triggerEvent: 'customer.inactive', status: 'paused' as const, enrolledCount: 98, completedCount: 42,
    steps: [
      { type: 'email' as const, label: 'We miss you', config: { templateId: 'tpl3' }, stats: { sent: 98, opened: 34 } },
      { type: 'delay' as const, label: 'Wait 3 days', config: { duration: '72h' }, stats: null },
      { type: 'email' as const, label: 'Special discount offer', config: { templateId: 'tpl3' }, stats: { sent: 67, opened: 22 } },
    ],
  },
];

// ── Deliverability ──────────────────────────────────────────────────────────

const EMAIL_DELIVERABILITY = {
  deliveryRate: 98.2,
  bounceRate: 1.2,
  complaintRate: 0.05,
  suppressionCount: 47,
  domains: [
    { domain: 'store.com', spf: 'pass' as const, dkim: 'pass' as const, dmarc: 'pass' as const },
    { domain: 'mail.store.com', spf: 'pass' as const, dkim: 'pass' as const, dmarc: 'fail' as const },
    { domain: 'promo.store.com', spf: 'pass' as const, dkim: 'fail' as const, dmarc: 'fail' as const },
  ],
  recentBounces: [
    { email: 'lucas.berg@proton.me', type: 'hard', date: 'Apr 4, 2026' },
    { email: 'test@invalid.com', type: 'hard', date: 'Apr 3, 2026' },
    { email: 'old.user@yahoo.com', type: 'soft', date: 'Apr 2, 2026' },
    { email: 'bounce@example.com', type: 'hard', date: 'Apr 1, 2026' },
    { email: 'full.inbox@gmail.com', type: 'soft', date: 'Mar 30, 2026' },
  ],
};

/* ==========================================================================
   Page Components
   ========================================================================== */

// ── 1. Overview ─────────────────────────────────────────────────────────────

function computeOverviewStats() {
  const sentCampaigns = EMAIL_CAMPAIGNS.filter(c => c.status === 'sent');
  const totalOpened = sentCampaigns.reduce((s, c) => s + c.stats.opened, 0);
  const totalClicked = sentCampaigns.reduce((s, c) => s + c.stats.clicked, 0);
  const totalDelivered = sentCampaigns.reduce((s, c) => s + c.stats.delivered, 0);
  const avgOpen = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0';
  const avgClick = totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : '0';
  return { contactCount: EMAIL_CONTACTS.length, sentCount: sentCampaigns.length, avgOpen, avgClick };
}

export function EmailOverviewPage() {
  const stats = computeOverviewStats();
  const recentCampaigns = EMAIL_CAMPAIGNS.filter(c => c.status === 'sent').slice(0, 3);

  return (
    <>
      <PageHeader title="Email Marketing" subtitle="Manage campaigns, contacts, and automations" />

      <StatsGrid>
        <StatCard label="Total contacts" value={String(EMAIL_CONTACTS.length)} change={4.2} />
        <StatCard label="Campaigns sent" value={String(stats.sentCount)} change={12.0} />
        <StatCard label="Avg open rate" value={`${stats.avgOpen}%`} change={1.8} />
        <StatCard label="Avg click rate" value={`${stats.avgClick}%`} change={-0.3} />
      </StatsGrid>

      <Card title="Recent campaigns">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Subject</th><th>Sent</th><th>Open rate</th><th>Click rate</th></tr>
          </thead>
          <tbody>
            {recentCampaigns.map(c => {
              const openRate = c.stats.delivered > 0 ? ((c.stats.opened / c.stats.delivered) * 100).toFixed(1) : '0';
              const clickRate = c.stats.delivered > 0 ? ((c.stats.clicked / c.stats.delivered) * 100).toFixed(1) : '0';
              return (
                <tr key={c.id}>
                  <td><a href={`/admin/email/campaigns/${c.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{c.name}</a></td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{c.subject}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.sentAt}</td>
                  <td>{openRate}%</td>
                  <td>{clickRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <a href="/admin/email/campaigns/new" className="admin-btn admin-btn--primary">Create campaign</a>
        <a href="/admin/email/automations" className="admin-btn admin-btn--secondary">View automations</a>
      </div>
    </>
  );
}

// ── 2. Contacts ─────────────────────────────────────────────────────────────

export function EmailContactsPage() {
  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={`${EMAIL_CONTACTS.length} contacts`}
        actions={<a href="/admin/email/contacts/import" className="admin-btn admin-btn--primary">Import contacts</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Contacts' }]}
      />
      <Toolbar searchPlaceholder="Search contacts..." />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th><th>Subscribed</th><th>Lists</th></tr>
          </thead>
          <tbody>
            {EMAIL_CONTACTS.map(c => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.email}</td>
                <td><Badge status={c.status} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.subscribedAt}</td>
                <td>{c.lists.map(l => <span key={l} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '4px' }}>{l}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={EMAIL_CONTACTS.length} pageSize={10} />
      </Card>
    </>
  );
}

// ── 3. Segment List ─────────────────────────────────────────────────────────

export function EmailSegmentListPage() {
  return (
    <>
      <PageHeader
        title="Segments"
        subtitle="Group contacts based on shared attributes"
        actions={<a href="/admin/email/segments/new" className="admin-btn admin-btn--primary">Create segment</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Segments' }]}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Description</th><th>Contacts</th><th>Last computed</th><th>Rules</th></tr>
          </thead>
          <tbody>
            {EMAIL_SEGMENTS.map(seg => (
              <tr key={seg.id}>
                <td><a href={`/admin/email/segments/${seg.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{seg.name}</a></td>
                <td style={{ color: 'var(--admin-text-secondary)' }}>{seg.description}</td>
                <td>{seg.contactCount.toLocaleString()}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{seg.lastComputedAt}</td>
                <td>{seg.rules.map((r, i) => <code key={i} style={{ fontSize: '12px', background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px', marginRight: '4px' }}>{r.field} {r.operator} {r.value}</code>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ── 4. Segment Form ─────────────────────────────────────────────────────────

const SEGMENT_FIELDS = ['email_domain', 'total_orders', 'total_spent', 'last_order_date', 'signup_date', 'location'];
const SEGMENT_OPERATORS = ['equals', 'contains', 'greater_than', 'less_than', 'between', 'in'];

export function EmailSegmentFormPage({ id }: { id?: string }) {
  const existing = id ? EMAIL_SEGMENTS.find(s => s.id === id) : null;
  const title = existing ? `Edit segment: ${existing.name}` : 'Create segment';
  const rules = existing?.rules ?? [{ field: 'total_spent', operator: 'greater_than', value: '' }];

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Segments', href: '/admin/email/segments' }, { label: title }]} />
      <PageHeader title={title} />

      <TwoCol
        left={
          <>
            <Card title="Segment rules">
              {rules.map((rule, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ textAlign: 'center', padding: '8px 0', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>AND</div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <select className="admin-input" defaultValue={rule.field}>
                      {SEGMENT_FIELDS.map(f => <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>)}
                    </select>
                    <select className="admin-input" defaultValue={rule.operator}>
                      {SEGMENT_OPERATORS.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                    </select>
                    <input className="admin-input" defaultValue={rule.value} placeholder="Value" />
                  </div>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn--secondary" style={{ marginTop: '8px' }}>Add rule</button>
            </Card>

            <Card title="Estimated reach">
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--admin-primary)' }}>{existing?.contactCount ?? '—'}</div>
                <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>contacts match these rules</div>
              </div>
            </Card>
          </>
        }
        right={
          <Card title="Details">
            <FormGroup label="Segment name">
              <input className="admin-input" defaultValue={existing?.name ?? ''} placeholder="e.g. High Spenders" />
            </FormGroup>
            <FormGroup label="Description">
              <textarea className="admin-input" rows={3} defaultValue={existing?.description ?? ''} placeholder="Describe this segment..." />
            </FormGroup>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '12px' }}>
              {existing ? 'Save segment' : 'Create segment'}
            </button>
          </Card>
        }
      />
    </>
  );
}

// ── 5. Templates List ───────────────────────────────────────────────────────

function categoryLabel(cat: string) {
  const map: Record<string, string> = { marketing: 'Marketing', transactional: 'Transactional', automation: 'Automation' };
  return map[cat] ?? cat;
}

export function EmailTemplatesPage() {
  return (
    <>
      <PageHeader
        title="Templates"
        subtitle="Reusable email templates for campaigns and automations"
        actions={<a href="/admin/email/templates/new" className="admin-btn admin-btn--primary">Create template</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Templates' }]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {EMAIL_TEMPLATES.map(tpl => (
          <div key={tpl.id} className="admin-card">
            <div className="admin-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{tpl.name}</h4>
                <Badge status={tpl.category === 'marketing' ? 'active' : tpl.category === 'transactional' ? 'pending' : 'scheduled'} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>{tpl.subject}</div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
                {categoryLabel(tpl.category)} &middot; Updated {tpl.updatedAt}
              </div>
              <a href={`/admin/email/templates/${tpl.id}`} className="admin-btn admin-btn--secondary" style={{ fontSize: '13px' }}>Edit</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── 6. Template Form ────────────────────────────────────────────────────────

const TEMPLATE_VARIABLES = ['{{first_name}}', '{{last_name}}', '{{order_number}}', '{{store_name}}'];

export function EmailTemplateFormPage({ id }: { id?: string }) {
  const existing = id ? EMAIL_TEMPLATES.find(t => t.id === id) : null;
  const title = existing ? `Edit template: ${existing.name}` : 'Create template';

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Templates', href: '/admin/email/templates' }, { label: title }]} />
      <PageHeader title={title} />

      <TwoCol
        left={
          <Card title="Content">
            <FormGroup label="Template name">
              <input className="admin-input" defaultValue={existing?.name ?? ''} placeholder="e.g. Welcome Email" />
            </FormGroup>
            <FormGroup label="Subject line" hint="Use variables below to personalize">
              <input className="admin-input" defaultValue={existing?.subject ?? ''} placeholder="e.g. Welcome to our store, {{first_name}}!" />
            </FormGroup>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {TEMPLATE_VARIABLES.map(v => (
                <span key={v} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}>{v}</span>
              ))}
            </div>
            <FormGroup label="HTML content">
              <textarea className="admin-input" rows={8} defaultValue={existing?.previewHtml ?? ''} placeholder="Paste or write HTML email content..." style={{ fontFamily: 'monospace', fontSize: '13px' }} />
            </FormGroup>
            <FormGroup label="Plain text content">
              <textarea className="admin-input" rows={4} defaultValue="" placeholder="Plain text fallback for email clients that don't support HTML..." />
            </FormGroup>
          </Card>
        }
        right={
          <>
            <Card title="Preview">
              <div style={{ border: '1px solid var(--admin-border-light)', borderRadius: '6px', padding: '16px', background: '#fff', minHeight: '120px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>{existing?.subject ?? 'Subject preview'}</div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                  {existing ? 'Email preview will render here based on the HTML content above.' : 'Start writing content to see a preview.'}
                </div>
              </div>
            </Card>
            <Card title="Settings">
              <FormGroup label="Category">
                <select className="admin-input" defaultValue={existing?.category ?? 'marketing'}>
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                  <option value="automation">Automation</option>
                </select>
              </FormGroup>
              <FormGroup label="Variables used">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(existing?.variables ?? []).map(v => (
                    <span key={v} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}>{`{{${v}}}`}</span>
                  ))}
                  {!existing && <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>No variables detected</span>}
                </div>
              </FormGroup>
              <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '12px' }}>
                {existing ? 'Save template' : 'Create template'}
              </button>
            </Card>
          </>
        }
      />
    </>
  );
}

// ── 7. Campaigns List ───────────────────────────────────────────────────────

export function EmailCampaignsPage() {
  const tabItems = ['All', 'Draft', 'Sent', 'Scheduled'];

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Send targeted emails to your contacts"
        actions={<a href="/admin/email/campaigns/new" className="admin-btn admin-btn--primary">Create campaign</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Campaigns' }]}
      />
      <Tabs items={tabItems} active={0} />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Sent</th><th>Open rate</th><th>Click rate</th></tr>
          </thead>
          <tbody>
            {EMAIL_CAMPAIGNS.map(c => {
              const openRate = c.stats.delivered > 0 ? ((c.stats.opened / c.stats.delivered) * 100).toFixed(1) : '—';
              const clickRate = c.stats.delivered > 0 ? ((c.stats.clicked / c.stats.delivered) * 100).toFixed(1) : '—';
              return (
                <tr key={c.id}>
                  <td><a href={`/admin/email/campaigns/${c.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{c.name}</a></td>
                  <td><Badge status={c.status} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.sentAt ?? '—'}</td>
                  <td>{openRate === '—' ? '—' : `${openRate}%`}</td>
                  <td>{clickRate === '—' ? '—' : `${clickRate}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination total={EMAIL_CAMPAIGNS.length} pageSize={10} />
      </Card>
    </>
  );
}

// ── 8. Campaign Form ────────────────────────────────────────────────────────

export function EmailCampaignFormPage({ id }: { id?: string }) {
  const existing = id ? EMAIL_CAMPAIGNS.find(c => c.id === id) : null;
  const title = existing ? `Edit campaign: ${existing.name}` : 'Create campaign';

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Campaigns', href: '/admin/email/campaigns' }, { label: title }]} />
      <PageHeader title={title} />

      <TwoCol
        left={
          <>
            <Card title="Content">
              <FormGroup label="Campaign name">
                <input className="admin-input" defaultValue={existing?.name ?? ''} placeholder="e.g. Spring Sale Launch" />
              </FormGroup>
              <FormGroup label="Subject line">
                <input className="admin-input" defaultValue={existing?.subject ?? ''} placeholder="e.g. Up to 30% off everything!" />
              </FormGroup>
              <FormGroup label="From name">
                <input className="admin-input" defaultValue="My Store" placeholder="e.g. My Store" />
              </FormGroup>
              <FormGroup label="From email">
                <input className="admin-input" defaultValue="hello@store.com" placeholder="e.g. hello@store.com" />
              </FormGroup>
              <FormGroup label="Reply-to">
                <input className="admin-input" defaultValue="support@store.com" placeholder="e.g. support@store.com" />
              </FormGroup>
            </Card>

            <Card title="Audience">
              <FormGroup label="Send to" hint="Choose a contact list or segment">
                <select className="admin-input" defaultValue="">
                  <option value="" disabled>Select audience...</option>
                  <optgroup label="Lists">
                    <option value="list:newsletter">Newsletter</option>
                    <option value="list:vip">VIP</option>
                    <option value="list:promotions">Promotions</option>
                  </optgroup>
                  <optgroup label="Segments">
                    {EMAIL_SEGMENTS.map(seg => <option key={seg.id} value={`segment:${seg.id}`}>{seg.name} ({seg.contactCount})</option>)}
                  </optgroup>
                </select>
              </FormGroup>
            </Card>

            <Card title="Template">
              <FormGroup label="Select template">
                <select className="admin-input" defaultValue="">
                  <option value="" disabled>Choose a template...</option>
                  {EMAIL_TEMPLATES.map(tpl => <option key={tpl.id} value={tpl.id}>{tpl.name} ({categoryLabel(tpl.category)})</option>)}
                </select>
              </FormGroup>
            </Card>

            <Card title="Schedule">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="radio" name="schedule" value="now" defaultChecked /> Send now
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="radio" name="schedule" value="later" /> Schedule for later
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <FormGroup label="Date">
                    <input className="admin-input" type="date" defaultValue="2026-04-10" />
                  </FormGroup>
                  <FormGroup label="Time">
                    <input className="admin-input" type="time" defaultValue="09:00" />
                  </FormGroup>
                </div>
              </div>
            </Card>
          </>
        }
        right={
          <Card title="Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Campaign</div>
                <div style={{ fontWeight: 600 }}>{existing?.name ?? 'Untitled campaign'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Subject</div>
                <div>{existing?.subject ?? 'No subject set'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>From</div>
                <div>My Store &lt;hello@store.com&gt;</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Audience</div>
                <div>Not selected</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Template</div>
                <div>Not selected</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Schedule</div>
                <div>Send now</div>
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '16px' }}>
              Send campaign
            </button>
            <button type="button" className="admin-btn admin-btn--secondary" style={{ width: '100%', marginTop: '8px' }}>
              Schedule
            </button>
          </Card>
        }
      />
    </>
  );
}

// ── 9. Campaign Detail ──────────────────────────────────────────────────────

const CAMPAIGN_RECIPIENTS = [
  { email: 'sarah.chen@gmail.com', status: 'opened', sentAt: 'Mar 15, 10:01 am', openedAt: 'Mar 15, 10:32 am', clickedAt: 'Mar 15, 10:35 am' },
  { email: 'nina.kowalski@gmail.com', status: 'clicked', sentAt: 'Mar 15, 10:01 am', openedAt: 'Mar 15, 11:15 am', clickedAt: 'Mar 15, 11:18 am' },
  { email: 'omar.hassan@gmail.com', status: 'delivered', sentAt: 'Mar 15, 10:02 am', openedAt: null, clickedAt: null },
  { email: 'elena.rossi@live.com', status: 'opened', sentAt: 'Mar 15, 10:02 am', openedAt: 'Mar 15, 2:45 pm', clickedAt: null },
  { email: 'lucas.berg@proton.me', status: 'bounced', sentAt: 'Mar 15, 10:02 am', openedAt: null, clickedAt: null },
];

export function EmailCampaignDetailPage({ id }: { id: string }) {
  const campaign = EMAIL_CAMPAIGNS.find(c => c.id === id);
  if (!campaign) return <div>Campaign not found</div>;

  const s = campaign.stats;
  const openRate = s.delivered > 0 ? ((s.opened / s.delivered) * 100).toFixed(1) : '0';
  const clickRate = s.delivered > 0 ? ((s.clicked / s.delivered) * 100).toFixed(1) : '0';

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Campaigns', href: '/admin/email/campaigns' }, { label: campaign.name }]} />
      <PageHeader
        title={campaign.name}
        subtitle={campaign.subject}
        actions={<Badge status={campaign.status} />}
      />

      <StatsGrid>
        <StatCard label="Sent" value={s.sent.toLocaleString()} />
        <StatCard label="Delivered" value={s.delivered.toLocaleString()} />
        <StatCard label="Opened" value={`${s.opened.toLocaleString()} (${openRate}%)`} />
        <StatCard label="Clicked" value={`${s.clicked.toLocaleString()} (${clickRate}%)`} />
        <StatCard label="Bounced" value={String(s.bounced)} />
        <StatCard label="Complained" value={String(s.complained)} />
        <StatCard label="Unsubscribed" value={String(s.unsubscribed)} />
      </StatsGrid>

      <Card title="Performance over time">
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
          Performance chart placeholder — opens and clicks over the first 72 hours
        </div>
      </Card>

      <Card title="Recipient activity">
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Status</th><th>Sent</th><th>Opened</th><th>Clicked</th></tr>
          </thead>
          <tbody>
            {CAMPAIGN_RECIPIENTS.map(r => (
              <tr key={r.email}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{r.email}</td>
                <td><Badge status={r.status} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.sentAt}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.openedAt ?? '—'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.clickedAt ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ── 10. Automations List ────────────────────────────────────────────────────

export function EmailAutomationsPage() {
  return (
    <>
      <PageHeader
        title="Automations"
        subtitle="Set up automated email workflows triggered by customer actions"
        actions={<a href="/admin/email/automations/new" className="admin-btn admin-btn--primary">Create automation</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Automations' }]}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Trigger</th><th>Status</th><th>Enrolled</th><th>Completed</th></tr>
          </thead>
          <tbody>
            {EMAIL_AUTOMATIONS.map(a => (
              <tr key={a.id}>
                <td><a href={`/admin/email/automations/${a.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{a.name}</a></td>
                <td><code style={{ fontSize: '12px', background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{a.triggerEvent}</code></td>
                <td><Badge status={a.status} /></td>
                <td>{a.enrolledCount}</td>
                <td>{a.completedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ── 11. Automation Detail ───────────────────────────────────────────────────

function StepIcon({ type }: { type: string }) {
  const icon = type === 'email' ? '📧' : type === 'delay' ? '⏱' : '🔀';
  return <span style={{ fontSize: '20px' }}>{icon}</span>;
}

export function EmailAutomationDetailPage({ id }: { id: string }) {
  const automation = EMAIL_AUTOMATIONS.find(a => a.id === id);
  if (!automation) return <div>Automation not found</div>;

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Automations', href: '/admin/email/automations' }, { label: automation.name }]} />
      <PageHeader
        title={automation.name}
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge status={automation.status} />
            <button type="button" className={`admin-btn ${automation.status === 'active' ? 'admin-btn--secondary' : 'admin-btn--primary'}`}>
              {automation.status === 'active' ? 'Pause' : 'Activate'}
            </button>
          </div>
        }
      />

      <Card title="Trigger">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Event: <code style={{ background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{automation.triggerEvent}</code></div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>Enrolled {automation.enrolledCount} &middot; Completed {automation.completedCount}</div>
          </div>
        </div>
      </Card>

      <Card title="Workflow steps">
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Vertical connector line */}
          <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '2px', background: 'var(--admin-border-light)' }} />

          {automation.steps.map((step, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < automation.steps.length - 1 ? '16px' : 0, paddingLeft: '24px' }}>
              {/* Step dot */}
              <div style={{ position: 'absolute', left: '-13px', top: '12px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--admin-primary)', border: '2px solid var(--admin-bg)' }} />

              <div className="admin-card" style={{ margin: 0 }}>
                <div className="admin-card-body" style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <StepIcon type={step.type} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Step {i + 1}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{step.label}</span>
                    </div>
                    {step.type === 'email' && step.stats && (
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                        Sent {step.stats.sent} &middot; Opened {step.stats.opened} ({step.stats.sent > 0 ? ((step.stats.opened / step.stats.sent) * 100).toFixed(0) : 0}%)
                      </div>
                    )}
                    {step.type === 'delay' && (
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>Wait {step.config.duration}</div>
                    )}
                    {step.type === 'condition' && (
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                        If <code style={{ background: 'var(--admin-bg-secondary)', padding: '1px 4px', borderRadius: '3px' }}>{step.config.field}</code> {step.config.operator} <code style={{ background: 'var(--admin-bg-secondary)', padding: '1px 4px', borderRadius: '3px' }}>{step.config.value}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ── 12. Automation Form ─────────────────────────────────────────────────────

const TRIGGER_EVENTS = ['customer.created', 'checkout.abandoned', 'order.completed', 'customer.inactive_90d'];

export function EmailAutomationFormPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Automations', href: '/admin/email/automations' }, { label: 'Create automation' }]} />
      <PageHeader title="Create automation" />

      <TwoCol
        left={
          <>
            <Card title="Automation details">
              <FormGroup label="Automation name">
                <input className="admin-input" placeholder="e.g. Welcome Series" />
              </FormGroup>
              <FormGroup label="Trigger event" hint="The event that starts this automation">
                <select className="admin-input" defaultValue="">
                  <option value="" disabled>Select trigger...</option>
                  {TRIGGER_EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </FormGroup>
            </Card>

            <Card title="Trigger conditions">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <select className="admin-input" defaultValue="">
                  <option value="" disabled>Field...</option>
                  {SEGMENT_FIELDS.map(f => <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>)}
                </select>
                <select className="admin-input" defaultValue="">
                  <option value="" disabled>Operator...</option>
                  {SEGMENT_OPERATORS.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                </select>
                <input className="admin-input" placeholder="Value" />
              </div>
            </Card>

            <Card title="Steps">
              {/* Default first step */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="admin-card" style={{ margin: 0, border: '1px solid var(--admin-border-light)' }}>
                  <div className="admin-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Step 1</span>
                    </div>
                    <FormGroup label="Step type">
                      <select className="admin-input" defaultValue="email">
                        <option value="email">Send Email</option>
                        <option value="delay">Wait</option>
                        <option value="condition">Condition</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Email template">
                      <select className="admin-input" defaultValue="">
                        <option value="" disabled>Select template...</option>
                        {EMAIL_TEMPLATES.map(tpl => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
                      </select>
                    </FormGroup>
                  </div>
                </div>

                <div className="admin-card" style={{ margin: 0, border: '1px solid var(--admin-border-light)' }}>
                  <div className="admin-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Step 2</span>
                    </div>
                    <FormGroup label="Step type">
                      <select className="admin-input" defaultValue="delay">
                        <option value="email">Send Email</option>
                        <option value="delay">Wait</option>
                        <option value="condition">Condition</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Wait duration">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input className="admin-input" type="number" defaultValue={2} min={1} />
                        <select className="admin-input" defaultValue="days">
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </select>
                      </div>
                    </FormGroup>
                  </div>
                </div>

                <div className="admin-card" style={{ margin: 0, border: '1px solid var(--admin-border-light)' }}>
                  <div className="admin-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Step 3</span>
                    </div>
                    <FormGroup label="Step type">
                      <select className="admin-input" defaultValue="condition">
                        <option value="email">Send Email</option>
                        <option value="delay">Wait</option>
                        <option value="condition">Condition</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Condition">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <select className="admin-input" defaultValue="">
                          <option value="" disabled>Field...</option>
                          {SEGMENT_FIELDS.map(f => <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>)}
                        </select>
                        <select className="admin-input" defaultValue="">
                          <option value="" disabled>Operator...</option>
                          {SEGMENT_OPERATORS.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                        </select>
                        <input className="admin-input" placeholder="Value" />
                      </div>
                    </FormGroup>
                  </div>
                </div>
              </div>

              <button type="button" className="admin-btn admin-btn--secondary" style={{ marginTop: '12px' }}>Add step</button>
            </Card>
          </>
        }
        right={
          <Card title="Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Automation</div>
                <div style={{ fontWeight: 600 }}>Untitled automation</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Trigger</div>
                <div>Not selected</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Steps</div>
                <div>3 steps configured</div>
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '16px' }}>
              Create automation
            </button>
          </Card>
        }
      />
    </>
  );
}

// ── 13. Deliverability ──────────────────────────────────────────────────────

function DomainBadge({ status }: { status: 'pass' | 'fail' }) {
  const cls = status === 'pass' ? 'admin-badge admin-badge--success' : 'admin-badge admin-badge--critical';
  return <span className={cls}>{status}</span>;
}

export function EmailDeliverabilityPage() {
  const d = EMAIL_DELIVERABILITY;

  return (
    <>
      <PageHeader
        title="Deliverability"
        subtitle="Monitor email delivery health and domain authentication"
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Deliverability' }]}
      />

      <StatsGrid>
        <StatCard label="Delivery rate" value={`${d.deliveryRate}%`} change={0.3} />
        <StatCard label="Bounce rate" value={`${d.bounceRate}%`} change={-0.2} />
        <StatCard label="Complaint rate" value={`${d.complaintRate}%`} change={-0.01} />
        <StatCard label="Suppression list" value={String(d.suppressionCount)} />
      </StatsGrid>

      <Card title="Domain health">
        <table className="admin-table">
          <thead>
            <tr><th>Domain</th><th>SPF</th><th>DKIM</th><th>DMARC</th></tr>
          </thead>
          <tbody>
            {d.domains.map(dom => (
              <tr key={dom.domain}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{dom.domain}</td>
                <td><DomainBadge status={dom.spf} /></td>
                <td><DomainBadge status={dom.dkim} /></td>
                <td><DomainBadge status={dom.dmarc} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Recent bounces">
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Type</th><th>Date</th></tr>
          </thead>
          <tbody>
            {d.recentBounces.map(b => (
              <tr key={b.email}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{b.email}</td>
                <td><Badge status={b.type === 'hard' ? 'bounced' : 'pending'} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{b.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Suppression list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 700 }}>{d.suppressionCount}</span>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginLeft: '8px' }}>suppressed email addresses</span>
          </div>
          <a href="/admin/email/deliverability/suppressions" className="admin-btn admin-btn--secondary">View all</a>
        </div>
      </Card>
    </>
  );
}
