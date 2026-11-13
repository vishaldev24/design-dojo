import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { APP_META, PLAN_CONTENT } from '../../data/content';
import { triggerConfettiBurst } from '../../lib/confetti';
import type { DesignDojoState } from '../../types/dojo';
import { AnimatedCheckbox } from '../AnimatedCheckbox';
import { ProgressRing } from '../ProgressRing';
import { Card, CardContent, CardHeader } from '../ui/card';

interface PlanTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

export function PlanTab({ state, onUpdate }: PlanTabProps) {
  const [openDays, setOpenDays] = React.useState<Record<string, boolean>>({
    'day-1': true,
    'day-2': true,
    'day-3': true,
  });

  const toggleDayOpen = (dayId: string) => {
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleToggleBlock = (
    dayId: string,
    blockId: string,
    checked: boolean,
    el: HTMLElement
  ) => {
    const day = PLAN_CONTENT.days.find((d) => d.id === dayId);
    if (day) {
      const wasDone = day.blocks.every((b) => Boolean(state.plan.blockTicks[b.id]));
      const nextTicks = { ...state.plan.blockTicks, [blockId]: checked };
      const willBeDone = day.blocks.every((b) => Boolean(nextTicks[b.id]));
      if (checked && !wasDone && willBeDone) {
        triggerConfettiBurst(el);
      }
    }

    onUpdate((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        blockTicks: {
          ...prev.plan.blockTicks,
          [blockId]: checked,
        },
      },
    }));
  };

  return (
    <div className="space-y-5">
      {PLAN_CONTENT.days.map((day) => {
        const total = day.blocks.length;
        const completed = day.blocks.filter((b) => Boolean(state.plan.blockTicks[b.id])).length;
        const isDone = completed === total;
        const isOpen = Boolean(openDays[day.id]);

        return (
          <Card key={day.id}>
            <CardHeader className="p-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleDayOpen(day.id)}
                className="flex min-h-[72px] w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-[#ece7dc]/45 rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <ProgressRing value={completed} max={total} size={56} strokeWidth={5} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-num text-xs font-semibold text-[#0b3d2e]">
                        {day.dayLabel}
                      </span>
                      <span className="text-xs text-[#52615a]" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono-num text-xs text-[#52615a]">
                        {completed}/{total} blocks
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2 py-0.5 text-xs font-semibold text-[#0b3d2e]">
                          <Check className="h-3.5 w-3.5" />
                          {APP_META.doneLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display mt-1 text-base sm:text-lg font-semibold leading-snug text-[#13221c]">
                      {day.headline}
                    </h3>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#52615a]">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>
            </CardHeader>

            {isOpen && (
              <CardContent className="border-t border-[#0b3d2e]/10 pt-4 space-y-3">
                <div className="space-y-1.5">
                  {day.blocks.map((block) => (
                    <AnimatedCheckbox
                      key={block.id}
                      checked={Boolean(state.plan.blockTicks[block.id])}
                      onChange={(checked, el) =>
                        handleToggleBlock(day.id, block.id, checked, el)
                      }
                      label={
                        block.duration ? `${block.title} (${block.duration})` : block.title
                      }
                      sublabel={block.description}
                    />
                  ))}
                </div>

                {day.doneWhen && (
                  <div className="rounded-xl border border-[#0b3d2e]/12 bg-[#e6eee9]/55 px-4 py-3 text-sm leading-relaxed text-[#0b3d2e]">
                    {day.doneWhen}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
