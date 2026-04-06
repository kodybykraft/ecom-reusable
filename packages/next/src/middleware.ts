import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface EcomMiddlewareOptions {
  apiBasePath?: string;
  adminBasePath?: string;
}

export function createEcomMiddleware(options?: EcomMiddlewareOptions) {
  const apiBase = options?.apiBasePath ?? '/api/ecom';
  const adminBase = options?.adminBasePath ?? '/admin';

  return function ecomMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin API routes — check for Bearer token presence.
    // Actual token validation happens in route handlers (edge runtime can't access DB).
    if (pathname.startsWith(`${apiBase}/admin`)) {
      const authHeader = request.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Missing or invalid Authorization header' },
          { status: 401 },
        );
      }
    }

    // /admin/* pages — allow through, auth enforced client-side
    return NextResponse.next();
  };
}

export function createEcomMiddlewareConfig(options?: EcomMiddlewareOptions) {
  const apiBase = options?.apiBasePath ?? '/api/ecom';
  const adminBase = options?.adminBasePath ?? '/admin';

  return {
    matcher: [`${adminBase}/:path*`, `${apiBase}/admin/:path*`],
  };
}
