import { Badge, Breadcrumb, Card, PageHeader, StatsGrid, StatCard, TwoCol, formatMoney } from './_shared';

/* ==========================================================================
   Abandoned Checkouts — Mock data & page components
   ========================================================================== */

const ABANDONED_CHECKOUTS = [
  { id: 'ac1', email: 'mike.johnson@gmail.com', customer: 'Mike Johnson', cartItems: [{ title: 'Classic Cotton T-Shirt', variant: 'L / White', qty: 2, price: 2499 }, { title: 'Leather Belt', variant: 'M / Brown', qty: 1, price: 3499 }], total: 8497, createdAt: 'Apr 5, 2026 3:10 pm', recoveryEmailSent: true },
  { id: 'ac2', email: 'anna.li@yahoo.com', customer: 'Anna Li', cartItems: [{ title: 'Running Shoes', variant: '8 / Black', qty: 1, price: 8999 }], total: 8999, createdAt: 'Apr 5, 2026 11:22 am', recoveryEmailSent: false },
  { id: 'ac3', email: 'tom.baker@outlook.com', customer: 'Tom Baker', cartItems: [{ title: 'Hooded Sweatshirt', variant: 'XL / Grey', qty: 1, price: 6999 }, { title: 'Cargo Shorts', variant: 'L / Khaki', qty: 2, price: 3999 }], total: 14997, createdAt: 'Apr 4, 2026 8:45 pm', recoveryEmailSent: true },
  { id: 'ac4', email: 'guest-user-44@temp.com', customer: 'Guest', cartItems: [{ title: 'Wool Beanie', variant: 'One Size / Red', qty: 1, price: 1999 }], total: 1999, createdAt: 'Apr 4, 2026 5:30 pm', recoveryEmailSent: false },
  { id: 'ac5', email: 'priya.sharma@gmail.com', customer: 'Priya Sharma', cartItems: [{ title: 'Slim Fit Jeans', variant: '30 / Black', qty: 1, price: 5999 }, { title: 'Canvas Sneakers', variant: '9 / White', qty: 1, price: 4999 }], total: 10998, createdAt: 'Apr 3, 2026 2:15 pm', recoveryEmailSent: true },
  { id: 'ac6', email: 'carlos.garcia@live.com', customer: 'Carlos Garcia', cartItems: [{ title: 'Silk Scarf', variant: 'Blue', qty: 2, price: 2999 }, { title: 'Classic Cotton T-Shirt', variant: 'M / Black', qty: 1, price: 2499 }], total: 8497, createdAt: 'Apr 2, 2026 6:00 pm', recoveryEmailSent: false },
];

export function AbandonedCheckoutsPage() {
  const totalRevenue = ABANDONED_CHECKOUTS.reduce((sum, c) => sum + c.total, 0);
  const recoverySent = ABANDONED_CHECKOUTS.filter((c) => c.recoveryEmailSent).length;

  return (
    <>
      <PageHeader title="Abandoned Checkouts" subtitle="Recover lost sales from incomplete checkouts" />
      <StatsGrid>
        <StatCard label="Abandoned Checkouts" value={String(ABANDONED_CHECKOUTS.length)} />
        <StatCard label="Potential Revenue" value={formatMoney(totalRevenue)} />
        <StatCard label="Recovery Emails Sent" value={String(recoverySent)} />
      </StatsGrid>
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Checkout</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Recovery Status</th>
            </tr>
          </thead>
          <tbody>
            {ABANDONED_CHECKOUTS.map((checkout) => (
              <tr key={checkout.id}>
                <td><a href={`/admin/abandoned-checkouts/${checkout.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>#{checkout.id}</a></td>
                <td style={{ whiteSpace: 'nowrap' }}>{checkout.createdAt}</td>
                <td>{checkout.customer}</td>
                <td>{checkout.email}</td>
                <td>{formatMoney(checkout.total)}</td>
                <td><Badge status={checkout.recoveryEmailSent ? 'completed' : 'pending'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function AbandonedCheckoutDetailPage({ id }: { id: string }) {
  const checkout = ABANDONED_CHECKOUTS.find((c) => c.id === id) ?? ABANDONED_CHECKOUTS[0];

  return (
    <>
      <Breadcrumb items={[
        { label: 'Abandoned Checkouts', href: '/admin/abandoned-checkouts' },
        { label: `#${checkout.id}` },
      ]} />
      <TwoCol
        left={
          <Card title="Cart Items">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {checkout.cartItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.title}</td>
                    <td>{item.variant}</td>
                    <td>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>{formatMoney(item.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 600, textAlign: 'right' }}>Total</td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>{formatMoney(checkout.total)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>
        }
        right={
          <>
            <Card title="Customer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><strong>{checkout.customer}</strong></div>
                <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>{checkout.email}</div>
                <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>Abandoned on {checkout.createdAt}</div>
              </div>
            </Card>
            <Card title="Recovery">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px' }}>Recovery email:</span>
                  <Badge status={checkout.recoveryEmailSent ? 'completed' : 'pending'} />
                </div>
                <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%' }}>
                  Send Recovery Email
                </button>
              </div>
            </Card>
          </>
        }
      />
    </>
  );
}
