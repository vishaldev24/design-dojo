import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] motion-reduce:active:scale-100 cursor-pointer shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#0b3d2e] text-[#fcfbf8] hover:bg-[#0e4e3b] shadow-xs',
        amber: 'bg-[#f59e0b] text-[#13221c] hover:bg-[#d97706] font-semibold shadow-xs',
        outline:
          'border border-[#0b3d2e]/20 bg-[#fcfbf8] text-[#13221c] hover:bg-[#ece7dc]/60',
        ghost: 'text-[#13221c] hover:bg-[#ece7dc]/70',
        destructive: 'bg-[#b91c1c] text-white hover:bg-[#991b1b]',
      },
      size: {
        default: 'min-h-[44px] px-4 py-2',
        sm: 'min-h-[44px] px-3.5 py-2 text-xs',
        lg: 'min-h-[48px] px-6 py-2.5 text-base',
        icon: 'min-h-[44px] min-w-[44px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
