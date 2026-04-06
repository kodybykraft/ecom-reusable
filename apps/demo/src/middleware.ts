import { createEcomMiddleware } from '@ecom/next';

export default createEcomMiddleware();

export const config = {
  matcher: ['/admin/:path*', '/api/ecom/admin/:path*'],
};
