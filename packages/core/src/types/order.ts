import type {
  Money,
  Currency,
  OrderFinancialStatus,
  OrderFulfillmentStatus,
  TransactionKind,
  TransactionStatus,
} from './common.js';
import type { CustomerAddress } from './customer.js';

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string | null;
  checkoutId: string | null;
  email: string;
  currency: Currency;
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  discountTotal: Money;
  total: Money;
  financialStatus: OrderFinancialStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  shippingAddress: CustomerAddress | null;
  billingAddress: CustomerAddress | null;
  cancelledAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  lineItems?: OrderLineItem[];
  transactions?: OrderTransaction[];
}

export interface OrderLineItem {
  id: string;
  orderId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string | null;
  quantity: number;
  price: Money;
  totalDiscount: Money;
  taxLines: TaxLine[];
}

export interface TaxLine {
  title: string;
  rate: number;
  amount: Money;
}

export interface OrderTransaction {
  id: string;
  orderId: string;
  kind: TransactionKind;
  status: TransactionStatus;
  amount: Money;
  currency: Currency;
  gateway: string;
  gatewayTransactionId: string | null;
  errorMessage: string | null;
  createdAt: Date;
}

export interface OrderFilter {
  financialStatus?: OrderFinancialStatus;
  fulfillmentStatus?: OrderFulfillmentStatus;
  customerId?: string;
  search?: string;
  dateRange?: { from: Date; to: Date };
}
