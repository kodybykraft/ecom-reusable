'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

/* ==========================================================================
   Toast (inline)
   ========================================================================== */

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

const borderColors: Record<ToastType, string> = {
  success: '#2ecc71',
  error: '#e74c3c',
  info: '#3498db',
};

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ToastContainer = () =>
    toasts.length > 0 ? (
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: 8,
              padding: '0.75rem 1rem',
              borderLeft: `4px solid ${borderColors[t.type]}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: 280,
              boxShadow: '0 4px 12px rgba(0,0,0,.3)',
              animation: 'toast-in .3s ease-out',
            }}
          >
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: 0,
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
        ))}
        <style>{`
          @keyframes toast-in {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    ) : null;

  return { toast, ToastContainer };
}

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
   Types & Mock Data
   ========================================================================== */

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  position: number;
  productCount: number;
}

interface Collection {
  id: string;
  title: string;
  slug: string;
  type: 'manual' | 'automated';
  rules: string | null;
  productCount: number;
  publishedAt: string | null;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Clothing', slug: 'clothing', parentId: null, position: 1, productCount: 4 },
  { id: 'cat2', name: 'T-Shirts', slug: 't-shirts', parentId: 'cat1', position: 1, productCount: 1 },
  { id: 'cat3', name: 'Pants', slug: 'pants', parentId: 'cat1', position: 2, productCount: 2 },
  { id: 'cat4', name: 'Outerwear', slug: 'outerwear', parentId: 'cat1', position: 3, productCount: 1 },
  { id: 'cat5', name: 'Accessories', slug: 'accessories', parentId: null, position: 2, productCount: 3 },
  { id: 'cat6', name: 'Belts', slug: 'belts', parentId: 'cat5', position: 1, productCount: 1 },
  { id: 'cat7', name: 'Footwear', slug: 'footwear', parentId: null, position: 3, productCount: 2 },
  { id: 'cat8', name: 'Sneakers', slug: 'sneakers', parentId: 'cat7', position: 1, productCount: 1 },
];

const MOCK_COLLECTIONS: Collection[] = [
  { id: 'col1', title: 'Summer Sale', slug: 'summer-sale', type: 'manual', rules: null, productCount: 12, publishedAt: 'Apr 1, 2026' },
  { id: 'col2', title: 'New Arrivals', slug: 'new-arrivals', type: 'automated', rules: 'created_at > 30 days ago', productCount: 5, publishedAt: 'Mar 15, 2026' },
  { id: 'col3', title: 'Best Sellers', slug: 'best-sellers', type: 'automated', rules: 'total_sold > 50', productCount: 8, publishedAt: 'Feb 1, 2026' },
  { id: 'col4', title: 'Under $30', slug: 'under-30', type: 'automated', rules: 'price < 3000', productCount: 4, publishedAt: 'Mar 20, 2026' },
  { id: 'col5', title: 'Staff Picks', slug: 'staff-picks', type: 'manual', rules: null, productCount: 6, publishedAt: null },
];

/* ==========================================================================
   CategoryTree (interactive)
   ========================================================================== */

function InteractiveCategoryTree({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => c.parentId === null).sort((a, b) => a.position - b.position);

  function renderCategory(cat: Category, depth: number) {
    const children = categories.filter((c) => c.parentId === cat.id).sort((a, b) => a.position - b.position);
    return (
      <div key={cat.id}>
        <a
          href={`/admin/categories/${cat.id}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 80px',
            padding: '10px 12px', paddingLeft: `${12 + depth * 24}px`,
            borderBottom: '1px solid var(--admin-border-light)',
            fontSize: '13px', alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-bg-hover, rgba(0,0,0,.04))'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
          >
            <span style={{ fontWeight: depth === 0 ? 600 : 400 }}>{cat.name}</span>
            <span style={{ color: 'var(--admin-text-secondary)', fontFamily: 'monospace', fontSize: '12px' }}>/{cat.slug}</span>
            <span style={{ color: 'var(--admin-text-secondary)', textAlign: 'right' }}>{cat.productCount} products</span>
          </div>
        </a>
        {children.map((child) => renderCategory(child, depth + 1))}
      </div>
    );
  }

  return <div>{roots.map((r) => renderCategory(r, 0))}</div>;
}

/* ==========================================================================
   CategoriesListClient
   ========================================================================== */

export function CategoriesListClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/admin/categories');
      if (!res.ok) throw new Error('api error');
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setCategories(json.data);
      } else if (Array.isArray(json)) {
        setCategories(json);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader
        title="Categories"
        subtitle="Organize your products into categories"
        actions={
          <a href="/admin/categories/new" className="admin-btn admin-btn--primary">
            Add category
          </a>
        }
      />

      <Card>
        <div style={{
          borderBottom: '1px solid var(--admin-border-light)',
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: '1fr 120px 80px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--admin-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          <span>Name</span>
          <span>Slug</span>
          <span style={{ textAlign: 'right' }}>Products</span>
        </div>

        {loading ? (
          <div style={{ padding: '12px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ padding: '10px 12px', paddingLeft: `${12 + (i % 3 === 0 ? 0 : 24)}px` }}>
                <SkeletonLine width={`${60 + Math.random() * 30}%`} />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
            No categories found
          </div>
        ) : (
          <InteractiveCategoryTree categories={categories} />
        )}
      </Card>
    </div>
  );
}

/* ==========================================================================
   CategoryFormClient
   ========================================================================== */

export function CategoryFormClient({ category }: { category: Category | null }) {
  const isEdit = !!category;
  const { toast, ToastContainer } = useToast();

  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState(category?.parentId ?? '');
  const [saving, setSaving] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>(
    MOCK_CATEGORIES.filter((c) => c.parentId === null),
  );

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  }, [name, isEdit]);

  // Fetch parent categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ecom/admin/categories');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        const data = json?.data ?? json;
        if (Array.isArray(data)) {
          setParentCategories(data.filter((c: Category) => c.parentId === null));
        }
      } catch {
        // keep mock data
      }
    })();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const body = { name, slug, description, parentId: parentId || null };

      const url = isEdit
        ? `/api/ecom/admin/categories/${category!.id}`
        : '/api/ecom/admin/categories';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('save failed');
      toast('Category saved successfully', 'success');
    } catch {
      toast('Could not save category (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [isEdit, category, name, slug, description, parentId, toast]);

  const title = isEdit ? `Edit ${category!.name}` : 'New Category';

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Categories', href: '/admin/categories' },
        { label: title },
      ]} />
      <Card title={title}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormGroup label="Name">
            <input
              className="admin-input"
              type="text"
              placeholder="e.g. Summer Dresses"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Slug" hint="Used in the URL for this category.">
            <input
              className="admin-input"
              type="text"
              placeholder="e.g. summer-dresses"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Description">
            <textarea
              className="admin-input"
              rows={3}
              placeholder="Describe this category..."
              style={{ resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Parent Category">
            <select
              className="admin-input"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">None (top-level)</option>
              {parentCategories
                .filter((r) => r.id !== category?.id)
                .map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
          </FormGroup>
          <div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save category'}
            </button>
          </div>
        </div>
      </Card>

      <ToastContainer />
    </div>
  );
}

/* ==========================================================================
   CollectionsListClient
   ========================================================================== */

export function CollectionsListClient() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/admin/collections');
      if (!res.ok) throw new Error('api error');
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setCollections(json.data);
      } else if (Array.isArray(json)) {
        setCollections(json);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      setCollections(MOCK_COLLECTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader
        title="Collections"
        subtitle="Group products into curated collections"
        actions={
          <a href="/admin/collections/new" className="admin-btn admin-btn--primary">
            Create collection
          </a>
        }
      />

      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Products</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={4} />)
              : collections.length === 0
                ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No collections found
                      </td>
                    </tr>
                  )
                : collections.map((col) => (
                    <tr
                      key={col.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        window.location.href = `/admin/collections/${col.id}`;
                      }}
                    >
                      <td>
                        <a
                          href={`/admin/collections/${col.id}`}
                          style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.title}
                        </a>
                      </td>
                      <td><Badge status={col.type === 'automated' ? 'active' : 'draft'} /></td>
                      <td>{col.productCount}</td>
                      <td>{col.publishedAt ? <Badge status="active" /> : <Badge status="draft" />}</td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ==========================================================================
   CollectionFormClient
   ========================================================================== */

export function CollectionFormClient({ collection }: { collection: Collection | null }) {
  const isEdit = !!collection;
  const { toast, ToastContainer } = useToast();

  const [title, setTitle] = useState(collection?.title ?? '');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'manual' | 'automated'>(collection?.type ?? 'manual');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const body = { title, description, type };

      const url = isEdit
        ? `/api/ecom/admin/collections/${collection!.id}`
        : '/api/ecom/admin/collections';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('save failed');
      toast('Collection saved successfully', 'success');
    } catch {
      toast('Could not save collection (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [isEdit, collection, title, description, type, toast]);

  const heading = isEdit ? `Edit ${collection!.title}` : 'New Collection';

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Collections', href: '/admin/collections' },
        { label: heading },
      ]} />

      <TwoCol
        left={
          <>
            <Card title="Collection Details">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup label="Title">
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="e.g. Summer Sale"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Description">
                  <textarea
                    className="admin-input"
                    rows={3}
                    placeholder="Describe this collection..."
                    style={{ resize: 'vertical' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Type">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}
                      onClick={() => setType('manual')}
                    >
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: `2px solid ${type === 'manual' ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                        background: type === 'manual' ? 'var(--admin-primary)' : 'transparent',
                        transition: 'all 0.15s',
                      }} />
                      Manual
                    </label>
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}
                      onClick={() => setType('automated')}
                    >
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: `2px solid ${type === 'automated' ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                        background: type === 'automated' ? 'var(--admin-primary)' : 'transparent',
                        transition: 'all 0.15s',
                      }} />
                      Automated
                    </label>
                  </div>
                </FormGroup>
              </div>
            </Card>
            {type === 'automated' && (
              <Card title="Conditions">
                <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>
                  Products that match these conditions will be automatically added.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select className="admin-input" style={{ flex: 1 }}>
                    <option>Product price</option>
                    <option>Product tag</option>
                    <option>Product type</option>
                    <option>Product vendor</option>
                    <option>Total sold</option>
                    <option>Created date</option>
                  </select>
                  <select className="admin-input" style={{ width: '140px' }}>
                    <option>is equal to</option>
                    <option>is not equal to</option>
                    <option>is greater than</option>
                    <option>is less than</option>
                    <option>contains</option>
                  </select>
                  <input className="admin-input" type="text" placeholder="Value" style={{ flex: 1 }} />
                </div>
                <button type="button" className="admin-btn" style={{ marginTop: '8px', fontSize: '13px' }}>
                  + Add condition
                </button>
              </Card>
            )}
            {type === 'manual' && (
              <Card title="Products">
                <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>
                  Search and add products to this collection.
                </p>
                <input className="admin-search" placeholder="Search products..." />
                <div style={{ marginTop: '12px', padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px', border: '1px dashed var(--admin-border-light)', borderRadius: '8px' }}>
                  No products added yet
                </div>
              </Card>
            )}
          </>
        }
        right={
          <>
            <Card title="Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge status={collection?.publishedAt ? 'active' : 'draft'} />
                <span style={{ fontSize: '13px' }}>{collection?.publishedAt ? `Published ${collection.publishedAt}` : 'Not published'}</span>
              </div>
            </Card>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              style={{ width: '100%' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save collection'}
            </button>
          </>
        }
      />

      <ToastContainer />
    </div>
  );
}
