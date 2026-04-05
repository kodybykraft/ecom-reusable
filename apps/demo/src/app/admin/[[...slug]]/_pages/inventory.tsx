import { Badge, Breadcrumb, Card, FormGroup, PageHeader, Pagination, StatsGrid, StatCard, Tabs, Toolbar } from './_shared';

/* ==========================================================================
   MOCK DATA — Inventory management
   ========================================================================== */

const LOCATIONS = [
  { id: 'loc1', name: 'Main Warehouse', address: '100 Industrial Blvd, Portland, OR 97201', isActive: true, isDefault: true },
  { id: 'loc2', name: 'East Coast Fulfillment', address: '45 Commerce Way, Newark, NJ 07102', isActive: true, isDefault: false },
  { id: 'loc3', name: 'West Coast Outlet', address: '800 Market St, San Francisco, CA 94102', isActive: false, isDefault: false },
];

const INVENTORY_LEVELS = [
  { id: 'inv1', locationId: 'loc1', product: 'Classic Cotton T-Shirt', variant: 'M / White', sku: 'CCT-MW', available: 25, committed: 3, incoming: 50 },
  { id: 'inv2', locationId: 'loc1', product: 'Classic Cotton T-Shirt', variant: 'L / Black', sku: 'CCT-LB', available: 18, committed: 1, incoming: 0 },
  { id: 'inv3', locationId: 'loc1', product: 'Slim Fit Jeans', variant: '32 / Indigo', sku: 'SFJ-32I', available: 1, committed: 0, incoming: 20 },
  { id: 'inv4', locationId: 'loc1', product: 'Leather Belt', variant: 'M / Brown', sku: 'LB-MB', available: 5, committed: 2, incoming: 0 },
  { id: 'inv5', locationId: 'loc1', product: 'Canvas Sneakers', variant: '10 / White', sku: 'CS-10W', available: 2, committed: 1, incoming: 15 },
  { id: 'inv6', locationId: 'loc2', product: 'Classic Cotton T-Shirt', variant: 'S / White', sku: 'CCT-SW', available: 12, committed: 0, incoming: 0 },
  { id: 'inv7', locationId: 'loc2', product: 'Wool Beanie', variant: 'One Size / Navy', sku: 'WB-OSN', available: 55, committed: 4, incoming: 0 },
  { id: 'inv8', locationId: 'loc2', product: 'Hooded Sweatshirt', variant: 'L / Black', sku: 'HS-LB', available: 8, committed: 2, incoming: 10 },
  { id: 'inv9', locationId: 'loc2', product: 'Running Shoes', variant: '9 / Black', sku: 'RS-9B', available: 3, committed: 1, incoming: 0 },
  { id: 'inv10', locationId: 'loc2', product: 'Cargo Shorts', variant: 'L / Khaki', sku: 'CG-LK', available: 25, committed: 0, incoming: 0 },
  { id: 'inv11', locationId: 'loc3', product: 'Classic Cotton T-Shirt', variant: 'XL / Black', sku: 'CCT-XLB', available: 0, committed: 0, incoming: 30 },
  { id: 'inv12', locationId: 'loc3', product: 'Slim Fit Jeans', variant: '34 / Black', sku: 'SFJ-34B', available: 4, committed: 0, incoming: 0 },
  { id: 'inv13', locationId: 'loc3', product: 'Canvas Sneakers', variant: '11 / Black', sku: 'CS-11B', available: 8, committed: 3, incoming: 0 },
  { id: 'inv14', locationId: 'loc3', product: 'Hooded Sweatshirt', variant: 'XL / Grey', sku: 'HS-XLG', available: 0, committed: 0, incoming: 0 },
  { id: 'inv15', locationId: 'loc1', product: 'Wool Beanie', variant: 'One Size / Red', sku: 'WB-OSR', available: 60, committed: 5, incoming: 0 },
];

const ADJUSTMENTS = [
  { id: 'adj1', date: 'Apr 5, 2026 3:15 pm', product: 'Classic Cotton T-Shirt', variant: 'M / White', location: 'Main Warehouse', change: -2, reason: 'damaged', user: 'Sarah Chen', note: 'Water damage in transit' },
  { id: 'adj2', date: 'Apr 5, 2026 1:00 pm', product: 'Slim Fit Jeans', variant: '32 / Indigo', location: 'Main Warehouse', change: 20, reason: 'received', user: 'James Wilson', note: 'PO-4521 shipment received' },
  { id: 'adj3', date: 'Apr 4, 2026 4:30 pm', product: 'Canvas Sneakers', variant: '10 / White', location: 'Main Warehouse', change: -1, reason: 'correction', user: 'Amira Patel', note: 'Cycle count correction' },
  { id: 'adj4', date: 'Apr 4, 2026 11:00 am', product: 'Leather Belt', variant: 'M / Brown', location: 'Main Warehouse', change: 10, reason: 'received', user: 'James Wilson', note: '' },
  { id: 'adj5', date: 'Apr 3, 2026 5:00 pm', product: 'Wool Beanie', variant: 'One Size / Navy', location: 'East Coast Fulfillment', change: -3, reason: 'shrinkage', user: 'Lucas Berg', note: 'Quarterly audit discrepancy' },
  { id: 'adj6', date: 'Apr 3, 2026 2:15 pm', product: 'Running Shoes', variant: '9 / Black', location: 'East Coast Fulfillment', change: 15, reason: 'received', user: 'Nina Kowalski', note: 'Bulk restock' },
  { id: 'adj7', date: 'Apr 2, 2026 10:30 am', product: 'Hooded Sweatshirt', variant: 'XL / Grey', location: 'West Coast Outlet', change: -5, reason: 'transfer_out', user: 'Omar Hassan', note: 'Transfer to Main Warehouse' },
  { id: 'adj8', date: 'Apr 2, 2026 10:30 am', product: 'Hooded Sweatshirt', variant: 'XL / Grey', location: 'Main Warehouse', change: 5, reason: 'transfer_in', user: 'Omar Hassan', note: 'Transfer from West Coast' },
  { id: 'adj9', date: 'Apr 1, 2026 9:00 am', product: 'Classic Cotton T-Shirt', variant: 'XL / Black', location: 'West Coast Outlet', change: -8, reason: 'damaged', user: 'Elena Rossi', note: 'Flood damage — full write-off' },
  { id: 'adj10', date: 'Mar 31, 2026 4:45 pm', product: 'Cargo Shorts', variant: 'L / Khaki', location: 'East Coast Fulfillment', change: 30, reason: 'received', user: 'David Kim', note: 'Spring restock shipment' },
];

/* ==========================================================================
   PAGE COMPONENTS
   ========================================================================== */

export function InventoryDashboardPage() {
  const totalSkus = INVENTORY_LEVELS.length;
  const lowStock = INVENTORY_LEVELS.filter((i) => i.available > 0 && i.available <= 5).length;
  const outOfStock = INVENTORY_LEVELS.filter((i) => i.available === 0).length;
  const activeLocations = LOCATIONS.filter((l) => l.isActive).length;

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track stock levels across all locations" />
      <StatsGrid>
        <StatCard label="Total SKUs" value={String(totalSkus)} />
        <StatCard label="Low Stock" value={String(lowStock)} />
        <StatCard label="Out of Stock" value={String(outOfStock)} />
        <StatCard label="Locations" value={String(activeLocations)} />
      </StatsGrid>

      <Tabs items={LOCATIONS.map((l) => l.name)} active={0} />

      {LOCATIONS.map((loc) => {
        const levels = INVENTORY_LEVELS.filter((i) => i.locationId === loc.id);
        if (levels.length === 0) return null;
        return (
          <Card key={loc.id} title={loc.name} actions={<Badge status={loc.isActive ? 'active' : 'archived'} />}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>SKU</th>
                  <th style={{ textAlign: 'right' }}>Available</th>
                  <th style={{ textAlign: 'right' }}>Committed</th>
                  <th style={{ textAlign: 'right' }}>Incoming</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.product}</td>
                    <td>{inv.variant}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{inv.sku}</td>
                    <td style={{ textAlign: 'right', color: inv.available <= 5 ? 'var(--admin-danger, #e74c3c)' : undefined, fontWeight: inv.available <= 5 ? 600 : undefined }}>
                      {inv.available}
                    </td>
                    <td style={{ textAlign: 'right' }}>{inv.committed}</td>
                    <td style={{ textAlign: 'right' }}>{inv.incoming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination total={levels.length} pageSize={10} />
          </Card>
        );
      })}
    </>
  );
}

export function InventoryBulkEditorPage() {
  const items = INVENTORY_LEVELS.slice(0, 8);

  return (
    <>
      <Breadcrumb items={[{ label: 'Inventory', href: '#' }, { label: 'Bulk Edit' }]} />
      <PageHeader title="Bulk Edit Inventory" subtitle="Update stock levels for multiple products at once" />

      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Current Stock</th>
              <th style={{ textAlign: 'right' }}>New Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((inv) => {
              return (
                <tr key={inv.id}>
                  <td>{inv.product}</td>
                  <td>{inv.variant}</td>
                  <td>
                    <select className="admin-input" defaultValue={inv.locationId} style={{ minWidth: '160px' }}>
                      {LOCATIONS.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>{inv.available}</td>
                  <td style={{ textAlign: 'right' }}>
                    <input type="number" className="admin-input" defaultValue={inv.available} style={{ width: '80px', textAlign: 'right' }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button type="button" className="admin-btn admin-btn--primary">Save Changes</button>
        </div>
      </Card>
    </>
  );
}

export function InventoryAdjustmentHistoryPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inventory', href: '#' }, { label: 'Adjustment History' }]} />
      <PageHeader title="Adjustment History" subtitle="View all inventory adjustments across locations" />

      <Card>
        <Toolbar searchPlaceholder="Search adjustments..." />
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Variant</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Change</th>
              <th>Reason</th>
              <th>User</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {ADJUSTMENTS.map((adj) => (
              <tr key={adj.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{adj.date}</td>
                <td>{adj.product}</td>
                <td>{adj.variant}</td>
                <td>{adj.location}</td>
                <td style={{ textAlign: 'right', color: adj.change >= 0 ? 'var(--admin-success, #2ecc71)' : 'var(--admin-danger, #e74c3c)', fontWeight: 600 }}>
                  {adj.change >= 0 ? '+' : ''}{adj.change}
                </td>
                <td><Badge status={adj.reason} /></td>
                <td>{adj.user}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adj.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={ADJUSTMENTS.length} pageSize={10} />
      </Card>
    </>
  );
}

export function InventoryLocationFormPage({ id }: { id?: string }) {
  const location = id ? LOCATIONS.find((l) => l.id === id) : undefined;
  const isEdit = !!location;

  return (
    <>
      <Breadcrumb items={[{ label: 'Inventory', href: '#' }, { label: 'Locations', href: '#' }, { label: isEdit ? location!.name : 'New Location' }]} />

      <Card title={isEdit ? `Edit ${location!.name}` : 'New Location'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <FormGroup label="Location Name">
            <input type="text" className="admin-input" defaultValue={location?.name ?? ''} placeholder="e.g. Main Warehouse" />
          </FormGroup>

          <FormGroup label="Address">
            <textarea className="admin-textarea" rows={3} defaultValue={location?.address ?? ''} placeholder="Full address..." />
          </FormGroup>

          <FormGroup label="Default Location">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={location?.isDefault ?? false} />
              <span>Set as default fulfillment location</span>
            </label>
          </FormGroup>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="button" className="admin-btn admin-btn--primary">{isEdit ? 'Save Location' : 'Create Location'}</button>
            <button type="button" className="admin-btn">Cancel</button>
          </div>
        </div>
      </Card>
    </>
  );
}
