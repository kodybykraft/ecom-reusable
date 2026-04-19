import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-savage-silver)] whitespace-nowrap cursor-pointer',
  {
    variants: {
      variant: {
        pill: 'rounded-[var(--radius-pill)] bg-[var(--color-foreground)] text-[var(--color-background)] hover:bg-[var(--color-savage-silver)]',
        rect: 'rounded-[var(--radius)] bg-[var(--color-foreground)] text-[var(--color-background)] uppercase tracking-[var(--tracking-eyebrow)] hover:bg-[var(--color-savage-silver)]',
        ghost:
          'rounded-[var(--radius)] border border-border bg-transparent text-bone hover:border-bone hover:bg-card',
        dark: 'rounded-[var(--radius-pill)] bg-card text-bone border border-border hover:border-bone',
        link: 'text-bone underline-offset-4 hover:underline',
      },
      size: {
        sm: 'text-[13px] h-9 px-4',
        md: 'text-[14px] h-11 px-6',
        lg: 'text-[15px] h-14 px-8',
        xl: 'text-[16px] h-16 px-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'pill',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
