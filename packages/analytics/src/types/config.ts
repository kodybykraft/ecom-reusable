export interface GoogleAnalyticsConfig {
  measurementId: string;
  apiSecret?: string;
}

export interface MetaPixelConfig {
  pixelId: string;
  accessToken?: string;
  testEventCode?: string;
}

export interface TikTokPixelConfig {
  pixelId: string;
  accessToken?: string;
}

export interface AnalyticsConfig {
  google?: GoogleAnalyticsConfig;
  meta?: MetaPixelConfig;
  tiktok?: TikTokPixelConfig;
}

export interface ClientAnalyticsConfig {
  google?: { measurementId: string };
  meta?: { pixelId: string };
  tiktok?: { pixelId: string };
}

export function toClientConfig(config: AnalyticsConfig): ClientAnalyticsConfig {
  const client: ClientAnalyticsConfig = {};
  if (config.google) client.google = { measurementId: config.google.measurementId };
  if (config.meta) client.meta = { pixelId: config.meta.pixelId };
  if (config.tiktok) client.tiktok = { pixelId: config.tiktok.pixelId };
  return client;
}
