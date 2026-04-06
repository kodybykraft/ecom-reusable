import type { AnalyticsConfig } from '../types/config.js';
import { MetaConversionApi } from './meta-capi.js';
import { GoogleMeasurementProtocol } from './google-mp.js';
import { TikTokEventsApi } from './tiktok-events-api.js';

interface OrderData {
  email: string;
  total: number;
  currency: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}

interface EventBus {
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

export function registerAnalyticsEventHandlers(
  eventBus: EventBus,
  config: AnalyticsConfig,
  getOrderData: (orderId: string) => Promise<OrderData | null>,
) {
  const meta = config.meta?.accessToken ? new MetaConversionApi(config.meta) : null;
  const google = config.google?.apiSecret ? new GoogleMeasurementProtocol(config.google) : null;
  const tiktok = config.tiktok?.accessToken ? new TikTokEventsApi(config.tiktok) : null;

  if (!meta && !google && !tiktok) return;

  eventBus.on('order.created', async (payload: unknown) => {
    const { orderId, customerId } = payload as { orderId: string; customerId?: string };
    const order = await getOrderData(orderId);
    if (!order) return;

    const promises: Promise<void>[] = [];

    if (meta) {
      promises.push(
        meta.sendEvent(
          'Purchase',
          {
            value: order.total / 100,
            currency: order.currency,
            content_ids: order.items.map((i) => i.id),
          },
          { email: order.email },
        ),
      );
    }

    if (google) {
      promises.push(
        google.sendEvent(orderId, 'purchase', {
          transaction_id: orderId,
          value: order.total / 100,
          currency: order.currency,
        }),
      );
    }

    if (tiktok) {
      promises.push(
        tiktok.sendEvent(
          'CompletePayment',
          {
            value: order.total / 100,
            currency: order.currency,
          },
          {},
        ),
      );
    }

    await Promise.allSettled(promises);
  });
}
