'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatMoney } from '@ecom/core';
import { Badge, Card, StatsGrid, StatCard, PageHeader } from './_shared';
import { ORDERS, PRODUCTS } from './_data';

interface StatsData {
  totalSales: number;
  orderCount: number;
  conversionRate: string;
  unfulfilled: number;
  totalSalesChange: number;
  ordersChange: number;
  conversionChange: number;
}

interface OrderRow {
  id: string;
  num: number;
  customer: string;
  total: number;
  payment: string;
}

interface ProductRow {
  id: string;
  title: string;
  inventory: number;
  price: number;
}

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

function SkeletonStatCard() {
  return (
    <div className="admin-stat-card">
      <SkeletonLine width="60%" />
      <div style={{ marginTop: 8 }}>
        <SkeletonLine width="40%" />
      </div>
    </div>
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

function getMockStats(): StatsData {
  const totalSales = ORDERS.filter((o) => o.payment === 'paid').reduce((s, o) => s + o.total, 0);
  const unfulfilled = ORDERS.filter((o) => o.fulfillment === 'unfulfilled').length;
  return {
    totalSales,
    orderCount: ORDERS.length,
    conversionRate: '3.2%',
    unfulfilled,
    totalSalesChange: 12.4,
    ordersChange: 8.2,
    conversionChange: 0.4,
  };
}

function getMockRecentOrders(): OrderRow[] {
  return ORDERS.slice(0, 5).map((o) => ({
    id: o.id,
    num: o.num,
    customer: o.customer,
    total: o.total,
    payment: o.payment,
  }));
}

function getMockTopProducts(): ProductRow[] {
  return PRODUCTS.slice(0, 5).map((p) => ({
    id: p.id,
    title: p.title,
    inventory: p.inventory,
    price: p.price,
  }));
}

export function DashboardClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRow[] | null>(null);
  const [topProducts, setTopProducts] = useState<ProductRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Try fetching from the API
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/ecom/admin/stats').then((r) => {
          if (!r.ok) throw new Error('stats api error');
          return r.json();
        }),
        fetch('/api/ecom/admin/orders?page=1&limit=5').then((r) => {
          if (!r.ok) throw new Error('orders api error');
          return r.json();
        }),
      ]);

      // Map API response to our shape
      if (statsRes?.data) {
        setStats({
          totalSales: statsRes.data.totalSales ?? 0,
          orderCount: statsRes.data.orderCount ?? 0,
          conversionRate: statsRes.data.conversionRate ?? '0%',
          unfulfilled: statsRes.data.unfulfilled ?? 0,
          totalSalesChange: statsRes.data.totalSalesChange ?? 0,
          ordersChange: statsRes.data.ordersChange ?? 0,
          conversionChange: statsRes.data.conversionChange ?? 0,
        });
      } else {
        setStats(getMockStats());
      }

      if (ordersRes?.data && Array.isArray(ordersRes.data)) {
        setRecentOrders(
          ordersRes.data.slice(0, 5).map((o: any) => ({
            id: o.id,
            num: o.num ?? o.orderNumber,
            customer: o.customer ?? o.customerName,
            total: o.total,
            payment: o.payment ?? o.paymentStatus,
          })),
        );
      } else {
        setRecentOrders(getMockRecentOrders());
      }

      // Top products from mock for now (no dedicated API endpoint)
      setTopProducts(getMockTopProducts());
    } catch {
      // API unavailable — fall back to mock data
      setStats(getMockStats());
      setRecentOrders(getMockRecentOrders());
      setTopProducts(getMockTopProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader title="Dashboard" />

      {/* KPI Cards */}
      {loading || !stats ? (
        <StatsGrid>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </StatsGrid>
      ) : (
        <StatsGrid>
          <StatCard label="Total sales" value={formatMoney(stats.totalSales)} change={stats.totalSalesChange} />
          <StatCard label="Orders" value={String(stats.orderCount)} change={stats.ordersChange} />
          <StatCard label="Conversion rate" value={stats.conversionRate} change={stats.conversionChange} />
          <StatCard label="Orders to fulfill" value={String(stats.unfulfilled)} />
        </StatsGrid>
      )}

      {/* Two-column grid: Recent Orders + Top Products */}
      <div className="admin-grid-2">
        <Card
          title="Recent orders"
          actions={
            <a href="/admin/orders" className="admin-btn admin-btn--plain">
              View all
            </a>
          }
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading || !recentOrders
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={4} />)
                : recentOrders.map((o) => (
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
                      <td>{o.customer}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(o.total)}</td>
                      <td>
                        <Badge status={o.payment} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card>

        <Card title="Top products">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'right' }}>Inventory</th>
                <th style={{ textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {loading || !topProducts
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={3} />)
                : topProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <a href={`/admin/products/${p.id}`} style={{ color: 'var(--admin-text)' }}>
                          {p.title}
                        </a>
                      </td>
                      <td style={{ textAlign: 'right' }}>{p.inventory}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(p.price)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
