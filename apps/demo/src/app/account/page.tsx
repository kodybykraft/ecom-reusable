export default function AccountPage() {
  return (
    <div>
      <h1>My Account</h1>
      <nav style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <a href="/account/orders">Order History</a>
        <a href="/account/addresses">Addresses</a>
      </nav>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Account dashboard will show customer summary, recent orders, and quick links.
      </p>
    </div>
  );
}
