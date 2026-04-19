import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const inputBase =
  'w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] font-body text-bone placeholder:text-bone/40 transition-colors focus:outline-none focus:border-bone disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(inputBase, 'h-12', className)} {...props} />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputBase, 'min-h-32 resize-y py-3', className)} {...props} />
  )
);
Textarea.displayName = 'Textarea';

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-[13px] font-medium uppercase tracking-[var(--tracking-eyebrow)] text-bone/60 mb-2',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Field({ label, hint, error, children, className, htmlFor }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="text-[12px] text-savage mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-bone/40 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
