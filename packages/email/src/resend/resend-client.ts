import { Resend } from 'resend';

export interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

/**
 * Resend email sender — drop-in replacement for SesClient.
 * Same method signatures so TransactionalEmailService + AutomationExecutor work unchanged.
 */
export class ResendClient {
  private client: Resend;

  constructor(private config: ResendConfig) {
    this.client = new Resend(config.apiKey);
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
    const from = this.config.fromName
      ? `${this.config.fromName} <${this.config.fromEmail}>`
      : this.config.fromEmail;

    const tags = input.tags
      ? Object.entries(input.tags).map(([name, value]) => ({ name, value }))
      : undefined;

    const { data, error } = await this.client.emails.send({
      from,
      to: recipients,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      tags,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }

    return { messageId: data?.id ?? crypto.randomUUID() };
  }

  async sendBulk(inputs: Array<{
    to: string;
    subject: string;
    html: string;
    text?: string;
  }>): Promise<Array<{ to: string; messageId: string; error?: string }>> {
    const from = this.config.fromName
      ? `${this.config.fromName} <${this.config.fromEmail}>`
      : this.config.fromEmail;

    const { data, error } = await this.client.batch.send(
      inputs.map((input) => ({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      })),
    );

    if (error) {
      return inputs.map((input) => ({
        to: input.to,
        messageId: '',
        error: error.message,
      }));
    }

    return inputs.map((input, i) => ({
      to: input.to,
      messageId: (data as { data: { id: string }[] })?.data?.[i]?.id ?? '',
    }));
  }

  getConfig() {
    return { fromEmail: this.config.fromEmail, fromName: this.config.fromName };
  }
}
