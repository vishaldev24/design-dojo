import { cn } from '../lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  value,
  max,
  size = 54,
  strokeWidth = 5,
  className,
}: ProgressRingProps) {
  const safeMax = max <= 0 ? 1 : max;
  const pct = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-label={`${pct}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e0d5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={pct === 100 ? '#f59e0b' : '#0b3d2e'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset,stroke] duration-300 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="font-mono-num absolute text-xs font-semibold text-[#13221c]">
        {pct}%
      </span>
    </div>
  );
}
