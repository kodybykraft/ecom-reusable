import type { CustomerAddress } from '../types/customer.js';
import { ValidationError } from '../utils/errors.js';

/** Validate a shipping/billing address has required fields */
export function validateAddress(address: CustomerAddress, type: 'shipping' | 'billing'): void {
  const required: Array<keyof CustomerAddress> = [
    'firstName',
    'lastName',
    'address1',
    'city',
    'country',
    'countryCode',
    'zip',
  ];

  for (const field of required) {
    if (!address[field]) {
      throw new ValidationError(`${type} address: ${field} is required`, field);
    }
  }
}

/** Validate checkout is ready for payment */
export function validateCheckoutReady(checkout: {
  email: string | null;
  shippingAddress: CustomerAddress | null;
  shippingMethodId: string | null;
  total: number;
}): void {
  if (!checkout.email) {
    throw new ValidationError('Email is required', 'email');
  }

  if (!checkout.shippingAddress) {
    throw new ValidationError('Shipping address is required', 'shippingAddress');
  }

  if (!checkout.shippingMethodId) {
    throw new ValidationError('Shipping method is required', 'shippingMethodId');
  }

  if (checkout.total <= 0) {
    throw new ValidationError('Checkout total must be greater than zero', 'total');
  }
}
