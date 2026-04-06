'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Breadcrumb, Card, FormGroup, PageHeader, TwoCol } from './_shared';

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
          <SkeletonLine width={i === 0 ? '120px' : '80%'} />
        </td>
      ))}
    </tr>
  );
}

/* ==========================================================================
   Mock data
   ========================================================================== */

const RESOURCES = ['products', 'orders', 'customers', 'discounts', 'settings', 'analytics', 'marketing'] as const;
const ACTIONS = ['Create', 'Read', 'Update', 'Delete'] as const;

interface StaffMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  lastLoginAt: string;
}

const MOCK_STAFF: StaffMember[] = [
  { id: 's1', email: 'admin@store.com', firstName: 'Alex', lastName: 'Thompson', role: 'admin', isActive: true, lastLoginAt: 'Apr 5, 2026 2:00 pm' },
  { id: 's2', email: 'maria@store.com', firstName: 'Maria', lastName: 'Gonzalez', role: 'staff', isActive: true, lastLoginAt: 'Apr 5, 2026 10:30 am' },
  { id: 's3', email: 'jake@store.com', firstName: 'Jake', lastName: "O'Brien", role: 'staff', isActive: true, lastLoginAt: 'Apr 4, 2026 5:15 pm' },
  { id: 's4', email: 'lin@store.com', firstName: 'Lin', lastName: 'Wei', role: 'staff', isActive: false, lastLoginAt: 'Mar 20, 2026 9:00 am' },
];

/* ==========================================================================
   StaffListClient
   ========================================================================== */

export function StaffListClient() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ecom/admin/staff');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setStaff(
            json.data.map((s: any) => ({
              id: s.id,
              email: s.email,
              firstName: s.firstName ?? s.first_name ?? '',
              lastName: s.lastName ?? s.last_name ?? '',
              role: s.role ?? 'staff',
              isActive: s.isActive ?? s.is_active ?? true,
              lastLoginAt: s.lastLoginAt ?? s.last_login_at ?? '',
            })),
          );
        } else {
          throw new Error('bad shape');
        }
      } catch {
        setStaff(MOCK_STAFF);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

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
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />)
              : staff.length === 0
                ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                        No staff members found
                      </td>
                    </tr>
                  )
                : staff.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <a href={`/admin/staff/${member.id}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>
                          {member.firstName} {member.lastName}
                        </a>
                      </td>
                      <td>{member.email}</td>
                      <td><Badge status={member.role === 'admin' ? 'active' : 'pending'} /></td>
                      <td><Badge status={member.isActive ? 'active' : 'archived'} /></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{member.lastLoginAt}</td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ==========================================================================
   StaffFormClient
   ========================================================================== */

export function StaffFormClient({ id }: { id?: string }) {
  const { toast, ToastContainer } = useToast();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    RESOURCES.forEach((r) => {
      initial[r] = {};
      ACTIONS.forEach((a) => {
        initial[r][a.toLowerCase()] = false;
      });
    });
    return initial;
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  const isNew = !id;
  const title = isNew ? 'New Staff Member' : `${firstName} ${lastName}`;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/ecom/admin/staff/${id}`);
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        setEmail(json.email ?? '');
        setFirstName(json.firstName ?? json.first_name ?? '');
        setLastName(json.lastName ?? json.last_name ?? '');
        setRole(json.role ?? 'staff');
        setIsActive(json.isActive ?? json.is_active ?? true);
        if (Array.isArray(json.permissions)) {
          const perms: Record<string, Record<string, boolean>> = {};
          RESOURCES.forEach((r) => {
            perms[r] = {};
            ACTIONS.forEach((a) => {
              const p = json.permissions.find((p: any) => p.resource === r && p.action === a.toLowerCase());
              perms[r][a.toLowerCase()] = p?.allowed ?? false;
            });
          });
          setPermissions(perms);
        }
      } catch {
        // Fall back to mock data for known IDs
        const mock = MOCK_STAFF.find((s) => s.id === id);
        if (mock) {
          setEmail(mock.email);
          setFirstName(mock.firstName);
          setLastName(mock.lastName);
          setRole(mock.role);
          setIsActive(mock.isActive);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const togglePermission = useCallback((resource: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: !prev[resource][action],
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const permArray = RESOURCES.flatMap((r) =>
      ACTIONS.map((a) => ({
        resource: r,
        action: a.toLowerCase(),
        allowed: permissions[r]?.[a.toLowerCase()] ?? false,
      })),
    );

    try {
      const url = isNew ? '/api/ecom/admin/staff' : `/api/ecom/admin/staff/${id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, role, isActive, permissions: permArray }),
      });
      if (!res.ok) throw new Error('save failed');
      toast(isNew ? 'Staff member added' : 'Staff member updated', 'success');
    } catch {
      toast('Could not save (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [id, isNew, email, firstName, lastName, role, isActive, permissions, toast]);

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
        <Breadcrumb items={[{ label: 'Staff', href: '/admin/staff' }, { label: 'Loading...' }]} />
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}><SkeletonLine width="100%" /></div>
            ))}
          </div>
        </Card>
      </>
    );
  }

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
                  <input
                    className="admin-input"
                    type="email"
                    placeholder="staff@store.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="First Name">
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Last Name">
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
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
                        const allowed = permissions[resource]?.[action.toLowerCase()] ?? false;
                        return (
                          <td key={action} style={{ textAlign: 'center' }}>
                            <div
                              onClick={() => togglePermission(resource, action.toLowerCase())}
                              style={{
                                width: '18px', height: '18px', borderRadius: '4px',
                                border: '2px solid var(--admin-border)',
                                background: allowed ? 'var(--admin-primary)' : 'transparent',
                                margin: '0 auto',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'background 0.15s',
                              }}
                            >
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
                <select className="admin-input" value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </FormGroup>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '8px' }}>
                Admins have full access to all areas. Staff members use the permission matrix.
              </div>
            </Card>
            <Card title="Status">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => setIsActive((v) => !v)}
              >
                <div style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  background: isActive ? 'var(--admin-primary)' : 'var(--admin-border)',
                  position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '2px',
                    transition: 'left 0.2s, right 0.2s',
                    ...(isActive ? { right: '2px' } : { left: '2px' }),
                  }} />
                </div>
                <span style={{ fontSize: '13px' }}>{isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </Card>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              style={{ width: '100%' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : isNew ? 'Add staff member' : 'Save changes'}
            </button>
          </>
        }
      />
      <ToastContainer />
    </>
  );
}
