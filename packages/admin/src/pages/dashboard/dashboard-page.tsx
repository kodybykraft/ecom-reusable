import { StatCard, PageHeader } from '@ecom/ui';

export interface DashboardData {
  revenue: { value: number; change: number };
  orders: { value: number; change: number };
  customers: { value: number; change: number };
  avgOrderValue: { value: number; change: number };
  recentOrders: Array<{
    id: string;
    orderNumber: number;
    email: string;
    total: number;
    financialStatus: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    title: string;
    variantTitle: string;
    inventoryQuantity: number;
  }>;
}

export interface DashboardPageProps {
  data: DashboardData | null;
  loading?: boolean;
  formatMoney: (cents: number) => string;
}

export function DashboardPage({ data, loading, formatMoney }: DashboardPageProps) {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          title="Revenue"
          value={data ? formatMoney(data.revenue.value) : '---'}
          change={data?.revenue.change}
          loading={loading}
        />
        <StatCard
          title="Orders"
          value={data?.orders.value ?? 0}
          change={data?.orders.change}
          loading={loading}
        />
        <StatCard
          title="Customers"
          value={data?.customers.value ?? 0}
          change={data?.customers.change}
          loading={loading}
        />
        <StatCard
          title="Avg Order Value"
          value={data ? formatMoney(data.avgOrderValue.value) : '---'}
          change={data?.avgOrderValue.change}
          loading={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Recent Orders</h3>
          {data?.recentOrders.length ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Customer</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '0.5rem' }}>{order.email}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{formatMoney(order.total)}</td>
                    <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{order.financialStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#9ca3af' }}>No recent orders</p>
          )}
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Low Stock Alerts</h3>
          {data?.lowStockProducts.length ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.lowStockProducts.map((p) => (
                <li key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 500 }}>{p.title}</div>
                  <div style={{ color: '#dc2626', fontSize: '0.8rem' }}>
                    {p.variantTitle} — {p.inventoryQuantity} left
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#9ca3af' }}>All stock levels healthy</p>
          )}
        </div>
      </div>
    </div>
  );
}
