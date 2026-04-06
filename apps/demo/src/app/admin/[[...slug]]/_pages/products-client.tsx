'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatMoney } from '@ecom/core';
import { Badge, TwoCol, Card, FormGroup, PageHeader } from './_shared';

/* ==========================================================================
   Mock fallback data — used when API is unavailable
   ========================================================================== */

const MOCK_PRODUCTS = [
  { id: 'p1', title: 'Classic Cotton T-Shirt', status: 'active', inventory: 142, type: 'T-Shirts', vendor: 'EcoCotton Co.', price: 2499, compareAt: 2999, cost: 800, sku: 'CCT-001', variants: [{ title: 'S / White', price: 2499, inventory: 25 }, { title: 'M / White', price: 2499, inventory: 3 }, { title: 'L / White', price: 2499, inventory: 30 }], description: 'A comfortable everyday cotton tee in multiple colors.' },
  { id: 'p2', title: 'Slim Fit Jeans', status: 'active', inventory: 67, type: 'Pants', vendor: 'DenimWorks', price: 5999, compareAt: 7499, cost: 2200, sku: 'SFJ-001', variants: [{ title: '30 / Indigo', price: 5999, inventory: 12 }, { title: '32 / Indigo', price: 5999, inventory: 1 }], description: 'Modern slim fit jeans with stretch comfort.' },
  { id: 'p3', title: 'Leather Belt', status: 'active', inventory: 34, type: 'Accessories', vendor: 'HideCraft', price: 3499, compareAt: null, cost: 1200, sku: 'LB-001', variants: [], description: 'Genuine leather belt with brushed metal buckle.' },
  { id: 'p4', title: 'Canvas Sneakers', status: 'active', inventory: 89, type: 'Footwear', vendor: 'StepUp', price: 4999, compareAt: 5999, cost: 1800, sku: 'CS-001', variants: [], description: 'Lightweight canvas sneakers for everyday wear.' },
  { id: 'p5', title: 'Wool Beanie', status: 'active', inventory: 210, type: 'Accessories', vendor: 'KnitCo', price: 1999, compareAt: null, cost: 600, sku: 'WB-001', variants: [], description: 'Soft merino wool beanie for cold days.' },
  { id: 'p6', title: 'Hooded Sweatshirt', status: 'active', inventory: 56, type: 'Outerwear', vendor: 'FleeceKing', price: 6999, compareAt: 7999, cost: 2500, sku: 'HS-001', variants: [], description: 'Cozy fleece-lined hoodie with kangaroo pocket.' },
  { id: 'p7', title: 'Linen Shirt', status: 'draft', inventory: 0, type: 'Shirts', vendor: 'LinenLux', price: 4499, compareAt: null, cost: 1500, sku: 'LS-001', variants: [], description: 'Lightweight linen shirt for warm weather.' },
  { id: 'p8', title: 'Cargo Shorts', status: 'active', inventory: 120, type: 'Pants', vendor: 'OutdoorGear', price: 3999, compareAt: 4999, cost: 1400, sku: 'CG-001', variants: [], description: 'Durable cargo shorts with multiple pockets.' },
  { id: 'p9', title: 'Silk Scarf', status: 'archived', inventory: 8, type: 'Accessories', vendor: 'SilkHouse', price: 2999, compareAt: null, cost: 1000, sku: 'SS-001', variants: [], description: 'Elegant silk scarf with hand-rolled edges.' },
  { id: 'p10', title: 'Running Shoes', status: 'active', inventory: 75, type: 'Footwear', vendor: 'SprintTech', price: 8999, compareAt: 10999, cost: 3200, sku: 'RS-001', variants: [], description: 'Lightweight performance running shoes with responsive cushioning.' },
];

type Product = typeof MOCK_PRODUCTS[0];

/* ==========================================================================
   Table skeleton for loading state
   ========================================================================== */

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}></th>
          <th>Product</th>
          <th>Status</th>
          <th>Inventory</th>
          <th>Type</th>
          <th>Vendor</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td><div style={{ width: 36, height: 36, background: 'var(--admin-border-light)', borderRadius: 'var(--admin-radius-sm)', animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            <td><div style={{ width: '60%', height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            <td><div style={{ width: 50, height: 20, background: 'var(--admin-border-light)', borderRadius: 10, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            <td><div style={{ width: 60, height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            <td><div style={{ width: 70, height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            <td><div style={{ width: 80, height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ==========================================================================
   Toast notification
   ========================================================================== */

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
   ProductsListClient — interactive products list with tabs, search, pagination
   ========================================================================== */

const TABS = ['All', 'Active', 'Draft', 'Archived'] as const;
const TAB_STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Active: 'active',
  Draft: 'draft',
  Archived: 'archived',
};
const PAGE_SIZE = 10;

export function ProductsListClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchProducts = useCallback(async (status: string | undefined, query: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (query) params.set('search', query);
      params.set('page', String(pg));
      params.set('limit', String(PAGE_SIZE));

      const res = await fetch(`/api/ecom/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(data.products ?? data.data ?? data);
      setTotal(data.total ?? data.meta?.total ?? (Array.isArray(data) ? data.length : 0));
    } catch {
      // Fall back to mock data on any error
      let filtered = [...MOCK_PRODUCTS];
      if (status) filtered = filtered.filter(p => p.status === status);
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q)
        );
      }
      setTotal(filtered.length);
      const start = (pg - 1) * PAGE_SIZE;
      setProducts(filtered.slice(start, start + PAGE_SIZE));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const status = TAB_STATUS_MAP[TABS[activeTab]];
    fetchProducts(status, search, page);
  }, [activeTab, search, page, fetchProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 300);
  };

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Products"
        actions={<a href="/admin/products/new" className="admin-btn admin-btn--primary">Add product</a>}
      />
      <div className="admin-card">
        {/* Interactive Tabs */}
        <div className="admin-tabs">
          {TABS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`admin-tab${i === activeTab ? ' admin-tab--active' : ''}`}
              onClick={() => handleTabChange(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Searchable Toolbar */}
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search products..."
            onChange={handleSearchChange}
            defaultValue=""
          />
          <button type="button" className="admin-filter-btn">Filter</button>
          <button type="button" className="admin-filter-btn">Sort</button>
        </div>

        {/* Product Table or Skeleton */}
        {loading ? (
          <TableSkeleton rows={5} />
        ) : products.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No products found
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Product</th>
                <th>Status</th>
                <th>Inventory</th>
                <th>Type</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><div style={{ width: 36, height: 36, background: '#f1f2f3', borderRadius: 'var(--admin-radius-sm)' }} /></td>
                  <td><a href={`/admin/products/${p.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{p.title}</a></td>
                  <td><Badge status={p.status} /></td>
                  <td>{p.inventory} in stock</td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{p.type}</td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{p.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginated footer */}
        <div className="admin-pagination">
          <span>Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ProductFormClient — interactive product create/edit form
   ========================================================================== */

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  compareAt: string;
  cost: string;
  sku: string;
  quantity: string;
  status: string;
  type: string;
  vendor: string;
}

export function ProductFormClient({ product }: { product: Product | null }) {
  const isNew = !product;

  const [form, setForm] = useState<ProductFormData>({
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product ? (product.price / 100).toFixed(2) : '',
    compareAt: product?.compareAt ? (product.compareAt / 100).toFixed(2) : '',
    cost: product ? (product.cost / 100).toFixed(2) : '',
    sku: product?.sku ?? '',
    quantity: String(product?.inventory ?? 0),
    status: product?.status ?? 'draft',
    type: product?.type ?? '',
    vendor: product?.vendor ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setToast({ message: 'Product title is required', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Math.round(parseFloat(form.price || '0') * 100),
        compareAt: form.compareAt ? Math.round(parseFloat(form.compareAt) * 100) : null,
        cost: Math.round(parseFloat(form.cost || '0') * 100),
        sku: form.sku,
        inventory: parseInt(form.quantity, 10) || 0,
        status: form.status,
        type: form.type,
        vendor: form.vendor,
      };

      const url = isNew
        ? '/api/ecom/admin/products'
        : `/api/ecom/admin/products/${product.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setToast({ message: isNew ? 'Product created successfully' : 'Product saved successfully', type: 'success' });

      if (isNew) {
        // Redirect to products list after short delay
        setTimeout(() => { window.location.href = '/admin/products'; }, 1200);
      }
    } catch {
      // Graceful fallback — show success-like message since no DB yet
      setToast({ message: isNew ? 'Product created (demo mode)' : 'Product saved (demo mode)', type: 'success' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isNew ? 'Add product' : form.title || product!.title}
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: isNew ? 'Add product' : product!.title },
        ]}
        actions={
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={saving}
            onClick={handleSubmit}
            style={{ minWidth: 80, position: 'relative' }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        }
      />
      <TwoCol
        left={
          <>
            <Card title="Title and description">
              <FormGroup label="Title">
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="Short sleeve t-shirt"
                />
              </FormGroup>
              <FormGroup label="Description">
                <textarea
                  className="admin-input"
                  rows={4}
                  value={form.description}
                  onChange={handleChange('description')}
                  style={{ resize: 'vertical' }}
                />
              </FormGroup>
            </Card>

            <Card title="Media">
              <div style={{
                border: '2px dashed var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                padding: '32px',
                textAlign: 'center',
                color: 'var(--admin-text-muted)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  Drag and drop or click to upload
                </div>
              </div>
            </Card>

            <Card title="Pricing">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <FormGroup label="Price">
                  <input
                    className="admin-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange('price')}
                  />
                </FormGroup>
                <FormGroup label="Compare-at price">
                  <input
                    className="admin-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compareAt}
                    onChange={handleChange('compareAt')}
                  />
                </FormGroup>
                <FormGroup label="Cost per item">
                  <input
                    className="admin-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.cost}
                    onChange={handleChange('cost')}
                  />
                </FormGroup>
              </div>
            </Card>

            <Card title="Inventory">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <FormGroup label="SKU">
                  <input
                    className="admin-input"
                    value={form.sku}
                    onChange={handleChange('sku')}
                  />
                </FormGroup>
                <FormGroup label="Quantity">
                  <input
                    className="admin-input"
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={handleChange('quantity')}
                  />
                </FormGroup>
              </div>
            </Card>

            {product && product.variants.length > 0 && (
              <Card title="Variants">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Inventory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v, i) => (
                      <tr key={i}>
                        <td>{v.title}</td>
                        <td style={{ textAlign: 'right' }}>{formatMoney(v.price)}</td>
                        <td style={{
                          textAlign: 'right',
                          color: v.inventory <= 5 ? 'var(--admin-critical)' : undefined,
                          fontWeight: v.inventory <= 5 ? 600 : undefined,
                        }}>
                          {v.inventory}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        }
        right={
          <>
            <Card title="Status">
              <select
                className="admin-input"
                value={form.status}
                onChange={handleChange('status')}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Card>

            <Card title="Product organization">
              <FormGroup label="Type">
                <input
                  className="admin-input"
                  value={form.type}
                  onChange={handleChange('type')}
                />
              </FormGroup>
              <FormGroup label="Vendor">
                <input
                  className="admin-input"
                  value={form.vendor}
                  onChange={handleChange('vendor')}
                />
              </FormGroup>
              <FormGroup label="Collections">
                <input className="admin-input" placeholder="Search collections..." />
              </FormGroup>
              <FormGroup label="Tags">
                <input className="admin-input" placeholder="Add tags..." />
              </FormGroup>
            </Card>
          </>
        }
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
