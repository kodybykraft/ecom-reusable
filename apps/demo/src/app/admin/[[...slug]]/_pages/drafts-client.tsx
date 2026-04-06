'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol, formatMoney } from './_shared';

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
   Pagination Controls
   ========================================================================== */

function PaginationControls({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="admin-pagination">
      <span>
        Showing {start}-{end} of {total}
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   Types & Mock Data
   ========================================================================== */

interface DraftLineItem {
  title: string;
  variant: string;
  qty: number;
  price: number;
}

interface DraftOrder {
  id: string;
  draftNumber: string;
  customer: string;
  email: string;
  status: 'open' | 'invoice_sent' | 'completed';
  items: DraftLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  createdAt: string;
  createdBy: string;
}

const MOCK_DRAFTS: DraftOrder[] = [
  {
    id: 'dr1', draftNumber: 'D-001', customer: 'Sarah Chen', email: 'sarah.chen@gmail.com', status: 'open',
    items: [
      { title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 3, price: 2499 },
      { title: 'Wool Beanie', variant: 'One Size / Navy', qty: 1, price: 1999 },
    ],
    subtotal: 9496, discount: 950, total: 8546,
    notes: 'Customer requested bulk pricing for company uniforms.',
    createdAt: 'Apr 5, 2026 10:00 am', createdBy: 'Admin',
  },
  {
    id: 'dr2', draftNumber: 'D-002', customer: 'James Wilson', email: 'james.wilson@outlook.com', status: 'invoice_sent',
    items: [
      { title: 'Slim Fit Jeans', variant: '32 / Indigo', qty: 2, price: 5999 },
    ],
    subtotal: 11998, discount: 0, total: 11998,
    notes: '',
    createdAt: 'Apr 4, 2026 3:30 pm', createdBy: 'Admin',
  },
  {
    id: 'dr3', draftNumber: 'D-003', customer: 'Amira Patel', email: 'amira.patel@yahoo.com', status: 'completed',
    items: [
      { title: 'Leather Belt', variant: 'M / Brown', qty: 1, price: 3499 },
      { title: 'Canvas Sneakers', variant: '9 / White', qty: 1, price: 4999 },
      { title: 'Hooded Sweatshirt', variant: 'L / Black', qty: 1, price: 6999 },
    ],
    subtotal: 15497, discount: 1550, total: 13947,
    notes: 'Phone order — customer called in.',
    createdAt: 'Apr 3, 2026 11:15 am', createdBy: 'Admin',
  },
  {
    id: 'dr4', draftNumber: 'D-004', customer: 'Nina Kowalski', email: 'nina.kowalski@gmail.com', status: 'open',
    items: [
      { title: 'Running Shoes', variant: '10 / Black', qty: 1, price: 8999 },
    ],
    subtotal: 8999, discount: 0, total: 8999,
    notes: 'Waiting for customer to confirm size.',
    createdAt: 'Apr 5, 2026 1:45 pm', createdBy: 'Admin',
  },
];

const PAGE_SIZE = 10;

/* ==========================================================================
   DraftOrdersListClient
   ========================================================================== */

export function DraftOrdersListClient() {
  const [page, setPage] = useState(1);
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));

      const res = await fetch(`/api/ecom/admin/drafts?${params}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setDrafts(json.data);
        setTotal(json.total ?? json.data.length);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      // Fall back to mock data
      const start = (page - 1) * PAGE_SIZE;
      setDrafts(MOCK_DRAFTS.slice(start, start + PAGE_SIZE));
      setTotal(MOCK_DRAFTS.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader
        title="Draft Orders"
        subtitle="Orders created on behalf of customers"
        actions={
          <a href="/admin/drafts/new" className="admin-btn admin-btn--primary">
            Create order
          </a>
        }
      />

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Draft #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />)
              : drafts.length === 0
                ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No draft orders found
                      </td>
                    </tr>
                  )
                : drafts.map((d) => (
                    <tr
                      key={d.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        window.location.href = `/admin/drafts/${d.id}`;
                      }}
                    >
                      <td>
                        <a
                          href={`/admin/drafts/${d.id}`}
                          style={{ fontWeight: 600, color: 'var(--admin-text)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {d.draftNumber}
                        </a>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--admin-text-secondary)' }}>{d.createdAt}</td>
                      <td>{d.customer}</td>
                      <td><Badge status={d.status} /></td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(d.total)}</td>
                    </tr>
                  ))}
          </tbody>
        </table>

        {!loading && total > 0 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   DraftOrderFormClient
   ========================================================================== */

interface LineItemRow {
  key: number;
  title: string;
  variant: string;
  qty: number;
  price: number;
}

let lineItemKey = 0;

function toLineItemRows(items: DraftLineItem[]): LineItemRow[] {
  return items.map((item) => ({
    key: ++lineItemKey,
    title: item.title,
    variant: item.variant,
    qty: item.qty,
    price: item.price,
  }));
}

export function DraftOrderFormClient({ draft }: { draft: DraftOrder | null }) {
  const isEdit = !!draft;
  const { toast, ToastContainer } = useToast();

  const [lineItems, setLineItems] = useState<LineItemRow[]>(
    draft ? toLineItemRows(draft.items) : [],
  );
  const [customerEmail, setCustomerEmail] = useState(draft?.email ?? '');
  const [customerName, setCustomerName] = useState(draft?.customer ?? '');
  const [notes, setNotes] = useState(draft?.notes ?? '');
  const [productSearch, setProductSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  const addLineItem = useCallback(() => {
    setLineItems((prev) => [
      ...prev,
      { key: ++lineItemKey, title: '', variant: '', qty: 1, price: 0 },
    ]);
  }, []);

  const removeLineItem = useCallback((key: number) => {
    setLineItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateLineItem = useCallback((key: number, field: keyof LineItemRow, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    );
  }, []);

  const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal; // discount could be added later

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const body = {
        customer: customerName,
        email: customerEmail,
        notes,
        items: lineItems.map((li) => ({
          title: li.title,
          variant: li.variant,
          qty: li.qty,
          price: li.price,
        })),
      };

      const url = isEdit
        ? `/api/ecom/admin/drafts/${draft!.id}`
        : '/api/ecom/admin/drafts';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('save failed');
      toast('Draft order saved successfully', 'success');
    } catch {
      toast('Could not save draft order (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [isEdit, draft, customerName, customerEmail, notes, lineItems, toast]);

  const handleConvert = useCallback(async () => {
    if (!draft) return;
    setConverting(true);
    try {
      const res = await fetch(`/api/ecom/admin/drafts/${draft.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('convert failed');
      toast('Draft converted to order successfully', 'success');
    } catch {
      toast('Could not convert draft to order (demo mode)', 'error');
    } finally {
      setConverting(false);
    }
  }, [draft, toast]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Drafts', href: '/admin/drafts' }, { label: isEdit ? draft!.draftNumber : 'New draft' }]} />
      <PageHeader title={isEdit ? draft!.draftNumber : 'New Draft Order'} />

      <TwoCol
        left={
          <>
            {/* Products */}
            <Card title="Products">
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Search products..."
                  style={{ width: '100%' }}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.key}>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          value={item.title}
                          onChange={(e) => updateLineItem(item.key, 'title', e.target.value)}
                          placeholder="Product name"
                          style={{ width: '100%', minWidth: '120px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          value={item.variant}
                          onChange={(e) => updateLineItem(item.key, 'variant', e.target.value)}
                          placeholder="Variant"
                          style={{ width: '100%', minWidth: '80px' }}
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <input
                          type="number"
                          className="admin-input"
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.key, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                          min={1}
                          style={{ width: '60px', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <input
                          type="number"
                          className="admin-input"
                          value={item.price}
                          onChange={(e) => updateLineItem(item.key, 'price', Math.max(0, parseInt(e.target.value) || 0))}
                          min={0}
                          style={{ width: '80px', textAlign: 'right' }}
                          placeholder="cents"
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(item.price * item.qty)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="admin-btn"
                          style={{ padding: '2px 8px', fontSize: '12px' }}
                          onClick={() => removeLineItem(item.key)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                        Search and add products above
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ marginTop: '8px' }}>
                <button type="button" className="admin-btn" onClick={addLineItem} style={{ fontSize: '13px' }}>
                  + Add line item
                </button>
              </div>
            </Card>

            {/* Payment */}
            <Card title="Payment">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes">
              <textarea
                className="admin-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note to this order..."
              />
            </Card>
          </>
        }
        right={
          <>
            {/* Customer */}
            <Card title="Customer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormGroup label="Customer Name">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Customer name"
                    style={{ width: '100%' }}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Email">
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="customer@email.com"
                    style={{ width: '100%' }}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </FormGroup>
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                style={{ width: '100%' }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              {isEdit && draft!.status === 'open' && (
                <button
                  type="button"
                  className="admin-btn"
                  style={{ width: '100%' }}
                  onClick={handleConvert}
                  disabled={converting}
                >
                  {converting ? 'Converting...' : 'Convert to Order'}
                </button>
              )}
            </div>
          </>
        }
      />

      <ToastContainer />
    </div>
  );
}
