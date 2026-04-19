'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@ecom/react';

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: products } = useProducts({ search: query, pageSize: 5 });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 hover:text-bone transition-colors"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-ink/90 z-50 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8 animate-slide-up">
            <div className="max-w-xl mx-auto bg-card border border-border">
              {/* Search input */}
              <form onSubmit={handleSubmit} className="flex items-center border-b border-border px-4">
                <Search className="h-5 w-5 text-bone/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 p-4 bg-transparent text-bone placeholder:text-bone/40 focus:outline-none text-lg"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 text-bone/40 hover:text-bone"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {/* Results */}
              {query.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {products && products.length > 0 ? (
                    products.map((product: any) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-card transition-colors flex items-center justify-between border-b border-border last:border-b-0"
                      >
                        <div>
                          <p className="font-display text-sm uppercase text-bone">{product.title}</p>
                          <p className="text-xs text-bone/40">
                            {(product.metadata as any)?.collection === 'reflective'
                              ? 'Reflective'
                              : 'OG Series'}
                          </p>
                        </div>
                        <span className="text-sm font-display text-savage">
                          £{((product.variants?.[0]?.price ?? 0) / 100).toFixed(0)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-6 text-center text-bone/40 text-sm">
                      No products found.
                    </p>
                  )}

                  {/* View all results link */}
                  <button
                    type="button"
                    onClick={handleSubmit as any}
                    className="w-full px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-bone/60 hover:text-bone hover:bg-card transition-colors border-t border-border"
                  >
                    View all results →
                  </button>
                </div>
              )}

              {query.length === 0 && (
                <p className="px-4 py-6 text-center text-bone/40 text-xs">
                  Start typing to search. Press ESC to close.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
