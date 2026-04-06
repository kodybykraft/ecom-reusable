import { eq, and, lt } from 'drizzle-orm';
import { checkouts } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { TransactionalEmailService } from './transactional-email-service.js';

// Track which checkouts have already received recovery emails.
// Resets on server restart — at worst sends one duplicate after deploy.
const sentCheckoutIds = new Set<string>();

/**
 * Finds abandoned checkouts (pending for > 2 hours) and sends recovery emails.
 */
export async function checkAbandonedCarts(
  db: Database,
  emailService: TransactionalEmailService,
): Promise<number> {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const abandoned = await db.query.checkouts.findMany({
    where: and(
      eq(checkouts.status, 'pending'),
      lt(checkouts.createdAt, twoHoursAgo),
    ),
  });

  let sent = 0;

  for (const checkout of abandoned) {
    if (sentCheckoutIds.has(checkout.id)) continue;

    try {
      await emailService.sendAbandonedCartEmail(checkout.id);
      sentCheckoutIds.add(checkout.id);
      sent++;
    } catch (err) {
      console.error(`[email] Failed to send abandoned cart email for checkout ${checkout.id}:`, err);
    }
  }

  return sent;
}
