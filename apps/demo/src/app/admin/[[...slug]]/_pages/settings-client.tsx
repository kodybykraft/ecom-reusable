'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Card, FormGroup, PageHeader } from './_shared';

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

/* ==========================================================================
   SettingsGeneralClient
   ========================================================================== */

export function SettingsGeneralClient() {
  const { toast, ToastContainer } = useToast();
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [contactEmail, setContactEmail] = useState('contact@mystore.com');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ecom/admin/settings/general');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        if (json.storeName) setStoreName(json.storeName);
        if (json.contactEmail) setContactEmail(json.contactEmail);
        if (json.currency) setCurrency(json.currency);
        if (json.timezone) setTimezone(json.timezone);
      } catch {
        // Keep defaults (mock fallback)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ecom/admin/settings/general', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, contactEmail, currency, timezone }),
      });
      if (!res.ok) throw new Error('save failed');
      toast('Settings saved successfully', 'success');
    } catch {
      toast('Could not save settings (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [storeName, contactEmail, currency, timezone, toast]);

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <PageHeader title="General Settings" subtitle="Manage your store details and preferences" />
      <Card title="Store Details">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <SkeletonLine width="80px" />
                <div style={{ marginTop: 8 }}><SkeletonLine /></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormGroup label="Store Name">
              <input
                className="admin-input"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Contact Email" hint="Customers will see this email on invoices and notifications.">
              <input
                className="admin-input"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Currency">
              <select className="admin-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </FormGroup>
            <FormGroup label="Timezone">
              <select className="admin-input" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="America/New_York">Eastern Time (US &amp; Canada)</option>
                <option value="America/Chicago">Central Time (US &amp; Canada)</option>
                <option value="America/Denver">Mountain Time (US &amp; Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US &amp; Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </FormGroup>
            <div>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </Card>
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   SettingsPaymentsClient
   ========================================================================== */

export function SettingsPaymentsClient() {
  return (
    <>
      <PageHeader title="Payment Providers" subtitle="Configure how you accept payments" />
      <Card title="Stripe">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Stripe</div>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
              Accept credit cards, debit cards, and other payment methods via Stripe.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge status="active" />
            <button type="button" className="admin-btn">Configure</button>
          </div>
        </div>
      </Card>
      <Card title="PayPal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>PayPal</div>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
              Allow customers to pay with their PayPal account.
            </div>
          </div>
          <button type="button" className="admin-btn admin-btn--primary">Enable</button>
        </div>
      </Card>
    </>
  );
}

/* ==========================================================================
   SettingsShippingClient
   ========================================================================== */

const MOCK_ZONES = [
  { name: 'Domestic (US)', countries: 'United States', rates: 3 },
  { name: 'Canada', countries: 'Canada', rates: 2 },
  { name: 'Europe', countries: 'UK, France, Germany, Italy, Spain', rates: 4 },
  { name: 'Rest of World', countries: 'All other countries', rates: 1 },
];

export function SettingsShippingClient() {
  const [zones, setZones] = useState(MOCK_ZONES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ecom/admin/settings/shipping');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        if (Array.isArray(json.zones)) setZones(json.zones);
      } catch {
        // Keep mock data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Shipping"
        subtitle="Manage shipping zones and rates"
        actions={<button type="button" className="admin-btn admin-btn--primary">Add zone</button>}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Countries</th>
              <th>Rates</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><SkeletonLine width="120px" /></td>
                  <td><SkeletonLine width="200px" /></td>
                  <td><SkeletonLine width="60px" /></td>
                </tr>
              ))
            ) : (
              zones.map((zone, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{zone.name}</td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{zone.countries}</td>
                  <td>{zone.rates} rate{zone.rates !== 1 ? 's' : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ==========================================================================
   SettingsTaxClient
   ========================================================================== */

const MOCK_TAX_RATES = [
  { region: 'United States - Default', rate: '0%', status: 'active' },
  { region: 'California', rate: '7.25%', status: 'active' },
  { region: 'New York', rate: '8.00%', status: 'active' },
  { region: 'Texas', rate: '6.25%', status: 'active' },
  { region: 'Oregon', rate: '0%', status: 'active' },
  { region: 'European Union - VAT', rate: '20%', status: 'draft' },
];

export function SettingsTaxClient() {
  const [taxRates, setTaxRates] = useState(MOCK_TAX_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ecom/admin/settings/tax');
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        if (Array.isArray(json.rates)) setTaxRates(json.rates);
      } catch {
        // Keep mock data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Tax"
        subtitle="Configure tax rates for different regions"
        actions={<button type="button" className="admin-btn admin-btn--primary">Add rate</button>}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td><SkeletonLine width="180px" /></td>
                  <td><SkeletonLine width="50px" /></td>
                  <td><SkeletonLine width="60px" /></td>
                </tr>
              ))
            ) : (
              taxRates.map((tax, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{tax.region}</td>
                  <td>{tax.rate}</td>
                  <td><Badge status={tax.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ==========================================================================
   SettingsCheckoutClient
   ========================================================================== */

export function SettingsCheckoutClient() {
  const { toast, ToastContainer } = useToast();
  const [accountReq, setAccountReq] = useState('optional');
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ecom/admin/settings/checkout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountRequirement: accountReq, guestCheckout }),
      });
      if (!res.ok) throw new Error('save failed');
      toast('Checkout settings saved', 'success');
    } catch {
      toast('Could not save checkout settings (demo mode)', 'error');
    } finally {
      setSaving(false);
    }
  }, [accountReq, guestCheckout, toast]);

  return (
    <>
      <PageHeader title="Checkout" subtitle="Configure your checkout experience" />
      <Card title="Customer Accounts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormGroup label="Account Requirement" hint="Choose whether customers need an account to check out.">
            <select
              className="admin-input"
              value={accountReq}
              onChange={(e) => setAccountReq(e.target.value)}
            >
              <option value="required">Required - customers must create an account</option>
              <option value="optional">Optional - customers can check out as guests</option>
              <option value="disabled">Disabled - no accounts, guest checkout only</option>
            </select>
          </FormGroup>
          <FormGroup label="Guest Checkout">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setGuestCheckout((v) => !v)}
            >
              <div style={{
                width: '36px', height: '20px', borderRadius: '10px',
                background: guestCheckout ? 'var(--admin-primary)' : 'var(--admin-border)',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#fff', position: 'absolute', top: '2px',
                  transition: 'left 0.2s, right 0.2s',
                  ...(guestCheckout ? { right: '2px' } : { left: '2px' }),
                }} />
              </div>
              <span style={{ fontSize: '13px' }}>Allow guest checkout</span>
            </div>
          </FormGroup>
          <div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </>
  );
}

/* ==========================================================================
   SettingsStaffClient — delegates to StaffListClient
   ========================================================================== */

export { StaffListClient as SettingsStaffClient } from './staff-client';
