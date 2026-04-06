import type { TikTokPixelConfig } from '../types/config.js';

interface UserContext {
  userAgent?: string;
  ip?: string;
}

export class TikTokEventsApi {
  private readonly pixelCode: string;
  private readonly accessToken: string;

  constructor(config: TikTokPixelConfig) {
    this.pixelCode = config.pixelId;
    this.accessToken = config.accessToken ?? '';
  }

  async sendEvent(
    eventName: string,
    eventData: Record<string, unknown>,
    userData: UserContext,
  ): Promise<void> {
    if (!this.accessToken) return;

    try {
      await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': this.accessToken,
        },
        body: JSON.stringify({
          pixel_code: this.pixelCode,
          event: eventName,
          timestamp: new Date().toISOString(),
          context: {
            user_agent: userData.userAgent,
            ip: userData.ip,
          },
          properties: eventData,
        }),
      });
    } catch (error) {
      console.error('[tiktok-events-api] Failed to send event:', eventName, error);
    }
  }
}
