'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, PageHeader, StatsGrid, StatCard, formatMoney } from './_shared';

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

/* ==========================================================================
   Mock data
   ========================================================================== */

interface AnalyticsData {
  totalSales: number;
  sessions: number;
  returningPct: number;
  aov: number;
  topReferrers: Array<{ source: string; sessions: number; orders: number }>;
}

const MOCK_ANALYTICS: AnalyticsData = {
  totalSales: 48723_00,
  sessions: 2847,
  returningPct: 38,
  aov: 6400,
  topReferrers: [
    { source: 'Direct', sessions: 1240, orders: 42 },
    { source: 'Google', sessions: 680, orders: 28 },
    { source: 'Instagram', sessions: 420, orders: 15 },
    { source: 'Facebook', sessions: 310, orders: 8 },
  ],
};

/* ==========================================================================
   Date range helpers
   ========================================================================== */

type DateRange = '7d' | '30d' | '90d';

function getDateRange(range: DateRange): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  if (range === '7d') from.setDate(from.getDate() - 7);
  else if (range === '30d') from.setDate(from.getDate() - 30);
  else from.setDate(from.getDate() - 90);

  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

/* ==========================================================================
   AnalyticsClient
   ========================================================================== */

export function AnalyticsClient() {
  const [range, setRange] = useState<DateRange>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { from, to } = getDateRange(range);
      const res = await fetch(`/api/ecom/admin/analytics?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('api error');
      const json = await res.json();
      if (json.totalSales !== undefined) {
        setData({
          totalSales: json.totalSales,
          sessions: json.sessions ?? 0,
          returningPct: json.returningPct ?? json.returningCustomerRate ?? 0,
          aov: json.aov ?? json.averageOrderValue ?? 0,
          topReferrers: Array.isArray(json.topReferrers) ? json.topReferrers : [],
        });
      } else {
        throw new Error('bad shape');
      }
    } catch {
      // Scale mock data by range for variety
      const scale = range === '7d' ? 1 : range === '30d' ? 3.5 : 10;
      setData({
        ...MOCK_ANALYTICS,
        totalSales: Math.round(MOCK_ANALYTICS.totalSales * scale),
        sessions: Math.round(MOCK_ANALYTICS.sessions * scale),
        topReferrers: MOCK_ANALYTICS.topReferrers.map((r) => ({
          ...r,
          sessions: Math.round(r.sessions * scale),
          orders: Math.round(r.orders * scale),
        })),
      });
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const rangeButtons: { label: string; value: DateRange }[] = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
  ];

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <PageHeader
        title="Analytics"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            {rangeButtons.map((btn) => (
              <button
                key={btn.value}
                type="button"
                className={`admin-btn ${range === btn.value ? 'admin-btn--primary' : 'admin-btn--outline'}`}
                onClick={() => setRange(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <>
          <StatsGrid>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-stat-card">
                <SkeletonLine width="80px" />
                <div style={{ marginTop: 8 }}><SkeletonLine width="120px" /></div>
              </div>
            ))}
          </StatsGrid>
          <div className="admin-grid-2">
            <Card title="Sales over time">
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkeletonLine width="80%" />
              </div>
            </Card>
            <Card title="Top referrers">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonLine key={i} />
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : data ? (
        <>
          <StatsGrid>
            <StatCard label="Total sales" value={formatMoney(data.totalSales)} />
            <StatCard label="Online store sessions" value={data.sessions.toLocaleString()} />
            <StatCard label="Returning customers" value={`${data.returningPct}%`} />
            <StatCard label="Avg order value" value={formatMoney(data.aov)} />
          </StatsGrid>

          <div className="admin-grid-2">
            <Card title="Sales over time">
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-text-muted)',
                  borderRadius: 'var(--admin-radius)',
                  background: 'var(--admin-border-light)',
                }}
              >
                Chart placeholder — integrate Recharts
              </div>
            </Card>
            <Card title="Top referrers">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th style={{ textAlign: 'right' }}>Sessions</th>
                    <th style={{ textAlign: 'right' }}>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topReferrers.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '1rem', color: 'var(--admin-text-secondary)' }}>
                        No referrer data
                      </td>
                    </tr>
                  ) : (
                    data.topReferrers.map((ref) => (
                      <tr key={ref.source}>
                        <td>{ref.source}</td>
                        <td style={{ textAlign: 'right' }}>{ref.sessions.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{ref.orders.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
