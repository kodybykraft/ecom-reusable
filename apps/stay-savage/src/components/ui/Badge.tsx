import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-sm)] font-body font-medium uppercase tracking-[var(--tracking-eyebrow)] whitespace-nowrap',
  {
    variants: {
      variant: {
        silver:
          'bg-[var(--color-savage-silver)] text-[var(--color-background)]',
        success: 'bg-[var(--color-success)]/15 text-green-500 border border-[var(--color-success)]/30',
        danger: 'bg-[var(--color-danger)]/15 text-savage border border-[var(--color-danger)]/30',
        muted: 'bg-card text-bone/60 border border-border',
        outline: 'border border-bone text-[var(--color-savage-silver)] bg-transparent',
      },
      size: {
        sm: 'h-5 px-2 text-[10px]',
        md: 'h-6 px-2.5 text-[11px]',
        lg: 'h-7 px-3 text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'silver',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
