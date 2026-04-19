import { Badge, Breadcrumb, Card, FormGroup, PageHeader, ProgressBar, Tabs } from './_shared';

/* ==========================================================================
   MOCK DATA — Import / Export jobs
   ========================================================================== */

const IMPORT_JOBS = [
  { id: 'imp1', type: 'products', status: 'completed', fileName: 'products_spring_2026.csv', totalRows: 150, processedRows: 150, successCount: 147, errorCount: 3, startedAt: 'Apr 5, 2026 9:00 am', completedAt: 'Apr 5, 2026 9:02 am' },
  { id: 'imp2', type: 'customers', status: 'processing', fileName: 'customer_list_q1.csv', totalRows: 500, processedRows: 312, successCount: 310, errorCount: 2, startedAt: 'Apr 5, 2026 2:30 pm', completedAt: null as string | null },
  { id: 'imp3', type: 'inventory', status: 'failed', fileName: 'inventory_update.csv', totalRows: 80, processedRows: 45, successCount: 44, errorCount: 1, startedAt: 'Apr 4, 2026 11:00 am', completedAt: 'Apr 4, 2026 11:01 am' },
  { id: 'imp4', type: 'orders', status: 'completed', fileName: 'historical_orders.csv', totalRows: 1200, processedRows: 1200, successCount: 1198, errorCount: 2, startedAt: 'Apr 3, 2026 4:00 pm', completedAt: 'Apr 3, 2026 4:15 pm' },
];

const EXPORT_JOBS = [
  { id: 'exp1', type: 'products', status: 'completed', fileName: 'products_export_apr5.csv', totalRows: 10, fileUrl: '#', startedAt: 'Apr 5, 2026 10:00 am', completedAt: 'Apr 5, 2026 10:00 am' },
  { id: 'exp2', type: 'orders', status: 'completed', fileName: 'orders_q1_2026.csv', totalRows: 342, fileUrl: '#', startedAt: 'Apr 4, 2026 8:00 am', completedAt: 'Apr 4, 2026 8:03 am' },
  { id: 'exp3', type: 'customers', status: 'processing', fileName: 'customers_full.csv', totalRows: 0, fileUrl: null as string | null, startedAt: 'Apr 5, 2026 3:00 pm', completedAt: null as string | null },
];

const CSV_HEADERS_MOCK = ['name', 'sku', 'price', 'qty'];
const DB_FIELDS_BY_TYPE: Record<string, string[]> = {
  products: ['Title', 'SKU', 'Price', 'Inventory Quantity', 'Description', 'Vendor', 'Type', 'Status'],
  customers: ['Name', 'Email', 'Phone', 'Address Line 1', 'City', 'State', 'ZIP', 'Country'],
  orders: ['Order Number', 'Customer', 'Total', 'Status', 'Date', 'Shipping Address'],
  inventory: ['SKU', 'Location', 'Available', 'Committed', 'Incoming'],
};

const PREVIEW_ROWS = [
  ['Classic Cotton T-Shirt', 'CCT-001', '24.99', '142'],
  ['Slim Fit Jeans', 'SFJ-001', '59.99', '67'],
  ['Leather Belt', 'LB-001', '34.99', '34'],
];

/* ==========================================================================
   PAGE COMPONENTS
   ========================================================================== */

export function ImportExportPage() {
  return (
    <>
      <PageHeader
        title="Import / Export"
        subtitle="Bulk import and export your store data"
      />

      <Tabs items={['Imports', 'Exports']} active={0} />

      {/* Imports Tab */}
      <Card
        title="Recent Imports"
        actions={<button type="button" className="admin-btn admin-btn--primary">New Import</button>}
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
            {IMPORT_JOBS.map((job) => (
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

      {/* Exports Tab (shown below for demo purposes) */}
      <Card
        title="Recent Exports"
        actions={<button type="button" className="admin-btn admin-btn--primary">New Export</button>}
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
            {EXPORT_JOBS.map((job) => (
              <tr key={job.id}>
                <td><Badge status={job.type} /></td>
                <td><Badge status={job.status} /></td>
                <td style={{ textAlign: 'right' }}>{job.totalRows || '—'}</td>
                <td>
                  {job.fileUrl ? (
                    <a href={job.fileUrl} style={{ color: 'var(--admin-primary, #6366f1)', fontFamily: 'monospace', fontSize: '13px' }}>{job.fileName}</a>
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
    </>
  );
}

export function ImportFormPage() {
  const selectedType = 'products';
  const dbFields = DB_FIELDS_BY_TYPE[selectedType];

  return (
    <>
      <Breadcrumb items={[{ label: 'Import / Export', href: '#' }, { label: 'New Import' }]} />
      <PageHeader title="Import Data" subtitle="Upload a CSV file to import data into your store" />

      {/* Step 1: Select Type */}
      <Card title="Step 1: Select Type">
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Products', 'Customers', 'Orders', 'Inventory'].map((type) => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--admin-border-light, #e5e7eb)', background: type === 'Products' ? 'var(--admin-bg-secondary, #f3f0ff)' : undefined }}>
              <input type="radio" name="import-type" defaultChecked={type === 'Products'} />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Step 2: Upload File */}
      <Card title="Step 2: Upload File">
        <div style={{
          border: '2px dashed var(--admin-border-light, #d1d5db)',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          color: 'var(--admin-text-muted)',
          cursor: 'pointer',
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>Drop CSV file here or click to browse</div>
          <div style={{ fontSize: '13px' }}>Supports .csv files up to 10MB</div>
        </div>
      </Card>

      {/* Step 3: Map Columns */}
      <Card title="Step 3: Map Columns">
        <table className="admin-table">
          <thead>
            <tr>
              <th>CSV Column</th>
              <th>Maps to</th>
            </tr>
          </thead>
          <tbody>
            {CSV_HEADERS_MOCK.map((header, i) => (
              <tr key={header}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{header}</td>
                <td>
                  <select className="admin-input" defaultValue={dbFields[i] ?? ''} style={{ minWidth: '200px' }}>
                    <option value="">— Skip this column —</option>
                    {dbFields.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Step 4: Preview */}
      <Card title="Step 4: Preview">
        <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>Showing first {PREVIEW_ROWS.length} rows of your file:</p>
        <table className="admin-table">
          <thead>
            <tr>
              {CSV_HEADERS_MOCK.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREVIEW_ROWS.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ fontFamily: 'monospace', fontSize: '13px' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" className="admin-btn">Cancel</button>
        <button type="button" className="admin-btn admin-btn--primary">Start Import</button>
      </div>
    </>
  );
}

export function ExportFormPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Import / Export', href: '#' }, { label: 'New Export' }]} />
      <PageHeader title="Export Data" subtitle="Generate a CSV export of your store data" />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <FormGroup label="Export Type">
            <select className="admin-input">
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="orders">Orders</option>
              <option value="inventory">Inventory</option>
            </select>
          </FormGroup>

          <FormGroup label="Date Range">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-label" style={{ fontSize: '12px' }}>From</label>
                <input type="date" className="admin-input" defaultValue="2026-01-01" />
              </div>
              <div>
                <label className="admin-label" style={{ fontSize: '12px' }}>To</label>
                <input type="date" className="admin-input" defaultValue="2026-04-05" />
              </div>
            </div>
          </FormGroup>

          <FormGroup label="Status Filter">
            <select className="admin-input">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </FormGroup>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="button" className="admin-btn admin-btn--primary">Start Export</button>
            <button type="button" className="admin-btn">Cancel</button>
          </div>
        </div>
      </Card>
    </>
  );
}
