import type { TransactionalEmailService } from './transactional-email-service.js';

interface EventBusLike {
  on(event: string, handler: (payload: any) => void | Promise<void>): void;
}

/**
 * Registers event bus listeners that trigger transactional emails.
 * All handlers are wrapped in try/catch — email failures never break commerce flow.
 */
export function registerEmailEventHandlers(
  eventBus: EventBusLike,
  emailService: TransactionalEmailService,
): void {
  eventBus.on('order.created', async (payload: { orderId: string }) => {
    try {
      await emailService.sendOrderConfirmation(payload.orderId);
    } catch (err) {
      console.error('[email] Failed to send order confirmation:', err);
    }
  });

  eventBus.on('order.fulfilled', async (payload: { orderId: string }) => {
    try {
      await emailService.sendShippingConfirmation(payload.orderId);
    } catch (err) {
      console.error('[email] Failed to send shipping confirmation:', err);
    }
  });

  eventBus.on('customer.created', async (payload: { customerId: string }) => {
    try {
      await emailService.sendWelcomeEmail(payload.customerId);
    } catch (err) {
      console.error('[email] Failed to send welcome email:', err);
    }
  });

  eventBus.on('return.approved', async (payload: { returnId: string }) => {
    try {
      await emailService.sendReturnConfirmation(payload.returnId);
    } catch (err) {
      console.error('[email] Failed to send return confirmation:', err);
    }
  });

  eventBus.on('order.refunded', async (payload: { orderId: string; amount: number }) => {
    try {
      await emailService.sendRefundNotification(payload.orderId, payload.amount);
    } catch (err) {
      console.error('[email] Failed to send refund notification:', err);
    }
  });
}
