import { cn } from '../lib/utils';

interface SegmentedOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex w-full sm:w-auto items-center gap-1 rounded-2xl border border-[#0b3d2e]/12 bg-[#ece7dc] p-1',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'min-h-[44px] flex-1 sm:flex-initial whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e] cursor-pointer',
              active
                ? 'bg-[#0b3d2e] text-[#fcfbf8] shadow-xs'
                : 'text-[#42524b] hover:text-[#13221c] hover:bg-[#fcfbf8]/50'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
