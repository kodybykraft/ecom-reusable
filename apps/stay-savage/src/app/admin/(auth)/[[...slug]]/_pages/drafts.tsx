import { Badge, Breadcrumb, Card, FormGroup, PageHeader, Pagination, TwoCol, formatMoney } from './_shared';

/* ==========================================================================
   MOCK DATA — Draft orders
   ========================================================================== */

const DRAFT_ORDERS = [
  {
    id: 'dr1', draftNumber: 'D-001', customer: 'Sarah Chen', email: 'sarah.chen@gmail.com', status: 'open' as const,
    items: [
      { title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 3, price: 2499 },
      { title: 'Wool Beanie', variant: 'One Size / Navy', qty: 1, price: 1999 },
    ],
    subtotal: 9496, discount: 950, total: 8546,
    notes: 'Customer requested bulk pricing for company uniforms.',
    createdAt: 'Apr 5, 2026 10:00 am', createdBy: 'Admin',
  },
  {
    id: 'dr2', draftNumber: 'D-002', customer: 'James Wilson', email: 'james.wilson@outlook.com', status: 'invoice_sent' as const,
    items: [
      { title: 'Slim Fit Jeans', variant: '32 / Indigo', qty: 2, price: 5999 },
    ],
    subtotal: 11998, discount: 0, total: 11998,
    notes: '',
    createdAt: 'Apr 4, 2026 3:30 pm', createdBy: 'Admin',
  },
  {
    id: 'dr3', draftNumber: 'D-003', customer: 'Amira Patel', email: 'amira.patel@yahoo.com', status: 'completed' as const,
    items: [
      { title: 'Leather Belt', variant: 'M / Brown', qty: 1, price: 3499 },
      { title: 'Canvas Sneakers', variant: '9 / White', qty: 1, price: 4999 },
      { title: 'Hooded Sweatshirt', variant: 'L / Black', qty: 1, price: 6999 },
    ],
    subtotal: 15497, discount: 1550, total: 13947,
    notes: 'Phone order — customer called in.',
    createdAt: 'Apr 3, 2026 11:15 am', createdBy: 'Admin',
  },
  {
    id: 'dr4', draftNumber: 'D-004', customer: 'Nina Kowalski', email: 'nina.kowalski@gmail.com', status: 'open' as const,
    items: [
      { title: 'Running Shoes', variant: '10 / Black', qty: 1, price: 8999 },
    ],
    subtotal: 8999, discount: 0, total: 8999,
    notes: 'Waiting for customer to confirm size.',
    createdAt: 'Apr 5, 2026 1:45 pm', createdBy: 'Admin',
  },
];

/* ==========================================================================
   PAGE COMPONENTS
   ========================================================================== */

export function DraftOrdersListPage() {
  return (
    <>
      <PageHeader
        title="Draft Orders"
        subtitle="Orders created on behalf of customers"
        actions={<button type="button" className="admin-btn admin-btn--primary">Create order</button>}
      />

      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Draft #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {DRAFT_ORDERS.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.draftNumber}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{d.createdAt}</td>
                <td>{d.customer}</td>
                <td><Badge status={d.status} /></td>
                <td style={{ textAlign: 'right' }}>{formatMoney(d.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={DRAFT_ORDERS.length} pageSize={10} />
      </Card>
    </>
  );
}

export function DraftOrderFormPage({ id }: { id?: string }) {
  const draft = id ? DRAFT_ORDERS.find((d) => d.id === id) : undefined;
  const isEdit = !!draft;

  return (
    <>
      <Breadcrumb items={[{ label: 'Drafts', href: '#' }, { label: isEdit ? draft!.draftNumber : 'New draft' }]} />
      <PageHeader title={isEdit ? draft!.draftNumber : 'New Draft Order'} />

      <TwoCol
        left={
          <>
            {/* Products */}
            <Card title="Products">
              <div style={{ marginBottom: '12px' }}>
                <input type="text" className="admin-input" placeholder="Search products..." style={{ width: '100%' }} />
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(draft?.items ?? []).map((item, i) => (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>{item.variant}</td>
                      <td style={{ textAlign: 'right' }}>
                        <input type="number" className="admin-input" defaultValue={item.qty} min={1} style={{ width: '60px', textAlign: 'right' }} />
                      </td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(item.price)}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(item.price * item.qty)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button type="button" className="admin-btn" style={{ padding: '2px 8px', fontSize: '12px' }}>X</button>
                      </td>
                    </tr>
                  ))}
                  {(!draft || draft.items.length === 0) && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                        Search and add products above
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>

            {/* Payment */}
            <Card title="Payment">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Subtotal</span>
                  <span>{formatMoney(draft?.subtotal ?? 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Discount</span>
                  <input type="text" className="admin-input" defaultValue={draft ? formatMoney(draft.discount) : '$0.00'} style={{ width: '100px', textAlign: 'right' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                  <span>Total</span>
                  <span>{formatMoney(draft?.total ?? 0)}</span>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes">
              <textarea className="admin-textarea" rows={3} defaultValue={draft?.notes ?? ''} placeholder="Add a note to this order..." />
            </Card>
          </>
        }
        right={
          <>
            {/* Customer */}
            <Card title="Customer">
              <div style={{ marginBottom: '12px' }}>
                <input type="text" className="admin-input" placeholder="Search customers..." style={{ width: '100%' }} />
              </div>
              {draft ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', padding: '12px', background: 'var(--admin-bg-secondary, #f9fafb)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{draft.customer}</span>
                  <span style={{ color: 'var(--admin-text-muted)' }}>{draft.email}</span>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '16px' }}>
                  No customer selected
                </div>
              )}
            </Card>

            {/* Shipping Address */}
            <Card title="Shipping Address">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormGroup label="Address Line 1">
                  <input type="text" className="admin-input" placeholder="Street address" />
                </FormGroup>
                <FormGroup label="City">
                  <input type="text" className="admin-input" placeholder="City" />
                </FormGroup>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormGroup label="State">
                    <input type="text" className="admin-input" placeholder="State" />
                  </FormGroup>
                  <FormGroup label="ZIP">
                    <input type="text" className="admin-input" placeholder="ZIP code" />
                  </FormGroup>
                </div>
                <FormGroup label="Country">
                  <select className="admin-input">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </FormGroup>
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%' }}>
                {isEdit && draft!.status === 'open' ? 'Mark as Paid' : 'Save Draft'}
              </button>
              {isEdit && draft!.status === 'open' && (
                <button type="button" className="admin-btn" style={{ width: '100%' }}>Convert to Order</button>
              )}
            </div>
          </>
        }
      />
    </>
  );
}
