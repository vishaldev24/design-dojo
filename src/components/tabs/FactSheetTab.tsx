import { Check, ShieldAlert } from 'lucide-react';
import { APP_META, FACT_SHEET_CONTENT } from '../../data/content';
import { triggerConfettiBurst } from '../../lib/confetti';
import { cn } from '../../lib/utils';
import type { DesignDojoState } from '../../types/dojo';
import { AnimatedCheckbox } from '../AnimatedCheckbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';

interface FactSheetTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

export function FactSheetTab({ state, onUpdate }: FactSheetTabProps) {
  const totalAudit = FACT_SHEET_CONTENT.claimsAuditRows.length;
  const checkedAudit = FACT_SHEET_CONTENT.claimsAuditRows.filter((row) =>
    Boolean(state.factSheet.claimsAudit[row.id])
  ).length;
  const allAuditDone = checkedAudit === totalAudit;

  const handleFieldChange = (id: string, value: string) => {
    onUpdate((prev) => ({
      ...prev,
      factSheet: {
        ...prev.factSheet,
        fields: {
          ...prev.factSheet.fields,
          [id]: value,
        },
      },
    }));
  };

  const handleToggleWord = (word: string) => {
    onUpdate((prev) => ({
      ...prev,
      factSheet: {
        ...prev.factSheet,
        flaggedWordsChecked: {
          ...prev.factSheet.flaggedWordsChecked,
          [word]: !prev.factSheet.flaggedWordsChecked[word],
        },
      },
    }));
  };

  const handleToggleAuditRow = (rowId: string, checked: boolean, el: HTMLElement) => {
    const nextAudit = {
      ...state.factSheet.claimsAudit,
      [rowId]: checked,
    };
    const willBeDone = FACT_SHEET_CONTENT.claimsAuditRows.every((r) => Boolean(nextAudit[r.id]));
    if (checked && !allAuditDone && willBeDone) {
      triggerConfettiBurst(el);
    }

    onUpdate((prev) => ({
      ...prev,
      factSheet: {
        ...prev.factSheet,
        claimsAudit: {
          ...prev.factSheet.claimsAudit,
          [rowId]: checked,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Truth Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#f59e0b]/55 bg-[#fef3c7] px-5 py-4 text-[#78350f]">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#b45309]" />
        <p className="font-display text-sm sm:text-base font-semibold">
          {FACT_SHEET_CONTENT.banner}
        </p>
      </div>

      {/* Textarea Sections */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {FACT_SHEET_CONTENT.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section.label}</CardTitle>
              <CardDescription>{section.prompt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                aria-label={section.label}
                value={state.factSheet.fields[section.id] ?? ''}
                onChange={(e) => handleFieldChange(section.id, e.target.value)}
                placeholder={section.placeholder}
                className="min-h-[110px]"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flagged Words Check */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{FACT_SHEET_CONTENT.searchWordsTitle}</CardTitle>
          <CardDescription>{FACT_SHEET_CONTENT.searchWordsSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2.5">
            {FACT_SHEET_CONTENT.searchWords.map((word) => {
              const checked = Boolean(state.factSheet.flaggedWordsChecked[word]);
              return (
                <button
                  key={word}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => handleToggleWord(word)}
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all active:scale-[0.97] cursor-pointer whitespace-nowrap',
                    checked
                      ? 'border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
                      : 'border-[#0b3d2e]/20 bg-[#ffffff] text-[#13221c] hover:bg-[#ece7dc]/60'
                  )}
                >
                  {checked && <Check className="h-4 w-4 shrink-0" />}
                  <span className="font-mono-num">{word}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Claims Audit Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{FACT_SHEET_CONTENT.claimsAuditTitle}</CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              {allAuditDone && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#0b3d2e]">
                  <Check className="h-3.5 w-3.5" />
                  {APP_META.doneLabel}
                </span>
              )}
              <span className="font-mono-num text-sm font-semibold text-[#52615a]">
                {checkedAudit}/{totalAudit}
              </span>
            </div>
          </div>
          <Progress value={checkedAudit} max={totalAudit} className="mt-3" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {FACT_SHEET_CONTENT.claimsAuditRows.map((row) => (
            <AnimatedCheckbox
              key={row.id}
              checked={Boolean(state.factSheet.claimsAudit[row.id])}
              onChange={(checked, el) => handleToggleAuditRow(row.id, checked, el)}
              label={row.label}
              sublabel={FACT_SHEET_CONTENT.claimsAuditCheckboxLabel}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
