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
   SettingsShippingClient — Zone + Rate CRUD
   ========================================================================== */

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates?: ShippingRate[];
}

interface ShippingRate {
  id: string;
  zoneId: string;
  name: string;
  type: string;
  price: number;
  conditions?: { minWeight?: number; maxWeight?: number; minPrice?: number; maxPrice?: number } | null;
}

export function SettingsShippingClient() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoneModal, setZoneModal] = useState<ShippingZone | null>(null);
  const [rateModal, setRateModal] = useState<{ rate: ShippingRate | null; zoneId: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/admin/shipping/zones');
      if (!res.ok) throw new Error('api error');
      const json = await res.json();
      setZones(json.data ?? []);
    } catch {
      setZones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openNewZone = () => setZoneModal({ id: '', name: '', countries: [] });
  const openEditZone = (z: ShippingZone) => setZoneModal({ ...z });

  const saveZone = async () => {
    if (!zoneModal) return;
    if (!zoneModal.name.trim()) return;
    setBusy(true);
    try {
      const payload = { name: zoneModal.name, countries: zoneModal.countries };
      const res = await fetch(
        zoneModal.id ? `/api/ecom/admin/shipping/zones/${zoneModal.id}` : '/api/ecom/admin/shipping/zones',
        {
          method: zoneModal.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('save failed');
      setZoneModal(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm('Delete this zone? All rates in it will also be removed.')) return;
    await fetch(`/api/ecom/admin/shipping/zones/${id}`, { method: 'DELETE' });
    await refresh();
  };

  const openNewRate = (zoneId: string) => setRateModal({ zoneId, rate: null });
  const openEditRate = (zoneId: string, rate: ShippingRate) => setRateModal({ zoneId, rate: { ...rate } });

  const saveRate = async () => {
    if (!rateModal) return;
    const r = rateModal.rate;
    if (!r || !r.name.trim()) return;
    setBusy(true);
    try {
      const payload = { name: r.name, type: r.type || 'flat', price: r.price, conditions: r.conditions };
      const res = await fetch(
        r.id
          ? `/api/ecom/admin/shipping/rates/${r.id}`
          : `/api/ecom/admin/shipping/zones/${rateModal.zoneId}/rates`,
        {
          method: r.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('save failed');
      setRateModal(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const deleteRate = async (id: string) => {
    if (!confirm('Delete this rate?')) return;
    await fetch(`/api/ecom/admin/shipping/rates/${id}`, { method: 'DELETE' });
    await refresh();
  };

  return (
    <>
      <PageHeader
        title="Shipping"
        subtitle="Manage shipping zones and rates"
        actions={<button type="button" className="admin-btn admin-btn--primary" onClick={openNewZone}>Add zone</button>}
      />

      {loading ? (
        <Card><p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-secondary)' }}>Loading...</p></Card>
      ) : zones.length === 0 ? (
        <Card><p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-secondary)' }}>No zones yet. Add one to start configuring shipping.</p></Card>
      ) : (
        zones.map((zone) => (
          <Card
            key={zone.id}
            title={zone.name}
            actions={
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => openNewRate(zone.id)}>Add rate</button>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => openEditZone(zone)}>Edit zone</button>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => deleteZone(zone.id)}>Delete</button>
              </div>
            }
          >
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 0 }}>
              {zone.countries.length ? `Countries: ${zone.countries.join(', ')}` : 'No countries assigned'}
            </p>
            {(zone.rates && zone.rates.length > 0) ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rate name</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ width: 120 }}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {zone.rates.map((rate) => (
                    <tr key={rate.id}>
                      <td>{rate.name}</td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{rate.type}</td>
                      <td style={{ textAlign: 'right' }}>£{(rate.price / 100).toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => openEditRate(zone.id, rate)}>Edit</button>{' '}
                        <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => deleteRate(rate.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', margin: 0 }}>No rates. Add one to start charging for shipping.</p>
            )}
          </Card>
        ))
      )}

      {/* Zone modal */}
      {zoneModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => !busy && setZoneModal(null)}
        >
          <div className="admin-card" style={{ minWidth: 420, maxWidth: 520, padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>{zoneModal.id ? 'Edit zone' : 'Add shipping zone'}</h3>
            <FormGroup label="Zone name">
              <input
                className="admin-input"
                value={zoneModal.name}
                onChange={(e) => setZoneModal({ ...zoneModal, name: e.target.value })}
                placeholder="e.g. UK"
                aria-label="Zone name"
                autoFocus
              />
            </FormGroup>
            <FormGroup label="Country codes (comma-separated ISO codes, e.g. GB, FR, DE)">
              <input
                className="admin-input"
                value={zoneModal.countries.join(', ')}
                onChange={(e) => setZoneModal({ ...zoneModal, countries: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) })}
                placeholder="GB, FR, DE"
                aria-label="Country codes"
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="admin-btn" onClick={() => setZoneModal(null)} disabled={busy}>Cancel</button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={saveZone} disabled={busy}>
                {busy ? 'Saving...' : 'Save zone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate modal */}
      {rateModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => !busy && setRateModal(null)}
        >
          <div className="admin-card" style={{ minWidth: 420, maxWidth: 520, padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>{rateModal.rate?.id ? 'Edit rate' : 'Add shipping rate'}</h3>
            <FormGroup label="Rate name">
              <input
                className="admin-input"
                value={rateModal.rate?.name ?? ''}
                onChange={(e) => setRateModal({ ...rateModal, rate: { ...(rateModal.rate ?? { id: '', zoneId: rateModal.zoneId, name: '', type: 'flat', price: 0 }), name: e.target.value } })}
                placeholder="e.g. UK Standard"
                aria-label="Rate name"
                autoFocus
              />
            </FormGroup>
            <FormGroup label="Type">
              <select
                className="admin-input"
                value={rateModal.rate?.type ?? 'flat'}
                onChange={(e) => setRateModal({ ...rateModal, rate: { ...(rateModal.rate ?? { id: '', zoneId: rateModal.zoneId, name: '', type: 'flat', price: 0 }), type: e.target.value } })}
                aria-label="Rate type"
              >
                <option value="flat">Flat rate</option>
                <option value="weight_based">Weight-based</option>
                <option value="price_based">Price-based</option>
              </select>
            </FormGroup>
            <FormGroup label="Price (£)">
              <input
                className="admin-input"
                type="number"
                step="0.01"
                min="0"
                value={((rateModal.rate?.price ?? 0) / 100).toFixed(2)}
                onChange={(e) => setRateModal({ ...rateModal, rate: { ...(rateModal.rate ?? { id: '', zoneId: rateModal.zoneId, name: '', type: 'flat', price: 0 }), price: Math.round(parseFloat(e.target.value || '0') * 100) } })}
                aria-label="Rate price"
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="admin-btn" onClick={() => setRateModal(null)} disabled={busy}>Cancel</button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={saveRate} disabled={busy}>
                {busy ? 'Saving...' : 'Save rate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ==========================================================================
   SettingsTaxClient
   ========================================================================== */

interface TaxRateRow {
  id: string;
  name: string;
  rate: string; // numeric as string from drizzle
  country: string;
  province: string | null;
  priority: number;
  isCompound: boolean;
  isShipping: boolean;
}

export function SettingsTaxClient() {
  const [taxRates, setTaxRates] = useState<TaxRateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<TaxRateRow> | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/admin/tax-rates');
      if (!res.ok) throw new Error('api error');
      const json = await res.json();
      setTaxRates(json.data ?? []);
    } catch {
      setTaxRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openNew = () => setModal({ name: '', rate: '0.20', country: 'GB', province: null, priority: 0, isCompound: false, isShipping: false });
  const openEdit = (r: TaxRateRow) => setModal({ ...r });

  const save = async () => {
    if (!modal || !modal.name?.trim() || !modal.country) return;
    setBusy(true);
    try {
      const payload = {
        name: modal.name,
        rate: parseFloat(String(modal.rate ?? 0)),
        country: modal.country,
        province: modal.province || null,
        priority: modal.priority ?? 0,
        isCompound: modal.isCompound ?? false,
        isShipping: modal.isShipping ?? false,
      };
      const res = await fetch(
        modal.id ? `/api/ecom/admin/tax-rates/${modal.id}` : '/api/ecom/admin/tax-rates',
        {
          method: modal.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('save failed');
      setModal(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this tax rate?')) return;
    await fetch(`/api/ecom/admin/tax-rates/${id}`, { method: 'DELETE' });
    await refresh();
  };

  const formatRate = (r: string) => `${(parseFloat(r) * 100).toFixed(2)}%`;

  return (
    <>
      <PageHeader
        title="Tax"
        subtitle="Configure tax rates for different regions"
        actions={<button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>Add rate</button>}
      />
      <Card>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th style={{ textAlign: 'right' }}>Rate</th>
              <th>Priority</th>
              <th style={{ width: 120 }}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td><SkeletonLine width="180px" /></td>
                  <td><SkeletonLine width="100px" /></td>
                  <td><SkeletonLine width="50px" /></td>
                  <td><SkeletonLine width="60px" /></td>
                  <td></td>
                </tr>
              ))
            ) : taxRates.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-secondary)', padding: 24 }}>No tax rates yet. Add one to start charging tax.</td></tr>
            ) : (
              taxRates.map((tax) => (
                <tr key={tax.id}>
                  <td style={{ fontWeight: 600 }}>{tax.name}</td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>
                    {tax.country}{tax.province ? ` / ${tax.province}` : ''}
                  </td>
                  <td style={{ textAlign: 'right' }}>{formatRate(tax.rate)}</td>
                  <td>{tax.priority}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => openEdit(tax)}>Edit</button>{' '}
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => del(tax.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => !busy && setModal(null)}
        >
          <div className="admin-card" style={{ minWidth: 440, maxWidth: 540, padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>{modal.id ? 'Edit tax rate' : 'Add tax rate'}</h3>

            <FormGroup label="Name">
              <input
                className="admin-input"
                value={modal.name ?? ''}
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                placeholder="e.g. UK VAT"
                aria-label="Tax name"
                autoFocus
              />
            </FormGroup>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormGroup label="Country (ISO code)">
                <input
                  className="admin-input"
                  value={modal.country ?? ''}
                  onChange={(e) => setModal({ ...modal, country: e.target.value.toUpperCase() })}
                  placeholder="GB"
                  aria-label="Country code"
                  maxLength={5}
                />
              </FormGroup>
              <FormGroup label="Province / State (optional)">
                <input
                  className="admin-input"
                  value={modal.province ?? ''}
                  onChange={(e) => setModal({ ...modal, province: e.target.value || null })}
                  placeholder="Optional"
                  aria-label="Province code"
                  maxLength={10}
                />
              </FormGroup>
            </div>
            <FormGroup label="Rate (decimal, e.g. 0.20 for 20%)">
              <input
                className="admin-input"
                type="number"
                step="0.0001"
                min="0"
                max="1"
                value={modal.rate ?? ''}
                onChange={(e) => setModal({ ...modal, rate: e.target.value })}
                placeholder="0.20"
                aria-label="Tax rate"
              />
            </FormGroup>
            <FormGroup label="Priority (lower = applied first)">
              <input
                className="admin-input"
                type="number"
                value={modal.priority ?? 0}
                onChange={(e) => setModal({ ...modal, priority: parseInt(e.target.value || '0', 10) })}
                aria-label="Priority"
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={modal.isCompound ?? false}
                  onChange={(e) => setModal({ ...modal, isCompound: e.target.checked })}
                />
                Compound tax
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={modal.isShipping ?? false}
                  onChange={(e) => setModal({ ...modal, isShipping: e.target.checked })}
                />
                Apply to shipping
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="admin-btn" onClick={() => setModal(null)} disabled={busy}>Cancel</button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={busy}>
                {busy ? 'Saving...' : 'Save rate'}
              </button>
            </div>
          </div>
        </div>
      )}
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
