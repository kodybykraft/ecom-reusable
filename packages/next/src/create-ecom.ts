import { createDb } from '@ecom/db';
import type { Database } from '@ecom/db';
import {
  AuthService,
  ProductService,
  CartService,
  CheckoutService,
  OrderService,
  CustomerService,
  DiscountService,
  ActivityLogService,
  PermissionService,
} from '@ecom/server';

export interface EcomConfig {
  databaseUrl: string;
}

export interface Ecom {
  db: Database;
  auth: AuthService;
  products: ProductService;
  cart: CartService;
  checkout: CheckoutService;
  orders: OrderService;
  customers: CustomerService;
  discounts: DiscountService;
  activityLog: ActivityLogService;
  permissions: PermissionService;
}

let instance: Ecom | null = null;

export function createEcom(config: EcomConfig): Ecom {
  if (instance) return instance;

  const db = createDb(config.databaseUrl);

  instance = {
    db,
    auth: new AuthService(db),
    products: new ProductService(db),
    cart: new CartService(db),
    checkout: new CheckoutService(db),
    orders: new OrderService(db),
    customers: new CustomerService(db),
    discounts: new DiscountService(db),
    activityLog: new ActivityLogService(db),
    permissions: new PermissionService(db),
  };

  return instance;
}

export function getEcom(): Ecom {
  if (!instance) throw new Error('Ecom not initialized. Call createEcom() first.');
  return instance;
}
