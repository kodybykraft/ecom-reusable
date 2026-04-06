import { createDb } from '@ecom/db';
import type { Database } from '@ecom/db';
import { EcomError } from '@ecom/core';
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
  PaymentService,
  InventoryService,
  ReturnService,
  DraftOrderService,
  ImportExportService,
  WebhookService,
  CategoryService,
  SettingsService,
  AnalyticsQueryService,
  StaffService,
  AbandonedCheckoutService,
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
  payments?: PaymentService; // initialized separately — requires a payment provider
  inventory: InventoryService;
  returns: ReturnService;
  draftOrders: DraftOrderService;
  importExport: ImportExportService;
  webhooks: WebhookService;
  categories: CategoryService;
  settings: SettingsService;
  analyticsQuery: AnalyticsQueryService;
  staff: StaffService;
  abandonedCheckouts: AbandonedCheckoutService;
}

let instance: Ecom | null = null;
let instanceUrl: string | null = null;

export function createEcom(config: EcomConfig): Ecom {
  if (instance) {
    if (instanceUrl !== config.databaseUrl) {
      throw new EcomError(
        'createEcom() already initialized with a different database URL. Use getEcom() to retrieve the existing instance.',
        'ALREADY_INITIALIZED',
        500,
      );
    }
    return instance;
  }

  const db = createDb(config.databaseUrl);

  instanceUrl = config.databaseUrl;
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
    // payments requires a provider — initialized separately via ecom.initPayments(provider)
    inventory: new InventoryService(db),
    returns: new ReturnService(db),
    draftOrders: new DraftOrderService(db),
    importExport: new ImportExportService(db),
    webhooks: new WebhookService(db),
    categories: new CategoryService(db),
    settings: new SettingsService(db),
    analyticsQuery: new AnalyticsQueryService(db),
    staff: new StaffService(db),
    abandonedCheckouts: new AbandonedCheckoutService(db),
  };

  return instance;
}

export function getEcom(): Ecom {
  if (!instance) throw new EcomError('Ecom not initialized. Call createEcom() first.', 'NOT_INITIALIZED', 500);
  return instance;
}
