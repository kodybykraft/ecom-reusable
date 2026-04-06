// Ecom factory
export { createEcom, getEcom } from './create-ecom.js';
export type { EcomConfig, Ecom } from './create-ecom.js';

// Server actions
export { getProducts, getProduct, getProductById } from './server-actions/product-actions.js';
export { getOrCreateCart, getCart, addToCart, updateCartItem, removeFromCart } from './server-actions/cart-actions.js';
export { createCheckout, updateCheckout, completeCheckout } from './server-actions/checkout-actions.js';
export { login, register, logout, validateToken } from './server-actions/auth-actions.js';

// Admin auth helpers
export { requireAdmin, requirePermission } from './admin-auth.js';
export type { AdminUser } from './admin-auth.js';
