import { DataTable, DataTablePagination, PageHeader, StatusBadge } from '@ecom/ui';
import type { Column } from '@ecom/ui';

interface DiscountRow {
  id: string;
  code: string;
  type: string;
  value: string;
  usageCount: number;
  usageLimit: number | null;
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
}

export interface DiscountListPageProps {
  discounts: DiscountRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onRowClick: (discount: DiscountRow) => void;
  onCreateClick: () => void;
}

export function DiscountListPage({
  discounts, total, page, pageSize, totalPages, loading,
  onPageChange, onRowClick, onCreateClick,
}: DiscountListPageProps) {
  const columns: Column<DiscountRow>[] = [
    { key: 'code', header: 'Code', render: (row) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.code}</span> },
    { key: 'type', header: 'Type', width: '130px', render: (row) => <span style={{ textTransform: 'capitalize' }}>{row.type.replace(/_/g, ' ')}</span> },
    { key: 'value', header: 'Value', width: '100px' },
    { key: 'usageCount', header: 'Used', width: '100px', render: (row) => <span>{row.usageCount}{row.usageLimit ? `/${row.usageLimit}` : ''}</span> },
    { key: 'isActive', header: 'Status', width: '100px', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'draft'} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Discounts"
        description={`${total} discount codes`}
        actions={
          <button onClick={onCreateClick} style={{ padding: '0.5rem 1rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
            Create Discount
          </button>
        }
      />
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <DataTable columns={columns} data={discounts} keyField="id" loading={loading} onRowClick={onRowClick} emptyMessage="No discounts found" />
        <DataTablePagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
