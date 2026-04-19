import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionVariants = cva('relative w-full', {
  variants: {
    size: {
      xs: 'min-h-[500px]',
      sm: 'min-h-[600px]',
      md: 'min-h-[900px]',
      lg: 'min-h-[1200px]',
      xl: 'min-h-[1400px]',
      hero: 'min-h-screen',
      auto: '',
    },
    bg: {
      base: 'bg-[var(--color-background)]',
      surface: 'bg-card',
      lift: 'bg-card',
      none: '',
    },
    pad: {
      none: '',
      sm: 'py-12 md:py-16',
      md: 'py-20 md:py-28',
      lg: 'py-28 md:py-40',
    },
    contain: {
      true: 'mx-auto max-w-[1440px] px-6 md:px-10',
      full: '',
    },
  },
  defaultVariants: {
    size: 'auto',
    bg: 'base',
    pad: 'md',
    contain: true,
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'article' | 'main';
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, size, bg, pad, contain, as: Tag = 'section', ...props }, ref) => {
    return (
      <Tag
        ref={ref as never}
        className={cn(sectionVariants({ size, bg, pad, contain }), className)}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';
