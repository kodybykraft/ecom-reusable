'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatMoney } from '@ecom/core';
import { Badge, TwoCol, Card, FormGroup, PageHeader } from './_shared';
import { DISCOUNTS } from './_data';

/* ==========================================================================
   Skeleton / Loading States
   ========================================================================== */

function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>{Array.from({ length: cols }, (_, i) => <th key={i}><div style={{ width: '60%', height: 14, background: 'var(--admin-border-light)', borderRadius: 4 }} /></th>)}</tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }, (_, c) => (
              <td key={c}><div style={{ width: `${50 + Math.random() * 40}%`, height: 14, background: 'var(--admin-border-light)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ==========================================================================
   Interactive Tabs
   ========================================================================== */

function InteractiveTabs({ items, active, onChange }: { items: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="admin-tabs">
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`admin-tab${i === active ? ' admin-tab--active' : ''}`}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ==========================================================================
   Paginated Table Footer
   ========================================================================== */

function PaginatedTable({ total, page, pageSize, onPageChange }: { total: number; page: number; pageSize: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="admin-pagination">
      <span>Showing {total > 0 ? start : 0}-{end} of {total}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button type="button" className="admin-pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <button type="button" className="admin-pagination-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}

/* ==========================================================================
   Toast notification
   ========================================================================== */

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      padding: '12px 20px', borderRadius: 8,
      background: type === 'success' ? '#2ecc71' : '#e74c3c',
      color: '#fff', fontSize: '14px', fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {message}
    </div>
  );
}

/* ==========================================================================
   DiscountsListClient
   ========================================================================== */

type DiscountRow = typeof DISCOUNTS[0];

const TAB_LABELS = ['All', 'Active', 'Expired'];

export function DiscountsListClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [discounts, setDiscounts] = useState<DiscountRow[]>(DISCOUNTS);
  const [total, setTotal] = useState(DISCOUNTS.length);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const fetchDiscounts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('pageSize', String(pageSize));
      const res = await fetch(`/api/ecom/admin/discounts?${params}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setDiscounts(data.discounts ?? data.data ?? data);
      setTotal(data.total ?? (data.discounts ?? data.data ?? data).length);
    } catch {
      // Fall back to mock data
      setDiscounts(DISCOUNTS);
      setTotal(DISCOUNTS.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts(page);
  }, [page, fetchDiscounts]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Filter by tab client-side
  const filtered = activeTab === 0
    ? discounts
    : activeTab === 1
      ? discounts.filter(d => d.active)
      : discounts.filter(d => !d.active);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader title="Discounts" actions={<a href="/admin/discounts/new" className="admin-btn admin-btn--primary">Create discount</a>} />
      <div className="admin-card">
        <InteractiveTabs items={TAB_LABELS} active={activeTab} onChange={setActiveTab} />
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px 0' }}>No discounts found</td></tr>
              ) : (
                paged.map(d => (
                  <tr key={d.id}>
                    <td><code style={{ fontWeight: 600, background: 'var(--admin-border-light)', padding: '2px 6px', borderRadius: '4px' }}>{d.code}</code></td>
                    <td style={{ textTransform: 'capitalize' }}>{d.type.replace(/_/g, ' ')}</td>
                    <td>{d.type === 'percentage' ? `${d.value}%` : d.type === 'fixed_amount' ? formatMoney(d.value) : 'Free shipping'}</td>
                    <td>{d.used}{d.limit ? ` / ${d.limit}` : ''}</td>
                    <td><Badge status={d.active ? 'active' : 'expired'} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        <PaginatedTable total={total} page={page} pageSize={pageSize} onPageChange={setPage} />
      </div>
    </div>
  );
}

/* ==========================================================================
   DiscountFormClient
   ========================================================================== */

export function DiscountFormClient() {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');
  const [value, setValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setToast({ message: 'Discount code is required', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const body = {
        code: code.toUpperCase().trim(),
        type,
        value: type === 'free_shipping' ? 0 : type === 'fixed_amount' ? Math.round(parseFloat(value) * 100) : parseFloat(value),
        limit: usageLimit ? parseInt(usageLimit, 10) : null,
        start: startDate || null,
        end: endDate || null,
      };

      const res = await fetch('/api/ecom/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to create discount');
      setToast({ message: 'Discount created successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to create discount. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create discount"
        breadcrumbs={[{ label: 'Discounts', href: '/admin/discounts' }, { label: 'Create discount' }]}
        actions={
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={saving}
            onClick={handleSubmit}
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving...' : 'Save discount'}
          </button>
        }
      />
      <TwoCol
        left={
          <>
            <Card title="Discount code">
              <FormGroup label="Code">
                <input
                  className="admin-input"
                  placeholder="e.g. SUMMER20"
                  style={{ textTransform: 'uppercase' }}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormGroup>
            </Card>
            <Card title="Type and value">
              <FormGroup label="Discount type">
                <select className="admin-input" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed amount</option>
                  <option value="free_shipping">Free shipping</option>
                </select>
              </FormGroup>
              {type !== 'free_shipping' && (
                <FormGroup label="Value">
                  <input
                    className="admin-input"
                    placeholder={type === 'percentage' ? '10' : '15.00'}
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </FormGroup>
              )}
            </Card>
            <Card title="Usage limits">
              <FormGroup label="Total usage limit" hint="Leave blank for unlimited">
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Unlimited"
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                />
              </FormGroup>
            </Card>
          </>
        }
        right={
          <Card title="Active dates">
            <FormGroup label="Start date">
              <input className="admin-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormGroup>
            <FormGroup label="End date" hint="Leave blank for no expiry">
              <input className="admin-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormGroup>
          </Card>
        }
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
