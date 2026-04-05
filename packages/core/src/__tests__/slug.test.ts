import { describe, it, expect } from 'vitest';
import { slugify, uniqueSlug } from '../utils/slug.js';

describe('slug utilities', () => {
  it('converts to lowercase kebab case', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Product #1 (Special!)')).toBe('product-1-special');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a---b---c')).toBe('a-b-c');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('-hello-')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('generates unique slugs', () => {
    const slug1 = uniqueSlug('Test Product');
    const slug2 = uniqueSlug('Test Product');
    expect(slug1).toMatch(/^test-product-/);
    expect(slug1).not.toBe(slug2);
  });
});
