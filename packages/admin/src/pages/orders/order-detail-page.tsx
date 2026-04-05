import { PageHeader, StatusBadge } from '@ecom/ui';

export interface OrderDetailData {
  id: string;
  orderNumber: number;
  email: string;
  financialStatus: string;
  fulfillmentStatus: string;
  subtotal: string;
  shippingTotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  createdAt: string;
  lineItems: Array<{
    id: string;
    title: string;
    variantTitle: string;
    sku: string | null;
    quantity: number;
    price: string;
  }>;
  transactions: Array<{
    id: string;
    kind: string;
    status: string;
    amount: string;
    gateway: string;
    createdAt: string;
  }>;
  shippingAddress: Record<string, unknown> | null;
  customer: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
}

export interface OrderDetailPageProps {
  order: OrderDetailData;
  onFulfill: () => void;
  onRefund: () => void;
  onCancel: () => void;
  basePath: string;
}

export function OrderDetailPage({ order, onFulfill, onRefund, onCancel, basePath }: OrderDetailPageProps) {
  return (
    <div>
      <PageHeader
        title={`Order #${order.orderNumber}`}
        breadcrumbs={[
          { label: 'Orders', href: `${basePath}/orders` },
          { label: `#${order.orderNumber}` },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {order.fulfillmentStatus !== 'fulfilled' && (
              <button onClick={onFulfill} style={{ padding: '0.5rem 1rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Mark Fulfilled
              </button>
            )}
            {order.financialStatus === 'paid' && (
              <button onClick={onRefund} style={{ padding: '0.5rem 1rem', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Refund
              </button>
            )}
            {!order.financialStatus.includes('refund') && order.financialStatus !== 'cancelled' && (
              <button onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
            )}
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Line Items */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>SKU</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{item.variantTitle}</div>
                  </td>
                  <td style={{ padding: '0.5rem', color: '#6b7280' }}>{item.sku ?? '—'}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Subtotal</span><span>{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Shipping</span><span>{order.shippingTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Tax</span><span>{order.taxTotal}</span>
            </div>
            {order.discountTotal !== '$0.00' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#059669' }}>
                <span>Discount</span><span>-{order.discountTotal}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              <span>Total</span><span>{order.total}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Status</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <StatusBadge status={order.financialStatus} />
              <StatusBadge status={order.fulfillmentStatus} />
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Placed {order.createdAt}
            </div>
          </div>

          {order.customer && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Customer</h3>
              <div style={{ fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 500 }}>
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <div style={{ color: '#6b7280' }}>{order.customer.email}</div>
              </div>
            </div>
          )}

          {order.transactions.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Transactions</h3>
              {order.transactions.map((tx) => (
                <div key={tx.id} style={{ fontSize: '0.8rem', padding: '0.375rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{tx.kind}</span>
                    <span style={{ fontWeight: 500 }}>{tx.amount}</span>
                  </div>
                  <div style={{ color: '#9ca3af' }}>{tx.gateway} · {tx.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
