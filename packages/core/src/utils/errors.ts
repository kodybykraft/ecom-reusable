export class EcomError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'EcomError';
  }
}

export class NotFoundError extends EcomError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends EcomError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class InsufficientStockError extends EcomError {
  constructor(variantId: string, requested: number, available: number) {
    super(
      `Insufficient stock for variant ${variantId}: requested ${requested}, available ${available}`,
      'INSUFFICIENT_STOCK',
      409,
    );
    this.name = 'InsufficientStockError';
  }
}

export class DiscountError extends EcomError {
  constructor(message: string) {
    super(message, 'DISCOUNT_ERROR', 400);
    this.name = 'DiscountError';
  }
}

export class PaymentError extends EcomError {
  constructor(message: string) {
    super(message, 'PAYMENT_ERROR', 402);
    this.name = 'PaymentError';
  }
}

export class UnauthorizedError extends EcomError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends EcomError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}
