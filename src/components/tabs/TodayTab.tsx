import React from 'react';
import { Check, Flame, Minus, Moon, Plus, Sun } from 'lucide-react';
import { APP_META, TODAY_CONTENT } from '../../data/content';
import { triggerConfettiBurst } from '../../lib/confetti';
import { calculateStreak, isDayRoutineComplete } from '../../lib/storage';
import { cn, formatDisplayDate, getMondayDateKey, getWeekDaysFromMonday, toDateKey } from '../../lib/utils';
import type { DailyRoutineEntry, DesignDojoState, WeeklyTargetsProgress } from '../../types/dojo';
import { AnimatedCheckbox } from '../AnimatedCheckbox';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

interface TodayTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

const EMPTY_DAY: DailyRoutineEntry = {
  oneJob: '',
  morningTicks: {},
  nightTicks: {},
};

const EMPTY_WEEKLY: WeeklyTargetsProgress = {
  applications: 0,
  messages: 0,
  drills: 0,
};

export function TodayTab({ state, onUpdate }: TodayTabProps) {
  const todayKey = toDateKey();
  const mondayKey = getMondayDateKey();
  const weekDays = getWeekDaysFromMonday(mondayKey);
  const todayEntry = state.daily[todayKey] ?? EMPTY_DAY;
  const weekly = state.weeklyTargets[mondayKey] ?? EMPTY_WEEKLY;
  const streak = calculateStreak(state.daily);

  const morningCount = TODAY_CONTENT.morningItems.filter(
    (item) => todayEntry.morningTicks[item.id]
  ).length;
  const morningTotal = TODAY_CONTENT.morningItems.length;
  const morningComplete = morningCount === morningTotal;

  const nightCount = TODAY_CONTENT.nightItems.filter(
    (item) => todayEntry.nightTicks[item.id]
  ).length;
  const nightTotal = TODAY_CONTENT.nightItems.length;
  const nightComplete = nightCount === nightTotal;

  const handleOneJobChange = (value: string) => {
    onUpdate((prev) => {
      const current = prev.daily[todayKey] ?? EMPTY_DAY;
      return {
        ...prev,
        daily: {
          ...prev.daily,
          [todayKey]: {
            ...current,
            oneJob: value,
          },
        },
      };
    });
  };

  const handleMorningToggle = (itemId: string, checked: boolean, el: HTMLElement) => {
    const nextMorningTicks = {
      ...todayEntry.morningTicks,
      [itemId]: checked,
    };
    const willComplete = TODAY_CONTENT.morningItems.every((i) => Boolean(nextMorningTicks[i.id]));
    if (checked && !morningComplete && willComplete) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => {
      const current = prev.daily[todayKey] ?? EMPTY_DAY;
      return {
        ...prev,
        daily: {
          ...prev.daily,
          [todayKey]: {
            ...current,
            morningTicks: {
              ...current.morningTicks,
              [itemId]: checked,
            },
          },
        },
      };
    });
  };

  const handleNightToggle = (itemId: string, checked: boolean, el: HTMLElement) => {
    const nextNightTicks = {
      ...todayEntry.nightTicks,
      [itemId]: checked,
    };
    const willComplete = TODAY_CONTENT.nightItems.every((i) => Boolean(nextNightTicks[i.id]));
    if (checked && !nightComplete && willComplete) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => {
      const current = prev.daily[todayKey] ?? EMPTY_DAY;
      return {
        ...prev,
        daily: {
          ...prev.daily,
          [todayKey]: {
            ...current,
            nightTicks: {
              ...current.nightTicks,
              [itemId]: checked,
            },
          },
        },
      };
    });
  };

  const handleWeeklyDelta = (key: keyof WeeklyTargetsProgress, delta: number) => {
    onUpdate((prev) => {
      const current = prev.weeklyTargets[mondayKey] ?? EMPTY_WEEKLY;
      const nextVal = Math.max(0, (current[key] ?? 0) + delta);
      return {
        ...prev,
        weeklyTargets: {
          ...prev.weeklyTargets,
          [mondayKey]: {
            ...current,
            [key]: nextVal,
          },
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Row: Date + Streak + One Job */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4 bg-[#0b3d2e] text-[#fcfbf8] border-[#0b3d2e]">
          <CardContent className="p-5 sm:p-6 flex h-full flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#fcfbf8]/75">
                  {formatDisplayDate(todayKey)}
                </p>
                <div className="mt-2 flex items-baseline gap-2.5">
                  <span className="font-mono-num text-4xl font-bold tracking-tight text-[#fcfbf8]">
                    {streak}
                  </span>
                  <span className="font-display text-base font-semibold text-[#fcfbf8]/90">
                    {TODAY_CONTENT.streakLabel}
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  streak > 0 ? 'bg-[#f59e0b] text-[#13221c]' : 'bg-[#fcfbf8]/12 text-[#f59e0b]'
                )}
                aria-hidden="true"
              >
                <Flame className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#fcfbf8]/80">
              {TODAY_CONTENT.streakSubtext}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{TODAY_CONTENT.oneJobLabel}</CardTitle>
            <CardDescription>Saved for {formatDisplayDate(todayKey)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              aria-label={TODAY_CONTENT.oneJobLabel}
              value={todayEntry.oneJob}
              onChange={(e) => handleOneJobChange(e.target.value)}
              placeholder={TODAY_CONTENT.oneJobPlaceholder}
              className="text-base font-medium min-h-[48px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Routines: Morning & Night */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Morning Routine */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef3c7] text-[#b45309]">
                  <Sun className="h-4.5 w-4.5" />
                </span>
                <CardTitle>{TODAY_CONTENT.morningTitle}</CardTitle>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {morningComplete && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                    <Check className="h-3.5 w-3.5" />
                    {APP_META.doneLabel}
                  </span>
                )}
                <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                  {morningCount}/{morningTotal}
                </span>
              </div>
            </div>
            <Progress value={morningCount} max={morningTotal} className="mt-3" accent="amber" />
          </CardHeader>
          <CardContent className="space-y-1.5">
            {TODAY_CONTENT.morningItems.map((item) => (
              <AnimatedCheckbox
                key={item.id}
                checked={Boolean(todayEntry.morningTicks[item.id])}
                onChange={(checked, el) => handleMorningToggle(item.id, checked, el)}
                label={item.text}
              />
            ))}
          </CardContent>
        </Card>

        {/* Night Routine */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6eee9] text-[#0b3d2e]">
                  <Moon className="h-4.5 w-4.5" />
                </span>
                <CardTitle>{TODAY_CONTENT.nightTitle}</CardTitle>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {nightComplete && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                    <Check className="h-3.5 w-3.5" />
                    {APP_META.doneLabel}
                  </span>
                )}
                <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                  {nightCount}/{nightTotal}
                </span>
              </div>
            </div>
            <Progress value={nightCount} max={nightTotal} className="mt-3" />
          </CardHeader>
          <CardContent className="space-y-1.5">
            {TODAY_CONTENT.nightItems.map((item) => (
              <AnimatedCheckbox
                key={item.id}
                checked={Boolean(todayEntry.nightTicks[item.id])}
                onChange={(checked, el) => handleNightToggle(item.id, checked, el)}
                label={item.text}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Targets & 7-Day Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle>{TODAY_CONTENT.weeklyTargetsTitle}</CardTitle>
              <span className="text-xs text-[#52615a]">{TODAY_CONTENT.weeklyTargetsSubtitle}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {TODAY_CONTENT.weeklyTargets.map((target) => {
              const count = weekly[target.key] ?? 0;
              const isMet = count >= target.target;
              return (
                <div key={target.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[15px] font-medium text-[#13221c]">
                        {target.label}
                      </span>
                      <span className="ml-2 font-mono-num text-sm text-[#52615a]">
                        {count}/{target.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Decrease ${target.label}`}
                        onClick={() => handleWeeklyDelta(target.key, -1)}
                        disabled={count <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant={isMet ? 'default' : 'amber'}
                        size="icon"
                        aria-label={`Increase ${target.label}`}
                        onClick={() => handleWeeklyDelta(target.key, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(count, target.target)}
                    max={target.target}
                    accent={isMet ? 'green' : 'amber'}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{TODAY_CONTENT.weekGridTitle}</CardTitle>
              <div className="flex items-center gap-3 text-xs text-[#52615a]">
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-[#d97706]" />
                  {TODAY_CONTENT.weekGridLegendMorning}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-[#0b3d2e]" />
                  {TODAY_CONTENT.weekGridLegendNight}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDays.map((day) => {
                const entry = state.daily[day.key];
                const mDone = isDayRoutineComplete(entry, 'morning');
                const nDone = isDayRoutineComplete(entry, 'night');
                const isToday = day.key === todayKey;

                return (
                  <div
                    key={day.key}
                    className={cn(
                      'flex flex-col items-center rounded-xl border p-2 text-center transition-colors',
                      isToday
                        ? 'border-[#0b3d2e] bg-[#e6eee9]/50'
                        : 'border-[#0b3d2e]/10 bg-[#ffffff]'
                    )}
                  >
                    <span className="text-[11px] font-medium text-[#52615a]">{day.label}</span>
                    <span className="font-mono-num mt-0.5 text-xs font-semibold text-[#13221c]">
                      {day.dayNum}
                    </span>
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      <span
                        title={`${day.label} Morning: ${mDone ? 'Complete' : 'Pending'}`}
                        aria-label={`${day.label} Morning ${mDone ? 'complete' : 'pending'}`}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg border text-xs',
                          mDone
                            ? 'border-[#f59e0b] bg-[#fef3c7] text-[#92400e]'
                            : 'border-[#0b3d2e]/12 bg-[#f4f1ea] text-[#52615a]/45'
                        )}
                      >
                        {mDone ? <Check className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                      </span>
                      <span
                        title={`${day.label} Night: ${nDone ? 'Complete' : 'Pending'}`}
                        aria-label={`${day.label} Night ${nDone ? 'complete' : 'pending'}`}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg border text-xs',
                          nDone
                            ? 'border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
                            : 'border-[#0b3d2e]/12 bg-[#f4f1ea] text-[#52615a]/45'
                        )}
                      >
                        {nDone ? <Check className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grounding Footer Quote */}
      <footer className="rounded-2xl border border-[#0b3d2e]/12 bg-[#ece7dc]/70 px-5 py-4 text-center">
        <p className="font-display text-sm font-semibold tracking-wide text-[#0b3d2e]">
          {APP_META.footerQuote}
        </p>
      </footer>
    </div>
  );
}
