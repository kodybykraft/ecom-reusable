'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatMoney } from '@ecom/core';
import { Badge, Card, FormGroup, PageHeader, TwoCol } from './_shared';
import { ORDERS } from './_data';

/* ==========================================================================
   Interactive Tabs (inline — avoids cross-package import issues)
   ========================================================================== */

interface TabItem {
  label: string;
  value: string;
  count?: number;
}

function InteractiveTabs({
  items,
  activeValue,
  onChange,
}: {
  items: TabItem[];
  activeValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="admin-tabs">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`admin-tab${activeValue === item.value ? ' admin-tab--active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.count !== undefined && <span className="admin-tab-count"> ({item.count})</span>}
        </button>
      ))}
    </div>
  );
}

/* ==========================================================================
   Searchable Toolbar (inline)
   ========================================================================== */

function SearchableToolbar({
  onSearch,
  placeholder,
}: {
  onSearch: (term: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  const timeoutRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setValue(term);
      if (timeoutRef[0]) clearTimeout(timeoutRef[0]);
      const timer = setTimeout(() => onSearch(term), 300);
      timeoutRef[0] = timer;
    },
    [onSearch, timeoutRef],
  );

  return (
    <div className="admin-toolbar">
      <input
        type="text"
        className="admin-search"
        placeholder={placeholder ?? 'Search...'}
        value={value}
        onChange={handleChange}
      />
      <button type="button" className="admin-filter-btn">
        Filter
      </button>
      <button type="button" className="admin-filter-btn">
        Sort
      </button>
    </div>
  );
}

/* ==========================================================================
   Paginated Table Controls (inline)
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
   Confirm Dialog (inline)
   ========================================================================== */

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'primary',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.4)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onCancel}
    >
      <div
        className="admin-card"
        style={{ minWidth: 360, maxWidth: 480, padding: '1.5rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 0.5rem' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem', opacity: 0.8 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="admin-btn admin-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`admin-btn ${variant === 'danger' ? 'admin-btn--critical' : 'admin-btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Toast (inline — minimal, no context needed since these are leaf components)
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
   Types
   ========================================================================== */

type MockOrder = (typeof ORDERS)[0];

interface OrderListItem {
  id: string;
  num: number;
  date: string;
  customer: string;
  total: number;
  payment: string;
  fulfillment: string;
}

/* ==========================================================================
   Mock data helpers
   ========================================================================== */

const PAGE_SIZE = 10;

function filterMockOrders(
  status: string,
  search: string,
): { data: OrderListItem[]; total: number } {
  let filtered: MockOrder[] = [...ORDERS];

  if (status === 'unfulfilled') {
    filtered = filtered.filter((o) => o.fulfillment === 'unfulfilled');
  } else if (status === 'unpaid') {
    filtered = filtered.filter((o) => o.payment === 'pending' || o.payment === 'unpaid');
  } else if (status === 'completed') {
    filtered = filtered.filter(
      (o) => o.fulfillment === 'fulfilled' && o.payment === 'paid',
    );
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        String(o.num).includes(q) ||
        o.id.includes(q),
    );
  }

  return {
    data: filtered.map((o) => ({
      id: o.id,
      num: o.num,
      date: o.date,
      customer: o.customer,
      total: o.total,
      payment: o.payment,
      fulfillment: o.fulfillment,
    })),
    total: filtered.length,
  };
}

/* ==========================================================================
   OrdersListClient
   ========================================================================== */

export function OrdersListClient() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (tab !== 'all') params.set('status', tab);
      if (search) params.set('search', search);

      const res = await fetch(`/api/ecom/admin/orders?${params}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setOrders(
          json.data.map((o: any) => ({
            id: o.id,
            num: o.num ?? o.orderNumber,
            date: o.date ?? o.createdAt,
            customer: o.customer ?? o.customerName,
            total: o.total,
            payment: o.payment ?? o.paymentStatus,
            fulfillment: o.fulfillment ?? o.fulfillmentStatus,
          })),
        );
        setTotal(json.total ?? json.data.length);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      // Fall back to mock data
      const result = filterMockOrders(tab, search);
      const start = (page - 1) * PAGE_SIZE;
      setOrders(result.data.slice(start, start + PAGE_SIZE));
      setTotal(result.data.length);
    } finally {
      setLoading(false);
    }
  }, [tab, search, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page when tab or search changes
  const handleTabChange = useCallback((value: string) => {
    setTab(value);
    setPage(1);
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const unfulfilledCount = ORDERS.filter((o) => o.fulfillment === 'unfulfilled').length;

  const tabItems: TabItem[] = [
    { label: 'All', value: 'all' },
    { label: 'Unfulfilled', value: 'unfulfilled', count: unfulfilledCount },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Orders" />
      <div className="admin-card">
        <InteractiveTabs items={tabItems} activeValue={tab} onChange={handleTabChange} />
        <SearchableToolbar onSearch={handleSearch} placeholder="Search orders..." />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Payment</th>
              <th>Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
              : orders.length === 0
                ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No orders found
                      </td>
                    </tr>
                  )
                : orders.map((o) => (
                    <tr
                      key={o.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        window.location.href = `/admin/orders/${o.id}`;
                      }}
                    >
                      <td>
                        <a
                          href={`/admin/orders/${o.id}`}
                          style={{ fontWeight: 500, color: 'var(--admin-text)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          #{o.num}
                        </a>
                      </td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{o.date}</td>
                      <td>{o.customer}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td>
                      <td>
                        <Badge status={o.payment} />
                      </td>
                      <td>
                        <Badge status={o.fulfillment} />
                      </td>
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
   OrderDetailClient
   ========================================================================== */

const CARRIERS = ['Royal Mail', 'Evri', 'DPD', 'DHL', 'UPS', 'Other'];

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const { toast, ToastContainer } = useToast();
  const [o, setO] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [fulfillOpen, setFulfillOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [fulfilling, setFulfilling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fulfill form
  const [carrier, setCarrier] = useState('Royal Mail');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  // Refund form
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ecom/admin/orders/${orderId}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled) setO((data.data ?? data) as MockOrder);
      } catch {
        if (!cancelled) {
          const fallback = ORDERS.find((x) => x.id === orderId || String(x.num) === orderId);
          setO(fallback ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleFulfill = useCallback(async () => {
    if (!o) return;
    setFulfilling(true);
    try {
      const res = await fetch(`/api/ecom/admin/orders/${o.id}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrier, trackingNumber, trackingUrl }),
      });
      if (!res.ok) throw new Error('fulfill failed');
      toast('Order fulfilled successfully', 'success');
      setFulfillOpen(false);
    } catch {
      toast('Could not fulfill order', 'error');
    } finally {
      setFulfilling(false);
    }
  }, [o, carrier, trackingNumber, trackingUrl, toast]);

  const handleRefund = useCallback(async () => {
    if (!o) return;
    setRefunding(true);
    try {
      const body: Record<string, unknown> = {};
      if (refundType === 'partial' && refundAmount) {
        body.amount = Math.round(parseFloat(refundAmount) * 100);
      }
      const res = await fetch(`/api/ecom/admin/orders/${o.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('refund failed');
      toast('Refund processed successfully', 'success');
      setRefundOpen(false);
    } catch {
      toast('Could not process refund', 'error');
    } finally {
      setRefunding(false);
    }
  }, [o, refundType, refundAmount, toast]);

  const handleCancel = useCallback(async () => {
    if (!o) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/ecom/admin/orders/${o.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('cancel failed');
      toast('Order cancelled', 'success');
      setCancelOpen(false);
    } catch {
      toast('Could not cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  }, [o, toast]);

  if (loading) return <div className="admin-empty"><div className="admin-empty-title">Loading...</div></div>;
  if (!o) return <div className="admin-empty"><div className="admin-empty-title">Order not found</div><a href="/admin/orders" className="admin-btn admin-btn--primary">Back to Orders</a></div>;

  return (
    <div>
      <PageHeader
        title={`#${o.num}`}
        breadcrumbs={[{ label: 'Orders', href: '/admin/orders' }, { label: `#${o.num}` }]}
        actions={
          <>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => setFulfillOpen(true)}
              disabled={fulfilling || o.fulfillment === 'fulfilled'}
            >
              {fulfilling ? 'Fulfilling...' : 'Fulfill items'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => setRefundOpen(true)}
              disabled={refunding || o.payment === 'refunded'}
            >
              {refunding ? 'Refunding...' : 'Refund'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => setCancelOpen(true)}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel order'}
            </button>
          </>
        }
      />

      <TwoCol
        left={
          <>
            <Card
              title={
                o.fulfillment === 'unfulfilled'
                  ? 'Unfulfilled'
                  : o.fulfillment === 'fulfilled'
                    ? 'Fulfilled'
                    : 'Partially fulfilled'
              }
            >
              <table className="admin-table">
                <tbody>
                  {o.items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                          {item.variant}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {formatMoney(item.price)} x {item.qty}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>
                        {formatMoney(item.price * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  borderTop: '1px solid var(--admin-border)',
                  padding: '12px 0 0',
                  marginTop: '8px',
                  fontSize: '13px',
                }}
              >
                {(
                  [
                    ['Subtotal', o.subtotal],
                    ['Shipping', o.shipping],
                    ['Tax', o.tax],
                  ] as [string, number][]
                ).map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '3px 0',
                    }}
                  >
                    <span style={{ color: 'var(--admin-text-secondary)' }}>{l}</span>
                    <span>{formatMoney(v)}</span>
                  </div>
                ))}
                {o.discount > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '3px 0',
                      color: 'var(--admin-success)',
                    }}
                  >
                    <span>Discount</span>
                    <span>-{formatMoney(o.discount)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: '14px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--admin-border)',
                    marginTop: '4px',
                  }}
                >
                  <span>Total</span>
                  <span>{formatMoney(o.total)}</span>
                </div>
              </div>
            </Card>
            <Card title="Timeline">
              {o.timeline.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom:
                      i < o.timeline.length - 1
                        ? '1px solid var(--admin-border-light)'
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--admin-primary)',
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{t.event}</div>
                    {t.detail && (
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                        {t.detail}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--admin-text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {t.time}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </>
        }
        right={
          <>
            <Card title="Customer">
              <div style={{ fontSize: '13px' }}>
                <div style={{ fontWeight: 500 }}>{o.customer}</div>
                <div style={{ color: 'var(--admin-text-secondary)' }}>{o.email}</div>
              </div>
            </Card>
            <Card title="Shipping address">
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                {o.address.name}
                <br />
                {o.address.line1}
                <br />
                {o.address.city}, {o.address.state} {o.address.zip}
              </div>
            </Card>
            <Card title="Notes">
              <textarea
                className="admin-input"
                rows={3}
                placeholder="Add a note..."
                style={{ resize: 'vertical' }}
              />
            </Card>
          </>
        }
      />

      {/* Fulfill dialog (form) */}
      {fulfillOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setFulfillOpen(false)}
        >
          <div className="admin-card" style={{ minWidth: 420, maxWidth: 520, padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Fulfill order #{o.num}</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Add tracking details so the customer can follow their package.</p>

            <FormGroup label="Carrier">
              <select className="admin-input" value={carrier} onChange={(e) => setCarrier(e.target.value)} aria-label="Carrier">
                {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Tracking number">
              <input className="admin-input" type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. AB123456789GB" />
            </FormGroup>
            <FormGroup label="Tracking URL (optional)">
              <input className="admin-input" type="url" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="https://..." />
            </FormGroup>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="admin-btn" onClick={() => setFulfillOpen(false)} disabled={fulfilling}>Cancel</button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={handleFulfill} disabled={fulfilling}>
                {fulfilling ? 'Fulfilling...' : 'Mark as fulfilled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund dialog (full / partial) */}
      {refundOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setRefundOpen(false)}
        >
          <div className="admin-card" style={{ minWidth: 420, maxWidth: 520, padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Refund order #{o.num}</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Order total: {formatMoney(o.total)}</p>

            <FormGroup label="Refund type">
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input type="radio" name="refundType" checked={refundType === 'full'} onChange={() => setRefundType('full')} />
                  Full refund ({formatMoney(o.total)})
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input type="radio" name="refundType" checked={refundType === 'partial'} onChange={() => setRefundType('partial')} />
                  Partial amount
                </label>
              </div>
            </FormGroup>

            {refundType === 'partial' && (
              <FormGroup label="Amount (£)">
                <input
                  className="admin-input"
                  type="number"
                  step="0.01"
                  min="0"
                  max={(o.total / 100).toFixed(2)}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="0.00"
                />
              </FormGroup>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="admin-btn" onClick={() => setRefundOpen(false)} disabled={refunding}>Cancel</button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={handleRefund}
                disabled={refunding || (refundType === 'partial' && !refundAmount)}
              >
                {refunding ? 'Processing...' : 'Process refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel order"
        message={`Cancel order #${o.num}? The customer will be notified and the order will be marked as cancelled. This does not refund payment — use the Refund action separately.`}
        confirmLabel={cancelling ? 'Cancelling...' : 'Cancel order'}
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}
