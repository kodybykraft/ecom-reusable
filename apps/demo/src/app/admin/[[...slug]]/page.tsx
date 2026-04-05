import { AdminLayout, DashboardPage, SettingsPage } from '@ecom/admin';
import type { DashboardData } from '@ecom/admin';
import { formatMoney } from '@ecom/core';

export const dynamic = 'force-dynamic';

const config = {
  basePath: '/admin',
  apiBase: '/api/ecom',
  branding: { title: 'E-Com Admin' },
};

export default async function AdminCatchAll({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug ? `/admin/${slug.join('/')}` : '/admin';

  // Determine which page to render based on path
  const page = slug?.[0];

  return (
    <AdminLayout config={config} currentPath={path}>
      {await renderPage(page, path)}
    </AdminLayout>
  );
}

async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const { ecom } = await import('../../../lib/ecom');
    const { orders, customers } = ecom;

    const [orderResult, customerResult] = await Promise.all([
      orders.list(undefined, { page: 1, pageSize: 5 }),
      customers.list(undefined, { page: 1, pageSize: 1 }),
    ]);

    const totalRevenue = orderResult.data.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orderResult.total > 0 ? Math.round(totalRevenue / orderResult.total) : 0;

    return {
      revenue: { value: totalRevenue, change: 0 },
      orders: { value: orderResult.total, change: 0 },
      customers: { value: customerResult.total, change: 0 },
      avgOrderValue: { value: avgOrderValue, change: 0 },
      recentOrders: orderResult.data.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        email: o.email,
        total: o.total,
        financialStatus: o.financialStatus,
        createdAt: o.createdAt.toISOString(),
      })),
      lowStockProducts: [],
    };
  } catch {
    return null;
  }
}

async function renderPage(page: string | undefined, currentPath: string) {
  switch (page) {
    case undefined: {
      const data = await fetchDashboardData();
      return (
        <DashboardPage
          data={data}
          loading={false}
          formatMoney={(cents) => formatMoney(cents)}
        />
      );
    }

    case 'settings':
      return <SettingsPage basePath="/admin" />;

    case 'products':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Products</h1>
          <p style={{ color: '#6b7280' }}>Product management will load data from the API when the database is running.</p>
        </div>
      );

    case 'orders':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Orders</h1>
          <p style={{ color: '#6b7280' }}>Order management will load data from the API when the database is running.</p>
        </div>
      );

    case 'customers':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Customers</h1>
          <p style={{ color: '#6b7280' }}>Customer management will load data from the API when the database is running.</p>
        </div>
      );

    case 'discounts':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Discounts</h1>
          <p style={{ color: '#6b7280' }}>Discount management will load data from the API when the database is running.</p>
        </div>
      );

    case 'categories':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Categories</h1>
          <p style={{ color: '#6b7280' }}>Category tree management coming soon.</p>
        </div>
      );

    case 'activity':
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Activity Log</h1>
          <p style={{ color: '#6b7280' }}>Activity log will load data from the API when the database is running.</p>
        </div>
      );

    default:
      return (
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page Not Found</h1>
          <p style={{ color: '#6b7280' }}>The admin page at {currentPath} does not exist.</p>
        </div>
      );
  }
}
