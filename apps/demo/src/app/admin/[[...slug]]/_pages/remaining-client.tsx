'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Card, PageHeader, ProgressBar, formatMoney } from './_shared';

/* ==========================================================================
   Skeleton helpers
   ========================================================================== */

function SkeletonLine({ width }: { width?: string }) {
  return (
    <div
      style={{
        height: 16,
        width: width ?? '100%',
        background: 'var(--admin-border-light, #2a3441)',
        borderRadius: 4,
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

function SkeletonTableRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <SkeletonLine width={i === 0 ? '60px' : '80%'} />
        </td>
      ))}
    </tr>
  );
}

/* ==========================================================================
   Pagination Controls (inline)
   ========================================================================== */

function PaginationControls({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="admin-pagination">
      <span>
        Showing {start}-{end} of {total}
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   Interactive Tabs (inline)
   ========================================================================== */

function InteractiveTabs({
  items,
  activeValue,
  onChange,
}: {
  items: Array<{ label: string; value: string }>;
  activeValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="admin-tabs">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`admin-tab${activeValue === item.value ? ' admin-tab--active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ==========================================================================
   ACTIVITY LOG — Mock data & client component
   ========================================================================== */

interface ActivityLogEntry {
  id: string;
  user: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  createdAt: string;
}

const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  { id: 'al1', user: 'Sarah Chen', action: 'created', resourceType: 'order', resourceId: '#1042', ipAddress: '203.0.113.42', createdAt: 'Apr 5, 2026 2:23 pm' },
  { id: 'al2', user: 'Admin', action: 'updated', resourceType: 'product', resourceId: 'p1', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 1:45 pm' },
  { id: 'al3', user: 'James Wilson', action: 'created', resourceType: 'order', resourceId: '#1041', ipAddress: '192.0.2.88', createdAt: 'Apr 5, 2026 12:10 pm' },
  { id: 'al4', user: 'Admin', action: 'deleted', resourceType: 'discount', resourceId: 'd4', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 11:30 am' },
  { id: 'al5', user: 'Admin', action: 'updated', resourceType: 'customer', resourceId: 'c5', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 10:15 am' },
  { id: 'al6', user: 'Amira Patel', action: 'created', resourceType: 'order', resourceId: '#1040', ipAddress: '203.0.113.77', createdAt: 'Apr 5, 2026 9:45 am' },
  { id: 'al7', user: 'Admin', action: 'created', resourceType: 'product', resourceId: 'p7', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 4:00 pm' },
  { id: 'al8', user: 'Admin', action: 'updated', resourceType: 'settings', resourceId: 'shipping', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 2:30 pm' },
  { id: 'al9', user: 'Nina Kowalski', action: 'created', resourceType: 'order', resourceId: '#1038', ipAddress: '192.0.2.55', createdAt: 'Apr 4, 2026 6:15 pm' },
  { id: 'al10', user: 'Admin', action: 'created', resourceType: 'discount', resourceId: 'd5', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 9:00 am' },
  { id: 'al11', user: 'Admin', action: 'updated', resourceType: 'product', resourceId: 'p3', ipAddress: '198.51.100.14', createdAt: 'Apr 3, 2026 3:00 pm' },
  { id: 'al12', user: 'Lucas Brown', action: 'created', resourceType: 'order', resourceId: '#1037', ipAddress: '203.0.113.12', createdAt: 'Apr 3, 2026 11:22 am' },
];

const ACTIVITY_PAGE_SIZE = 10;

export function ActivityLogClient() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ecom/admin/activity-log?page=${page}&limit=${ACTIVITY_PAGE_SIZE}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setLogs(
          json.data.map((l: any) => ({
            id: l.id,
            user: l.user ?? l.userName ?? 'Unknown',
            action: l.action,
            resourceType: l.resourceType ?? l.resource_type ?? '',
            resourceId: l.resourceId ?? l.resource_id ?? '',
            ipAddress: l.ipAddress ?? l.ip_address ?? '',
            createdAt: l.createdAt ?? l.created_at ?? '',
          })),
        );
        setTotal(json.total ?? json.data.length);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      // Fall back to mock data with pagination
      const start = (page - 1) * ACTIVITY_PAGE_SIZE;
      setLogs(MOCK_ACTIVITY_LOGS.slice(start, start + ACTIVITY_PAGE_SIZE));
      setTotal(MOCK_ACTIVITY_LOGS.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / ACTIVITY_PAGE_SIZE));

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Activity Log" subtitle="Track all actions performed in your store" />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource Type</th>
              <th>Resource ID</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
              : logs.length === 0
                ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No activity logs found
                      </td>
                    </tr>
                  )
                : logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{log.createdAt}</td>
                      <td>{log.user}</td>
                      <td>
                        <Badge status={log.action === 'deleted' ? 'cancelled' : log.action === 'created' ? 'active' : 'pending'} />
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{log.resourceType}</td>
                      <td>
                        <code style={{ fontSize: '12px', background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                          {log.resourceId}
                        </code>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{log.ipAddress}</td>
                    </tr>
                  ))}
          </tbody>
        </table>
        {!loading && total > 0 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={ACTIVITY_PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}

/* ==========================================================================
   ABANDONED CHECKOUTS — Mock data & client component
   ========================================================================== */

interface AbandonedCheckout {
  id: string;
  email: string;
  customer: string;
  total: number;
  createdAt: string;
  recoveryEmailSent: boolean;
}

const MOCK_ABANDONED: AbandonedCheckout[] = [
  { id: 'ac1', email: 'mike.johnson@gmail.com', customer: 'Mike Johnson', total: 8497, createdAt: 'Apr 5, 2026 3:10 pm', recoveryEmailSent: true },
  { id: 'ac2', email: 'anna.li@yahoo.com', customer: 'Anna Li', total: 8999, createdAt: 'Apr 5, 2026 11:22 am', recoveryEmailSent: false },
  { id: 'ac3', email: 'tom.baker@outlook.com', customer: 'Tom Baker', total: 14997, createdAt: 'Apr 4, 2026 8:45 pm', recoveryEmailSent: true },
  { id: 'ac4', email: 'guest-user-44@temp.com', customer: 'Guest', total: 1999, createdAt: 'Apr 4, 2026 5:30 pm', recoveryEmailSent: false },
  { id: 'ac5', email: 'priya.sharma@gmail.com', customer: 'Priya Sharma', total: 10998, createdAt: 'Apr 3, 2026 2:15 pm', recoveryEmailSent: true },
  { id: 'ac6', email: 'carlos.garcia@live.com', customer: 'Carlos Garcia', total: 8497, createdAt: 'Apr 2, 2026 6:00 pm', recoveryEmailSent: false },
];

const ABANDONED_PAGE_SIZE = 10;

export function AbandonedCheckoutsClient() {
  const [checkouts, setCheckouts] = useState<AbandonedCheckout[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCheckouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ecom/admin/abandoned-checkouts?page=${page}&limit=${ABANDONED_PAGE_SIZE}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setCheckouts(
          json.data.map((c: any) => ({
            id: c.id,
            email: c.email ?? '',
            customer: c.customer ?? c.customerName ?? 'Guest',
            total: c.total ?? 0,
            createdAt: c.createdAt ?? c.created_at ?? '',
            recoveryEmailSent: c.recoveryEmailSent ?? c.recovery_email_sent ?? false,
          })),
        );
        setTotal(json.total ?? json.data.length);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      const start = (page - 1) * ABANDONED_PAGE_SIZE;
      setCheckouts(MOCK_ABANDONED.slice(start, start + ABANDONED_PAGE_SIZE));
      setTotal(MOCK_ABANDONED.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCheckouts();
  }, [fetchCheckouts]);

  const totalPages = Math.max(1, Math.ceil(total / ABANDONED_PAGE_SIZE));

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Abandoned Checkouts" subtitle="Recover lost sales from incomplete checkouts" />
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
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
              : checkouts.length === 0
                ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No abandoned checkouts
                      </td>
                    </tr>
                  )
                : checkouts.map((checkout) => (
                    <tr key={checkout.id}>
                      <td>
                        <a href={`/admin/abandoned-checkouts/${checkout.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>
                          #{checkout.id}
                        </a>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{checkout.createdAt}</td>
                      <td>{checkout.customer}</td>
                      <td>{checkout.email}</td>
                      <td>{formatMoney(checkout.total)}</td>
                      <td><Badge status={checkout.recoveryEmailSent ? 'completed' : 'pending'} /></td>
                    </tr>
                  ))}
          </tbody>
        </table>
        {!loading && total > 0 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={ABANDONED_PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}

/* ==========================================================================
   IMPORT / EXPORT — Mock data & client component
   ========================================================================== */

interface ImportJob {
  id: string;
  type: string;
  status: string;
  fileName: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  startedAt: string;
}

interface ExportJob {
  id: string;
  type: string;
  status: string;
  fileName: string;
  totalRows: number;
  fileUrl: string | null;
  startedAt: string;
}

const MOCK_IMPORTS: ImportJob[] = [
  { id: 'imp1', type: 'products', status: 'completed', fileName: 'products_spring_2026.csv', totalRows: 150, processedRows: 150, successCount: 147, errorCount: 3, startedAt: 'Apr 5, 2026 9:00 am' },
  { id: 'imp2', type: 'customers', status: 'processing', fileName: 'customer_list_q1.csv', totalRows: 500, processedRows: 312, successCount: 310, errorCount: 2, startedAt: 'Apr 5, 2026 2:30 pm' },
  { id: 'imp3', type: 'inventory', status: 'failed', fileName: 'inventory_update.csv', totalRows: 80, processedRows: 45, successCount: 44, errorCount: 1, startedAt: 'Apr 4, 2026 11:00 am' },
  { id: 'imp4', type: 'orders', status: 'completed', fileName: 'historical_orders.csv', totalRows: 1200, processedRows: 1200, successCount: 1198, errorCount: 2, startedAt: 'Apr 3, 2026 4:00 pm' },
];

const MOCK_EXPORTS: ExportJob[] = [
  { id: 'exp1', type: 'products', status: 'completed', fileName: 'products_export_apr5.csv', totalRows: 10, fileUrl: '#', startedAt: 'Apr 5, 2026 10:00 am' },
  { id: 'exp2', type: 'orders', status: 'completed', fileName: 'orders_q1_2026.csv', totalRows: 342, fileUrl: '#', startedAt: 'Apr 4, 2026 8:00 am' },
  { id: 'exp3', type: 'customers', status: 'processing', fileName: 'customers_full.csv', totalRows: 0, fileUrl: null, startedAt: 'Apr 5, 2026 3:00 pm' },
];

export function ImportExportClient() {
  const [tab, setTab] = useState<'imports' | 'exports'>('imports');
  const [imports, setImports] = useState<ImportJob[]>([]);
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ecom/admin/import-export');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        if (Array.isArray(json.imports)) setImports(json.imports);
        if (Array.isArray(json.exports)) setExports(json.exports);
      } catch {
        setImports(MOCK_IMPORTS);
        setExports(MOCK_EXPORTS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Import / Export" subtitle="Bulk import and export your store data" />

      <InteractiveTabs
        items={[
          { label: 'Imports', value: 'imports' },
          { label: 'Exports', value: 'exports' },
        ]}
        activeValue={tab}
        onChange={(v) => setTab(v as 'imports' | 'exports')}
      />

      {tab === 'imports' && (
        <Card
          title="Recent Imports"
          actions={
            <a href="/admin/import-export/new-import" className="admin-btn admin-btn--primary">
              New Import
            </a>
          }
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th style={{ textAlign: 'right' }}>Success</th>
                <th style={{ textAlign: 'right' }}>Errors</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)
                : imports.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                          No import jobs yet
                        </td>
                      </tr>
                    )
                  : imports.map((job) => (
                      <tr key={job.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{job.fileName}</td>
                        <td><Badge status={job.type} /></td>
                        <td><Badge status={job.status} /></td>
                        <td style={{ minWidth: '120px' }}>
                          <ProgressBar value={job.processedRows} max={job.totalRows} label={`${job.processedRows}/${job.totalRows} rows`} />
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--admin-success, #2ecc71)' }}>{job.successCount}</td>
                        <td style={{ textAlign: 'right', color: job.errorCount > 0 ? 'var(--admin-danger, #e74c3c)' : undefined }}>{job.errorCount}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{job.startedAt}</td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'exports' && (
        <Card
          title="Recent Exports"
          actions={
            <a href="/admin/import-export/new-export" className="admin-btn admin-btn--primary">
              New Export
            </a>
          }
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Rows</th>
                <th>File</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />)
                : exports.length === 0
                  ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                          No export jobs yet
                        </td>
                      </tr>
                    )
                  : exports.map((job) => (
                      <tr key={job.id}>
                        <td><Badge status={job.type} /></td>
                        <td><Badge status={job.status} /></td>
                        <td style={{ textAlign: 'right' }}>{job.totalRows || '\u2014'}</td>
                        <td>
                          {job.fileUrl ? (
                            <a href={job.fileUrl} style={{ color: 'var(--admin-primary, #6366f1)', fontFamily: 'monospace', fontSize: '13px' }}>
                              {job.fileName}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--admin-text-muted)' }}>Generating...</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>{job.startedAt}</td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
