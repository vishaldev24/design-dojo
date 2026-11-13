import React from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { APP_META, PRACTICE_CONTENT } from '../../data/content';
import { triggerConfettiBurst } from '../../lib/confetti';
import { cn, formatDisplayDate, toDateKey } from '../../lib/utils';
import type { DesignDojoState, PracticeAttempt, ScorecardValue } from '../../types/dojo';
import { AnimatedCheckbox } from '../AnimatedCheckbox';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';

interface PracticeTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

export function PracticeTab({ state, onUpdate }: PracticeTabProps) {
  const [expandedAttemptId, setExpandedAttemptId] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string>('');

  const rulesCount = PRACTICE_CONTENT.rules.filter(
    (r) => Boolean(state.practice.activeRulesTicks[r.id])
  ).length;
  const rulesTotal = PRACTICE_CONTENT.rules.length;
  const allRulesDone = rulesCount === rulesTotal;

  const totalScore = PRACTICE_CONTENT.scorecardRows.reduce((sum, row) => {
    const val = state.practice.activeScores[row.id] ?? 0;
    return sum + val;
  }, 0);

  // "Next focus" amber banner: if the same scorecard row scored 0 or 1 in each of the last 3 saved attempts
  const nextFocusRows = React.useMemo(() => {
    const lastThree = state.practice.attempts.slice(0, 3);
    if (lastThree.length < 3) return [];
    return PRACTICE_CONTENT.scorecardRows.filter((row) =>
      lastThree.every((attempt) => {
        const s = attempt.scores?.[row.id] ?? 0;
        return s === 0 || s === 1;
      })
    );
  }, [state.practice.attempts]);

  const handleRuleToggle = (ruleId: string, checked: boolean, el: HTMLElement) => {
    const nextTicks = {
      ...state.practice.activeRulesTicks,
      [ruleId]: checked,
    };
    const willBeDone = PRACTICE_CONTENT.rules.every((r) => Boolean(nextTicks[r.id]));
    if (checked && !allRulesDone && willBeDone) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        activeRulesTicks: {
          ...prev.practice.activeRulesTicks,
          [ruleId]: checked,
        },
      },
    }));
  };

  const handleScoreChange = (rowId: string, value: ScorecardValue) => {
    onUpdate((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        activeScores: {
          ...prev.practice.activeScores,
          [rowId]: value,
        },
      },
    }));
  };

  const handleFieldChange = (
    field:
      | 'challengeName'
      | 'date'
      | 'timeTaken'
      | 'whatWentRight'
      | 'whatWentWrong'
      | 'oneFixNextTime',
    value: string
  ) => {
    if (field === 'challengeName' && formError) setFormError('');
    onUpdate((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        [field]: value,
      },
    }));
  };

  const handleSaveAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = state.practice.challengeName.trim();
    if (!trimmedName) {
      setFormError('Enter a challenge name before saving.');
      return;
    }

    const attempt: PracticeAttempt = {
      id: `att-${Date.now()}`,
      challengeName: trimmedName,
      date: state.practice.date || toDateKey(),
      timeTaken: state.practice.timeTaken.trim() || 'Not recorded',
      whatWentRight: state.practice.whatWentRight.trim(),
      whatWentWrong: state.practice.whatWentWrong.trim(),
      oneFixNextTime: state.practice.oneFixNextTime.trim(),
      rulesTicks: { ...state.practice.activeRulesTicks },
      scores: PRACTICE_CONTENT.scorecardRows.reduce(
        (acc, row) => {
          acc[row.id] = state.practice.activeScores[row.id] ?? 0;
          return acc;
        },
        {} as Record<string, ScorecardValue>
      ),
      totalScore,
      createdAt: new Date().toISOString(),
    };

    onUpdate((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        activeRulesTicks: {},
        activeScores: {},
        challengeName: '',
        date: toDateKey(),
        timeTaken: '',
        whatWentRight: '',
        whatWentWrong: '',
        oneFixNextTime: '',
        attempts: [attempt, ...prev.practice.attempts],
      },
    }));
    setExpandedAttemptId(attempt.id);
    setFormError('');
  };

  const handleDeleteAttempt = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        attempts: prev.practice.attempts.filter((a) => a.id !== id),
      },
    }));
    if (expandedAttemptId === id) {
      setExpandedAttemptId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Next Focus Amber Banner */}
      {nextFocusRows.length > 0 && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#f59e0b]/60 bg-[#fef3c7] px-5 py-4 text-[#78350f]"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#b45309]" />
          <div className="space-y-1">
            <p className="font-display text-sm font-bold">{PRACTICE_CONTENT.nextFocusTitle}</p>
            <p className="text-sm leading-relaxed">
              {PRACTICE_CONTENT.nextFocusPrefix}{' '}
              <span className="font-semibold">
                {nextFocusRows.map((r) => r.label).join('; ')}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Top Grid: The 5 Rules + Scorecard */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* The 5 Rules */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>{PRACTICE_CONTENT.rulesTitle}</CardTitle>
              <div className="flex items-center gap-2 shrink-0">
                {allRulesDone && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                    <Check className="h-3.5 w-3.5" />
                    {APP_META.doneLabel}
                  </span>
                )}
                <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                  {rulesCount}/{rulesTotal}
                </span>
              </div>
            </div>
            <Progress value={rulesCount} max={rulesTotal} className="mt-3" accent="amber" />
          </CardHeader>
          <CardContent className="space-y-1">
            {PRACTICE_CONTENT.rules.map((rule) => (
              <AnimatedCheckbox
                key={rule.id}
                checked={Boolean(state.practice.activeRulesTicks[rule.id])}
                onChange={(checked, el) => handleRuleToggle(rule.id, checked, el)}
                label={rule.text}
              />
            ))}
          </CardContent>
        </Card>

        {/* Scorecard (0 / 1 / 2) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{PRACTICE_CONTENT.scorecardTitle}</CardTitle>
                <CardDescription className="mt-1">
                  0 missed · 1 partly · 2 done
                </CardDescription>
              </div>
              <div className="flex items-baseline gap-1 rounded-xl bg-[#0b3d2e] px-3.5 py-2 text-[#fcfbf8]">
                <span className="font-mono-num text-2xl font-bold transition-all duration-200">
                  {totalScore}
                </span>
                <span className="font-mono-num text-sm text-[#fcfbf8]/75">/12</span>
              </div>
            </div>
            <Progress value={totalScore} max={12} className="mt-3" />
          </CardHeader>
          <CardContent className="divide-y divide-[#0b3d2e]/10">
            {PRACTICE_CONTENT.scorecardRows.map((row) => {
              const currentScore = state.practice.activeScores[row.id] ?? 0;
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-2.5 py-3 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-[#13221c]">{row.label}</span>
                  <div
                    role="radiogroup"
                    aria-label={row.label}
                    className="inline-flex items-center gap-1.5 shrink-0"
                  >
                    {PRACTICE_CONTENT.scoreLegend.map((opt) => {
                      const selected = currentScore === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => handleScoreChange(row.id, opt.value)}
                          className={cn(
                            'min-h-[44px] min-w-[68px] rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e] cursor-pointer whitespace-nowrap',
                            selected
                              ? opt.value === 2
                                ? 'border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
                                : opt.value === 1
                                ? 'border-[#f59e0b] bg-[#f59e0b] text-[#13221c] font-semibold'
                                : 'border-[#13221c] bg-[#13221c] text-[#fcfbf8]'
                              : 'border-[#0b3d2e]/15 bg-[#ffffff] text-[#52615a] hover:bg-[#ece7dc]/60'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Attempt Log Form */}
      <Card>
        <CardHeader>
          <CardTitle>{PRACTICE_CONTENT.attemptFormTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAttempt} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-1">
                <label htmlFor="practice-challenge" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.challengeName}
                </label>
                <Input
                  id="practice-challenge"
                  value={state.practice.challengeName}
                  onChange={(e) => handleFieldChange('challengeName', e.target.value)}
                  placeholder={PRACTICE_CONTENT.fields.challengeNamePlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="practice-date" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.date}
                </label>
                <Input
                  id="practice-date"
                  type="date"
                  value={state.practice.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="practice-time" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.timeTaken}
                </label>
                <Input
                  id="practice-time"
                  value={state.practice.timeTaken}
                  onChange={(e) => handleFieldChange('timeTaken', e.target.value)}
                  placeholder={PRACTICE_CONTENT.fields.timeTakenPlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="practice-right" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.whatWentRight}
                </label>
                <Textarea
                  id="practice-right"
                  value={state.practice.whatWentRight}
                  onChange={(e) => handleFieldChange('whatWentRight', e.target.value)}
                  placeholder={PRACTICE_CONTENT.fields.whatWentRightPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="practice-wrong" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.whatWentWrong}
                </label>
                <Textarea
                  id="practice-wrong"
                  value={state.practice.whatWentWrong}
                  onChange={(e) => handleFieldChange('whatWentWrong', e.target.value)}
                  placeholder={PRACTICE_CONTENT.fields.whatWentWrongPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="practice-fix" className="block text-sm font-medium text-[#13221c]">
                  {PRACTICE_CONTENT.fields.oneFixNextTime}
                </label>
                <Textarea
                  id="practice-fix"
                  value={state.practice.oneFixNextTime}
                  onChange={(e) => handleFieldChange('oneFixNextTime', e.target.value)}
                  placeholder={PRACTICE_CONTENT.fields.oneFixNextTimePlaceholder}
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="text-sm font-medium text-[#b91c1c]">
                {formError}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" variant="default">
                <PlusCircle className="h-4 w-4" />
                {PRACTICE_CONTENT.saveAttemptButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Saved Attempts History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{PRACTICE_CONTENT.historyTitle}</CardTitle>
            <span className="font-mono-num text-sm text-[#52615a]">
              {state.practice.attempts.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {state.practice.attempts.length === 0 ? (
            <p className="text-sm text-[#52615a]">{PRACTICE_CONTENT.historyEmpty}</p>
          ) : (
            <div className="space-y-3">
              {state.practice.attempts.map((attempt) => {
                const isExpanded = expandedAttemptId === attempt.id;
                return (
                  <div
                    key={attempt.id}
                    className="rounded-xl border border-[#0b3d2e]/12 bg-[#ffffff]"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAttemptId(isExpanded ? null : attempt.id)
                        }
                        className="flex min-h-[44px] flex-1 items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-[#13221c] truncate">
                            {attempt.challengeName}
                          </p>
                          <p className="text-xs text-[#52615a]">
                            <span>{formatDisplayDate(attempt.date)}</span>
                            <span className="mx-1.5" aria-hidden="true">·</span>
                            <span>{attempt.timeTaken}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono-num rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-bold text-[#0b3d2e]">
                            {attempt.totalScore}/12
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[#52615a]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#52615a]" />
                          )}
                        </div>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${attempt.challengeName}`}
                        onClick={() => handleDeleteAttempt(attempt.id)}
                        className="text-[#52615a] hover:text-[#b91c1c]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[#0b3d2e]/10 px-4 py-4 space-y-4 text-sm">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold text-[#0b3d2e]">What went right</p>
                            <p className="mt-1 whitespace-pre-wrap text-[#13221c]">
                              {attempt.whatWentRight || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#0b3d2e]">What went wrong</p>
                            <p className="mt-1 whitespace-pre-wrap text-[#13221c]">
                              {attempt.whatWentWrong || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#b45309]">One fix for next time</p>
                            <p className="mt-1 whitespace-pre-wrap text-[#13221c]">
                              {attempt.oneFixNextTime || '—'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 border-t border-[#0b3d2e]/10 pt-3 sm:grid-cols-2">
                          {PRACTICE_CONTENT.scorecardRows.map((row) => (
                            <div
                              key={row.id}
                              className="flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="text-[#52615a]">{row.label}</span>
                              <span className="font-mono-num font-semibold text-[#13221c]">
                                {attempt.scores?.[row.id] ?? 0}/2
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Free Sources & Weekly Rhythm */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{PRACTICE_CONTENT.freeSourcesTitle}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[#0b3d2e]/10">
            {PRACTICE_CONTENT.freeSources.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-between gap-3 py-3 text-sm font-medium text-[#0b3d2e] hover:underline first:pt-0 last:pb-0"
              >
                <span>{src.name}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-[#52615a]" />
              </a>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#0b3d2e]" />
              <CardTitle>{PRACTICE_CONTENT.weeklyRhythmTitle}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-[#0b3d2e]/10">
            {PRACTICE_CONTENT.weeklyRhythm.map((item) => (
              <div key={item.days} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-[#0b3d2e]">{item.days}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[#13221c]">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
