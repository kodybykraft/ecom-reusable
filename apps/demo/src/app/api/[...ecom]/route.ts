export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handleError, getStatusCode } from '@ecom/server';

async function getEcomInstance() {
  const { ecom } = await import('../../../lib/ecom');
  return ecom;
}

function segments(request: NextRequest): string[] {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  // Remove leading "api" segment — the rest forms the route
  const idx = parts.indexOf('api');
  return idx >= 0 ? parts.slice(idx + 1) : parts;
}

function searchParam(request: NextRequest, key: string): string | null {
  return new URL(request.url).searchParams.get(key);
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const ecom = await getEcomInstance();
    const parts = segments(request);

    // GET /api/ecom/products
    if (parts[0] === 'ecom' && parts[1] === 'products' && !parts[2]) {
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

    // GET /api/ecom/products/[slug]
    if (parts[0] === 'ecom' && parts[1] === 'products' && parts[2]) {
      const product = await ecom.products.getBySlug(parts[2]);
      return NextResponse.json(product);
    }

    // GET /api/ecom/cart/[id]
    if (parts[0] === 'ecom' && parts[1] === 'cart' && parts[2] && !parts[3]) {
      const cart = await ecom.cart.getById(parts[2]);
      return NextResponse.json(cart);
    }

    // GET /api/ecom/orders
    if (parts[0] === 'ecom' && parts[1] === 'orders' && !parts[2]) {
      const orders = await ecom.orders.list();
      return NextResponse.json(orders);
    }

    // GET /api/ecom/orders/[id]
    if (parts[0] === 'ecom' && parts[1] === 'orders' && parts[2]) {
      const order = await ecom.orders.getById(parts[2]);
      return NextResponse.json(order);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const ecom = await getEcomInstance();
    const parts = segments(request);

    // POST /api/ecom/cart (create new cart)
    if (parts[0] === 'ecom' && parts[1] === 'cart' && !parts[2]) {
      const cart = await ecom.cart.getOrCreate();
      return NextResponse.json(cart, { status: 201 });
    }

    // POST /api/ecom/cart/[id]/items
    if (parts[0] === 'ecom' && parts[1] === 'cart' && parts[2] && parts[3] === 'items' && !parts[4]) {
      const body = await request.json();
      const { variantId, quantity } = body;
      const cart = await ecom.cart.addItem(parts[2], variantId, quantity);
      return NextResponse.json(cart, { status: 201 });
    }

    // POST /api/ecom/checkout
    if (parts[0] === 'ecom' && parts[1] === 'checkout' && !parts[2]) {
      const body = await request.json();
      const { cartId, email } = body;
      const checkout = await ecom.checkout.create({ cartId, email });
      return NextResponse.json(checkout, { status: 201 });
    }

    // POST /api/ecom/checkout/[id]/complete
    if (parts[0] === 'ecom' && parts[1] === 'checkout' && parts[2] && parts[3] === 'complete') {
      const checkout = await ecom.checkout.complete(parts[2]);
      const order = await ecom.orders.createFromCheckout(checkout as Parameters<typeof ecom.orders.createFromCheckout>[0]);
      return NextResponse.json(order, { status: 201 });
    }

    // POST /api/ecom/auth/login
    if (parts[0] === 'ecom' && parts[1] === 'auth' && parts[2] === 'login') {
      const body = await request.json();
      const { email, password } = body;
      const result = await ecom.auth.login(email, password);
      return NextResponse.json(result);
    }

    // POST /api/ecom/auth/register
    if (parts[0] === 'ecom' && parts[1] === 'auth' && parts[2] === 'register') {
      const body = await request.json();
      const { email, password, firstName, lastName } = body;
      const result = await ecom.auth.register({ email, password, firstName, lastName });
      return NextResponse.json(result, { status: 201 });
    }

    // POST /api/ecom/auth/logout
    if (parts[0] === 'ecom' && parts[1] === 'auth' && parts[2] === 'logout') {
      const body = await request.json();
      await ecom.auth.logout(body.token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

// ---------------------------------------------------------------------------
// PATCH
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  try {
    const ecom = await getEcomInstance();
    const parts = segments(request);

    // PATCH /api/ecom/cart/[id]/items/[itemId]
    if (parts[0] === 'ecom' && parts[1] === 'cart' && parts[2] && parts[3] === 'items' && parts[4]) {
      const body = await request.json();
      const { quantity } = body;
      const cart = await ecom.cart.updateItemQuantity(parts[2], parts[4], quantity);
      return NextResponse.json(cart);
    }

    // PATCH /api/ecom/checkout/[id]
    if (parts[0] === 'ecom' && parts[1] === 'checkout' && parts[2] && !parts[3]) {
      const body = await request.json();
      const { shippingAddress } = body;
      const checkout = await ecom.checkout.update(parts[2], { shippingAddress });
      return NextResponse.json(checkout);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const ecom = await getEcomInstance();
    const parts = segments(request);

    // DELETE /api/ecom/cart/[id]/items/[itemId]
    if (parts[0] === 'ecom' && parts[1] === 'cart' && parts[2] && parts[3] === 'items' && parts[4]) {
      const cart = await ecom.cart.removeItem(parts[2], parts[4]);
      return NextResponse.json(cart);
    }

    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } }, { status: 404 });
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}
