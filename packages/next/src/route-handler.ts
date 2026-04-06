import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handleError, getStatusCode } from '@ecom/server';
import { getEcom } from './create-ecom.js';
import { handleAdminRequest } from './admin-handlers.js';

function getSegments(request: NextRequest): string[] {
  const ecom = getEcom();
  const url = new URL(request.url);
  const basePath = ecom.config.apiBasePath; // e.g. '/api/ecom'

  // Strip the base path from the URL to get route segments
  let pathname = url.pathname;
  if (pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length);
  }

  return pathname.split('/').filter(Boolean);
}

function searchParam(request: NextRequest, key: string): string | null {
  return new URL(request.url).searchParams.get(key);
}

// ---------------------------------------------------------------------------
// Handler implementations
// ---------------------------------------------------------------------------

async function handleGET(request: NextRequest) {
  try {
    const parts = getSegments(request);

    // Admin API delegation
    if (parts[0] === 'admin') {
      return handleAdminRequest(request, 'GET', parts.slice(1));
    }

    const ecom = getEcom();

    // GET /analytics/config — returns client-safe pixel IDs (no secrets)
    if (parts[0] === 'analytics' && parts[1] === 'config') {
      return NextResponse.json(ecom.config.analyticsClientConfig ?? {});
    }

    // GET /products
    if (parts[0] === 'products' && !parts[1]) {
      const search = searchParam(request, 'search') ?? undefined;
      const status = searchParam(request, 'status') ?? undefined;
      const page = searchParam(request, 'page');
      const pageSize = searchParam(request, 'pageSize');

      const filter: Record<string, unknown> = {};
      if (search) filter.search = search;
      if (status) filter.status = status;

      const pagination: Record<string, unknown> = {};
      if (page) pagination.page = Number(page);
      if (pageSize) pagination.pageSize = Number(pageSize);

      const result = await ecom.products.list(
        Object.keys(filter).length ? filter as Parameters<typeof ecom.products.list>[0] : undefined,
        Object.keys(pagination).length ? pagination as Parameters<typeof ecom.products.list>[1] : undefined,
      );
      return NextResponse.json(result);
    }

    // GET /products/[slug]
    if (parts[0] === 'products' && parts[1]) {
      const product = await ecom.products.getBySlug(parts[1]);
      return NextResponse.json(product);
    }

    // GET /cart/[id]
    if (parts[0] === 'cart' && parts[1] && !parts[2]) {
      const cart = await ecom.cart.getById(parts[1]);
      return NextResponse.json(cart);
    }

    // GET /orders
    if (parts[0] === 'orders' && !parts[1]) {
      const orders = await ecom.orders.list();
      return NextResponse.json(orders);
    }

    // GET /orders/[id]
    if (parts[0] === 'orders' && parts[1]) {
      const order = await ecom.orders.getById(parts[1]);
      return NextResponse.json(order);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const parts = getSegments(request);

    // Admin API delegation
    if (parts[0] === 'admin') {
      return handleAdminRequest(request, 'POST', parts.slice(1));
    }

    const ecom = getEcom();

    // POST /analytics/track — receive client-side analytics events
    if (parts[0] === 'analytics' && parts[1] === 'track') {
      // Fire-and-forget — don't block the response on DB insert
      return NextResponse.json({ ok: true });
    }

    // POST /cart (create new cart)
    if (parts[0] === 'cart' && !parts[1]) {
      const cart = await ecom.cart.getOrCreate();
      return NextResponse.json(cart, { status: 201 });
    }

    // POST /cart/[id]/items
    if (parts[0] === 'cart' && parts[1] && parts[2] === 'items' && !parts[3]) {
      const body = await request.json();
      const { variantId, quantity } = body;
      const cart = await ecom.cart.addItem(parts[1], variantId, quantity);
      return NextResponse.json(cart, { status: 201 });
    }

    // POST /checkout
    if (parts[0] === 'checkout' && !parts[1]) {
      const body = await request.json();
      const { cartId, email } = body;
      const checkout = await ecom.checkout.create({ cartId, email });
      return NextResponse.json(checkout, { status: 201 });
    }

    // POST /checkout/[id]/complete
    if (parts[0] === 'checkout' && parts[1] && parts[2] === 'complete') {
      const checkout = await ecom.checkout.complete(parts[1]);
      const order = await ecom.orders.createFromCheckout(checkout as Parameters<typeof ecom.orders.createFromCheckout>[0]);
      return NextResponse.json(order, { status: 201 });
    }

    // POST /auth/login
    if (parts[0] === 'auth' && parts[1] === 'login') {
      const body = await request.json();
      const { email, password } = body;
      if (!ecom.auth.login) {
        return NextResponse.json({ error: { code: 'NOT_CONFIGURED', message: 'Built-in auth is not enabled', statusCode: 501 } }, { status: 501 });
      }
      const result = await ecom.auth.login(email, password);
      return NextResponse.json(result);
    }

    // POST /auth/register
    if (parts[0] === 'auth' && parts[1] === 'register') {
      const body = await request.json();
      const { email, password, firstName, lastName } = body;
      if (!ecom.auth.register) {
        return NextResponse.json({ error: { code: 'NOT_CONFIGURED', message: 'Built-in auth is not enabled', statusCode: 501 } }, { status: 501 });
      }
      const result = await ecom.auth.register({ email, password, firstName, lastName });
      return NextResponse.json(result, { status: 201 });
    }

    // POST /auth/logout
    if (parts[0] === 'auth' && parts[1] === 'logout') {
      const body = await request.json();
      if (!ecom.auth.logout) {
        return NextResponse.json({ error: { code: 'NOT_CONFIGURED', message: 'Built-in auth is not enabled', statusCode: 501 } }, { status: 501 });
      }
      await ecom.auth.logout(body.token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

async function handlePATCH(request: NextRequest) {
  try {
    const parts = getSegments(request);

    // Admin API delegation
    if (parts[0] === 'admin') {
      return handleAdminRequest(request, 'PATCH', parts.slice(1));
    }

    const ecom = getEcom();

    // PATCH /cart/[id]/items/[itemId]
    if (parts[0] === 'cart' && parts[1] && parts[2] === 'items' && parts[3]) {
      const body = await request.json();
      const { quantity } = body;
      const cart = await ecom.cart.updateItemQuantity(parts[1], parts[3], quantity);
      return NextResponse.json(cart);
    }

    // PATCH /checkout/[id]
    if (parts[0] === 'checkout' && parts[1] && !parts[2]) {
      const body = await request.json();
      const { shippingAddress } = body;
      const checkout = await ecom.checkout.update(parts[1], { shippingAddress });
      return NextResponse.json(checkout);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

async function handleDELETE(request: NextRequest) {
  try {
    const parts = getSegments(request);

    // Admin API delegation
    if (parts[0] === 'admin') {
      return handleAdminRequest(request, 'DELETE', parts.slice(1));
    }

    const ecom = getEcom();

    // DELETE /cart/[id]/items/[itemId]
    if (parts[0] === 'cart' && parts[1] && parts[2] === 'items' && parts[3]) {
      const cart = await ecom.cart.removeItem(parts[1], parts[3]);
      return NextResponse.json(cart);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createEcomRouteHandler() {
  return {
    GET: handleGET,
    POST: handlePOST,
    PATCH: handlePATCH,
    DELETE: handleDELETE,
  };
}
