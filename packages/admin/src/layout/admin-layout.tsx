import type { ReactNode } from 'react';
import { AdminSidebar } from './admin-sidebar.js';
import type { AdminConfig } from '../config.js';

export interface AdminLayoutProps {
  config: AdminConfig;
  children: ReactNode;
  currentPath: string;
}

export function AdminLayout({ config, children, currentPath }: AdminLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar config={config} currentPath={currentPath} />
      <main style={{ marginLeft: '240px', flex: 1, padding: '1.5rem 2rem', background: '#f9fafb' }}>
        {children}
      </main>
    </div>
  );
}
