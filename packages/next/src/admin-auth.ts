import { getEcom } from './create-ecom.js';
import { UnauthorizedError, ForbiddenError } from '@ecom/core';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  firstName: string | null;
  lastName: string | null;
}

/**
 * Extract and validate a Bearer token from the request, returning the
 * authenticated admin/staff user. Throws if the token is missing, invalid,
 * or belongs to a customer-role account.
 */
export async function requireAdmin(request: Request): Promise<AdminUser> {
  const authHeader = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');

  // Extract token from Authorization header or HttpOnly cookie
  let token: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/ecom_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }
  const ecom = getEcom();
  const user = await ecom.auth.validateToken(token);

  if (!user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  if (user.role === 'customer') {
    throw new ForbiddenError('Admin access required');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/**
 * Check that the given admin user has permission to perform `action` on
 * `resource`. Admins are always allowed; staff permissions are checked
 * against the database.
 */
export async function requirePermission(
  user: AdminUser,
  resource: string,
  action: string,
): Promise<void> {
  if (user.role === 'admin') {
    return;
  }

  const ecom = getEcom();
  const allowed = await ecom.permissions.checkPermission(
    user,
    resource as Parameters<typeof ecom.permissions.checkPermission>[1],
    action as Parameters<typeof ecom.permissions.checkPermission>[2],
  );

  if (!allowed) {
    throw new ForbiddenError(`No permission to ${action} ${resource}`);
  }
}
