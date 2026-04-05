import { Sidebar } from '@ecom/ui';
import type { SidebarSection } from '@ecom/ui';
import type { AdminConfig } from '../config.js';
import { adminRoutes } from '../utils/admin-routes.js';

interface Props {
  config: AdminConfig;
  currentPath: string;
}

export function AdminSidebar({ config, currentPath }: Props) {
  const routes = adminRoutes(config.basePath);

  const sections: SidebarSection[] = [
    {
      items: [
        { label: 'Dashboard', href: routes.dashboard, active: currentPath === routes.dashboard },
      ],
    },
    {
      title: 'Catalog',
      items: [
        { label: 'Products', href: routes.products, active: currentPath.startsWith(routes.products) },
        { label: 'Categories', href: routes.categories, active: currentPath.startsWith(routes.categories) },
      ],
    },
    {
      title: 'Sales',
      items: [
        { label: 'Orders', href: routes.orders, active: currentPath.startsWith(routes.orders) },
        { label: 'Customers', href: routes.customers, active: currentPath.startsWith(routes.customers) },
        { label: 'Discounts', href: routes.discounts, active: currentPath.startsWith(routes.discounts) },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', href: routes.settings, active: currentPath.startsWith(routes.settings) },
        { label: 'Activity Log', href: routes.activity, active: currentPath.startsWith(routes.activity) },
      ],
    },
  ];

  return (
    <Sidebar
      sections={sections}
      header={<span>{config.branding?.title ?? 'Admin'}</span>}
    />
  );
}
