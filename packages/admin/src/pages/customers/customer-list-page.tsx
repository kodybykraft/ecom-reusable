import { DataTable, DataTableToolbar, DataTablePagination, PageHeader } from '@ecom/ui';
import type { Column } from '@ecom/ui';

interface CustomerRow {
  id: string;
  email: string;
  name: string;
  orderCount: number;
  totalSpent: string;
  createdAt: string;
}

export interface CustomerListPageProps {
  customers: CustomerRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  loading?: boolean;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (customer: CustomerRow) => void;
}

export function CustomerListPage({
  customers, total, page, pageSize, totalPages, search, loading,
  onSearchChange, onPageChange, onRowClick,
}: CustomerListPageProps) {
  const columns: Column<CustomerRow>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'orderCount', header: 'Orders', width: '100px' },
    { key: 'totalSpent', header: 'Total Spent', width: '130px' },
    { key: 'createdAt', header: 'Joined', width: '130px' },
  ];

  return (
    <div>
      <PageHeader title="Customers" description={`${total} customers`} />
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <DataTableToolbar search={search} onSearchChange={onSearchChange} searchPlaceholder="Search customers..." />
        <DataTable columns={columns} data={customers} keyField="id" loading={loading} onRowClick={onRowClick} emptyMessage="No customers found" />
        <DataTablePagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
