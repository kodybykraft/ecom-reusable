import { eq } from 'drizzle-orm';
import { paymentIntents, orders, orderTransactions } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { PaymentProvider, CreatePaymentData } from '@ecom/integrations';
import { NotFoundError, PaymentError } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class PaymentService {
  constructor(
    private db: Database,
    private provider: PaymentProvider,
  ) {}

  async createPaymentIntent(orderId: string, returnUrl?: string, cancelUrl?: string) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!order) throw new NotFoundError('Order', orderId);

    const data: CreatePaymentData = {
      amount: order.total,
      currency: order.currency,
      orderId: order.id,
      returnUrl,
      cancelUrl,
    };

    const result = await this.provider.createPaymentIntent(data);

    await this.db.insert(paymentIntents).values({
      orderId,
      provider: this.provider.id,
      providerIntentId: result.id,
      amount: order.total,
      currency: order.currency,
      status: result.status,
    });

    return result;
  }

  async capturePayment(providerIntentId: string) {
    const result = await this.provider.capturePayment(providerIntentId);

    // Update payment intent status
    await this.db
      .update(paymentIntents)
      .set({ status: result.status })
      .where(eq(paymentIntents.providerIntentId, providerIntentId));

    // Find the order and record transaction
    const intent = await this.db.query.paymentIntents.findFirst({
      where: eq(paymentIntents.providerIntentId, providerIntentId),
    });

    if (intent?.orderId && result.status === 'succeeded') {
      await this.db.insert(orderTransactions).values({
        orderId: intent.orderId,
        kind: 'sale',
        status: 'success',
        amount: result.amount,
        currency: intent.currency,
        gateway: this.provider.id,
        gatewayTransactionId: result.id,
      });

      await this.db
        .update(orders)
        .set({ financialStatus: 'paid' })
        .where(eq(orders.id, intent.orderId));

      await eventBus.emit('order.paid', { orderId: intent.orderId });
    }

    return result;
  }

  async refundPayment(orderId: string, amount?: number) {
    const intent = await this.db.query.paymentIntents.findFirst({
      where: eq(paymentIntents.orderId, orderId),
    });
    if (!intent) throw new PaymentError('No payment intent found for order');

    const result = await this.provider.refundPayment(intent.providerIntentId, amount);

    await this.db.insert(orderTransactions).values({
      orderId,
      kind: 'refund',
      status: result.status === 'succeeded' ? 'success' : 'pending',
      amount: result.amount,
      currency: intent.currency,
      gateway: this.provider.id,
      gatewayTransactionId: result.id,
    });

    const order = await this.db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    if (order && result.status === 'succeeded') {
      const newStatus = result.amount >= order.total ? 'refunded' : 'partially_refunded';
      await this.db.update(orders).set({ financialStatus: newStatus }).where(eq(orders.id, orderId));
      await eventBus.emit('order.refunded', { orderId, amount: result.amount });
    }

    return result;
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!this.provider.verifyWebhookSignature(rawBody, signature)) {
      throw new PaymentError('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    return this.provider.handleWebhook(event);
  }
}
