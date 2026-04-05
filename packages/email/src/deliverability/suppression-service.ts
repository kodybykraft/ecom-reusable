import { eq } from 'drizzle-orm';
import { emailSuppressionList, emailContacts } from '@ecom/db';
import type { Database } from '@ecom/db';

export class SuppressionService {
  constructor(private db: Database) {}

  async list() {
    return this.db.query.emailSuppressionList.findMany({
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });
  }

  async isEmailSuppressed(email: string): Promise<boolean> {
    const entry = await this.db.query.emailSuppressionList.findFirst({
      where: eq(emailSuppressionList.email, email),
    });
    return !!entry;
  }

  async suppress(email: string, reason: 'bounce' | 'complaint' | 'manual') {
    const existing = await this.isEmailSuppressed(email);
    if (existing) return;

    await this.db.insert(emailSuppressionList).values({ email, reason });

    // Also update contact status
    await this.db.update(emailContacts).set({
      status: reason === 'complaint' ? 'complained' : 'bounced',
    }).where(eq(emailContacts.email, email));
  }

  async remove(email: string) {
    await this.db.delete(emailSuppressionList).where(eq(emailSuppressionList.email, email));
  }

  /** Handle SES SNS bounce/complaint notification */
  async handleSnsNotification(notification: {
    notificationType: 'Bounce' | 'Complaint';
    bounce?: { bouncedRecipients: Array<{ emailAddress: string }> };
    complaint?: { complainedRecipients: Array<{ emailAddress: string }> };
  }) {
    if (notification.notificationType === 'Bounce' && notification.bounce) {
      for (const recipient of notification.bounce.bouncedRecipients) {
        await this.suppress(recipient.emailAddress, 'bounce');
      }
    }

    if (notification.notificationType === 'Complaint' && notification.complaint) {
      for (const recipient of notification.complaint.complainedRecipients) {
        await this.suppress(recipient.emailAddress, 'complaint');
      }
    }
  }
}
