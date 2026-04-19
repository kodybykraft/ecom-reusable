'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type FilterGroup = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

export const DEFAULT_FILTERS: FilterGroup[] = [
  {
    key: 'category',
    label: 'Range',
    options: [
      { value: 'og', label: 'OG Tracksuit' },
      { value: 'reflective', label: 'Reflective' },
    ],
  },
  {
    key: 'color',
    label: 'Colour',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'grey', label: 'Grey' },
      { value: 'navy', label: 'Navy' },
      { value: 'olive', label: 'Olive' },
    ],
  },
  {
    key: 'size',
    label: 'Size',
    options: ['S', 'M', 'L', 'XL', 'XXL'].map((s) => ({ value: s.toLowerCase(), label: s })),
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

function setParam(sp: URLSearchParams, key: string, value: string | null) {
  if (!value) sp.delete(key);
  else sp.set(key, value);
  return sp;
}

export interface FilterPanelProps {
  groups?: FilterGroup[];
  className?: string;
  onApply?: () => void;
}

export function FilterPanel({ groups = DEFAULT_FILTERS, className, onApply }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const activeCount = useMemo(() => {
    let n = 0;
    for (const g of groups) if (search.get(g.key)) n += 1;
    return n;
  }, [groups, search]);

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const sp = new URLSearchParams(Array.from(search.entries()));
      setParam(sp, key, value);
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [router, pathname, search]
  );

  const clearAll = useCallback(() => {
    const sp = new URLSearchParams();
    const sort = search.get('sort');
    if (sort) sp.set('sort', sort);
    router.replace(sp.toString() ? `${pathname}?${sp.toString()}` : pathname, { scroll: false });
  }, [router, pathname, search]);

  return (
    <aside className={cn('flex flex-col gap-8', className)}>
      <header className="flex items-center justify-between">
        <Eyebrow>Filter · {activeCount} active</Eyebrow>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60 hover:text-bone"
          >
            Clear <X className="h-3 w-3" />
          </button>
        )}
      </header>

      {groups.map((group) => {
        const current = search.get(group.key);
        return (
          <div key={group.key} className="flex flex-col gap-3">
            <Eyebrow muted>{group.label}</Eyebrow>
            <ul className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const active = current === opt.value;
                return (
                  <li key={opt.value}>
                    <button
                      onClick={() => updateFilter(group.key, active ? null : opt.value)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-4 h-9 text-[13px] transition-colors',
                        active
                          ? 'border-bone bg-card text-bone'
                          : 'border-border text-bone/60 hover:border-bone/60 hover:text-bone'
                      )}
                    >
                      {opt.label}
                      {active ? <X className="h-3 w-3" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {onApply && (
        <Button variant="rect" size="md" fullWidth onClick={onApply}>
          Show results
        </Button>
      )}
    </aside>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const value = search.get('sort') ?? 'newest';

  return (
    <div className="inline-flex items-center gap-3">
      <Eyebrow muted>Sort</Eyebrow>
      <select
        value={value}
        onChange={(e) => {
          const sp = new URLSearchParams(Array.from(search.entries()));
          setParam(sp, 'sort', e.target.value);
          router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        }}
        className="h-9 bg-transparent border border-border rounded-[var(--radius)] px-3 text-[13px] text-bone focus:outline-none focus:border-bone"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--color-background)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
