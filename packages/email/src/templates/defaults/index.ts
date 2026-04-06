import { eq } from 'drizzle-orm';
import { emailTemplates } from '@ecom/db';
import type { Database } from '@ecom/db';
import { orderConfirmationTemplate } from './order-confirmation.js';
import { shippingConfirmationTemplate } from './shipping-confirmation.js';
import { welcomeTemplate } from './welcome.js';
import { returnConfirmationTemplate } from './return-confirmation.js';
import { refundNotificationTemplate } from './refund-notification.js';
import { abandonedCartTemplate } from './abandoned-cart.js';

export {
  orderConfirmationTemplate,
  shippingConfirmationTemplate,
  welcomeTemplate,
  returnConfirmationTemplate,
  refundNotificationTemplate,
  abandonedCartTemplate,
};

const defaultTemplates = [
  orderConfirmationTemplate,
  shippingConfirmationTemplate,
  welcomeTemplate,
  returnConfirmationTemplate,
  refundNotificationTemplate,
  abandonedCartTemplate,
];

/**
 * Seeds the database with default email templates.
 * Only inserts templates whose category does not already exist in the DB.
 * Returns the number of templates that were seeded.
 */
export async function seedDefaultTemplates(db: Database): Promise<number> {
  let seeded = 0;

  for (const template of defaultTemplates) {
    const existing = await db.query.emailTemplates.findFirst({
      where: eq(emailTemplates.category, template.category),
    });

    if (!existing) {
      const variableMatches = template.htmlContent.match(/\{\{(\w+)\}\}/g) ?? [];
      const variables = [...new Set(variableMatches.map((m) => m.replace(/\{\{|\}\}/g, '')))];

      await db.insert(emailTemplates).values({
        name: template.name,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        category: template.category,
        variables,
      });

      seeded++;
    }
  }

  return seeded;
}
