import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

/* ==========================================================================
   Webhooks — Mock data & page components
   ========================================================================== */

const WEBHOOK_EVENTS = [
  'order.created', 'order.paid', 'order.fulfilled', 'order.cancelled', 'order.refunded',
  'product.created', 'product.updated', 'product.deleted',
  'customer.created', 'customer.updated',
  'checkout.created', 'checkout.completed',
] as const;

const WEBHOOKS = [
  { id: 'wh1', url: 'https://api.example.com/webhooks/orders', events: ['order.created', 'order.paid', 'order.fulfilled'], isActive: true, createdAt: 'Mar 10, 2026', lastDelivery: { statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm' } },
  { id: 'wh2', url: 'https://inventory.warehouse.io/hook', events: ['order.fulfilled', 'product.updated'], isActive: true, createdAt: 'Mar 15, 2026', lastDelivery: { statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm' } },
  { id: 'wh3', url: 'https://crm.biztools.com/incoming/ecom', events: ['customer.created', 'customer.updated', 'order.created'], isActive: false, createdAt: 'Feb 20, 2026', lastDelivery: { statusCode: 500, deliveredAt: 'Apr 3, 2026 4:21 pm' } },
  { id: 'wh4', url: 'https://analytics.internal.co/events', events: ['checkout.created', 'checkout.completed', 'order.paid', 'order.refunded'], isActive: true, createdAt: 'Apr 1, 2026', lastDelivery: null },
];

const DELIVERY_LOG = [
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm', responseTime: '142ms' },
  { event: 'order.paid', statusCode: 200, deliveredAt: 'Apr 5, 2026 2:24 pm', responseTime: '98ms' },
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm', responseTime: '120ms' },
  { event: 'order.paid', statusCode: 200, deliveredAt: 'Apr 5, 2026 12:11 pm', responseTime: '105ms' },
  { event: 'order.fulfilled', statusCode: 200, deliveredAt: 'Apr 5, 2026 3:01 pm', responseTime: '88ms' },
  { event: 'order.created', statusCode: 500, deliveredAt: 'Apr 4, 2026 6:16 pm', responseTime: '2340ms' },
  { event: 'order.created', statusCode: 200, deliveredAt: 'Apr 3, 2026 4:21 pm', responseTime: '156ms' },
];

export function WebhooksPage() {
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
            {WEBHOOKS.map((wh) => (
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

export function WebhookFormPage() {
  return (
    <>
      <Breadcrumb items={[
        { label: 'Webhooks', href: '/admin/webhooks' },
        { label: 'Create webhook' },
      ]} />
      <TwoCol
        left={
          <>
            <Card title="Endpoint">
              <FormGroup label="URL" hint="We will send a POST request to this URL when events occur.">
                <input className="admin-input" type="url" placeholder="https://example.com/webhooks" />
              </FormGroup>
            </Card>
            <Card title="Events">
              <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>
                Select the events you want to subscribe to.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {WEBHOOK_EVENTS.map((event) => (
                  <label key={event} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      border: '2px solid var(--admin-border)', background: 'var(--admin-bg)',
                      flexShrink: 0,
                    }} />
                    {event}
                  </label>
                ))}
              </div>
            </Card>
          </>
        }
        right={
          <>
            <Card title="Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  background: 'var(--admin-primary)', position: 'relative',
                }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '2px', right: '2px',
                  }} />
                </div>
                <span style={{ fontSize: '13px' }}>Active</span>
              </div>
            </Card>
            <Card title="Summary">
              <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                <p>Configure the webhook URL and select events to listen to. Active webhooks will receive POST requests in real-time.</p>
              </div>
            </Card>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%' }}>
              Save webhook
            </button>
          </>
        }
      />
    </>
  );
}

export function WebhookDetailPage({ id }: { id: string }) {
  const webhook = WEBHOOKS.find((w) => w.id === id) ?? WEBHOOKS[0];

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
            {DELIVERY_LOG.map((d, i) => (
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
