import { Badge, Breadcrumb, Card, FormGroup, PageHeader, Pagination, Tabs, TwoCol, formatMoney } from './_shared';

/* ==========================================================================
   MOCK DATA — Returns & RMA management
   ========================================================================== */

const RETURN_REASONS = [
  { id: 'defective', label: 'Defective', requiresNote: true },
  { id: 'wrong_item', label: 'Wrong Item', requiresNote: true },
  { id: 'changed_mind', label: 'Changed Mind', requiresNote: false },
  { id: 'not_as_described', label: 'Not as Described', requiresNote: true },
  { id: 'arrived_late', label: 'Arrived Late', requiresNote: false },
  { id: 'other', label: 'Other', requiresNote: true },
];

const RETURNS = [
  {
    id: 'ret1', returnNumber: 1001, orderId: '1042', orderNumber: 1042, customer: 'Sarah Chen', email: 'sarah.chen@gmail.com', status: 'requested',
    items: [{ title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 1, reason: 'defective', condition: 'unopened' }],
    totalRefund: 2499, requestedAt: 'Apr 5, 2026 4:00 pm',
    timeline: [{ time: 'Apr 5, 4:00 pm', event: 'Return requested by customer' }, { time: 'Apr 5, 4:01 pm', event: 'Confirmation email sent' }],
  },
  {
    id: 'ret2', returnNumber: 1002, orderId: '1041', orderNumber: 1041, customer: 'James Wilson', email: 'james.wilson@outlook.com', status: 'approved',
    items: [{ title: 'Slim Fit Jeans', variant: '32 / Indigo', qty: 1, reason: 'not_as_described', condition: 'opened' }],
    totalRefund: 5999, requestedAt: 'Apr 4, 2026 10:00 am',
    timeline: [{ time: 'Apr 4, 10:00 am', event: 'Return requested by customer' }, { time: 'Apr 4, 11:30 am', event: 'Return approved by admin' }, { time: 'Apr 4, 11:31 am', event: 'Return shipping label emailed' }],
  },
  {
    id: 'ret3', returnNumber: 1003, orderId: '1038', orderNumber: 1038, customer: 'Nina Kowalski', email: 'nina.kowalski@gmail.com', status: 'received',
    items: [
      { title: 'Hooded Sweatshirt', variant: 'XL / Grey', qty: 2, reason: 'changed_mind', condition: 'unopened' },
      { title: 'Cargo Shorts', variant: 'L / Khaki', qty: 1, reason: 'wrong_item', condition: 'opened' },
    ],
    totalRefund: 17997, requestedAt: 'Apr 3, 2026 8:00 am',
    timeline: [{ time: 'Apr 3, 8:00 am', event: 'Return requested by customer' }, { time: 'Apr 3, 9:00 am', event: 'Return approved by admin' }, { time: 'Apr 4, 2:00 pm', event: 'Package received at warehouse' }, { time: 'Apr 4, 2:30 pm', event: 'Items inspected — all in acceptable condition' }],
  },
  {
    id: 'ret4', returnNumber: 1004, orderId: '1037', orderNumber: 1037, customer: 'Omar Hassan', email: 'omar.hassan@gmail.com', status: 'completed',
    items: [{ title: 'Wool Beanie', variant: 'One Size / Red', qty: 1, reason: 'arrived_late', condition: 'unopened' }],
    totalRefund: 1999, requestedAt: 'Apr 1, 2026 3:00 pm',
    timeline: [{ time: 'Apr 1, 3:00 pm', event: 'Return requested by customer' }, { time: 'Apr 1, 3:15 pm', event: 'Return approved by admin' }, { time: 'Apr 2, 11:00 am', event: 'Package received at warehouse' }, { time: 'Apr 2, 2:00 pm', event: 'Refund of $19.99 processed to original payment method' }],
  },
  {
    id: 'ret5', returnNumber: 1005, orderId: '1040', orderNumber: 1040, customer: 'Amira Patel', email: 'amira.patel@yahoo.com', status: 'requested',
    items: [{ title: 'Canvas Sneakers', variant: '9 / White', qty: 1, reason: 'defective', condition: 'opened' }],
    totalRefund: 4999, requestedAt: 'Apr 5, 2026 6:30 pm',
    timeline: [{ time: 'Apr 5, 6:30 pm', event: 'Return requested by customer' }],
  },
];

const RETURN_STEPS = ['requested', 'approved', 'received', 'completed'] as const;

/* ==========================================================================
   PAGE COMPONENTS
   ========================================================================== */

export function ReturnsListPage() {
  const tabs = ['All', 'Requested', 'Approved', 'Received', 'Completed'];

  return (
    <>
      <PageHeader title="Returns" subtitle="Manage return requests and refunds" />
      <Tabs items={tabs} active={0} />

      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Return #</th>
              <th>Order #</th>
              <th>Customer</th>
              <th style={{ textAlign: 'right' }}>Items</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Refund Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {RETURNS.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>RMA-{String(r.returnNumber).padStart(4, '0')}</td>
                <td>#{r.orderNumber}</td>
                <td>{r.customer}</td>
                <td style={{ textAlign: 'right' }}>{r.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                <td><Badge status={r.status} /></td>
                <td style={{ textAlign: 'right' }}>{formatMoney(r.totalRefund)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.requestedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={RETURNS.length} pageSize={10} />
      </Card>
    </>
  );
}

export function ReturnDetailPage({ id }: { id: string }) {
  const ret = RETURNS.find((r) => r.id === id) ?? RETURNS[0];
  const stepIndex = RETURN_STEPS.indexOf(ret.status as typeof RETURN_STEPS[number]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Returns', href: '#' }, { label: `RMA-${String(ret.returnNumber).padStart(4, '0')}` }]} />
      <PageHeader
        title={`RMA-${String(ret.returnNumber).padStart(4, '0')}`}
        subtitle={`Return for order #${ret.orderNumber}`}
        actions={
          <>
            {ret.status === 'requested' && (
              <>
                <button type="button" className="admin-btn admin-btn--primary">Approve</button>
                <button type="button" className="admin-btn admin-btn--danger">Reject</button>
              </>
            )}
            {ret.status === 'approved' && (
              <button type="button" className="admin-btn admin-btn--primary">Mark Received</button>
            )}
            {ret.status === 'received' && (
              <button type="button" className="admin-btn admin-btn--primary">Process Refund</button>
            )}
          </>
        }
      />

      <TwoCol
        left={
          <>
            {/* Items */}
            <Card title="Return Items">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th>Reason</th>
                    <th>Condition</th>
                    <th>Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {ret.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>{item.variant}</td>
                      <td style={{ textAlign: 'right' }}>{item.qty}</td>
                      <td><Badge status={item.reason} /></td>
                      <td><Badge status={item.condition} /></td>
                      <td>
                        <input type="checkbox" defaultChecked={item.condition === 'unopened'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Status Progress */}
            <Card title="Return Progress">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', padding: '16px 0' }}>
                {RETURN_STEPS.map((step, i) => {
                  const isComplete = i <= stepIndex;
                  const isCurrent = i === stepIndex;
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isComplete ? 'var(--admin-primary, #6366f1)' : 'var(--admin-border-light, #e5e7eb)',
                        color: isComplete ? '#fff' : 'var(--admin-text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 600,
                        border: isCurrent ? '2px solid var(--admin-primary, #6366f1)' : 'none',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      {i < RETURN_STEPS.length - 1 && (
                        <div style={{
                          flex: 1, height: '2px',
                          background: i < stepIndex ? 'var(--admin-primary, #6366f1)' : 'var(--admin-border-light, #e5e7eb)',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {RETURN_STEPS.map((step) => (
                  <span key={step} style={{ textTransform: 'capitalize' }}>{step}</span>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            <Card title="Timeline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ret.timeline.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', minWidth: '130px' }}>{entry.time}</span>
                    <span>{entry.event}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        }
        right={
          <>
            {/* Customer */}
            <Card title="Customer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <span style={{ fontWeight: 600 }}>{ret.customer}</span>
                <span style={{ color: 'var(--admin-text-muted)' }}>{ret.email}</span>
              </div>
            </Card>

            {/* Order Link */}
            <Card title="Order">
              <a href="#" style={{ fontWeight: 600, color: 'var(--admin-primary, #6366f1)' }}>Order #{ret.orderNumber}</a>
            </Card>

            {/* Refund Summary */}
            <Card title="Refund Summary">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Method</span>
                  <span>Original payment method</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                  <span>Total Refund</span>
                  <span>{formatMoney(ret.totalRefund)}</span>
                </div>
              </div>
            </Card>
          </>
        }
      />
    </>
  );
}

export function CreateReturnPage() {
  const sampleOrder = { id: '1042', num: 1042, customer: 'Sarah Chen', items: [
    { title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 2, price: 2499 },
    { title: 'Wool Beanie', variant: 'One Size / Navy', qty: 1, price: 1999 },
  ]};

  return (
    <>
      <Breadcrumb items={[{ label: 'Returns', href: '#' }, { label: 'Create Return' }]} />
      <PageHeader title="Create Return" subtitle="Initiate a return for an existing order" />

      <TwoCol
        left={
          <>
            <Card title="Select Order">
              <FormGroup label="Order">
                <select className="admin-input">
                  <option value="">Select an order...</option>
                  <option value="1042">Order #1042 — Sarah Chen</option>
                  <option value="1041">Order #1041 — James Wilson</option>
                  <option value="1040">Order #1040 — Amira Patel</option>
                  <option value="1039">Order #1039 — Lucas Berg</option>
                </select>
              </FormGroup>
            </Card>

            <Card title="Line Items">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: 'right' }}>Qty to Return</th>
                    <th>Reason</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>{item.variant}</td>
                      <td style={{ textAlign: 'right' }}>
                        <input type="number" className="admin-input" defaultValue={0} min={0} max={item.qty} style={{ width: '60px', textAlign: 'right' }} />
                      </td>
                      <td>
                        <select className="admin-input" style={{ minWidth: '140px' }}>
                          <option value="">Select reason...</option>
                          {RETURN_REASONS.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select className="admin-input" style={{ minWidth: '120px' }}>
                          <option value="unopened">Unopened</option>
                          <option value="opened">Opened</option>
                          <option value="damaged">Damaged</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        }
        right={
          <Card title="Refund Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-muted)' }}>
                <span>Items subtotal</span>
                <span>{formatMoney(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                <span>Total Refund</span>
                <span>{formatMoney(0)}</span>
              </div>
              <button type="button" className="admin-btn admin-btn--primary" style={{ marginTop: '12px', width: '100%' }}>Submit Return</button>
            </div>
          </Card>
        }
      />
    </>
  );
}
