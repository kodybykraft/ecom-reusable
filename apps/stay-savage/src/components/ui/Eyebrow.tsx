import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  muted?: boolean;
}

export const Eyebrow = forwardRef<HTMLSpanElement, EyebrowProps>(
  ({ className, muted = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-block font-body text-[13px] font-medium uppercase',
          'tracking-[var(--tracking-eyebrow)]',
          muted
            ? 'text-bone/40'
            : 'text-bone/60',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Eyebrow.displayName = 'Eyebrow';
