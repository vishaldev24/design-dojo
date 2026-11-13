import * as React from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[88px] w-full rounded-xl border border-[#0b3d2e]/18 bg-[#ffffff] px-3.5 py-2.5 text-sm leading-relaxed text-[#13221c] placeholder:text-[#52615a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e] focus-visible:border-[#0b3d2e] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
