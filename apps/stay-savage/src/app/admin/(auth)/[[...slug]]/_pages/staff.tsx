import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

/* ==========================================================================
   Staff — Mock data & page components
   ========================================================================== */

const RESOURCES = ['products', 'orders', 'customers', 'discounts', 'settings', 'analytics', 'marketing'] as const;
const ACTIONS = ['Create', 'Read', 'Update', 'Delete'] as const;

const STAFF = [
  {
    id: 's1', email: 'admin@store.com', firstName: 'Alex', lastName: 'Thompson', role: 'admin' as const, isActive: true, lastLoginAt: 'Apr 5, 2026 2:00 pm',
    permissions: RESOURCES.flatMap((r) => ACTIONS.map((a) => ({ resource: r, action: a.toLowerCase(), allowed: true }))),
  },
  {
    id: 's2', email: 'maria@store.com', firstName: 'Maria', lastName: 'Gonzalez', role: 'staff' as const, isActive: true, lastLoginAt: 'Apr 5, 2026 10:30 am',
    permissions: RESOURCES.flatMap((r) => ACTIONS.map((a) => ({ resource: r, action: a.toLowerCase(), allowed: r === 'orders' || r === 'customers' || (r === 'products' && a === 'Read') }))),
  },
  {
    id: 's3', email: 'jake@store.com', firstName: 'Jake', lastName: 'O\'Brien', role: 'staff' as const, isActive: true, lastLoginAt: 'Apr 4, 2026 5:15 pm',
    permissions: RESOURCES.flatMap((r) => ACTIONS.map((a) => ({ resource: r, action: a.toLowerCase(), allowed: r === 'products' || r === 'orders' }))),
  },
  {
    id: 's4', email: 'lin@store.com', firstName: 'Lin', lastName: 'Wei', role: 'staff' as const, isActive: false, lastLoginAt: 'Mar 20, 2026 9:00 am',
    permissions: RESOURCES.flatMap((r) => ACTIONS.map((a) => ({ resource: r, action: a.toLowerCase(), allowed: r === 'analytics' && a === 'Read' }))),
  },
];

export function StaffListPage() {
  return (
    <>
      <PageHeader
        title="Staff"
        subtitle="Manage team members and their permissions"
        actions={<a href="/admin/staff/new" className="admin-btn admin-btn--primary">Add staff member</a>}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {STAFF.map((member) => (
              <tr key={member.id}>
                <td><a href={`/admin/staff/${member.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{member.firstName} {member.lastName}</a></td>
                <td>{member.email}</td>
                <td><Badge status={member.role === 'admin' ? 'active' : 'pending'} /></td>
                <td><Badge status={member.isActive ? 'active' : 'archived'} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{member.lastLoginAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function StaffFormPage({ id }: { id?: string }) {
  const existing = id ? STAFF.find((s) => s.id === id) : null;
  const title = existing ? `${existing.firstName} ${existing.lastName}` : 'New Staff Member';

  return (
    <>
      <Breadcrumb items={[
        { label: 'Staff', href: '/admin/staff' },
        { label: title },
      ]} />
      <TwoCol
        left={
          <>
            <Card title="Account Details">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup label="Email">
                  <input className="admin-input" type="email" placeholder="staff@store.com" defaultValue={existing?.email ?? ''} />
                </FormGroup>
                <FormGroup label="First Name">
                  <input className="admin-input" type="text" placeholder="First name" defaultValue={existing?.firstName ?? ''} />
                </FormGroup>
                <FormGroup label="Last Name">
                  <input className="admin-input" type="text" placeholder="Last name" defaultValue={existing?.lastName ?? ''} />
                </FormGroup>
              </div>
            </Card>
            <Card title="Permissions">
              <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>
                Control what this staff member can access.
              </p>
              <table className="admin-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ textTransform: 'capitalize' }}>Resource</th>
                    {ACTIONS.map((a) => (
                      <th key={a} style={{ textAlign: 'center', width: '70px' }}>{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESOURCES.map((resource) => (
                    <tr key={resource}>
                      <td style={{ textTransform: 'capitalize' }}>{resource}</td>
                      {ACTIONS.map((action) => {
                        const perm = existing?.permissions.find((p) => p.resource === resource && p.action === action.toLowerCase());
                        const allowed = perm?.allowed ?? false;
                        return (
                          <td key={action} style={{ textAlign: 'center' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '4px',
                              border: '2px solid var(--admin-border)',
                              background: allowed ? 'var(--admin-primary)' : 'transparent',
                              margin: '0 auto',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {allowed && (
                                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>&#10003;</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        }
        right={
          <>
            <Card title="Role">
              <FormGroup label="Role">
                <select className="admin-input" defaultValue={existing?.role ?? 'staff'}>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </FormGroup>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '8px' }}>
                Admins have full access to all areas. Staff members use the permission matrix.
              </div>
            </Card>
            <Card title="Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  background: (existing?.isActive ?? true) ? 'var(--admin-primary)' : 'var(--admin-border)',
                  position: 'relative',
                }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '2px',
                    ...(existing?.isActive ?? true) ? { right: '2px' } : { left: '2px' },
                  }} />
                </div>
                <span style={{ fontSize: '13px' }}>{(existing?.isActive ?? true) ? 'Active' : 'Inactive'}</span>
              </div>
            </Card>
            <button type="button" className="admin-btn admin-btn--primary" style={{ width: '100%' }}>
              {existing ? 'Save changes' : 'Add staff member'}
            </button>
          </>
        }
      />
    </>
  );
}
