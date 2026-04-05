export default function CartPage() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Cart functionality requires client-side JavaScript. This page will be enhanced with the CartProvider and useCart hook.</p>
      <div id="cart-root" />
      <div style={{ marginTop: '2rem' }}>
        <a
          href="/products"
          style={{ color: '#666', textDecoration: 'underline' }}
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
