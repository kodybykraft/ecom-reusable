import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

/* ==========================================================================
   Categories & Collections — Mock data & page components
   ========================================================================== */

const CATEGORIES = [
  { id: 'cat1', name: 'Clothing', slug: 'clothing', parentId: null, position: 1, productCount: 4 },
  { id: 'cat2', name: 'T-Shirts', slug: 't-shirts', parentId: 'cat1', position: 1, productCount: 1 },
  { id: 'cat3', name: 'Pants', slug: 'pants', parentId: 'cat1', position: 2, productCount: 2 },
  { id: 'cat4', name: 'Outerwear', slug: 'outerwear', parentId: 'cat1', position: 3, productCount: 1 },
  { id: 'cat5', name: 'Accessories', slug: 'accessories', parentId: null, position: 2, productCount: 3 },
  { id: 'cat6', name: 'Belts', slug: 'belts', parentId: 'cat5', position: 1, productCount: 1 },
  { id: 'cat7', name: 'Footwear', slug: 'footwear', parentId: null, position: 3, productCount: 2 },
  { id: 'cat8', name: 'Sneakers', slug: 'sneakers', parentId: 'cat7', position: 1, productCount: 1 },
];

const COLLECTIONS = [
  { id: 'col1', title: 'Summer Sale', slug: 'summer-sale', type: 'manual' as const, rules: null, productCount: 12, publishedAt: 'Apr 1, 2026' },
  { id: 'col2', title: 'New Arrivals', slug: 'new-arrivals', type: 'automated' as const, rules: 'created_at > 30 days ago', productCount: 5, publishedAt: 'Mar 15, 2026' },
  { id: 'col3', title: 'Best Sellers', slug: 'best-sellers', type: 'automated' as const, rules: 'total_sold > 50', productCount: 8, publishedAt: 'Feb 1, 2026' },
  { id: 'col4', title: 'Under $30', slug: 'under-30', type: 'automated' as const, rules: 'price < 3000', productCount: 4, publishedAt: 'Mar 20, 2026' },
  { id: 'col5', title: 'Staff Picks', slug: 'staff-picks', type: 'manual' as const, rules: null, productCount: 6, publishedAt: null },
];

function CategoryTree() {
  const roots = CATEGORIES.filter((c) => c.parentId === null).sort((a, b) => a.position - b.position);

  function renderCategory(cat: typeof CATEGORIES[0], depth: number) {
    const children = CATEGORIES.filter((c) => c.parentId === cat.id).sort((a, b) => a.position - b.position);
    return (
      <div key={cat.id}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 80px',
          padding: '10px 12px', paddingLeft: `${12 + depth * 24}px`,
          borderBottom: '1px solid var(--admin-border-light)',
          fontSize: '13px', alignItems: 'center',
        }}>
          <span style={{ fontWeight: depth === 0 ? 600 : 400 }}>{cat.name}</span>
          <span style={{ color: 'var(--admin-text-secondary)', fontFamily: 'monospace', fontSize: '12px' }}>/{cat.slug}</span>
          <span style={{ color: 'var(--admin-text-secondary)', textAlign: 'right' }}>{cat.productCount} products</span>
        </div>
        {children.map((child) => renderCategory(child, depth + 1))}
      </div>
    );
  }

  return <div>{roots.map((r) => renderCategory(r, 0))}</div>;
}

export function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize your products into categories"
        actions={<a href="/admin/categories/new" className="admin-btn admin-btn--primary">Add category</a>}
      />
      <Card>
        <div style={{ borderBottom: '1px solid var(--admin-border-light)', padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 120px 80px', fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Name</span>
          <span>Slug</span>
          <span style={{ textAlign: 'right' }}>Products</span>
        </div>
        <CategoryTree />
      </Card>
    </>
  );
}

export function CategoryFormPage({ id }: { id?: string }) {
  const existing = id ? CATEGORIES.find((c) => c.id === id) : null;
  const title = existing ? `Edit ${existing.name}` : 'New Category';
  const roots = CATEGORIES.filter((c) => c.parentId === null);

  return (
    <>
      <Breadcrumb items={[
        { label: 'Categories', href: '/admin/categories' },
        { label: title },
      ]} />
      <Card title={title}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormGroup label="Name">
            <input className="admin-input" type="text" placeholder="e.g. Summer Dresses" defaultValue={existing?.name ?? ''} />
          </FormGroup>
          <FormGroup label="Slug" hint="Used in the URL for this category.">
            <input className="admin-input" type="text" placeholder="e.g. summer-dresses" defaultValue={existing?.slug ?? ''} />
          </FormGroup>
          <FormGroup label="Description">
            <textarea className="admin-input" rows={3} placeholder="Describe this category..." style={{ resize: 'vertical' }} />
          </FormGroup>
          <FormGroup label="Parent Category">
            <select className="admin-input" defaultValue={existing?.parentId ?? ''}>
              <option value="">None (top-level)</option>
              {roots.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label="Position" hint="Controls display order within its parent.">
            <input className="admin-input" type="number" min={1} defaultValue={existing?.position ?? 1} />
          </FormGroup>
          <div>
            <button type="button" className="admin-btn admin-btn--primary">Save category</button>
          </div>
        </div>
      </Card>
    </>
  );
}

export function CollectionsPage() {
  return (
    <>
      <PageHeader
        title="Collections"
        subtitle="Group products into curated collections"
        actions={<a href="/admin/collections/new" className="admin-btn admin-btn--primary">Create collection</a>}
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
            {COLLECTIONS.map((col) => (
              <tr key={col.id}>
                <td><a href={`/admin/collections/${col.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{col.title}</a></td>
                <td><Badge status={col.type === 'automated' ? 'active' : 'draft'} /></td>
                <td>{col.productCount}</td>
                <td>{col.publishedAt ? <Badge status="active" /> : <Badge status="draft" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CollectionFormPage({ id }: { id?: string }) {
  const existing = id ? COLLECTIONS.find((c) => c.id === id) : null;
  const title = existing ? `Edit ${existing.title}` : 'New Collection';
  const isAutomated = existing?.type === 'automated';

  return (
    <>
      <Breadcrumb items={[
        { label: 'Collections', href: '/admin/collections' },
        { label: title },
      ]} />
      <TwoCol
        left={
          <>
            <Card title="Collection Details">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup label="Title">
                  <input className="admin-input" type="text" placeholder="e.g. Summer Sale" defaultValue={existing?.title ?? ''} />
                </FormGroup>
                <FormGroup label="Description">
                  <textarea className="admin-input" rows={3} placeholder="Describe this collection..." style={{ resize: 'vertical' }} />
                </FormGroup>
                <FormGroup label="Type">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: `2px solid ${!isAutomated ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                        background: !isAutomated ? 'var(--admin-primary)' : 'transparent',
                      }} />
                      Manual
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: `2px solid ${isAutomated ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                        background: isAutomated ? 'var(--admin-primary)' : 'transparent',
                      }} />
                      Automated
                    </label>
                  </div>
                </FormGroup>
              </div>
            </Card>
            {isAutomated && (
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
            {!isAutomated && (
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
                <Badge status={existing?.publishedAt ? 'active' : 'draft'} />
                <span style={{ fontSize: '13px' }}>{existing?.publishedAt ? `Published ${existing.publishedAt}` : 'Not published'}</span>
              </div>
            </Card>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%' }}>
              Save collection
            </button>
          </>
        }
      />
    </>
  );
}
