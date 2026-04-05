import { Badge, Card, PageHeader, Pagination } from './_shared';

/* ==========================================================================
   Activity Log — Mock data & page components
   ========================================================================== */

const ACTIVITY_LOGS = [
  { id: 'al1', user: 'Sarah Chen', action: 'created', resourceType: 'order', resourceId: '#1042', ipAddress: '203.0.113.42', createdAt: 'Apr 5, 2026 2:23 pm' },
  { id: 'al2', user: 'Admin', action: 'updated', resourceType: 'product', resourceId: 'p1', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 1:45 pm' },
  { id: 'al3', user: 'James Wilson', action: 'created', resourceType: 'order', resourceId: '#1041', ipAddress: '192.0.2.88', createdAt: 'Apr 5, 2026 12:10 pm' },
  { id: 'al4', user: 'Admin', action: 'deleted', resourceType: 'discount', resourceId: 'd4', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 11:30 am' },
  { id: 'al5', user: 'Admin', action: 'updated', resourceType: 'customer', resourceId: 'c5', ipAddress: '198.51.100.14', createdAt: 'Apr 5, 2026 10:15 am' },
  { id: 'al6', user: 'Amira Patel', action: 'created', resourceType: 'order', resourceId: '#1040', ipAddress: '203.0.113.77', createdAt: 'Apr 5, 2026 9:45 am' },
  { id: 'al7', user: 'Admin', action: 'created', resourceType: 'product', resourceId: 'p7', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 4:00 pm' },
  { id: 'al8', user: 'Admin', action: 'updated', resourceType: 'settings', resourceId: 'shipping', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 2:30 pm' },
  { id: 'al9', user: 'Nina Kowalski', action: 'created', resourceType: 'order', resourceId: '#1038', ipAddress: '192.0.2.55', createdAt: 'Apr 4, 2026 6:15 pm' },
  { id: 'al10', user: 'Admin', action: 'created', resourceType: 'discount', resourceId: 'd5', ipAddress: '198.51.100.14', createdAt: 'Apr 4, 2026 9:00 am' },
];

export function ActivityLogPage() {
  return (
    <>
      <PageHeader title="Activity Log" subtitle="Track all actions performed in your store" />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource Type</th>
              <th>Resource ID</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_LOGS.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{log.createdAt}</td>
                <td>{log.user}</td>
                <td><Badge status={log.action === 'deleted' ? 'cancelled' : log.action === 'created' ? 'active' : 'pending'} /></td>
                <td style={{ textTransform: 'capitalize' }}>{log.resourceType}</td>
                <td><code style={{ fontSize: '12px', background: 'var(--admin-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{log.resourceId}</code></td>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={ACTIVITY_LOGS.length} pageSize={10} />
      </Card>
    </>
  );
}
