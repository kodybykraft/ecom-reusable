import { createEcomRouteHandler } from '@ecom/next';

// Import ecom to ensure it's initialized before handling requests
import '../../../lib/ecom';

export const dynamic = 'force-dynamic';

export const { GET, POST, PATCH, DELETE } = createEcomRouteHandler();
