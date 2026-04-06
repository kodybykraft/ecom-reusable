import type { MetaPixelConfig } from '../types/config.js';

interface UserData {
  email?: string;
}

async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class MetaConversionApi {
  private readonly pixelId: string;
  private readonly accessToken: string;
  private readonly testEventCode?: string;

  constructor(config: MetaPixelConfig) {
    this.pixelId = config.pixelId;
    this.accessToken = config.accessToken ?? '';
    this.testEventCode = config.testEventCode;
  }

  async sendEvent(
    eventName: string,
    eventData: Record<string, unknown>,
    userData: UserData,
  ): Promise<void> {
    if (!this.accessToken) return;

    try {
      const hashedEmail = userData.email ? await hashEmail(userData.email) : undefined;

      const payload: Record<string, unknown> = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: hashedEmail ? { em: [hashedEmail] } : {},
            custom_data: eventData,
          },
        ],
        access_token: this.accessToken,
      };

      if (this.testEventCode) {
        payload.test_event_code = this.testEventCode;
      }

      await fetch(`https://graph.facebook.com/v18.0/${this.pixelId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('[meta-capi] Failed to send event:', eventName, error);
    }
  }
}
