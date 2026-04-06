import { createDb } from '@ecom/db';
import type { Database } from '@ecom/db';
import { EcomError } from '@ecom/core';
import type { AuthAdapter } from '@ecom/server';
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
  eventBus,
} from '@ecom/server';

export interface AnalyticsConfig {
  google?: { measurementId: string; apiSecret?: string };
  meta?: { pixelId: string; accessToken?: string; testEventCode?: string };
  tiktok?: { pixelId: string; accessToken?: string };
}

export interface EmailConfig {
  provider: 'ses';
  region: string;
  fromEmail: string;
  fromName?: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface EcomConfig {
  databaseUrl: string;
  apiBasePath?: string;
  adminBasePath?: string;
  auth?: AuthAdapter;
  analytics?: AnalyticsConfig;
  email?: EmailConfig;
}

export interface Ecom {
  db: Database;
  auth: AuthAdapter;
  config: {
    apiBasePath: string;
    adminBasePath: string;
    analyticsClientConfig?: {
      google?: { measurementId: string };
      meta?: { pixelId: string };
      tiktok?: { pixelId: string };
    };
  };
  products: ProductService;
  cart: CartService;
  checkout: CheckoutService;
  orders: OrderService;
  customers: CustomerService;
  discounts: DiscountService;
  activityLog: ActivityLogService;
  permissions: PermissionService;
  payments?: PaymentService;
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
  const auth = config.auth ?? new AuthService(db);

  // Build client-safe analytics config (pixel IDs only, no secrets)
  let analyticsClientConfig: Ecom['config']['analyticsClientConfig'];
  if (config.analytics) {
    analyticsClientConfig = {};
    if (config.analytics.google) analyticsClientConfig.google = { measurementId: config.analytics.google.measurementId };
    if (config.analytics.meta) analyticsClientConfig.meta = { pixelId: config.analytics.meta.pixelId };
    if (config.analytics.tiktok) analyticsClientConfig.tiktok = { pixelId: config.analytics.tiktok.pixelId };
  }

  instanceUrl = config.databaseUrl;
  instance = {
    db,
    auth,
    config: {
      apiBasePath: config.apiBasePath ?? '/api/ecom',
      adminBasePath: config.adminBasePath ?? '/admin',
      analyticsClientConfig,
    },
    products: new ProductService(db),
    cart: new CartService(db),
    checkout: new CheckoutService(db),
    orders: new OrderService(db),
    customers: new CustomerService(db),
    discounts: new DiscountService(db),
    activityLog: new ActivityLogService(db),
    permissions: new PermissionService(db),
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

  // Wire email transactional system (if configured)
  if (config.email) {
    initEmail(db, config.email).catch((err) =>
      console.error('[ecom] Email initialization failed:', err),
    );
  }

  return instance;
}

export function getEcom(): Ecom {
  if (!instance) throw new EcomError('Ecom not initialized. Call createEcom() first.', 'NOT_INITIALIZED', 500);
  return instance;
}

async function initEmail(db: Database, emailConfig: EmailConfig): Promise<void> {
  // Dynamic import — email package is an optional dependency
  const email = await import('@ecom/email');

  const sesClient = new email.SesClient({
    accessKeyId: emailConfig.accessKeyId,
    secretAccessKey: emailConfig.secretAccessKey,
    region: emailConfig.region,
    fromEmail: emailConfig.fromEmail,
    fromName: emailConfig.fromName,
  });

  const templateService = new email.TemplateService(db);
  const automationService = new email.AutomationService(db);

  // Seed default templates (idempotent)
  if (email.seedDefaultTemplates) {
    await email.seedDefaultTemplates(db);
  }

  // Create transactional email service
  const txnService = new email.TransactionalEmailService(
    db,
    sesClient,
    templateService,
    emailConfig.fromEmail,
    emailConfig.fromName,
  );

  // Register event listeners
  email.registerEmailEventHandlers(eventBus, txnService);
  if (email.registerAutomationTriggers) {
    email.registerAutomationTriggers(eventBus, db, automationService);
  }

  // Start automation processing loop (every 60s)
  const executor = new email.AutomationExecutor(db, sesClient, templateService, emailConfig.fromEmail, emailConfig.fromName);
  setInterval(() => executor.processQueue().catch(console.error), 60_000);

  // Start abandoned cart checker (every 5 min)
  email.checkAbandonedCarts(db, txnService).catch(console.error);
  setInterval(() => email.checkAbandonedCarts(db, txnService).catch(console.error), 300_000);
}
