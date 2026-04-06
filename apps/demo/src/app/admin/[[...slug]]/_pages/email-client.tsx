'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Badge, Breadcrumb, Card, FormGroup, PageHeader, StatsGrid, StatCard, TwoCol,
} from './_shared';

/* ==========================================================================
   Email Marketing — Interactive client components
   ========================================================================== */

// ── Shared inline helpers ──────────────────────────────────────────────────

interface TabItem { label: string; value: string; count?: number }

function InteractiveTabs({ items, activeValue, onChange }: {
  items: TabItem[];
  activeValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="admin-tabs">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`admin-tab${activeValue === item.value ? ' admin-tab--active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.count !== undefined && <span className="admin-tab-count"> ({item.count})</span>}
        </button>
      ))}
    </div>
  );
}

function SearchableToolbar({ onSearch, placeholder }: {
  onSearch: (term: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  const timeoutRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setValue(term);
      if (timeoutRef[0]) clearTimeout(timeoutRef[0]);
      const timer = setTimeout(() => onSearch(term), 300);
      timeoutRef[0] = timer;
    },
    [onSearch, timeoutRef],
  );

  return (
    <div className="admin-toolbar">
      <input
        type="text"
        className="admin-search"
        placeholder={placeholder ?? 'Search...'}
        value={value}
        onChange={handleChange}
      />
      <button type="button" className="admin-filter-btn">Filter</button>
      <button type="button" className="admin-filter-btn">Sort</button>
    </div>
  );
}

function PaginationControls({ page, totalPages, total, pageSize, onPageChange }: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="admin-pagination">
      <span>Showing {start}-{end} of {total}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button type="button" className="admin-pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button type="button" className="admin-pagination-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; message: string; type: ToastType }
let toastId = 0;

const borderColors: Record<ToastType, string> = { success: '#2ecc71', error: '#e74c3c', info: 'var(--admin-primary)' };

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  const ToastContainer = () => (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} className="admin-card" style={{ padding: '12px 20px', borderLeft: `3px solid ${borderColors[t.type]}`, fontSize: 13, minWidth: 260 }}>
          {t.message}
        </div>
      ))}
    </div>
  );
  return { push, ToastContainer };
}

// ── Mock data (fallbacks) ──────────────────────────────────────────────────

const MOCK_CONTACTS = [
  { id: 'ec1', email: 'sarah.chen@gmail.com', firstName: 'Sarah', lastName: 'Chen', status: 'subscribed', subscribedAt: 'Jan 15, 2026', lists: ['newsletter', 'vip'] },
  { id: 'ec2', email: 'james.wilson@outlook.com', firstName: 'James', lastName: 'Wilson', status: 'subscribed', subscribedAt: 'Feb 3, 2026', lists: ['newsletter'] },
  { id: 'ec3', email: 'amira.patel@yahoo.com', firstName: 'Amira', lastName: 'Patel', status: 'unsubscribed', subscribedAt: 'Feb 18, 2026', lists: ['newsletter'] },
  { id: 'ec4', email: 'lucas.berg@proton.me', firstName: 'Lucas', lastName: 'Berg', status: 'bounced', subscribedAt: 'Mar 1, 2026', lists: ['promotions'] },
  { id: 'ec5', email: 'nina.kowalski@gmail.com', firstName: 'Nina', lastName: 'Kowalski', status: 'subscribed', subscribedAt: 'Dec 20, 2025', lists: ['newsletter', 'vip', 'promotions'] },
  { id: 'ec6', email: 'omar.hassan@gmail.com', firstName: 'Omar', lastName: 'Hassan', status: 'subscribed', subscribedAt: 'Jan 28, 2026', lists: ['newsletter', 'promotions'] },
  { id: 'ec7', email: 'elena.rossi@live.com', firstName: 'Elena', lastName: 'Rossi', status: 'subscribed', subscribedAt: 'Mar 12, 2026', lists: ['newsletter'] },
  { id: 'ec8', email: 'david.kim@proton.me', firstName: 'David', lastName: 'Kim', status: 'unsubscribed', subscribedAt: 'Mar 25, 2026', lists: ['promotions'] },
];

const MOCK_CAMPAIGNS = [
  { id: 'cmp1', name: 'Spring Sale Launch', subject: 'Spring Sale — Up to 30% off everything!', status: 'sent', sentAt: 'Mar 15, 2026 10:00 am', stats: { sent: 1180, delivered: 1162, opened: 442, clicked: 128, bounced: 18, complained: 2, unsubscribed: 5 } },
  { id: 'cmp2', name: 'April Newsletter', subject: "What's new this April", status: 'sent', sentAt: 'Apr 1, 2026 9:00 am', stats: { sent: 1203, delivered: 1189, opened: 523, clicked: 187, bounced: 14, complained: 1, unsubscribed: 3 } },
  { id: 'cmp3', name: 'VIP Early Access', subject: 'Exclusive early access for VIP members', status: 'scheduled', sentAt: 'Apr 10, 2026 8:00 am', stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0, unsubscribed: 0 } },
  { id: 'cmp4', name: 'Re-engagement Campaign', subject: "We miss you! Here's 20% off", status: 'draft', sentAt: null, stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0, unsubscribed: 0 } },
  { id: 'cmp5', name: 'Flash Sale Alert', subject: '24-hour flash sale — today only!', status: 'sent', sentAt: 'Mar 25, 2026 12:00 pm', stats: { sent: 980, delivered: 965, opened: 398, clicked: 156, bounced: 15, complained: 3, unsubscribed: 8 } },
];

const MOCK_TEMPLATES = [
  { id: 'tpl1', name: 'Welcome Email', subject: 'Welcome to our store, {{first_name}}!', category: 'automation', updatedAt: 'Apr 1, 2026' },
  { id: 'tpl2', name: 'Order Confirmation', subject: 'Your order #{{order_number}} has been confirmed', category: 'transactional', updatedAt: 'Mar 28, 2026' },
  { id: 'tpl3', name: 'Spring Sale', subject: 'Spring Sale — Up to 30% off everything!', category: 'marketing', updatedAt: 'Mar 15, 2026' },
  { id: 'tpl4', name: 'Abandoned Cart Reminder', subject: 'You left something in your cart!', category: 'automation', updatedAt: 'Mar 20, 2026' },
  { id: 'tpl5', name: 'Monthly Newsletter', subject: "What's new at {{store_name}} this month", category: 'marketing', updatedAt: 'Apr 3, 2026' },
];

const MOCK_AUTOMATIONS = [
  { id: 'auto1', name: 'Welcome Series', triggerEvent: 'customer.created', status: 'active', enrolledCount: 342, completedCount: 298 },
  { id: 'auto2', name: 'Abandoned Cart', triggerEvent: 'checkout.abandoned', status: 'active', enrolledCount: 187, completedCount: 145 },
  { id: 'auto3', name: 'Post-Purchase Follow-up', triggerEvent: 'order.completed', status: 'active', enrolledCount: 520, completedCount: 410 },
  { id: 'auto4', name: 'Win-back', triggerEvent: 'customer.inactive', status: 'paused', enrolledCount: 98, completedCount: 42 },
];

const MOCK_SEGMENTS = [
  { id: 'seg1', name: 'High Spenders', description: 'Customers who have spent over $200 lifetime', contactCount: 245, lastComputedAt: 'Apr 5, 2026 8:00 am' },
  { id: 'seg2', name: 'New Customers', description: 'Signed up in the last 30 days', contactCount: 89, lastComputedAt: 'Apr 5, 2026 8:00 am' },
  { id: 'seg3', name: 'Inactive', description: 'No orders in the last 90 days', contactCount: 156, lastComputedAt: 'Apr 4, 2026 8:00 am' },
  { id: 'seg4', name: 'Newsletter Subscribers', description: 'All contacts on the newsletter list', contactCount: 1203, lastComputedAt: 'Apr 5, 2026 8:00 am' },
];

const MOCK_DELIVERABILITY = {
  deliveryRate: 98.2,
  bounceRate: 1.2,
  complaintRate: 0.05,
  suppressionCount: 47,
  domains: [
    { domain: 'store.com', spf: 'pass', dkim: 'pass', dmarc: 'pass' },
    { domain: 'mail.store.com', spf: 'pass', dkim: 'pass', dmarc: 'fail' },
    { domain: 'promo.store.com', spf: 'pass', dkim: 'fail', dmarc: 'fail' },
  ],
};

/* ==========================================================================
   1. EmailOverviewClient
   ========================================================================== */

export function EmailOverviewClient() {
  const [stats, setStats] = useState<{ contactCount: number; sentCount: number; avgOpen: string; avgClick: string } | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState(MOCK_CAMPAIGNS.filter((c) => c.status === 'sent').slice(0, 3));

  useEffect(() => {
    fetch('/api/ecom/admin/email/overview')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        setStats(data.stats);
        if (data.recentCampaigns) setRecentCampaigns(data.recentCampaigns);
      })
      .catch(() => {
        const sentCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'sent');
        const totalDelivered = sentCampaigns.reduce((s, c) => s + c.stats.delivered, 0);
        const totalOpened = sentCampaigns.reduce((s, c) => s + c.stats.opened, 0);
        const totalClicked = sentCampaigns.reduce((s, c) => s + c.stats.clicked, 0);
        setStats({
          contactCount: MOCK_CONTACTS.length,
          sentCount: sentCampaigns.length,
          avgOpen: totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0',
          avgClick: totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : '0',
        });
      });
  }, []);

  if (!stats) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</div>;

  return (
    <>
      <PageHeader title="Email Marketing" subtitle="Manage campaigns, contacts, and automations" />

      <StatsGrid>
        <StatCard label="Total contacts" value={String(stats.contactCount)} change={4.2} />
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
            {recentCampaigns.map((c: any) => {
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

/* ==========================================================================
   2. EmailContactsClient
   ========================================================================== */

export function EmailContactsClient() {
  const PAGE_SIZE = 10;
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/ecom/admin/email/contacts')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.contacts) setContacts(data.contacts); })
      .catch(() => { /* keep mock */ });
  }, []);

  const filtered = contacts.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return c.email.toLowerCase().includes(term)
      || c.firstName.toLowerCase().includes(term)
      || c.lastName.toLowerCase().includes(term);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={`${filtered.length} contacts`}
        actions={<a href="/admin/email/contacts/import" className="admin-btn admin-btn--primary">Import contacts</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Contacts' }]}
      />
      <SearchableToolbar onSearch={(t) => { setSearch(t); setPage(1); }} placeholder="Search contacts..." />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th><th>Subscribed</th><th>Lists</th></tr>
          </thead>
          <tbody>
            {pageData.map((c) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.email}</td>
                <td><Badge status={c.status} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.subscribedAt}</td>
                <td>{c.lists.map((l) => <span key={l} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '4px' }}>{l}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Card>
    </>
  );
}

/* ==========================================================================
   3. EmailCampaignsClient
   ========================================================================== */

export function EmailCampaignsClient() {
  const PAGE_SIZE = 10;
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/ecom/admin/email/campaigns')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.campaigns) setCampaigns(data.campaigns); })
      .catch(() => { /* keep mock */ });
  }, []);

  const tabItems: TabItem[] = [
    { label: 'All', value: 'all', count: campaigns.length },
    { label: 'Draft', value: 'draft', count: campaigns.filter((c) => c.status === 'draft').length },
    { label: 'Sent', value: 'sent', count: campaigns.filter((c) => c.status === 'sent').length },
    { label: 'Scheduled', value: 'scheduled', count: campaigns.filter((c) => c.status === 'scheduled').length },
  ];

  const filtered = activeTab === 'all' ? campaigns : campaigns.filter((c) => c.status === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Send targeted emails to your contacts"
        actions={<a href="/admin/email/campaigns/new" className="admin-btn admin-btn--primary">Create campaign</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Campaigns' }]}
      />
      <InteractiveTabs items={tabItems} activeValue={activeTab} onChange={(v) => { setActiveTab(v); setPage(1); }} />
      <Card>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Sent</th><th>Open rate</th><th>Click rate</th></tr>
          </thead>
          <tbody>
            {pageData.map((c) => {
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
        <PaginationControls page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Card>
    </>
  );
}

/* ==========================================================================
   4. EmailCampaignFormClient
   ========================================================================== */

const MOCK_SEGMENT_OPTIONS = MOCK_SEGMENTS.map((s) => ({ id: s.id, name: s.name, contactCount: s.contactCount }));
const MOCK_TEMPLATE_OPTIONS = MOCK_TEMPLATES.map((t) => ({ id: t.id, name: t.name, category: t.category }));

function categoryLabel(cat: string) {
  const map: Record<string, string> = { marketing: 'Marketing', transactional: 'Transactional', automation: 'Automation' };
  return map[cat] ?? cat;
}

export function EmailCampaignFormClient({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  const { push, ToastContainer } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', subject: '', fromName: 'My Store', fromEmail: 'hello@store.com',
    replyTo: 'support@store.com', audience: '', templateId: '', scheduleType: 'now' as 'now' | 'later',
    scheduleDate: '2026-04-10', scheduleTime: '09:00',
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ecom/admin/email/campaigns/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setForm((f) => ({ ...f, ...data })))
      .catch(() => {
        const mock = MOCK_CAMPAIGNS.find((c) => c.id === id);
        if (mock) setForm((f) => ({ ...f, name: mock.name, subject: mock.subject }));
      });
  }, [id]);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/ecom/admin/email/campaigns${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        push(id ? 'Campaign updated' : 'Campaign created', 'success');
      } else {
        push('Failed to save campaign', 'error');
      }
    } catch {
      push('Campaign saved (mock)', 'success');
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? `Edit campaign: ${form.name || 'Untitled'}` : 'Create campaign';

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Campaigns', href: '/admin/email/campaigns' }, { label: title }]} />
      <PageHeader title={title} />

      <TwoCol
        left={
          <>
            <Card title="Content">
              <FormGroup label="Campaign name">
                <input className="admin-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Spring Sale Launch" />
              </FormGroup>
              <FormGroup label="Subject line">
                <input className="admin-input" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="e.g. Up to 30% off everything!" />
              </FormGroup>
              <FormGroup label="From name">
                <input className="admin-input" value={form.fromName} onChange={(e) => set('fromName', e.target.value)} placeholder="e.g. My Store" />
              </FormGroup>
              <FormGroup label="From email">
                <input className="admin-input" value={form.fromEmail} onChange={(e) => set('fromEmail', e.target.value)} placeholder="e.g. hello@store.com" />
              </FormGroup>
              <FormGroup label="Reply-to">
                <input className="admin-input" value={form.replyTo} onChange={(e) => set('replyTo', e.target.value)} placeholder="e.g. support@store.com" />
              </FormGroup>
            </Card>

            <Card title="Audience">
              <FormGroup label="Send to" hint="Choose a contact list or segment">
                <select className="admin-input" value={form.audience} onChange={(e) => set('audience', e.target.value)}>
                  <option value="" disabled>Select audience...</option>
                  <optgroup label="Lists">
                    <option value="list:newsletter">Newsletter</option>
                    <option value="list:vip">VIP</option>
                    <option value="list:promotions">Promotions</option>
                  </optgroup>
                  <optgroup label="Segments">
                    {MOCK_SEGMENT_OPTIONS.map((seg) => (
                      <option key={seg.id} value={`segment:${seg.id}`}>{seg.name} ({seg.contactCount})</option>
                    ))}
                  </optgroup>
                </select>
              </FormGroup>
            </Card>

            <Card title="Template">
              <FormGroup label="Select template">
                <select className="admin-input" value={form.templateId} onChange={(e) => set('templateId', e.target.value)}>
                  <option value="" disabled>Choose a template...</option>
                  {MOCK_TEMPLATE_OPTIONS.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>{tpl.name} ({categoryLabel(tpl.category)})</option>
                  ))}
                </select>
              </FormGroup>
            </Card>

            <Card title="Schedule">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="radio" name="schedule" value="now" checked={form.scheduleType === 'now'} onChange={() => set('scheduleType', 'now')} /> Send now
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="radio" name="schedule" value="later" checked={form.scheduleType === 'later'} onChange={() => set('scheduleType', 'later')} /> Schedule for later
                </label>
                {form.scheduleType === 'later' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <FormGroup label="Date">
                      <input className="admin-input" type="date" value={form.scheduleDate} onChange={(e) => set('scheduleDate', e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Time">
                      <input className="admin-input" type="time" value={form.scheduleTime} onChange={(e) => set('scheduleTime', e.target.value)} />
                    </FormGroup>
                  </div>
                )}
              </div>
            </Card>
          </>
        }
        right={
          <Card title="Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Campaign</div>
                <div style={{ fontWeight: 600 }}>{form.name || 'Untitled campaign'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Subject</div>
                <div>{form.subject || 'No subject set'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>From</div>
                <div>{form.fromName} &lt;{form.fromEmail}&gt;</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Audience</div>
                <div>{form.audience || 'Not selected'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Template</div>
                <div>{form.templateId ? MOCK_TEMPLATE_OPTIONS.find((t) => t.id === form.templateId)?.name ?? form.templateId : 'Not selected'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--admin-text-muted)', marginBottom: '2px' }}>Schedule</div>
                <div>{form.scheduleType === 'now' ? 'Send now' : `${form.scheduleDate} at ${form.scheduleTime}`}</div>
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving} onClick={handleSubmit}>
              {saving ? 'Saving...' : form.scheduleType === 'now' ? 'Send campaign' : 'Schedule campaign'}
            </button>
          </Card>
        }
      />
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   5. EmailTemplatesClient
   ========================================================================== */

export function EmailTemplatesClient() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  useEffect(() => {
    fetch('/api/ecom/admin/email/templates')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.templates) setTemplates(data.templates); })
      .catch(() => { /* keep mock */ });
  }, []);

  return (
    <>
      <PageHeader
        title="Templates"
        subtitle="Reusable email templates for campaigns and automations"
        actions={<a href="/admin/email/templates/new" className="admin-btn admin-btn--primary">Create template</a>}
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Templates' }]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {templates.map((tpl) => (
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

/* ==========================================================================
   6. EmailTemplateFormClient
   ========================================================================== */

const TEMPLATE_VARIABLES = ['{{first_name}}', '{{last_name}}', '{{order_number}}', '{{store_name}}'];

export function EmailTemplateFormClient({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  const { push, ToastContainer } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', subject: '', htmlContent: '', textContent: '', category: 'marketing',
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ecom/admin/email/templates/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setForm((f) => ({ ...f, ...data })))
      .catch(() => {
        const mock = MOCK_TEMPLATES.find((t) => t.id === id);
        if (mock) setForm((f) => ({ ...f, name: mock.name, subject: mock.subject, category: mock.category }));
      });
  }, [id]);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/ecom/admin/email/templates${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        push(id ? 'Template updated' : 'Template created', 'success');
      } else {
        push('Failed to save template', 'error');
      }
    } catch {
      push('Template saved (mock)', 'success');
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? `Edit template: ${form.name || 'Untitled'}` : 'Create template';
  const detectedVars = TEMPLATE_VARIABLES.filter((v) => form.subject.includes(v) || form.htmlContent.includes(v));

  return (
    <>
      <Breadcrumb items={[{ label: 'Email', href: '/admin/email' }, { label: 'Templates', href: '/admin/email/templates' }, { label: title }]} />
      <PageHeader title={title} />

      <TwoCol
        left={
          <Card title="Content">
            <FormGroup label="Template name">
              <input className="admin-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Welcome Email" />
            </FormGroup>
            <FormGroup label="Subject line" hint="Use variables below to personalize">
              <input className="admin-input" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="e.g. Welcome to our store, {{first_name}}!" />
            </FormGroup>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {TEMPLATE_VARIABLES.map((v) => (
                <span key={v} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                  onClick={() => set('htmlContent', form.htmlContent + v)}>{v}</span>
              ))}
            </div>
            <FormGroup label="HTML content">
              <textarea className="admin-input" rows={8} value={form.htmlContent} onChange={(e) => set('htmlContent', e.target.value)} placeholder="Paste or write HTML email content..." style={{ fontFamily: 'monospace', fontSize: '13px' }} />
            </FormGroup>
            <FormGroup label="Plain text content">
              <textarea className="admin-input" rows={4} value={form.textContent} onChange={(e) => set('textContent', e.target.value)} placeholder="Plain text fallback for email clients that don't support HTML..." />
            </FormGroup>
          </Card>
        }
        right={
          <>
            <Card title="Preview">
              <div style={{ border: '1px solid var(--admin-border-light)', borderRadius: '6px', padding: '16px', background: '#fff', minHeight: '120px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>{form.subject || 'Subject preview'}</div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                  {form.htmlContent ? 'Email preview will render here based on the HTML content above.' : 'Start writing content to see a preview.'}
                </div>
              </div>
            </Card>
            <Card title="Settings">
              <FormGroup label="Category">
                <select className="admin-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                  <option value="automation">Automation</option>
                </select>
              </FormGroup>
              <FormGroup label="Variables used">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {detectedVars.length > 0 ? detectedVars.map((v) => (
                    <span key={v} style={{ display: 'inline-block', background: 'var(--admin-bg-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}>{v}</span>
                  )) : <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>No variables detected</span>}
                </div>
              </FormGroup>
              <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%', marginTop: '12px' }} disabled={saving} onClick={handleSubmit}>
                {saving ? 'Saving...' : isEdit ? 'Save template' : 'Create template'}
              </button>
            </Card>
          </>
        }
      />
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   7. EmailAutomationsClient
   ========================================================================== */

export function EmailAutomationsClient() {
  const { push, ToastContainer } = useToast();
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);

  useEffect(() => {
    fetch('/api/ecom/admin/email/automations')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.automations) setAutomations(data.automations); })
      .catch(() => { /* keep mock */ });
  }, []);

  const toggleStatus = async (autoId: string) => {
    const auto = automations.find((a) => a.id === autoId);
    if (!auto) return;
    const newStatus = auto.status === 'active' ? 'paused' : 'active';

    try {
      const res = await fetch(`/api/ecom/admin/email/automations/${autoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setAutomations((prev) => prev.map((a) => a.id === autoId ? { ...a, status: newStatus } : a));
      push(`Automation ${newStatus === 'active' ? 'activated' : 'paused'}`, 'success');
    } catch {
      setAutomations((prev) => prev.map((a) => a.id === autoId ? { ...a, status: newStatus } : a));
      push(`Automation ${newStatus === 'active' ? 'activated' : 'paused'} (mock)`, 'success');
    }
  };

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
            <tr><th>Name</th><th>Trigger</th><th>Status</th><th>Enrolled</th><th>Completed</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {automations.map((a) => (
              <tr key={a.id}>
                <td><a href={`/admin/email/automations/${a.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{a.name}</a></td>
                <td><code style={{ fontSize: '12px', background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{a.triggerEvent}</code></td>
                <td><Badge status={a.status} /></td>
                <td>{a.enrolledCount}</td>
                <td>{a.completedCount}</td>
                <td>
                  <button
                    type="button"
                    className={`admin-btn ${a.status === 'active' ? 'admin-btn--secondary' : 'admin-btn--primary'}`}
                    style={{ fontSize: '12px', padding: '4px 12px' }}
                    onClick={() => toggleStatus(a.id)}
                  >
                    {a.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   8. EmailSegmentsClient
   ========================================================================== */

export function EmailSegmentsClient() {
  const [segments, setSegments] = useState(MOCK_SEGMENTS);

  useEffect(() => {
    fetch('/api/ecom/admin/email/segments')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.segments) setSegments(data.segments); })
      .catch(() => { /* keep mock */ });
  }, []);

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
            <tr><th>Name</th><th>Description</th><th>Contacts</th><th>Last computed</th></tr>
          </thead>
          <tbody>
            {segments.map((seg) => (
              <tr key={seg.id}>
                <td><a href={`/admin/email/segments/${seg.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{seg.name}</a></td>
                <td style={{ color: 'var(--admin-text-secondary)' }}>{seg.description}</td>
                <td>{seg.contactCount.toLocaleString()}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{seg.lastComputedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ==========================================================================
   9. EmailDeliverabilityClient
   ========================================================================== */

function DomainBadge({ status }: { status: string }) {
  const cls = status === 'pass' ? 'admin-badge admin-badge--success' : 'admin-badge admin-badge--critical';
  return <span className={cls}>{status}</span>;
}

export function EmailDeliverabilityClient() {
  const [data, setData] = useState(MOCK_DELIVERABILITY);

  useEffect(() => {
    fetch('/api/ecom/admin/email/deliverability')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => setData(d))
      .catch(() => { /* keep mock */ });
  }, []);

  return (
    <>
      <PageHeader
        title="Deliverability"
        subtitle="Monitor email delivery health and domain authentication"
        breadcrumbs={[{ label: 'Email', href: '/admin/email' }, { label: 'Deliverability' }]}
      />

      <StatsGrid>
        <StatCard label="Delivery rate" value={`${data.deliveryRate}%`} change={0.3} />
        <StatCard label="Bounce rate" value={`${data.bounceRate}%`} change={-0.2} />
        <StatCard label="Complaint rate" value={`${data.complaintRate}%`} change={-0.01} />
        <StatCard label="Suppression list" value={String(data.suppressionCount)} />
      </StatsGrid>

      <Card title="Domain health">
        <table className="admin-table">
          <thead>
            <tr><th>Domain</th><th>SPF</th><th>DKIM</th><th>DMARC</th></tr>
          </thead>
          <tbody>
            {data.domains.map((dom) => (
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
    </>
  );
}
