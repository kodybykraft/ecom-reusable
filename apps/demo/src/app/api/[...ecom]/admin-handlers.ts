import { NextResponse } from 'next/server';
import { requireAdmin } from '@ecom/next';
import { handleError, getStatusCode } from '@ecom/server';

function parsePagination(url: URL) {
  const page = url.searchParams.get('page');
  const pageSize = url.searchParams.get('pageSize');
  const pagination: Record<string, number> = {};
  if (page) pagination.page = Number(page);
  if (pageSize) pagination.pageSize = Number(pageSize);
  return Object.keys(pagination).length ? pagination : undefined;
}

export async function handleAdminRequest(
  request: Request,
  method: string,
  segments: string[],
): Promise<NextResponse> {
  try {
    await requireAdmin(request);

    const { ecom } = await import('../../../lib/ecom');
    const url = new URL(request.url);
    const pagination = parsePagination(url);

    // -----------------------------------------------------------------------
    // GET
    // -----------------------------------------------------------------------
    if (method === 'GET') {
      // GET /admin/orders
      if (segments[0] === 'orders' && !segments[1]) {
        const filter: Record<string, unknown> = {};
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');
        if (status) filter.status = status;
        if (search) filter.search = search;
        const result = await ecom.orders.list(
          Object.keys(filter).length ? filter as any : undefined,
          pagination as any,
        );
        return NextResponse.json(result);
      }

      // GET /admin/orders/:id
      if (segments[0] === 'orders' && segments[1] && !segments[2]) {
        const result = await ecom.orders.getById(segments[1]);
        return NextResponse.json(result);
      }

      // GET /admin/products
      if (segments[0] === 'products' && !segments[1]) {
        const filter: Record<string, unknown> = {};
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');
        if (status) filter.status = status;
        if (search) filter.search = search;
        const result = await ecom.products.list(
          Object.keys(filter).length ? filter as any : undefined,
          pagination as any,
        );
        return NextResponse.json(result);
      }

      // GET /admin/customers
      if (segments[0] === 'customers' && !segments[1]) {
        const search = url.searchParams.get('search') ?? undefined;
        const result = await ecom.customers.list(search, pagination as any);
        return NextResponse.json(result);
      }

      // GET /admin/customers/:id
      if (segments[0] === 'customers' && segments[1] && !segments[2]) {
        const result = await ecom.customers.getById(segments[1]);
        return NextResponse.json(result);
      }

      // GET /admin/discounts
      if (segments[0] === 'discounts' && !segments[1]) {
        const result = await ecom.discounts.list(pagination as any);
        return NextResponse.json(result);
      }

      // GET /admin/inventory/levels
      if (segments[0] === 'inventory' && segments[1] === 'levels') {
        const filter: Record<string, unknown> = {};
        const search = url.searchParams.get('search');
        const locationId = url.searchParams.get('locationId');
        if (search) filter.search = search;
        if (locationId) filter.locationId = locationId;
        const result = await ecom.inventory.getLevels(
          Object.keys(filter).length ? filter as any : undefined,
          pagination as any,
        );
        return NextResponse.json(result);
      }

      // GET /admin/inventory/locations
      if (segments[0] === 'inventory' && segments[1] === 'locations') {
        const result = await ecom.inventory.listLocations();
        return NextResponse.json(result);
      }

      // GET /admin/returns
      if (segments[0] === 'returns' && !segments[1]) {
        const filter: Record<string, unknown> = {};
        const status = url.searchParams.get('status');
        if (status) filter.status = status;
        const result = await ecom.returns.list(
          Object.keys(filter).length ? filter as any : undefined,
          pagination as any,
        );
        return NextResponse.json(result);
      }

      // GET /admin/returns/:id
      if (segments[0] === 'returns' && segments[1] && !segments[2]) {
        const result = await ecom.returns.getById(segments[1]);
        return NextResponse.json(result);
      }

      // GET /admin/drafts
      if (segments[0] === 'drafts' && !segments[1]) {
        const result = await ecom.draftOrders.list(pagination as any);
        return NextResponse.json(result);
      }

      // GET /admin/drafts/:id
      if (segments[0] === 'drafts' && segments[1] && !segments[2]) {
        const result = await ecom.draftOrders.getById(segments[1]);
        return NextResponse.json(result);
      }

      // GET /admin/categories
      if (segments[0] === 'categories' && !segments[1]) {
        const result = await ecom.categories.listCategories();
        return NextResponse.json(result);
      }

      // GET /admin/collections
      if (segments[0] === 'collections' && !segments[1]) {
        const result = await ecom.categories.listCollections();
        return NextResponse.json(result);
      }

      // GET /admin/webhooks
      if (segments[0] === 'webhooks' && !segments[1]) {
        const result = await ecom.webhooks.list();
        return NextResponse.json(result);
      }

      // GET /admin/settings/:section
      if (segments[0] === 'settings' && segments[1]) {
        const result = await ecom.settings.getByGroup(segments[1]);
        return NextResponse.json(result);
      }

      // GET /admin/staff
      if (segments[0] === 'staff' && !segments[1]) {
        const result = await ecom.staff.list();
        return NextResponse.json(result);
      }

      // GET /admin/analytics
      if (segments[0] === 'analytics' && !segments[1]) {
        const from = url.searchParams.get('from') ?? undefined;
        const to = url.searchParams.get('to') ?? undefined;
        const result = await ecom.analyticsQuery.getDashboardStats({ from, to } as any);
        return NextResponse.json(result);
      }

      // GET /admin/activity-log
      if (segments[0] === 'activity-log' && !segments[1]) {
        const filter: Record<string, unknown> = {};
        const resource = url.searchParams.get('resource');
        const action = url.searchParams.get('action');
        if (resource) filter.resource = resource;
        if (action) filter.action = action;
        const result = await ecom.activityLog.list(
          Object.keys(filter).length ? filter as any : undefined,
          pagination as any,
        );
        return NextResponse.json(result);
      }

      // GET /admin/abandoned-checkouts
      if (segments[0] === 'abandoned-checkouts' && !segments[1]) {
        const result = await ecom.abandonedCheckouts.list(pagination as any);
        return NextResponse.json(result);
      }
    }

    // -----------------------------------------------------------------------
    // POST
    // -----------------------------------------------------------------------
    if (method === 'POST') {
      const body = await request.json();

      // POST /admin/products
      if (segments[0] === 'products' && !segments[1]) {
        const result = await ecom.products.create(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/discounts
      if (segments[0] === 'discounts' && !segments[1]) {
        const result = await ecom.discounts.create(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/inventory/adjust
      if (segments[0] === 'inventory' && segments[1] === 'adjust') {
        const result = await ecom.inventory.adjustStock(body);
        return NextResponse.json(result);
      }

      // POST /admin/returns
      if (segments[0] === 'returns' && !segments[1]) {
        const result = await ecom.returns.create(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/drafts
      if (segments[0] === 'drafts' && !segments[1]) {
        const result = await ecom.draftOrders.create(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/drafts/:id/convert
      if (segments[0] === 'drafts' && segments[1] && segments[2] === 'convert') {
        const result = await ecom.draftOrders.convertToOrder(segments[1]);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/categories
      if (segments[0] === 'categories' && !segments[1]) {
        const result = await ecom.categories.createCategory(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/collections
      if (segments[0] === 'collections' && !segments[1]) {
        const result = await ecom.categories.createCollection(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/webhooks
      if (segments[0] === 'webhooks' && !segments[1]) {
        const result = await ecom.webhooks.create(body);
        return NextResponse.json(result, { status: 201 });
      }

      // POST /admin/staff
      if (segments[0] === 'staff' && !segments[1]) {
        const result = await ecom.staff.create(body);
        return NextResponse.json(result, { status: 201 });
      }
    }

    // -----------------------------------------------------------------------
    // PATCH
    // -----------------------------------------------------------------------
    if (method === 'PATCH') {
      const body = await request.json();

      // PATCH /admin/orders/:id/fulfill
      if (segments[0] === 'orders' && segments[1] && segments[2] === 'fulfill') {
        const result = await ecom.orders.updateFulfillmentStatus(segments[1], 'fulfilled');
        return NextResponse.json(result);
      }

      // PATCH /admin/orders/:id/cancel
      if (segments[0] === 'orders' && segments[1] && segments[2] === 'cancel') {
        const result = await ecom.orders.cancel(segments[1]);
        return NextResponse.json(result);
      }

      // PATCH /admin/products/:id
      if (segments[0] === 'products' && segments[1] && !segments[2]) {
        const result = await ecom.products.update(segments[1], body);
        return NextResponse.json(result);
      }

      // PATCH /admin/discounts/:id
      if (segments[0] === 'discounts' && segments[1] && !segments[2]) {
        const result = await ecom.discounts.update(segments[1], body);
        return NextResponse.json(result);
      }

      // PATCH /admin/returns/:id/approve
      if (segments[0] === 'returns' && segments[1] && segments[2] === 'approve') {
        const result = await ecom.returns.approve(segments[1]);
        return NextResponse.json(result);
      }

      // PATCH /admin/returns/:id/receive
      if (segments[0] === 'returns' && segments[1] && segments[2] === 'receive') {
        const result = await ecom.returns.markReceived(segments[1]);
        return NextResponse.json(result);
      }

      // PATCH /admin/returns/:id/refund
      if (segments[0] === 'returns' && segments[1] && segments[2] === 'refund') {
        const result = await ecom.returns.processRefund(segments[1]);
        return NextResponse.json(result);
      }

      // PATCH /admin/drafts/:id
      if (segments[0] === 'drafts' && segments[1] && !segments[2]) {
        const result = await ecom.draftOrders.update(segments[1], body);
        return NextResponse.json(result);
      }

      // PATCH /admin/webhooks/:id
      if (segments[0] === 'webhooks' && segments[1] && !segments[2]) {
        const result = await ecom.webhooks.update(segments[1], body);
        return NextResponse.json(result);
      }

      // PATCH /admin/settings/:section
      if (segments[0] === 'settings' && segments[1]) {
        const entries = Object.entries(body).map(([key, value]) => ({
          group: segments[1],
          key,
          value: value as string,
        }));
        const result = await ecom.settings.setBulk(entries as any);
        return NextResponse.json(result);
      }

      // PATCH /admin/staff/:id
      if (segments[0] === 'staff' && segments[1] && !segments[2]) {
        const result = await ecom.staff.update(segments[1], body);
        return NextResponse.json(result);
      }
    }

    // -----------------------------------------------------------------------
    // DELETE
    // -----------------------------------------------------------------------
    if (method === 'DELETE') {
      // DELETE /admin/products/:id
      if (segments[0] === 'products' && segments[1] && !segments[2]) {
        await ecom.products.delete(segments[1]);
        return NextResponse.json({ success: true });
      }

      // DELETE /admin/discounts/:id
      if (segments[0] === 'discounts' && segments[1] && !segments[2]) {
        await ecom.discounts.delete(segments[1]);
        return NextResponse.json({ success: true });
      }

      // DELETE /admin/drafts/:id
      if (segments[0] === 'drafts' && segments[1] && !segments[2]) {
        await ecom.draftOrders.delete(segments[1]);
        return NextResponse.json({ success: true });
      }

      // DELETE /admin/webhooks/:id
      if (segments[0] === 'webhooks' && segments[1] && !segments[2]) {
        await ecom.webhooks.delete(segments[1]);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Admin route not found', statusCode: 404 } },
      { status: 404 },
    );
  } catch (err) {
    const body = handleError(err);
    return NextResponse.json(body, { status: getStatusCode(err) });
  }
}
