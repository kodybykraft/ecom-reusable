import { createEcom } from '@ecom/next';

export const ecom = createEcom({
  databaseUrl: process.env.DATABASE_URL!,
  apiBasePath: '/api/ecom',
  adminBasePath: '/admin',
  analytics: {
    google: process.env.GA4_MEASUREMENT_ID
      ? { measurementId: process.env.GA4_MEASUREMENT_ID, apiSecret: process.env.GA4_API_SECRET }
      : undefined,
    meta: process.env.META_PIXEL_ID
      ? { pixelId: process.env.META_PIXEL_ID, accessToken: process.env.META_ACCESS_TOKEN }
      : undefined,
    tiktok: process.env.TIKTOK_PIXEL_ID
      ? { pixelId: process.env.TIKTOK_PIXEL_ID, accessToken: process.env.TIKTOK_ACCESS_TOKEN }
      : undefined,
  },
  email: process.env.RESEND_API_KEY
    ? {
        provider: 'resend' as const,
        apiKey: process.env.RESEND_API_KEY!,
        fromEmail: process.env.EMAIL_FROM ?? 'orders@stay-savage.com',
        fromName: 'Stay Savage',
      }
    : process.env.AWS_SES_ACCESS_KEY_ID
      ? {
          provider: 'ses' as const,
          region: 'eu-west-2',
          fromEmail: 'orders@stay-savage.com',
          fromName: 'Stay Savage',
          accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
        }
      : undefined,
  storage: process.env.R2_ACCOUNT_ID
    ? {
        provider: 'r2' as const,
        accountId: process.env.R2_ACCOUNT_ID!,
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        bucket: process.env.R2_BUCKET_NAME ?? 'stay-savage-media',
        publicUrl: process.env.R2_PUBLIC_URL ?? '',
      }
    : undefined,
});
