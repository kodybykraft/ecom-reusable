// Config
export { defaultConfig } from './config.js';
export type { AdminConfig } from './config.js';

// Layout
export { AdminLayout } from './layout/admin-layout.js';
export { AdminSidebar } from './layout/admin-sidebar.js';

// Pages
export { DashboardPage } from './pages/dashboard/dashboard-page.js';
export type { DashboardData, DashboardPageProps } from './pages/dashboard/dashboard-page.js';

export { ProductListPage } from './pages/products/product-list-page.js';
export type { ProductListPageProps } from './pages/products/product-list-page.js';

export { OrderListPage } from './pages/orders/order-list-page.js';
export type { OrderListPageProps } from './pages/orders/order-list-page.js';

export { OrderDetailPage } from './pages/orders/order-detail-page.js';
export type { OrderDetailData, OrderDetailPageProps } from './pages/orders/order-detail-page.js';

export { CustomerListPage } from './pages/customers/customer-list-page.js';
export type { CustomerListPageProps } from './pages/customers/customer-list-page.js';

export { DiscountListPage } from './pages/discounts/discount-list-page.js';
export type { DiscountListPageProps } from './pages/discounts/discount-list-page.js';

export { SettingsPage } from './pages/settings/settings-page.js';
export type { SettingsPageProps } from './pages/settings/settings-page.js';

export { ActivityLogPage } from './pages/activity/activity-log-page.js';
export type { ActivityLogPageProps } from './pages/activity/activity-log-page.js';

// Hooks — import directly from '@ecom/admin/hooks/use-admin-api' in client components
// Not re-exported here to avoid 'use client' boundary issues in server components

// Utils
export { adminRoutes } from './utils/admin-routes.js';
