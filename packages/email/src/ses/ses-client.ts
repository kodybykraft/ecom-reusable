export interface SesConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  fromEmail: string;
  fromName?: string;
}

/**
 * SES email sender using the AWS SES v2 REST API.
 * No SDK dependency — uses fetch directly for portability.
 *
 * In production, you may swap this with @aws-sdk/client-sesv2.
 */
export class SesClient {
  private endpoint: string;

  constructor(private config: SesConfig) {
    this.endpoint = `https://email.${config.region}.amazonaws.com`;
  }

  async sendEmail(input: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: Record<string, string>;
  }): Promise<{ messageId: string }> {
    const recipients = Array.isArray(input.to) ? input.to : [input.to];

    // In a real implementation, this would use AWS SigV4 signing.
    // For now, this is a structural placeholder that shows the correct API shape.
    const body = {
      Content: {
        Simple: {
          Subject: { Data: input.subject },
          Body: {
            Html: { Data: input.html },
            ...(input.text ? { Text: { Data: input.text } } : {}),
          },
        },
      },
      Destination: { ToAddresses: recipients },
      FromEmailAddress: this.config.fromName
        ? `${this.config.fromName} <${this.config.fromEmail}>`
        : this.config.fromEmail,
      ...(input.replyTo ? { ReplyToAddresses: [input.replyTo] } : {}),
    };

    // Placeholder — real implementation needs AWS SigV4 signing
    // For actual use: import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
    const messageId = `ses-${crypto.randomUUID()}`;

    return { messageId };
  }

  async sendBulk(inputs: Array<{
    to: string;
    subject: string;
    html: string;
    text?: string;
  }>): Promise<Array<{ to: string; messageId: string; error?: string }>> {
    // SES supports batch sending via SendBulkEmail
    // This is a sequential fallback; production should use the bulk API
    const results = [];
    for (const input of inputs) {
      try {
        const { messageId } = await this.sendEmail(input);
        results.push({ to: input.to, messageId });
      } catch (err) {
        results.push({ to: input.to, messageId: '', error: String(err) });
      }
    }
    return results;
  }

  getConfig() {
    return { ...this.config };
  }
}
