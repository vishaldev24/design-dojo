import React from 'react';
import { Check, ClipboardCheck, PlusCircle, Trash2 } from 'lucide-react';
import { APP_META, CHECKLISTS_CONTENT } from '../../data/content';
import { triggerConfettiBurst } from '../../lib/confetti';
import { formatDisplayDate, toDateKey } from '../../lib/utils';
import type { AssessmentHistoryItem, DesignDojoState } from '../../types/dojo';
import { AnimatedCheckbox } from '../AnimatedCheckbox';
import { SegmentedControl } from '../SegmentedControl';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

interface ChecklistsTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

export function ChecklistsTab({ state, onUpdate }: ChecklistsTabProps) {
  const [view, setView] = React.useState<'deliverables' | 'drills'>('deliverables');

  const allDeliverableItems = CHECKLISTS_CONTENT.deliverableGroups.flatMap((g) => g.items);
  const totalDeliverables = allDeliverableItems.length;
  const checkedDeliverables = allDeliverableItems.filter(
    (item) => Boolean(state.checklists.mandatoryTicks[item.id])
  ).length;
  const allDeliverablesDone = checkedDeliverables === totalDeliverables;

  const totalDrills = CHECKLISTS_CONTENT.drillTrackerItems.length;
  const checkedDrills = CHECKLISTS_CONTENT.drillTrackerItems.filter(
    (item) => Boolean(state.checklists.drillTrackerTicks[item.id])
  ).length;
  const allDrillsDone = checkedDrills === totalDrills;

  const handleToggleDeliverable = (itemId: string, checked: boolean, el: HTMLElement) => {
    const nextTicks = {
      ...state.checklists.mandatoryTicks,
      [itemId]: checked,
    };

    // Check if either the item's group or the whole checklist just became 100%
    const parentGroup = CHECKLISTS_CONTENT.deliverableGroups.find((g) =>
      g.items.some((i) => i.id === itemId)
    );
    const wasGroupDone =
      parentGroup?.items.every((i) => Boolean(state.checklists.mandatoryTicks[i.id])) ?? false;
    const isGroupDone = parentGroup?.items.every((i) => Boolean(nextTicks[i.id])) ?? false;
    const isAllDone = allDeliverableItems.every((i) => Boolean(nextTicks[i.id]));

    if (checked && ((!wasGroupDone && isGroupDone) || (!allDeliverablesDone && isAllDone))) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        mandatoryTicks: {
          ...prev.checklists.mandatoryTicks,
          [itemId]: checked,
        },
      },
    }));
  };

  const handleAssessmentNameChange = (name: string) => {
    onUpdate((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        assessmentName: name,
      },
    }));
  };

  const handleStartNewAssessment = () => {
    const trimmed = state.checklists.assessmentName.trim() || 'Untitled Assessment';
    const pct = totalDeliverables > 0 ? Math.round((checkedDeliverables / totalDeliverables) * 100) : 0;

    const historyItem: AssessmentHistoryItem = {
      id: `asm-${Date.now()}`,
      name: trimmed,
      date: toDateKey(),
      completionPercent: pct,
      checkedCount: checkedDeliverables,
      totalCount: totalDeliverables,
      ticks: { ...state.checklists.mandatoryTicks },
    };

    onUpdate((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        assessmentName: '',
        mandatoryTicks: {},
        assessmentHistory: [historyItem, ...prev.checklists.assessmentHistory],
      },
    }));
  };

  const handleDeleteAssessment = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        assessmentHistory: prev.checklists.assessmentHistory.filter((item) => item.id !== id),
      },
    }));
  };

  const handleToggleDrillTracker = (itemId: string, checked: boolean, el: HTMLElement) => {
    const nextTicks = {
      ...state.checklists.drillTrackerTicks,
      [itemId]: checked,
    };
    const willBeDone = CHECKLISTS_CONTENT.drillTrackerItems.every((i) => Boolean(nextTicks[i.id]));
    if (checked && !allDrillsDone && willBeDone) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        drillTrackerTicks: {
          ...prev.checklists.drillTrackerTicks,
          [itemId]: checked,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          options={CHECKLISTS_CONTENT.segmentedTabs}
          value={view}
          onChange={setView}
        />
        {view === 'deliverables' ? (
          <div className="flex items-center gap-2 text-sm font-medium text-[#52615a]">
            <ClipboardCheck className="h-4 w-4 text-[#0b3d2e]" />
            <span className="font-mono-num">
              {checkedDeliverables}/{totalDeliverables}
            </span>
            <span>completed</span>
            {allDeliverablesDone && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2 py-0.5 text-xs font-semibold text-[#0b3d2e]">
                <Check className="h-3.5 w-3.5" />
                {APP_META.doneLabel}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-[#52615a]">
            <span className="font-mono-num">
              {checkedDrills}/{totalDrills}
            </span>
            <span>skills mastered</span>
            {allDrillsDone && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2 py-0.5 text-xs font-semibold text-[#0b3d2e]">
                <Check className="h-3.5 w-3.5" />
                {APP_META.doneLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {view === 'deliverables' ? (
        <div className="space-y-6">
          {/* Rule Banner */}
          <div className="rounded-2xl border border-[#f59e0b]/45 bg-[#fef3c7]/80 px-5 py-4">
            <p className="font-display text-sm sm:text-base font-semibold text-[#78350f]">
              {CHECKLISTS_CONTENT.ruleBanner}
            </p>
          </div>

          {/* Assessment Name + Start New Assessment */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1.5">
                  <label
                    htmlFor="assessment-name-input"
                    className="block text-sm font-medium text-[#13221c]"
                  >
                    {CHECKLISTS_CONTENT.assessmentNameLabel}
                  </label>
                  <Input
                    id="assessment-name-input"
                    value={state.checklists.assessmentName}
                    onChange={(e) => handleAssessmentNameChange(e.target.value)}
                    placeholder={CHECKLISTS_CONTENT.assessmentNamePlaceholder}
                  />
                </div>
                <Button
                  type="button"
                  variant="amber"
                  onClick={handleStartNewAssessment}
                  className="w-full sm:w-auto"
                >
                  <PlusCircle className="h-4 w-4" />
                  {CHECKLISTS_CONTENT.startNewButton}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Three Checklist Groups */}
          <div className="grid grid-cols-1 gap-5">
            {CHECKLISTS_CONTENT.deliverableGroups.map((group) => {
              const count = group.items.filter(
                (i) => Boolean(state.checklists.mandatoryTicks[i.id])
              ).length;
              const total = group.items.length;
              const isDone = count === total;

              return (
                <Card key={group.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle>{group.title}</CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        {isDone && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                            <Check className="h-3.5 w-3.5" />
                            {APP_META.doneLabel}
                          </span>
                        )}
                        <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                          {count}/{total}
                        </span>
                      </div>
                    </div>
                    <Progress value={count} max={total} className="mt-3" accent={isDone ? 'green' : 'amber'} />
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {group.items.map((item) => (
                      <AnimatedCheckbox
                        key={item.id}
                        checked={Boolean(state.checklists.mandatoryTicks[item.id])}
                        onChange={(checked, el) => handleToggleDeliverable(item.id, checked, el)}
                        label={item.text}
                      />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Assessment History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{CHECKLISTS_CONTENT.historyTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {state.checklists.assessmentHistory.length === 0 ? (
                <p className="text-sm leading-relaxed text-[#52615a]">
                  {CHECKLISTS_CONTENT.historyEmpty}
                </p>
              ) : (
                <div className="divide-y divide-[#0b3d2e]/10">
                  {state.checklists.assessmentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#13221c] truncate">{item.name}</p>
                        <p className="text-xs text-[#52615a]">
                          <span>{formatDisplayDate(item.date)}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="font-mono-num">
                            {item.checkedCount}/{item.totalCount} ({item.completionPercent}%)
                          </span>
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => handleDeleteAssessment(item.id)}
                        className="text-[#52615a] hover:text-[#b91c1c]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* B) Interview Drill Sheet */
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CHECKLISTS_CONTENT.drillCards.map((card) => (
              <Card key={card.id} className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <ul className="space-y-2.5 text-sm leading-relaxed text-[#13221c]">
                    {card.drills.map((drill, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="font-mono-num mt-0.5 text-xs font-semibold text-[#0b3d2e]">
                          0{idx + 1}.
                        </span>
                        <span>{drill}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl border border-[#0b3d2e]/12 bg-[#e6eee9]/55 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-[#0b3d2e]">Got it when:</p>
                    <p className="mt-0.5 text-sm text-[#13221c]">{card.gotItWhen}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 12-Item Tracker */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{CHECKLISTS_CONTENT.drillTrackerTitle}</CardTitle>
                <div className="flex items-center gap-2 shrink-0">
                  {allDrillsDone && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                      <Check className="h-3.5 w-3.5" />
                      {APP_META.doneLabel}
                    </span>
                  )}
                  <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                    {checkedDrills}/{totalDrills}
                  </span>
                </div>
              </div>
              <Progress value={checkedDrills} max={totalDrills} className="mt-3" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {CHECKLISTS_CONTENT.drillTrackerItems.map((item) => (
                <AnimatedCheckbox
                  key={item.id}
                  checked={Boolean(state.checklists.drillTrackerTicks[item.id])}
                  onChange={(checked, el) => handleToggleDrillTracker(item.id, checked, el)}
                  label={item.text}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
