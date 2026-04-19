import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('relative transition-all duration-300', {
  variants: {
    variant: {
      base: 'rounded-[var(--radius)] border border-border bg-card',
      lift: 'rounded-[var(--radius)] border border-border bg-card',
      product:
        'rounded-[var(--radius-lg)] overflow-hidden border border-transparent hover:border-bone/40 bg-card',
      ghost: 'rounded-[var(--radius)] border border-border bg-transparent',
    },
    pad: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8 md:p-10',
    },
    interactive: {
      true: 'cursor-pointer hover:border-bone/40',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'base',
    pad: 'md',
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, pad, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, pad, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';
