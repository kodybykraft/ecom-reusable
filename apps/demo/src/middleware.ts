import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes — check for Bearer token presence.
  // Actual token validation happens in route handlers (edge runtime can't access DB).
  if (pathname.startsWith('/api/ecom/admin')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing or invalid Authorization header' },
        { status: 401 },
      );
    }
  }

  // /admin/* pages — allow through, auth enforced client-side for now
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/ecom/admin/:path*'],
};
