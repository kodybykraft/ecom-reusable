import { createEcomRouteHandler } from '@ecom/next';
import '@/lib/ecom';

export const dynamic = 'force-dynamic';

export const { GET, POST, PATCH, DELETE } = createEcomRouteHandler();
