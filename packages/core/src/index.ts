// Types
export type * from './types/index.js';

// Utils
export {
  addMoney,
  subtractMoney,
  multiplyMoney,
  percentageOf,
  formatMoney,
  toCents,
  toDollars,
  clampMoney,
  sumMoney,
} from './utils/money.js';
export { slugify, uniqueSlug } from './utils/slug.js';
export { escapeLike, escapeHtml } from './utils/escape.js';
export {
  EcomError,
  NotFoundError,
  ValidationError,
  InsufficientStockError,
  DiscountError,
  PaymentError,
  UnauthorizedError,
  ForbiddenError,
} from './utils/errors.js';

// Cart
export {
  calculateItemTotal,
  calculateSubtotal,
  calculateCartTotals,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from './cart/cart-calculator.js';
export type { CartItemWithVariant } from './cart/cart-calculator.js';
export { validateStock, validateCartStock, validateCartConstraints } from './cart/cart-validator.js';

// Checkout
export { calculateCheckoutTotals } from './checkout/checkout-calculator.js';
export type { CheckoutCalculationInput, CheckoutTotals } from './checkout/checkout-calculator.js';
export { validateAddress, validateCheckoutReady } from './checkout/checkout-validator.js';

// Discount
export { calculateDiscountAmount, validateDiscount } from './discount/discount-engine.js';

// Tax
export { calculateTax, calculateLineTax } from './tax/tax-calculator.js';

// Shipping
export {
  findMatchingZone,
  getAvailableRates,
  calculateShippingCost,
  getCheapestRate,
} from './shipping/shipping-calculator.js';
