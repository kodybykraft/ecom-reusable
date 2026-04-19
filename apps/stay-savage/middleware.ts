import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE = '/api/ecom';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes — require Bearer token or cookie.
  // Page-level auth is handled in src/app/admin/(auth)/layout.tsx.
  if (pathname.startsWith(`${API_BASE}/admin`)) {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('ecom_token')?.value;
    if (!authHeader?.startsWith('Bearer ') && !cookieToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header', statusCode: 401 } },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/ecom/admin/:path*'],
};
