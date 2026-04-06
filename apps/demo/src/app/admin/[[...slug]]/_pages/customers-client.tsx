'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatMoney } from '@ecom/core';
import { Badge, TwoCol, Card, PageHeader } from './_shared';
import { CUSTOMERS, ORDERS } from './_data';

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
   Searchable Toolbar
   ========================================================================== */

function SearchableToolbar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="admin-toolbar">
      <input
        className="admin-search"
        placeholder={placeholder ?? 'Search...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" className="admin-filter-btn">Filter</button>
      <button type="button" className="admin-filter-btn">Sort</button>
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
   CustomersListClient
   ========================================================================== */

type CustomerRow = typeof CUSTOMERS[0];

export function CustomersListClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState<CustomerRow[]>(CUSTOMERS);
  const [total, setTotal] = useState(CUSTOMERS.length);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const fetchCustomers = useCallback(async (s: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (s) params.set('search', s);
      params.set('page', String(p));
      params.set('pageSize', String(pageSize));
      const res = await fetch(`/api/ecom/admin/customers?${params}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setCustomers(data.customers ?? data.data ?? data);
      setTotal(data.total ?? (data.customers ?? data.data ?? data).length);
    } catch {
      // Fall back to mock data with client-side search/pagination
      let filtered = CUSTOMERS;
      if (s) {
        const q = s.toLowerCase();
        filtered = CUSTOMERS.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
      }
      setTotal(filtered.length);
      setCustomers(filtered.slice((p - 1) * pageSize, p * pageSize));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(search, page);
  }, [search, page, fetchCustomers]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div>
      <PageHeader title="Customers" />
      <div className="admin-card">
        <SearchableToolbar value={search} onChange={setSearch} placeholder="Search customers..." />
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Location</th>
                <th style={{ textAlign: 'right' }}>Orders</th>
                <th style={{ textAlign: 'right' }}>Amount spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px 0' }}>No customers found</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id}>
                    <td><a href={`/admin/customers/${c.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{c.name}</a></td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{c.email}</td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{c.location}</td>
                    <td style={{ textAlign: 'right' }}>{c.orders}</td>
                    <td style={{ textAlign: 'right' }}>{formatMoney(c.spent)}</td>
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
   CustomerDetailClient
   ========================================================================== */

export function CustomerDetailClient({ customer: initial }: { customer: CustomerRow }) {
  const [customer, setCustomer] = useState(initial);
  const [orders, setOrders] = useState(() => ORDERS.filter(o => o.email === initial.email));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/ecom/admin/customers/${initial.id}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled) {
          setCustomer(data.customer ?? data);
          if (data.orders) setOrders(data.orders);
        }
      } catch {
        // Keep props / mock data
      }
    })();
    return () => { cancelled = true; };
  }, [initial.id, initial.email]);

  const c = customer;
  const customerOrders = orders;

  return (
    <div>
      <PageHeader title={c.name} breadcrumbs={[{ label: 'Customers', href: '/admin/customers' }, { label: c.name }]} />
      <TwoCol
        left={
          <Card title={`Orders (${customerOrders.length})`}>
            {customerOrders.length > 0 ? (
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Date</th><th style={{ textAlign: 'right' }}>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {customerOrders.map(o => (
                    <tr key={o.id}>
                      <td><a href={`/admin/orders/${o.id}`} style={{ fontWeight: 500, color: 'var(--admin-text)' }}>#{o.num}</a></td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{o.date}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td>
                      <td><Badge status={o.payment} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: 'var(--admin-text-muted)', padding: '16px 0' }}>No orders yet</div>
            )}
          </Card>
        }
        right={
          <>
            <Card title="Contact information">
              <div style={{ fontSize: '13px', lineHeight: 1.8 }}>
                <div>Email: {c.email}</div>
                <div>Phone: {c.phone || 'Not provided'}</div>
                <div style={{ marginTop: 8 }}><strong>Member since</strong> {c.joined}</div>
                <div><strong>Total spent</strong> {formatMoney(c.spent)}</div>
              </div>
            </Card>
            {c.addresses[0] && (
              <Card title="Default address">
                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                  {c.name}<br />
                  {c.addresses[0].line1}<br />
                  {c.addresses[0].city}, {c.addresses[0].state} {c.addresses[0].zip}
                </div>
              </Card>
            )}
            {c.notes && (
              <Card title="Notes">
                <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>{c.notes}</div>
              </Card>
            )}
          </>
        }
      />
    </div>
  );
}
