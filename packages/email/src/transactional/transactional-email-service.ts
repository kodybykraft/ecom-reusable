import { eq } from 'drizzle-orm';
import { orders, orderLineItems, customers, returns, checkouts, cartItems, productVariants } from '@ecom/db';
import type { Database } from '@ecom/db';
import { formatMoney, escapeHtml } from '@ecom/core';
import type { SesClient } from '../ses/ses-client.js';
import type { TemplateService } from '../templates/template-service.js';

export class TransactionalEmailService {
  constructor(
    private db: Database,
    private ses: SesClient,
    private templates: TemplateService,
    private fromEmail: string,
    private fromName?: string,
  ) {}

  private async findTemplate(category: string) {
    // Check for custom template first, then fall back to seeded default
    const templates = await this.templates.list({ page: 1, pageSize: 100 });
    return templates.data.find((t) => t.category === category) ?? null;
  }

  private async renderAndSend(
    category: string,
    to: string,
    variables: Record<string, string>,
  ): Promise<string | null> {
    const template = await this.findTemplate(category);
    if (!template) {
      console.warn(`[email] No template found for category: ${category}`);
      return null;
    }

    const rendered = await this.templates.renderPreview(template.id, variables);
    if (!rendered) return null;

    // Replace variables in subject too
    let subject = rendered.subject;
    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    const result = await this.ses.sendEmail({
      to,
      subject,
      html: rendered.html,
    });

    return result.messageId;
  }

  async sendOrderConfirmation(orderId: string): Promise<string | null> {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { lineItems: true, customer: true },
    });
    if (!order) return null;

    const email = order.customer?.email ?? order.email;
    const firstName = order.customer?.firstName ?? 'Customer';

    const lineItemsHtml = order.lineItems
      .map(
        (li) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(li.title)} - ${escapeHtml(li.variantTitle)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${li.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatMoney(li.price * li.quantity)}</td></tr>`,
      )
      .join('');

    const shippingAddr = order.shippingAddress
      ? JSON.stringify(order.shippingAddress)
      : 'Not provided';

    return this.renderAndSend('order-confirmation', email, {
      storeName: this.fromName ?? 'Store',
      firstName,
      orderNumber: String(order.orderNumber),
      orderTotal: formatMoney(order.total),
      lineItems: lineItemsHtml,
      shippingAddress: typeof order.shippingAddress === 'object' && order.shippingAddress
        ? formatAddress(order.shippingAddress as Record<string, string>)
        : shippingAddr,
      orderUrl: `/account/orders/${order.id}`,
    });
  }

  async sendShippingConfirmation(orderId: string): Promise<string | null> {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { customer: true },
    });
    if (!order) return null;

    const email = order.customer?.email ?? order.email;
    const firstName = order.customer?.firstName ?? 'Customer';

    return this.renderAndSend('shipping-confirmation', email, {
      storeName: this.fromName ?? 'Store',
      firstName,
      orderNumber: String(order.orderNumber),
      trackingNumber: '',
      trackingUrl: '',
      carrier: '',
    });
  }

  async sendWelcomeEmail(customerId: string): Promise<string | null> {
    const customer = await this.db.query.customers.findFirst({
      where: eq(customers.id, customerId),
    });
    if (!customer) return null;

    return this.renderAndSend('welcome', customer.email, {
      storeName: this.fromName ?? 'Store',
      firstName: customer.firstName ?? 'there',
      shopUrl: '/',
    });
  }

  async sendReturnConfirmation(returnId: string): Promise<string | null> {
    const ret = await this.db.query.returns.findFirst({
      where: eq(returns.id, returnId),
      with: { order: true, customer: true, lineItems: true },
    });
    if (!ret) return null;

    const email = ret.customer?.email ?? ret.order?.email;
    if (!email) return null;

    const firstName = ret.customer?.firstName ?? 'Customer';

    const returnItemsHtml = ret.lineItems
      .map((li) => `<li>${li.quantity}x item</li>`)
      .join('');

    return this.renderAndSend('return-confirmation', email, {
      storeName: this.fromName ?? 'Store',
      firstName,
      returnId: ret.id.slice(0, 8).toUpperCase(),
      orderNumber: String(ret.order?.orderNumber ?? ''),
      returnItems: `<ul>${returnItemsHtml}</ul>`,
    });
  }

  async sendRefundNotification(orderId: string, amount: number): Promise<string | null> {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { customer: true },
    });
    if (!order) return null;

    const email = order.customer?.email ?? order.email;
    const firstName = order.customer?.firstName ?? 'Customer';

    return this.renderAndSend('refund-notification', email, {
      storeName: this.fromName ?? 'Store',
      firstName,
      orderNumber: String(order.orderNumber),
      refundAmount: formatMoney(amount),
    });
  }

  async sendAbandonedCartEmail(checkoutId: string): Promise<string | null> {
    const checkout = await this.db.query.checkouts.findFirst({
      where: eq(checkouts.id, checkoutId),
      with: { cart: { with: { items: true } } },
    });
    if (!checkout || !checkout.email) return null;

    const cartItemsHtml = checkout.cart?.items
      ?.map((item) => `<li>${item.quantity}x item</li>`)
      .join('') ?? '';

    return this.renderAndSend('abandoned-cart', checkout.email, {
      storeName: this.fromName ?? 'Store',
      firstName: 'there',
      cartItems: `<ul>${cartItemsHtml}</ul>`,
      cartTotal: formatMoney(checkout.total),
      cartUrl: `/checkout/${checkout.id}`,
    });
  }
}

function formatAddress(addr: Record<string, string>): string {
  const parts = [
    addr.address1,
    addr.address2,
    addr.city,
    addr.province,
    addr.zip,
    addr.country,
  ].filter(Boolean);
  return parts.join(', ');
}
