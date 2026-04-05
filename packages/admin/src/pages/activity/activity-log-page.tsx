import { DataTable, DataTablePagination, PageHeader } from '@ecom/ui';
import type { Column } from '@ecom/ui';

interface ActivityRow {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  userName: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface ActivityLogPageProps {
  logs: ActivityRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export function ActivityLogPage({
  logs, total, page, pageSize, totalPages, loading, onPageChange,
}: ActivityLogPageProps) {
  const columns: Column<ActivityRow>[] = [
    { key: 'createdAt', header: 'Time', width: '160px' },
    { key: 'userName', header: 'User', width: '150px' },
    { key: 'action', header: 'Action' },
    { key: 'resourceType', header: 'Resource', width: '120px', render: (row) => <span style={{ textTransform: 'capitalize' }}>{row.resourceType}</span> },
    { key: 'resourceId', header: 'ID', width: '120px', render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.resourceId?.slice(0, 8) ?? '—'}</span> },
  ];

  return (
    <div>
      <PageHeader title="Activity Log" description="Audit trail of all admin actions" />
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <DataTable columns={columns} data={logs} keyField="id" loading={loading} emptyMessage="No activity recorded" />
        <DataTablePagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
