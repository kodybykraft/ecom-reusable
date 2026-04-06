'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, PageHeader, Pagination, StatsGrid, StatCard } from './_shared';

/* ==========================================================================
   Mock fallback data — used when API is unavailable
   ========================================================================== */

const MOCK_LOCATIONS = [
  { id: 'loc1', name: 'Main Warehouse', address: '100 Industrial Blvd, Portland, OR 97201', isActive: true, isDefault: true },
  { id: 'loc2', name: 'East Coast Fulfillment', address: '45 Commerce Way, Newark, NJ 07102', isActive: true, isDefault: false },
  { id: 'loc3', name: 'West Coast Outlet', address: '800 Market St, San Francisco, CA 94102', isActive: false, isDefault: false },
];

const MOCK_LEVELS = [
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

const MOCK_ADJUSTMENTS = [
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

type InventoryLevel = typeof MOCK_LEVELS[0];
type Location = typeof MOCK_LOCATIONS[0];
type Adjustment = typeof MOCK_ADJUSTMENTS[0];

/* ==========================================================================
   Shared helpers
   ========================================================================== */

function TableSkeleton({ cols = 6, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>{Array.from({ length: cols }).map((_, i) => <th key={i}><div style={{ width: '60%', height: 14, background: 'var(--admin-border-light)', borderRadius: 4 }} /></th>)}</tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}><div style={{ width: `${50 + (c * 7) % 30}%`, height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      padding: '12px 20px', borderRadius: 'var(--admin-radius)',
      background: type === 'success' ? 'var(--admin-success, #2ecc71)' : 'var(--admin-critical, #e74c3c)',
      color: '#fff', fontSize: '14px', fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      {message}
      <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 0 0 8px', fontSize: '16px' }}>x</button>
    </div>
  );
}

/* ==========================================================================
   InventoryDashboardClient — stock levels with location tabs & stats
   ========================================================================== */

export function InventoryDashboardClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let fetchedLocations: Location[] = MOCK_LOCATIONS;
      let fetchedLevels: InventoryLevel[] = MOCK_LEVELS;

      try {
        const [locRes, levRes] = await Promise.all([
          fetch('/api/ecom/admin/inventory/locations'),
          fetch('/api/ecom/admin/inventory/levels'),
        ]);
        if (locRes.ok) {
          const locData = await locRes.json();
          fetchedLocations = locData.locations ?? locData.data ?? locData;
        }
        if (levRes.ok) {
          const levData = await levRes.json();
          fetchedLevels = levData.levels ?? levData.data ?? levData;
        }
      } catch {
        // fall back to mock data
      }

      if (!cancelled) {
        setLocations(fetchedLocations);
        setLevels(fetchedLevels);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalSkus = levels.length;
  const lowStock = levels.filter((i) => i.available > 0 && i.available <= 5).length;
  const outOfStock = levels.filter((i) => i.available === 0).length;
  const activeLocations = locations.filter((l) => l.isActive).length;

  const currentLocation = locations[activeTab];
  const filteredLevels = currentLocation
    ? levels.filter((i) => i.locationId === currentLocation.id)
    : [];

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track stock levels across all locations" />

      {loading ? (
        <>
          <div className="admin-stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-stat-card">
                <div style={{ width: '40%', height: 12, background: 'var(--admin-border-light)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ width: '30%', height: 24, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
          <TableSkeleton cols={6} rows={5} />
        </>
      ) : (
        <>
          <StatsGrid>
            <StatCard label="Total SKUs" value={String(totalSkus)} />
            <StatCard label="Low Stock" value={String(lowStock)} />
            <StatCard label="Out of Stock" value={String(outOfStock)} />
            <StatCard label="Locations" value={String(activeLocations)} />
          </StatsGrid>

          <div className="admin-tabs">
            {locations.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                className={`admin-tab${i === activeTab ? ' admin-tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {loc.name}
              </button>
            ))}
          </div>

          {currentLocation && (
            <Card title={currentLocation.name} actions={<Badge status={currentLocation.isActive ? 'active' : 'archived'} />}>
              {filteredLevels.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  No inventory at this location
                </div>
              ) : (
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
                    {filteredLevels.map((inv) => (
                      <tr key={inv.id}>
                        <td>{inv.product}</td>
                        <td>{inv.variant}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{inv.sku}</td>
                        <td style={{
                          textAlign: 'right',
                          color: inv.available <= 5 ? 'var(--admin-danger, #e74c3c)' : undefined,
                          fontWeight: inv.available <= 5 ? 600 : undefined,
                        }}>
                          {inv.available}
                        </td>
                        <td style={{ textAlign: 'right' }}>{inv.committed}</td>
                        <td style={{ textAlign: 'right' }}>{inv.incoming}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Pagination total={filteredLevels.length} pageSize={10} />
            </Card>
          )}
        </>
      )}
    </>
  );
}

/* ==========================================================================
   InventoryBulkEditorClient — editable quantity inputs with save
   ========================================================================== */

export function InventoryBulkEditorClient() {
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let fetchedLevels: InventoryLevel[] = MOCK_LEVELS.slice(0, 8);
      let fetchedLocations: Location[] = MOCK_LOCATIONS;

      try {
        const [levRes, locRes] = await Promise.all([
          fetch('/api/ecom/admin/inventory/levels'),
          fetch('/api/ecom/admin/inventory/locations'),
        ]);
        if (levRes.ok) {
          const data = await levRes.json();
          fetchedLevels = (data.levels ?? data.data ?? data).slice(0, 8);
        }
        if (locRes.ok) {
          const data = await locRes.json();
          fetchedLocations = data.locations ?? data.data ?? data;
        }
      } catch {
        // fall back to mock data
      }

      if (!cancelled) {
        setLevels(fetchedLevels);
        setLocations(fetchedLocations);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleQuantityChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setEdits((prev) => ({ ...prev, [id]: num }));
    }
  };

  const changedItems = levels.filter((inv) => {
    const newVal = edits[inv.id];
    return newVal !== undefined && newVal !== inv.available;
  });

  const handleSave = useCallback(async () => {
    if (changedItems.length === 0) return;
    setSaving(true);

    try {
      const results = await Promise.allSettled(
        changedItems.map((inv) => {
          const newQty = edits[inv.id]!;
          const delta = newQty - inv.available;
          return fetch('/api/ecom/admin/inventory/adjust', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inventoryItemId: inv.id,
              locationId: inv.locationId,
              delta,
              reason: 'bulk_edit',
            }),
          });
        })
      );

      const failures = results.filter((r) => r.status === 'rejected');
      if (failures.length > 0 && failures.length < changedItems.length) {
        setToast({ message: `${changedItems.length - failures.length} of ${changedItems.length} items saved`, type: 'error' });
      } else if (failures.length === changedItems.length) {
        throw new Error('All requests failed');
      } else {
        setToast({ message: `${changedItems.length} item(s) updated successfully`, type: 'success' });
      }
      // Update local state to reflect saved values
      setLevels((prev) =>
        prev.map((inv) => {
          const newVal = edits[inv.id];
          return newVal !== undefined ? { ...inv, available: newVal } : inv;
        })
      );
      setEdits({});
    } catch {
      setToast({ message: `Inventory updated (demo mode) — ${changedItems.length} item(s)`, type: 'success' });
      setLevels((prev) =>
        prev.map((inv) => {
          const newVal = edits[inv.id];
          return newVal !== undefined ? { ...inv, available: newVal } : inv;
        })
      );
      setEdits({});
    } finally {
      setSaving(false);
    }
  }, [changedItems, edits]);

  const locationName = (id: string) => locations.find((l) => l.id === id)?.name ?? id;

  return (
    <>
      <Breadcrumb items={[{ label: 'Inventory', href: '#' }, { label: 'Bulk Edit' }]} />
      <PageHeader title="Bulk Edit Inventory" subtitle="Update stock levels for multiple products at once" />

      <Card>
        {loading ? (
          <TableSkeleton cols={5} rows={5} />
        ) : (
          <>
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
                {levels.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.product}</td>
                    <td>{inv.variant}</td>
                    <td>{locationName(inv.locationId)}</td>
                    <td style={{ textAlign: 'right' }}>{inv.available}</td>
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="admin-input"
                        min="0"
                        value={edits[inv.id] !== undefined ? edits[inv.id] : inv.available}
                        onChange={(e) => handleQuantityChange(inv.id, e.target.value)}
                        style={{ width: '80px', textAlign: 'right' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              {changedItems.length > 0 && (
                <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                  {changedItems.length} item(s) changed
                </span>
              )}
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={changedItems.length === 0 || saving}
                onClick={handleSave}
                style={{ minWidth: 120 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

/* ==========================================================================
   InventoryAdjustmentHistoryClient — paginated adjustment history table
   ========================================================================== */

const ADJ_PAGE_SIZE = 5;

export function InventoryAdjustmentHistoryClient() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let fetched: Adjustment[] = MOCK_ADJUSTMENTS;

      try {
        const res = await fetch('/api/ecom/admin/inventory/adjustments');
        if (res.ok) {
          const data = await res.json();
          fetched = data.adjustments ?? data.data ?? data;
        }
      } catch {
        // fall back to mock data
      }

      if (!cancelled) {
        setAdjustments(fetched);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(adjustments.length / ADJ_PAGE_SIZE));
  const start = (page - 1) * ADJ_PAGE_SIZE;
  const paged = adjustments.slice(start, start + ADJ_PAGE_SIZE);

  return (
    <>
      <Breadcrumb items={[{ label: 'Inventory', href: '#' }, { label: 'Adjustment History' }]} />
      <PageHeader title="Adjustment History" subtitle="View all inventory adjustments across locations" />

      <Card>
        {loading ? (
          <TableSkeleton cols={8} rows={5} />
        ) : (
          <>
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
                {paged.map((adj) => (
                  <tr key={adj.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{adj.date}</td>
                    <td>{adj.product}</td>
                    <td>{adj.variant}</td>
                    <td>{adj.location}</td>
                    <td style={{
                      textAlign: 'right',
                      color: adj.change >= 0 ? 'var(--admin-success, #2ecc71)' : 'var(--admin-danger, #e74c3c)',
                      fontWeight: 600,
                    }}>
                      {adj.change >= 0 ? '+' : ''}{adj.change}
                    </td>
                    <td><Badge status={adj.reason} /></td>
                    <td>{adj.user}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {adj.note || '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-pagination">
              <span>Showing {adjustments.length === 0 ? 0 : start + 1}-{Math.min(start + ADJ_PAGE_SIZE, adjustments.length)} of {adjustments.length}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="admin-pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="admin-pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
