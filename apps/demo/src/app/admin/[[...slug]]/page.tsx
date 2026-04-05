import { AdminLayout, DashboardPage, SettingsPage } from '@ecom/admin';
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
      {renderPage(page, path)}
    </AdminLayout>
  );
}

function renderPage(page: string | undefined, currentPath: string) {
  switch (page) {
    case undefined:
      return (
        <DashboardPage
          data={null}
          loading={false}
          formatMoney={(cents) => formatMoney(cents)}
        />
      );

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
