import React from 'react';
import { cn } from '../lib/utils';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean, el: HTMLElement) => void;
  label: string;
  sublabel?: string;
  className?: string;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  sublabel,
  className,
}: AnimatedCheckboxProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (buttonRef.current) {
      onChange(!checked, buttonRef.current);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleToggle}
      className={cn(
        'group flex min-h-[44px] w-full items-start gap-3.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-[#ece7dc]/60 active:scale-[0.99] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e] cursor-pointer',
        checked && 'bg-[#e6eee9]/50',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-150',
          checked
            ? 'dojo-check-box-checked border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
            : 'border-[#0b3d2e]/35 bg-[#ffffff] group-hover:border-[#0b3d2e]/70'
        )}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M5 13l4 4L19 7" className="dojo-check-path" />
          </svg>
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            'block text-[15px] leading-snug transition-colors duration-150',
            checked ? 'text-[#52615a] line-through decoration-[#0b3d2e]/40' : 'text-[#13221c]'
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span className="mt-0.5 block text-xs leading-relaxed text-[#52615a]">
            {sublabel}
          </span>
        )}
      </span>
    </button>
  );
}
