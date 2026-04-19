import { Badge, Card, FormGroup, PageHeader } from './_shared';
import { StaffListPage } from './staff';

/* ==========================================================================
   Settings Sub-Pages — Extended settings that replace inline settings
   ========================================================================== */

export function SettingsGeneralPage() {
  return (
    <>
      <PageHeader title="General Settings" subtitle="Manage your store details and preferences" />
      <Card title="Store Details">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormGroup label="Store Name">
            <input className="admin-input" type="text" defaultValue="My Awesome Store" />
          </FormGroup>
          <FormGroup label="Contact Email" hint="Customers will see this email on invoices and notifications.">
            <input className="admin-input" type="email" defaultValue="contact@mystore.com" />
          </FormGroup>
          <FormGroup label="Currency">
            <select className="admin-input" defaultValue="USD">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </FormGroup>
          <FormGroup label="Timezone">
            <select className="admin-input" defaultValue="America/New_York">
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
            <button type="button" className="admin-btn admin-btn--primary">Save changes</button>
          </div>
        </div>
      </Card>
    </>
  );
}

export function SettingsPaymentsPage() {
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

export function SettingsShippingPage() {
  const zones = [
    { name: 'Domestic (US)', countries: 'United States', rates: 3 },
    { name: 'Canada', countries: 'Canada', rates: 2 },
    { name: 'Europe', countries: 'UK, France, Germany, Italy, Spain', rates: 4 },
    { name: 'Rest of World', countries: 'All other countries', rates: 1 },
  ];

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
            {zones.map((zone, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{zone.name}</td>
                <td style={{ color: 'var(--admin-text-secondary)' }}>{zone.countries}</td>
                <td>{zone.rates} rate{zone.rates !== 1 ? 's' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function SettingsTaxPage() {
  const taxRates = [
    { region: 'United States - Default', rate: '0%', status: 'active' },
    { region: 'California', rate: '7.25%', status: 'active' },
    { region: 'New York', rate: '8.00%', status: 'active' },
    { region: 'Texas', rate: '6.25%', status: 'active' },
    { region: 'Oregon', rate: '0%', status: 'active' },
    { region: 'European Union - VAT', rate: '20%', status: 'draft' },
  ];

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
            {taxRates.map((tax, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{tax.region}</td>
                <td>{tax.rate}</td>
                <td><Badge status={tax.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function SettingsStaffPage() {
  return <StaffListPage />;
}

export function SettingsCheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" subtitle="Configure your checkout experience" />
      <Card title="Customer Accounts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormGroup label="Account Requirement" hint="Choose whether customers need an account to check out.">
            <select className="admin-input" defaultValue="optional">
              <option value="required">Required - customers must create an account</option>
              <option value="optional">Optional - customers can check out as guests</option>
              <option value="disabled">Disabled - no accounts, guest checkout only</option>
            </select>
          </FormGroup>
          <FormGroup label="Guest Checkout">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '20px', borderRadius: '10px',
                background: 'var(--admin-primary)', position: 'relative',
              }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#fff', position: 'absolute', top: '2px', right: '2px',
                }} />
              </div>
              <span style={{ fontSize: '13px' }}>Allow guest checkout</span>
            </div>
          </FormGroup>
          <div>
            <button type="button" className="admin-btn admin-btn--primary">Save changes</button>
          </div>
        </div>
      </Card>
    </>
  );
}
