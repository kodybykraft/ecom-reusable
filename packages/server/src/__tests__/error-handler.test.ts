import { describe, it, expect } from 'vitest';
import { handleError, getStatusCode } from '../middleware/error-handler.js';
import {
  EcomError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '@ecom/core';

describe('handleError', () => {
  it('converts EcomError to structured error response', () => {
    const err = new NotFoundError('Product', 'abc123');
    const result = handleError(err);

    expect(result.error.code).toBe('NOT_FOUND');
    expect(result.error.message).toBe('Product not found: abc123');
    expect(result.error.statusCode).toBe(404);
  });

  it('includes field for ValidationError', () => {
    const err = new ValidationError('Email is required', 'email');
    const result = handleError(err);

    expect(result.error.code).toBe('VALIDATION_ERROR');
    expect(result.error.field).toBe('email');
    expect(result.error.statusCode).toBe(400);
  });

  it('converts UnauthorizedError correctly', () => {
    const err = new UnauthorizedError('Invalid token');
    const result = handleError(err);

    expect(result.error.code).toBe('UNAUTHORIZED');
    expect(result.error.statusCode).toBe(401);
  });

  it('converts ForbiddenError correctly', () => {
    const err = new ForbiddenError('Admin access required');
    const result = handleError(err);

    expect(result.error.code).toBe('FORBIDDEN');
    expect(result.error.statusCode).toBe(403);
  });

  it('hides details for generic Error', () => {
    const err = new Error('database connection lost');
    const result = handleError(err);

    expect(result.error.code).toBe('INTERNAL_ERROR');
    expect(result.error.message).toBe('An unexpected error occurred');
    expect(result.error.statusCode).toBe(500);
  });

  it('handles non-Error values safely', () => {
    const result = handleError('some string error');

    expect(result.error.code).toBe('UNKNOWN_ERROR');
    expect(result.error.statusCode).toBe(500);
  });

  it('handles null/undefined safely', () => {
    expect(handleError(null).error.statusCode).toBe(500);
    expect(handleError(undefined).error.statusCode).toBe(500);
  });
});

describe('getStatusCode', () => {
  it('returns EcomError status codes', () => {
    expect(getStatusCode(new NotFoundError('x', '1'))).toBe(404);
    expect(getStatusCode(new UnauthorizedError('x'))).toBe(401);
    expect(getStatusCode(new ForbiddenError('x'))).toBe(403);
    expect(getStatusCode(new ValidationError('x'))).toBe(400);
  });

  it('returns 500 for generic errors', () => {
    expect(getStatusCode(new Error('oops'))).toBe(500);
    expect(getStatusCode('string')).toBe(500);
    expect(getStatusCode(null)).toBe(500);
  });
});
