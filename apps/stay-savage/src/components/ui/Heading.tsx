import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-display leading-none', {
  variants: {
    variant: {
      hero: 'text-[clamp(56px,9vw,100px)] font-bold uppercase tracking-tight',
      inner: 'text-[clamp(44px,6.5vw,80px)] font-normal uppercase tracking-tight',
      l: 'text-[clamp(32px,4.5vw,50px)] font-bold uppercase tracking-tight',
      m: 'text-[clamp(22px,3vw,30px)] font-bold uppercase tracking-tight',
      s: 'text-[clamp(18px,2vw,24px)] font-semibold leading-tight',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'l',
    align: 'left',
  },
});

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, align, as: Tag = 'h2', ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ variant, align }), className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';
