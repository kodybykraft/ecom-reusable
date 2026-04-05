import { PageHeader } from '@ecom/ui';

export interface SettingsPageProps {
  basePath: string;
}

export function SettingsPage({ basePath }: SettingsPageProps) {
  const sections = [
    { title: 'General', description: 'Store name, currency, timezone', href: `${basePath}/settings` },
    { title: 'Shipping', description: 'Shipping zones and rates', href: `${basePath}/settings/shipping` },
    { title: 'Taxes', description: 'Tax rates and regions', href: `${basePath}/settings/tax` },
    { title: 'Payments', description: 'Payment provider configuration', href: `${basePath}/settings/payments` },
    { title: 'Staff', description: 'Staff members and permissions', href: `${basePath}/settings/staff` },
  ];

  return (
    <div>
      <PageHeader title="Settings" description="Manage your store configuration" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {sections.map((section) => (
          <a
            key={section.title}
            href={section.href}
            style={{
              display: 'block',
              padding: '1.25rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{section.title}</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>{section.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
