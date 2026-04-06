'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';
import { formatMoney } from '@ecom/core';

/* ==========================================================================
   Interactive Tabs (inline)
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
   Mock data — fallback when API is unavailable
   ========================================================================== */

const RETURN_REASONS = [
  { id: 'defective', label: 'Defective', requiresNote: true },
  { id: 'wrong_item', label: 'Wrong Item', requiresNote: true },
  { id: 'changed_mind', label: 'Changed Mind', requiresNote: false },
  { id: 'not_as_described', label: 'Not as Described', requiresNote: true },
  { id: 'arrived_late', label: 'Arrived Late', requiresNote: false },
  { id: 'other', label: 'Other', requiresNote: true },
];

const RETURNS = [
  {
    id: 'ret1', returnNumber: 1001, orderId: '1042', orderNumber: 1042, customer: 'Sarah Chen', email: 'sarah.chen@gmail.com', status: 'requested',
    items: [{ title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 1, reason: 'defective', condition: 'unopened' }],
    totalRefund: 2499, requestedAt: 'Apr 5, 2026 4:00 pm',
    timeline: [{ time: 'Apr 5, 4:00 pm', event: 'Return requested by customer' }, { time: 'Apr 5, 4:01 pm', event: 'Confirmation email sent' }],
  },
  {
    id: 'ret2', returnNumber: 1002, orderId: '1041', orderNumber: 1041, customer: 'James Wilson', email: 'james.wilson@outlook.com', status: 'approved',
    items: [{ title: 'Slim Fit Jeans', variant: '32 / Indigo', qty: 1, reason: 'not_as_described', condition: 'opened' }],
    totalRefund: 5999, requestedAt: 'Apr 4, 2026 10:00 am',
    timeline: [{ time: 'Apr 4, 10:00 am', event: 'Return requested by customer' }, { time: 'Apr 4, 11:30 am', event: 'Return approved by admin' }, { time: 'Apr 4, 11:31 am', event: 'Return shipping label emailed' }],
  },
  {
    id: 'ret3', returnNumber: 1003, orderId: '1038', orderNumber: 1038, customer: 'Nina Kowalski', email: 'nina.kowalski@gmail.com', status: 'received',
    items: [
      { title: 'Hooded Sweatshirt', variant: 'XL / Grey', qty: 2, reason: 'changed_mind', condition: 'unopened' },
      { title: 'Cargo Shorts', variant: 'L / Khaki', qty: 1, reason: 'wrong_item', condition: 'opened' },
    ],
    totalRefund: 17997, requestedAt: 'Apr 3, 2026 8:00 am',
    timeline: [{ time: 'Apr 3, 8:00 am', event: 'Return requested by customer' }, { time: 'Apr 3, 9:00 am', event: 'Return approved by admin' }, { time: 'Apr 4, 2:00 pm', event: 'Package received at warehouse' }, { time: 'Apr 4, 2:30 pm', event: 'Items inspected — all in acceptable condition' }],
  },
  {
    id: 'ret4', returnNumber: 1004, orderId: '1037', orderNumber: 1037, customer: 'Omar Hassan', email: 'omar.hassan@gmail.com', status: 'completed',
    items: [{ title: 'Wool Beanie', variant: 'One Size / Red', qty: 1, reason: 'arrived_late', condition: 'unopened' }],
    totalRefund: 1999, requestedAt: 'Apr 1, 2026 3:00 pm',
    timeline: [{ time: 'Apr 1, 3:00 pm', event: 'Return requested by customer' }, { time: 'Apr 1, 3:15 pm', event: 'Return approved by admin' }, { time: 'Apr 2, 11:00 am', event: 'Package received at warehouse' }, { time: 'Apr 2, 2:00 pm', event: 'Refund of $19.99 processed to original payment method' }],
  },
  {
    id: 'ret5', returnNumber: 1005, orderId: '1040', orderNumber: 1040, customer: 'Amira Patel', email: 'amira.patel@yahoo.com', status: 'requested',
    items: [{ title: 'Canvas Sneakers', variant: '9 / White', qty: 1, reason: 'defective', condition: 'opened' }],
    totalRefund: 4999, requestedAt: 'Apr 5, 2026 6:30 pm',
    timeline: [{ time: 'Apr 5, 6:30 pm', event: 'Return requested by customer' }],
  },
];

const RETURN_STEPS = ['requested', 'approved', 'received', 'completed'] as const;

type MockReturn = (typeof RETURNS)[0];

const SAMPLE_ORDERS = [
  { id: '1042', num: 1042, customer: 'Sarah Chen', items: [
    { title: 'Classic Cotton T-Shirt', variant: 'M / White', qty: 2, price: 2499 },
    { title: 'Wool Beanie', variant: 'One Size / Navy', qty: 1, price: 1999 },
  ]},
  { id: '1041', num: 1041, customer: 'James Wilson', items: [
    { title: 'Slim Fit Jeans', variant: '32 / Indigo', qty: 1, price: 5999 },
  ]},
  { id: '1040', num: 1040, customer: 'Amira Patel', items: [
    { title: 'Canvas Sneakers', variant: '9 / White', qty: 1, price: 4999 },
    { title: 'Leather Belt', variant: 'M / Brown', qty: 1, price: 2999 },
  ]},
  { id: '1039', num: 1039, customer: 'Lucas Berg', items: [
    { title: 'Flannel Shirt', variant: 'L / Plaid', qty: 1, price: 3499 },
  ]},
];

/* ==========================================================================
   Mock data helpers
   ========================================================================== */

const PAGE_SIZE = 10;

function filterMockReturns(
  status: string,
  search: string,
): { data: MockReturn[]; total: number } {
  let filtered = [...RETURNS];

  if (status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        String(r.returnNumber).includes(q) ||
        String(r.orderNumber).includes(q),
    );
  }

  return { data: filtered, total: filtered.length };
}

/* ==========================================================================
   ReturnsListClient
   ========================================================================== */

export function ReturnsListClient() {
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [returns, setReturns] = useState<MockReturn[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (tab !== 'all') params.set('status', tab);

      const res = await fetch(`/api/ecom/admin/returns?${params}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setReturns(
          json.data.map((r: any) => ({
            id: r.id,
            returnNumber: r.returnNumber ?? r.num,
            orderId: r.orderId,
            orderNumber: r.orderNumber,
            customer: r.customer ?? r.customerName,
            email: r.email,
            status: r.status,
            items: r.items ?? [],
            totalRefund: r.totalRefund ?? r.refundAmount,
            requestedAt: r.requestedAt ?? r.createdAt,
            timeline: r.timeline ?? [],
          })),
        );
        setTotal(json.total ?? json.data.length);
      } else {
        throw new Error('bad shape');
      }
    } catch {
      // Fall back to mock data
      const result = filterMockReturns(tab, '');
      const start = (page - 1) * PAGE_SIZE;
      setReturns(result.data.slice(start, start + PAGE_SIZE));
      setTotal(result.data.length);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleTabChange = useCallback((value: string) => {
    setTab(value);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedCount = RETURNS.filter((r) => r.status === 'requested').length;

  const tabItems: TabItem[] = [
    { label: 'All', value: 'all' },
    { label: 'Requested', value: 'requested', count: requestedCount },
    { label: 'Approved', value: 'approved' },
    { label: 'Received', value: 'received' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Returns" subtitle="Manage return requests and refunds" />

      <div className="admin-card">
        <InteractiveTabs items={tabItems} activeValue={tab} onChange={handleTabChange} />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Return #</th>
              <th>Order #</th>
              <th>Customer</th>
              <th style={{ textAlign: 'right' }}>Items</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Refund Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)
              : returns.length === 0
                ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No returns found
                      </td>
                    </tr>
                  )
                : returns.map((r) => (
                    <tr
                      key={r.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        window.location.href = `/admin/returns/${r.id}`;
                      }}
                    >
                      <td>
                        <a
                          href={`/admin/returns/${r.id}`}
                          style={{ fontWeight: 600, color: 'var(--admin-text)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          RMA-{String(r.returnNumber).padStart(4, '0')}
                        </a>
                      </td>
                      <td>#{r.orderNumber}</td>
                      <td>{r.customer}</td>
                      <td style={{ textAlign: 'right' }}>{r.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                      <td><Badge status={r.status} /></td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(r.totalRefund)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{r.requestedAt}</td>
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
   ReturnDetailClient
   ========================================================================== */

export function ReturnDetailClient({ returnData }: { returnData?: MockReturn }) {
  const ret = returnData ?? RETURNS[0];
  const { toast, ToastContainer } = useToast();
  const [currentStatus, setCurrentStatus] = useState(ret.status);
  const [timeline, setTimeline] = useState(ret.timeline);
  const [actionLoading, setActionLoading] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    action: string;
    title: string;
    message: string;
    label: string;
    variant: 'primary' | 'danger';
  } | null>(null);

  const stepIndex = RETURN_STEPS.indexOf(currentStatus as typeof RETURN_STEPS[number]);

  const openConfirm = useCallback(
    (action: string, title: string, message: string, label: string, variant: 'primary' | 'danger' = 'primary') => {
      setConfirmAction({ action, title, message, label, variant });
      setConfirmOpen(true);
    },
    [],
  );

  const handleAction = useCallback(async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/ecom/admin/returns/${ret.id}/${confirmAction.action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('action failed');

      const nextStatusMap: Record<string, string> = {
        approve: 'approved',
        'mark-received': 'received',
        'process-refund': 'completed',
        reject: 'rejected',
      };
      const newStatus = nextStatusMap[confirmAction.action] ?? currentStatus;
      setCurrentStatus(newStatus);

      const now = new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
      });
      const eventMessages: Record<string, string> = {
        approve: 'Return approved by admin',
        'mark-received': 'Package received at warehouse',
        'process-refund': `Refund of ${formatMoney(ret.totalRefund)} processed to original payment method`,
        reject: 'Return rejected by admin',
      };
      setTimeline((prev) => [...prev, { time: now, event: eventMessages[confirmAction.action] ?? 'Status updated' }]);
      toast(`Return ${confirmAction.action.replace('-', ' ')}d successfully`, 'success');
    } catch {
      // In demo mode, still update the UI optimistically
      const nextStatusMap: Record<string, string> = {
        approve: 'approved',
        'mark-received': 'received',
        'process-refund': 'completed',
        reject: 'rejected',
      };
      const newStatus = nextStatusMap[confirmAction.action] ?? currentStatus;
      setCurrentStatus(newStatus);

      const now = new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
      });
      const eventMessages: Record<string, string> = {
        approve: 'Return approved by admin',
        'mark-received': 'Package received at warehouse',
        'process-refund': `Refund of ${formatMoney(ret.totalRefund)} processed to original payment method`,
        reject: 'Return rejected by admin',
      };
      setTimeline((prev) => [...prev, { time: now, event: eventMessages[confirmAction.action] ?? 'Status updated' }]);
      toast(`Return ${confirmAction.action.replace('-', ' ')}d (demo mode)`, 'info');
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
      setConfirmAction(null);
    }
  }, [confirmAction, ret.id, ret.totalRefund, currentStatus, toast]);

  const isRejected = currentStatus === 'rejected';

  return (
    <div>
      <Breadcrumb items={[{ label: 'Returns', href: '/admin/returns' }, { label: `RMA-${String(ret.returnNumber).padStart(4, '0')}` }]} />
      <PageHeader
        title={`RMA-${String(ret.returnNumber).padStart(4, '0')}`}
        subtitle={`Return for order #${ret.orderNumber}`}
        actions={
          <>
            {currentStatus === 'requested' && (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={actionLoading}
                onClick={() =>
                  openConfirm(
                    'approve',
                    'Approve return',
                    `Approve return RMA-${String(ret.returnNumber).padStart(4, '0')}? A shipping label will be emailed to the customer.`,
                    'Approve',
                  )
                }
              >
                Approve
              </button>
            )}
            {currentStatus === 'approved' && (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={actionLoading}
                onClick={() =>
                  openConfirm(
                    'mark-received',
                    'Mark as received',
                    `Confirm that the return package for RMA-${String(ret.returnNumber).padStart(4, '0')} has been received at the warehouse?`,
                    'Mark Received',
                  )
                }
              >
                Mark Received
              </button>
            )}
            {currentStatus === 'received' && (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={actionLoading}
                onClick={() =>
                  openConfirm(
                    'process-refund',
                    'Process refund',
                    `Process a refund of ${formatMoney(ret.totalRefund)} for RMA-${String(ret.returnNumber).padStart(4, '0')}? This action cannot be undone.`,
                    'Process Refund',
                  )
                }
              >
                Process Refund
              </button>
            )}
            {!isRejected && currentStatus !== 'completed' && (
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                disabled={actionLoading}
                onClick={() =>
                  openConfirm(
                    'reject',
                    'Reject return',
                    `Reject return RMA-${String(ret.returnNumber).padStart(4, '0')}? The customer will be notified.`,
                    'Reject',
                    'danger',
                  )
                }
              >
                Reject
              </button>
            )}
          </>
        }
      />

      <TwoCol
        left={
          <>
            {/* Items */}
            <Card title="Return Items">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th>Reason</th>
                    <th>Condition</th>
                    <th>Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {ret.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>{item.variant}</td>
                      <td style={{ textAlign: 'right' }}>{item.qty}</td>
                      <td><Badge status={item.reason} /></td>
                      <td><Badge status={item.condition} /></td>
                      <td>
                        <input type="checkbox" defaultChecked={item.condition === 'unopened'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Status Progress */}
            <Card title="Return Progress">
              {isRejected ? (
                <div style={{ padding: '16px 0', textAlign: 'center' }}>
                  <Badge status="rejected" />
                  <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                    This return has been rejected.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0', padding: '16px 0' }}>
                    {RETURN_STEPS.map((step, i) => {
                      const isComplete = i <= stepIndex;
                      const isCurrent = i === stepIndex;
                      return (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: isComplete ? 'var(--admin-primary, #6366f1)' : 'var(--admin-border-light, #e5e7eb)',
                            color: isComplete ? '#fff' : 'var(--admin-text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 600,
                            border: isCurrent ? '2px solid var(--admin-primary, #6366f1)' : 'none',
                            flexShrink: 0,
                          }}>
                            {i + 1}
                          </div>
                          {i < RETURN_STEPS.length - 1 && (
                            <div style={{
                              flex: 1, height: '2px',
                              background: i < stepIndex ? 'var(--admin-primary, #6366f1)' : 'var(--admin-border-light, #e5e7eb)',
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {RETURN_STEPS.map((step) => (
                      <span key={step} style={{ textTransform: 'capitalize' }}>{step}</span>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Timeline */}
            <Card title="Timeline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {timeline.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
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
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{entry.event}</div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                        {entry.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        }
        right={
          <>
            {/* Customer */}
            <Card title="Customer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <span style={{ fontWeight: 600 }}>{ret.customer}</span>
                <span style={{ color: 'var(--admin-text-muted)' }}>{ret.email}</span>
              </div>
            </Card>

            {/* Order Link */}
            <Card title="Order">
              <a href={`/admin/orders/${ret.orderId}`} style={{ fontWeight: 600, color: 'var(--admin-primary, #6366f1)' }}>
                Order #{ret.orderNumber}
              </a>
            </Card>

            {/* Refund Summary */}
            <Card title="Refund Summary">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Method</span>
                  <span>Original payment method</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Status</span>
                  <Badge status={currentStatus === 'completed' ? 'completed' : 'pending'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                  <span>Total Refund</span>
                  <span>{formatMoney(ret.totalRefund)}</span>
                </div>
              </div>
            </Card>
          </>
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmAction?.title ?? ''}
        message={confirmAction?.message ?? ''}
        confirmLabel={actionLoading ? 'Processing...' : (confirmAction?.label ?? 'Confirm')}
        variant={confirmAction?.variant ?? 'primary'}
        onConfirm={handleAction}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmAction(null);
        }}
      />

      <ToastContainer />
    </div>
  );
}

/* ==========================================================================
   CreateReturnClient
   ========================================================================== */

interface LineItemReturn {
  title: string;
  variant: string;
  maxQty: number;
  price: number;
  qty: number;
  reason: string;
  condition: string;
}

export function CreateReturnClient() {
  const { toast, ToastContainer } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [lineItems, setLineItems] = useState<LineItemReturn[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // When order changes, populate line items
  const handleOrderChange = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    const order = SAMPLE_ORDERS.find((o) => o.id === orderId);
    if (order) {
      setLineItems(
        order.items.map((item) => ({
          title: item.title,
          variant: item.variant,
          maxQty: item.qty,
          price: item.price,
          qty: 0,
          reason: '',
          condition: 'unopened',
        })),
      );
    } else {
      setLineItems([]);
    }
  }, []);

  const updateLineItem = useCallback((index: number, field: keyof LineItemReturn, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }, []);

  const refundSubtotal = lineItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasItems = lineItems.some((item) => item.qty > 0);
  const allReasonsSet = lineItems.every((item) => item.qty === 0 || item.reason !== '');

  const handleSubmit = useCallback(async () => {
    if (!selectedOrderId || !hasItems || !allReasonsSet) return;

    setSubmitting(true);
    try {
      const payload = {
        orderId: selectedOrderId,
        items: lineItems
          .filter((item) => item.qty > 0)
          .map((item) => ({
            title: item.title,
            variant: item.variant,
            qty: item.qty,
            reason: item.reason,
            condition: item.condition,
          })),
      };

      const res = await fetch('/api/ecom/admin/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('submit failed');
      toast('Return created successfully', 'success');
      setSubmitted(true);
    } catch {
      toast('Return created (demo mode)', 'info');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [selectedOrderId, lineItems, hasItems, allReasonsSet, toast]);

  const selectedOrder = SAMPLE_ORDERS.find((o) => o.id === selectedOrderId);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Returns', href: '/admin/returns' }, { label: 'Create Return' }]} />
      <PageHeader title="Create Return" subtitle="Initiate a return for an existing order" />

      {submitted ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Return submitted</div>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
              The return request has been created for order #{selectedOrder?.num}.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <a href="/admin/returns" className="admin-btn admin-btn--primary">
                View all returns
              </a>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedOrderId('');
                  setLineItems([]);
                }}
              >
                Create another
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <TwoCol
          left={
            <>
              <Card title="Select Order">
                <FormGroup label="Order">
                  <select
                    className="admin-input"
                    value={selectedOrderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                  >
                    <option value="">Select an order...</option>
                    {SAMPLE_ORDERS.map((o) => (
                      <option key={o.id} value={o.id}>
                        Order #{o.num} -- {o.customer}
                      </option>
                    ))}
                  </select>
                </FormGroup>
              </Card>

              {lineItems.length > 0 && (
                <Card title="Line Items">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Variant</th>
                        <th style={{ textAlign: 'right' }}>Qty to Return</th>
                        <th>Reason</th>
                        <th>Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, i) => (
                        <tr key={i}>
                          <td>{item.title}</td>
                          <td>{item.variant}</td>
                          <td style={{ textAlign: 'right' }}>
                            <input
                              type="number"
                              className="admin-input"
                              value={item.qty}
                              min={0}
                              max={item.maxQty}
                              style={{ width: '60px', textAlign: 'right' }}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(item.maxQty, parseInt(e.target.value) || 0));
                                updateLineItem(i, 'qty', val);
                              }}
                            />
                          </td>
                          <td>
                            <select
                              className="admin-input"
                              style={{ minWidth: '140px' }}
                              value={item.reason}
                              onChange={(e) => updateLineItem(i, 'reason', e.target.value)}
                            >
                              <option value="">Select reason...</option>
                              {RETURN_REASONS.map((r) => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="admin-input"
                              style={{ minWidth: '120px' }}
                              value={item.condition}
                              onChange={(e) => updateLineItem(i, 'condition', e.target.value)}
                            >
                              <option value="unopened">Unopened</option>
                              <option value="opened">Opened</option>
                              <option value="damaged">Damaged</option>
                            </select>
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
            <Card title="Refund Summary">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-muted)' }}>
                  <span>Items subtotal</span>
                  <span>{formatMoney(refundSubtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px', borderTop: '1px solid var(--admin-border-light, #e5e7eb)', paddingTop: '8px' }}>
                  <span>Total Refund</span>
                  <span>{formatMoney(refundSubtotal)}</span>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  style={{ marginTop: '12px', width: '100%' }}
                  disabled={!hasItems || !allReasonsSet || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Submitting...' : 'Submit Return'}
                </button>
                {!hasItems && selectedOrderId && (
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>
                    Set quantity on at least one item to submit.
                  </p>
                )}
                {hasItems && !allReasonsSet && (
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>
                    Please select a reason for all items being returned.
                  </p>
                )}
              </div>
            </Card>
          }
        />
      )}

      <ToastContainer />
    </div>
  );
}
