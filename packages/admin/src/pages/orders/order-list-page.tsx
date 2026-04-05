import { DataTable, DataTableToolbar, DataTablePagination, PageHeader, StatusBadge } from '@ecom/ui';
import type { Column } from '@ecom/ui';

interface OrderRow {
  id: string;
  orderNumber: number;
  email: string;
  total: string;
  financialStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

export interface OrderListPageProps {
  orders: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  loading?: boolean;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (order: OrderRow) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function OrderListPage({
  orders,
  total,
  page,
  pageSize,
  totalPages,
  search,
  loading,
  onSearchChange,
  onPageChange,
  onRowClick,
}: OrderListPageProps) {
  const columns: Column<OrderRow>[] = [
    { key: 'orderNumber', header: 'Order', width: '100px', render: (row) => <span>#{row.orderNumber}</span> },
    { key: 'email', header: 'Customer', sortable: true },
    { key: 'total', header: 'Total', width: '120px' },
    { key: 'financialStatus', header: 'Payment', width: '140px', render: (row) => <StatusBadge status={row.financialStatus} /> },
    { key: 'fulfillmentStatus', header: 'Fulfillment', width: '140px', render: (row) => <StatusBadge status={row.fulfillmentStatus} /> },
    { key: 'createdAt', header: 'Date', width: '140px' },
  ];

  return (
    <div>
      <PageHeader title="Orders" description={`${total} orders`} />

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <DataTableToolbar search={search} onSearchChange={onSearchChange} searchPlaceholder="Search orders..." />
        <DataTable
          columns={columns}
          data={orders}
          keyField="id"
          loading={loading}
          onRowClick={onRowClick}
          emptyMessage="No orders found"
        />
        <DataTablePagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
