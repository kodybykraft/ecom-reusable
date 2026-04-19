'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

/* ==========================================================================
   Webhooks — Interactive client components
   ========================================================================== */

// ── Shared inline helpers ──────────────────────────────────────────────────

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

const WEBHOOK_EVENTS = [
  'order.created', 'order.paid', 'order.fulfilled', 'order.cancelled', 'order.refunded',
  'product.created', 'product.updated', 'product.deleted',
  'customer.created', 'customer.updated',
  'checkout.created', 'checkout.completed',
] as const;

const MOCK_WEBHOOKS = [
  { id: 'wh1', url: 'https://api.example.com/webhooks/orders', events: ['order.created', 'order.paid', 'order.fulfilled'], isActive: true, createdAt: 'Mar 10, 2026', lastDelivery: { statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm' } },
  { id: 'wh2', url: 'https://inventory.warehouse.io/hook', events: ['order.fulfilled', 'product.updated'], isActive: true, createdAt: 'Mar 15, 2026', lastDelivery: { statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm' } },
  { id: 'wh3', url: 'https://crm.biztools.com/incoming/ecom', events: ['customer.created', 'customer.updated', 'order.created'], isActive: false, createdAt: 'Feb 20, 2026', lastDelivery: { statusCode: 500, deliveredAt: 'Apr 3, 2026 4:21 pm' } },
  { id: 'wh4', url: 'https://analytics.internal.co/events', events: ['checkout.created', 'checkout.completed', 'order.paid', 'order.refunded'], isActive: true, createdAt: 'Apr 1, 2026', lastDelivery: null },
];

const MOCK_DELIVERY_LOG = [
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm', responseTime: '142ms' },
  { event: 'order.paid', statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm', responseTime: '98ms' },
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm', responseTime: '120ms' },
  { event: 'order.paid', statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm', responseTime: '105ms' },
  { event: 'order.fulfilled', statusCode: 200, deliveredAt: 'Apr 5, 2026 3:01 pm', responseTime: '88ms' },
  { event: 'order.created', statusCode: 500, deliveredAt: 'Apr 4, 2026 6:16 pm', responseTime: '2340ms' },
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 3, 2026 4:21 pm', responseTime: '156ms' },
];

/* ==========================================================================
   1. WebhooksListClient
   ========================================================================== */

export function WebhooksListClient() {
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS);

  useEffect(() => {
    fetch('/api/ecom/admin/webhooks')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { if (data.webhooks) setWebhooks(data.webhooks); })
      .catch(() => { /* keep mock */ });
  }, []);

  return (
    <>
      <PageHeader
        title="Webhooks"
        subtitle="Send real-time notifications to external services"
        actions={<a href="/admin/webhooks/new" className="admin-btn admin-btn--primary">Create webhook</a>}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Events</th>
              <th>Status</th>
              <th>Last Delivery</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((wh) => (
              <tr key={wh.id}>
                <td>
                  <a href={`/admin/webhooks/${wh.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontFamily: 'monospace', fontSize: '13px' }}>
                    {wh.url}
                  </a>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {wh.events.map((e) => (
                      <span key={e} className="admin-badge admin-badge--subdued" style={{ fontSize: '11px' }}>{e}</span>
                    ))}
                  </div>
                </td>
                <td><Badge status={wh.isActive ? 'active' : 'archived'} /></td>
                <td>
                  {wh.lastDelivery ? (
                    <div>
                      <Badge status={wh.lastDelivery.statusCode === 200 ? 'success' : 'failed'} />
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>{wh.lastDelivery.deliveredAt}</div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--admin-text-muted)' }}>Never</span>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{wh.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ==========================================================================
   2. WebhookFormClient
   ========================================================================== */

export function WebhookFormClient({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  const { push, ToastContainer } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    url: '',
    events: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ecom/admin/webhooks/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setForm({ url: data.url, events: data.events, isActive: data.isActive }))
      .catch(() => {
        const mock = MOCK_WEBHOOKS.find((w) => w.id === id);
        if (mock) setForm({ url: mock.url, events: [...mock.events], isActive: mock.isActive });
      });
  }, [id]);

  const toggleEvent = (event: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(event) ? f.events.filter((e) => e !== event) : [...f.events, event],
    }));
  };

  const toggleActive = () => setForm((f) => ({ ...f, isActive: !f.isActive }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/ecom/admin/webhooks${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        push(id ? 'Webhook updated' : 'Webhook created', 'success');
      } else {
        push('Failed to save webhook', 'error');
      }
    } catch {
      push('Webhook saved (mock)', 'success');
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? 'Edit webhook' : 'Create webhook';

  return (
    <>
      <Breadcrumb items={[
        { label: 'Webhooks', href: '/admin/webhooks' },
        { label: title },
      ]} />
      <TwoCol
        left={
          <>
            <Card title="Endpoint">
              <FormGroup label="URL" hint="We will send a POST request to this URL when events occur.">
                <input
                  className="admin-input"
                  type="url"
                  placeholder="https://example.com/webhooks"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
              </FormGroup>
            </Card>
            <Card title="Events">
              <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>
                Select the events you want to subscribe to.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {WEBHOOK_EVENTS.map((event) => {
                  const checked = form.events.includes(event);
                  return (
                    <label key={event} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }} onClick={() => toggleEvent(event)}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '4px',
                        border: `2px solid ${checked ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                        background: checked ? 'var(--admin-primary)' : 'var(--admin-bg)',
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {event}
                    </label>
                  );
                })}
              </div>
            </Card>
          </>
        }
        right={
          <>
            <Card title="Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={toggleActive}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    background: form.isActive ? 'var(--admin-primary)' : 'var(--admin-border)',
                    position: 'relative', border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '2px',
                    left: form.isActive ? '18px' : '2px',
                    transition: 'left 0.2s',
                  }} />
                </button>
                <span style={{ fontSize: '13px' }}>{form.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </Card>
            <Card title="Summary">
              <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                <p>Configure the webhook URL and select events to listen to. Active webhooks will receive POST requests in real-time.</p>
                {form.events.length > 0 && (
                  <p style={{ marginTop: '8px' }}>
                    <strong>{form.events.length}</strong> event{form.events.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </Card>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              style={{ width: '100%' }}
              disabled={saving || !form.url}
              onClick={handleSubmit}
            >
              {saving ? 'Saving...' : isEdit ? 'Update webhook' : 'Save webhook'}
            </button>
          </>
        }
      />
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   3. WebhookDetailClient
   ========================================================================== */

export function WebhookDetailClient({ id }: { id: string }) {
  const [webhook, setWebhook] = useState<typeof MOCK_WEBHOOKS[0] | null>(null);
  const [deliveryLog, setDeliveryLog] = useState(MOCK_DELIVERY_LOG);

  useEffect(() => {
    fetch(`/api/ecom/admin/webhooks/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        setWebhook(data.webhook ?? data);
        if (data.deliveryLog) setDeliveryLog(data.deliveryLog);
      })
      .catch(() => {
        setWebhook(MOCK_WEBHOOKS.find((w) => w.id === id) ?? MOCK_WEBHOOKS[0]);
      });
  }, [id]);

  if (!webhook) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</div>;

  return (
    <>
      <Breadcrumb items={[
        { label: 'Webhooks', href: '/admin/webhooks' },
        { label: webhook.url },
      ]} />
      <Card title="Configuration">
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: '13px' }}>
          <span style={{ color: 'var(--admin-text-secondary)' }}>URL</span>
          <span style={{ fontFamily: 'monospace' }}>{webhook.url}</span>
          <span style={{ color: 'var(--admin-text-secondary)' }}>Status</span>
          <span><Badge status={webhook.isActive ? 'active' : 'archived'} /></span>
          <span style={{ color: 'var(--admin-text-secondary)' }}>Events</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {webhook.events.map((e) => (
              <span key={e} className="admin-badge admin-badge--subdued" style={{ fontSize: '11px' }}>{e}</span>
            ))}
          </div>
          <span style={{ color: 'var(--admin-text-secondary)' }}>Created</span>
          <span>{webhook.createdAt}</span>
        </div>
      </Card>
      <Card title="Recent Deliveries">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status Code</th>
              <th>Delivered At</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
            {deliveryLog.map((d, i) => (
              <tr key={i}>
                <td><span className="admin-badge admin-badge--subdued" style={{ fontSize: '11px' }}>{d.event}</span></td>
                <td><Badge status={d.statusCode === 200 ? 'success' : 'failed'} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{d.deliveredAt}</td>
                <td>{d.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
