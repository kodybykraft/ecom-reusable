import type { GoogleAnalyticsConfig } from '../types/config.js';

export class GoogleMeasurementProtocol {
  private readonly measurementId: string;
  private readonly apiSecret: string;

  constructor(config: GoogleAnalyticsConfig) {
    this.measurementId = config.measurementId;
    this.apiSecret = config.apiSecret ?? '';
  }

  async sendEvent(
    clientId: string,
    eventName: string,
    params: Record<string, unknown>,
  ): Promise<void> {
    if (!this.apiSecret) return;

    try {
      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: eventName, params }],
        }),
      });
    } catch (error) {
      console.error('[google-mp] Failed to send event:', eventName, error);
    }
  }
}
