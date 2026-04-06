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

// Interactive Components
export { InteractiveTabs } from './components/interactive-tabs.js';
export type { TabItem, InteractiveTabsProps } from './components/interactive-tabs.js';

export { SearchableToolbar } from './components/searchable-toolbar.js';
export type { SearchableToolbarProps } from './components/searchable-toolbar.js';

export { PaginatedTable } from './components/paginated-table.js';
export type { PaginatedTableProps } from './components/paginated-table.js';

export { FormWrapper } from './components/form-wrapper.js';
export type { FormWrapperProps } from './components/form-wrapper.js';

export { ConfirmDialog } from './components/confirm-dialog.js';
export type { ConfirmDialogProps } from './components/confirm-dialog.js';

export { ToastProvider, useToast } from './components/toast.js';

export { TableSkeleton, CardSkeleton, FormSkeleton } from './components/loading-skeleton.js';

export { ErrorBoundary } from './components/error-boundary.js';

// Utils
export { adminRoutes } from './utils/admin-routes.js';
