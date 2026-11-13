import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  accent?: 'green' | 'amber';
}

export function Progress({
  value,
  max = 100,
  accent = 'green',
  className,
  ...props
}: ProgressProps) {
  const safeMax = max <= 0 ? 100 : max;
  const pct = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'relative h-2.5 w-full overflow-hidden rounded-full bg-[#e5e0d5]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none',
          accent === 'amber' ? 'bg-[#f59e0b]' : 'bg-[#0b3d2e]'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
