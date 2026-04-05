import { DataTable, DataTableToolbar, DataTablePagination, PageHeader, StatusBadge } from '@ecom/ui';
import type { Column } from '@ecom/ui';

interface ProductRow {
  id: string;
  title: string;
  status: string;
  variantCount: number;
  inventory: number;
  price: string;
  updatedAt: string;
}

export interface ProductListPageProps {
  products: ProductRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  loading?: boolean;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (product: ProductRow) => void;
  onCreateClick: () => void;
}

export function ProductListPage({
  products,
  total,
  page,
  pageSize,
  totalPages,
  search,
  loading,
  onSearchChange,
  onPageChange,
  onRowClick,
  onCreateClick,
}: ProductListPageProps) {
  const columns: Column<ProductRow>[] = [
    { key: 'title', header: 'Product', sortable: true },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'variantCount', header: 'Variants', width: '100px' },
    { key: 'inventory', header: 'Inventory', width: '100px' },
    { key: 'price', header: 'Price', width: '120px' },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${total} products`}
        actions={
          <button
            onClick={onCreateClick}
            style={{ padding: '0.5rem 1rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Add Product
          </button>
        }
      />

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <DataTableToolbar
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search products..."
        />
        <DataTable
          columns={columns}
          data={products}
          keyField="id"
          loading={loading}
          onRowClick={onRowClick}
          emptyMessage="No products found"
        />
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
