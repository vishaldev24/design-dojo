import React from 'react';
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { LOGS_CONTENT } from '../../data/content';
import { cn, formatDisplayDate, toDateKey } from '../../lib/utils';
import type {
  DecisionLogRow,
  DesignDojoState,
  InterviewDebriefEntry,
  JournalEntry,
} from '../../types/dojo';
import { SegmentedControl } from '../SegmentedControl';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface LogsTabProps {
  state: DesignDojoState;
  onUpdate: (updater: (prev: DesignDojoState) => DesignDojoState) => void;
}

const EMPTY_DEBRIEF_FORM = {
  company: '',
  role: '',
  round: '',
  date: toDateKey(),
  questionsAsked: '',
  wordsOrClaimsDugInto: '',
  wentRight: '',
  wentWrong: '',
  didNotKnowAndHowToFindOut: '',
  oneThingToChange: '',
  resultAndReason: '',
};

const EMPTY_JOURNAL_FORM = {
  date: toDateKey(),
  learnedToday: '',
  didNotKnow: '',
  howToFindOut: '',
  energy: 3 as 1 | 2 | 3 | 4 | 5,
};

export function LogsTab({ state, onUpdate }: LogsTabProps) {
  const [view, setView] = React.useState<'decision' | 'debrief' | 'journal'>('decision');

  // Decision log state
  const [newProjectName, setNewProjectName] = React.useState('');
  const [addingProject, setAddingProject] = React.useState(false);

  // Interview debrief state
  const [debriefForm, setDebriefForm] = React.useState(EMPTY_DEBRIEF_FORM);
  const [editingDebriefId, setEditingDebriefId] = React.useState<string | null>(null);
  const [debriefSearch, setDebriefSearch] = React.useState('');
  const [openedDebriefId, setOpenedDebriefId] = React.useState<string | null>(null);

  // Daily journal state
  const [journalForm, setJournalForm] = React.useState(EMPTY_JOURNAL_FORM);
  const [editingJournalId, setEditingJournalId] = React.useState<string | null>(null);

  const selectedProject =
    state.logs.projects.find((p) => p.id === state.logs.selectedProjectId) ??
    state.logs.projects[0];

  // --- DECISION LOG HANDLERS ---
  const handleSelectProject = (projectId: string) => {
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        selectedProjectId: projectId,
      },
    }));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProjectName.trim();
    if (!trimmed) return;
    const newProj = {
      id: `proj-${Date.now()}`,
      name: trimmed,
      rows: [],
    };
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        selectedProjectId: newProj.id,
        projects: [...prev.logs.projects, newProj],
      },
    }));
    setNewProjectName('');
    setAddingProject(false);
  };

  const handleAddDecisionRow = () => {
    if (!selectedProject) return;
    const newRow: DecisionLogRow = {
      id: `row-${Date.now()}`,
      screenOrDecision: '',
      optionsConsidered: '',
      whatIChose: '',
      why: '',
      riskNotValidated: '',
    };
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        projects: prev.logs.projects.map((p) =>
          p.id === selectedProject.id ? { ...p, rows: [...p.rows, newRow] } : p
        ),
      },
    }));
  };

  const handleUpdateDecisionRow = (
    rowId: string,
    field: keyof Omit<DecisionLogRow, 'id'>,
    value: string
  ) => {
    if (!selectedProject) return;
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        projects: prev.logs.projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                rows: p.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
              }
            : p
        ),
      },
    }));
  };

  const handleDeleteDecisionRow = (rowId: string) => {
    if (!selectedProject) return;
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        projects: prev.logs.projects.map((p) =>
          p.id === selectedProject.id
            ? { ...p, rows: p.rows.filter((r) => r.id !== rowId) }
            : p
        ),
      },
    }));
  };

  // --- INTERVIEW DEBRIEF HANDLERS ---
  const handleSaveDebrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debriefForm.company.trim() && !debriefForm.role.trim()) return;

    if (editingDebriefId) {
      onUpdate((prev) => ({
        ...prev,
        logs: {
          ...prev.logs,
          debriefs: prev.logs.debriefs.map((d) =>
            d.id === editingDebriefId
              ? {
                  ...d,
                  ...debriefForm,
                }
              : d
          ),
        },
      }));
      setOpenedDebriefId(editingDebriefId);
      setEditingDebriefId(null);
      setDebriefForm(EMPTY_DEBRIEF_FORM);
      return;
    }

    const entry: InterviewDebriefEntry = {
      id: `deb-${Date.now()}`,
      ...debriefForm,
      createdAt: new Date().toISOString(),
    };
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        debriefs: [entry, ...prev.logs.debriefs],
      },
    }));
    setDebriefForm(EMPTY_DEBRIEF_FORM);
    setOpenedDebriefId(entry.id);
  };

  const handleEditDebrief = (entry: InterviewDebriefEntry) => {
    setEditingDebriefId(entry.id);
    setDebriefForm({
      company: entry.company,
      role: entry.role,
      round: entry.round,
      date: entry.date,
      questionsAsked: entry.questionsAsked,
      wordsOrClaimsDugInto: entry.wordsOrClaimsDugInto,
      wentRight: entry.wentRight,
      wentWrong: entry.wentWrong,
      didNotKnowAndHowToFindOut: entry.didNotKnowAndHowToFindOut,
      oneThingToChange: entry.oneThingToChange,
      resultAndReason: entry.resultAndReason,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDebrief = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        debriefs: prev.logs.debriefs.filter((d) => d.id !== id),
      },
    }));
    if (editingDebriefId === id) {
      setEditingDebriefId(null);
      setDebriefForm(EMPTY_DEBRIEF_FORM);
    }
    if (openedDebriefId === id) {
      setOpenedDebriefId(null);
    }
  };

  const filteredDebriefs = state.logs.debriefs.filter((d) => {
    const q = debriefSearch.trim().toLowerCase();
    if (!q) return true;
    return [
      d.company,
      d.role,
      d.round,
      d.questionsAsked,
      d.wordsOrClaimsDugInto,
      d.resultAndReason,
      d.oneThingToChange,
    ]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  // --- JOURNAL HANDLERS ---
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !journalForm.learnedToday.trim() &&
      !journalForm.didNotKnow.trim() &&
      !journalForm.howToFindOut.trim()
    ) {
      return;
    }

    if (editingJournalId) {
      onUpdate((prev) => ({
        ...prev,
        logs: {
          ...prev.logs,
          journal: prev.logs.journal.map((j) =>
            j.id === editingJournalId ? { ...j, ...journalForm } : j
          ),
        },
      }));
      setEditingJournalId(null);
      setJournalForm(EMPTY_JOURNAL_FORM);
      return;
    }

    const entry: JournalEntry = {
      id: `jr-${Date.now()}`,
      ...journalForm,
      createdAt: new Date().toISOString(),
    };
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        journal: [entry, ...prev.logs.journal],
      },
    }));
    setJournalForm(EMPTY_JOURNAL_FORM);
  };

  const handleEditJournal = (entry: JournalEntry) => {
    setEditingJournalId(entry.id);
    setJournalForm({
      date: entry.date,
      learnedToday: entry.learnedToday,
      didNotKnow: entry.didNotKnow,
      howToFindOut: entry.howToFindOut,
      energy: entry.energy,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJournal = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        journal: prev.logs.journal.filter((j) => j.id !== id),
      },
    }));
    if (editingJournalId === id) {
      setEditingJournalId(null);
      setJournalForm(EMPTY_JOURNAL_FORM);
    }
  };

  const sortedJournal = [...state.logs.journal].sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date);
    if (dateCmp !== 0) return dateCmp;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-6">
      <SegmentedControl
        options={LOGS_CONTENT.segmentedTabs}
        value={view}
        onChange={setView}
      />

      {/* A) DECISION LOG */}
      {view === 'decision' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#f59e0b]/45 bg-[#fef3c7]/80 px-5 py-4">
            <p className="font-display text-sm sm:text-base font-semibold text-[#78350f]">
              {LOGS_CONTENT.decisionLog.banner}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {state.logs.projects.map((proj) => {
                    const active = proj.id === selectedProject?.id;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => handleSelectProject(proj.id)}
                        className={cn(
                          'min-h-[44px] rounded-xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap',
                          active
                            ? 'border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
                            : 'border-[#0b3d2e]/15 bg-[#ffffff] text-[#13221c] hover:bg-[#ece7dc]/60'
                        )}
                      >
                        {proj.name}
                      </button>
                    );
                  })}
                  {!addingProject ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddingProject(true)}
                    >
                      <Plus className="h-4 w-4" />
                      {LOGS_CONTENT.decisionLog.addProjectLabel}
                    </Button>
                  ) : (
                    <form onSubmit={handleAddProject} className="flex items-center gap-2">
                      <Input
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Project name"
                        className="w-40"
                        autoFocus
                      />
                      <Button type="submit" size="sm">
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel add project"
                        onClick={() => {
                          setAddingProject(false);
                          setNewProjectName('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </div>

                <Button type="button" variant="amber" onClick={handleAddDecisionRow}>
                  <Plus className="h-4 w-4" />
                  {LOGS_CONTENT.decisionLog.addRowLabel}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Grey Example Hint */}
              <p className="rounded-xl bg-[#ece7dc]/70 px-3.5 py-2.5 text-xs leading-relaxed text-[#52615a]">
                {LOGS_CONTENT.decisionLog.exampleHint}
              </p>

              {!selectedProject || selectedProject.rows.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#52615a]">
                  {LOGS_CONTENT.decisionLog.emptyRows}
                </p>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#0b3d2e]/15 text-xs font-semibold text-[#52615a]">
                          {LOGS_CONTENT.decisionLog.columns.map((col) => (
                            <th key={col} className="pb-2.5 pr-3">
                              {col}
                            </th>
                          ))}
                          <th className="pb-2.5 w-11" aria-label="Actions" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0b3d2e]/10">
                        {selectedProject.rows.map((row) => (
                          <tr key={row.id} className="align-top">
                            <td className="py-2.5 pr-2">
                              <Textarea
                                aria-label="Screen / decision"
                                value={row.screenOrDecision}
                                onChange={(e) =>
                                  handleUpdateDecisionRow(
                                    row.id,
                                    'screenOrDecision',
                                    e.target.value
                                  )
                                }
                                placeholder="Screen / decision"
                                className="min-h-[68px] text-xs"
                              />
                            </td>
                            <td className="py-2.5 pr-2">
                              <Textarea
                                aria-label="Options I considered"
                                value={row.optionsConsidered}
                                onChange={(e) =>
                                  handleUpdateDecisionRow(
                                    row.id,
                                    'optionsConsidered',
                                    e.target.value
                                  )
                                }
                                placeholder="Options considered"
                                className="min-h-[68px] text-xs"
                              />
                            </td>
                            <td className="py-2.5 pr-2">
                              <Textarea
                                aria-label="What I chose"
                                value={row.whatIChose}
                                onChange={(e) =>
                                  handleUpdateDecisionRow(row.id, 'whatIChose', e.target.value)
                                }
                                placeholder="What I chose"
                                className="min-h-[68px] text-xs"
                              />
                            </td>
                            <td className="py-2.5 pr-2">
                              <Textarea
                                aria-label="Why"
                                value={row.why}
                                onChange={(e) =>
                                  handleUpdateDecisionRow(row.id, 'why', e.target.value)
                                }
                                placeholder="Why (required to own it)"
                                className={cn(
                                  'min-h-[68px] text-xs',
                                  !row.why.trim() && 'border-[#f59e0b]/70 bg-[#fef3c7]/30'
                                )}
                              />
                            </td>
                            <td className="py-2.5 pr-2">
                              <Textarea
                                aria-label="Risk / not validated"
                                value={row.riskNotValidated}
                                onChange={(e) =>
                                  handleUpdateDecisionRow(
                                    row.id,
                                    'riskNotValidated',
                                    e.target.value
                                  )
                                }
                                placeholder="Risk / not validated"
                                className="min-h-[68px] text-xs"
                              />
                            </td>
                            <td className="py-2.5 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Delete decision row"
                                onClick={() => handleDeleteDecisionRow(row.id)}
                                className="text-[#52615a] hover:text-[#b91c1c]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile / Tablet Stacked Editable Cards */}
                  <div className="space-y-4 lg:hidden">
                    {selectedProject.rows.map((row, idx) => (
                      <div
                        key={row.id}
                        className="rounded-xl border border-[#0b3d2e]/12 bg-[#ffffff] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-num text-xs font-semibold text-[#0b3d2e]">
                            Row {idx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete row ${idx + 1}`}
                            onClick={() => handleDeleteDecisionRow(row.id)}
                            className="text-[#52615a] hover:text-[#b91c1c]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <label className="text-xs font-medium text-[#52615a]">
                              {LOGS_CONTENT.decisionLog.columns[0]}
                            </label>
                            <Input
                              value={row.screenOrDecision}
                              onChange={(e) =>
                                handleUpdateDecisionRow(row.id, 'screenOrDecision', e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#52615a]">
                              {LOGS_CONTENT.decisionLog.columns[1]}
                            </label>
                            <Input
                              value={row.optionsConsidered}
                              onChange={(e) =>
                                handleUpdateDecisionRow(row.id, 'optionsConsidered', e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#52615a]">
                              {LOGS_CONTENT.decisionLog.columns[2]}
                            </label>
                            <Input
                              value={row.whatIChose}
                              onChange={(e) =>
                                handleUpdateDecisionRow(row.id, 'whatIChose', e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#52615a]">
                              {LOGS_CONTENT.decisionLog.columns[3]}
                            </label>
                            <Textarea
                              value={row.why}
                              onChange={(e) =>
                                handleUpdateDecisionRow(row.id, 'why', e.target.value)
                              }
                              className={cn(
                                'mt-1 min-h-[64px]',
                                !row.why.trim() && 'border-[#f59e0b]/70 bg-[#fef3c7]/30'
                              )}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#52615a]">
                              {LOGS_CONTENT.decisionLog.columns[4]}
                            </label>
                            <Input
                              value={row.riskNotValidated}
                              onChange={(e) =>
                                handleUpdateDecisionRow(row.id, 'riskNotValidated', e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* B) INTERVIEW DEBRIEF */}
      {view === 'debrief' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#0b3d2e]/15 bg-[#e6eee9]/70 px-5 py-3.5 text-sm text-[#0b3d2e]">
            {LOGS_CONTENT.debrief.hint}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {editingDebriefId ? 'Edit Interview Debrief' : 'New Interview Debrief'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveDebrief} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <label htmlFor="deb-company" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.company}
                    </label>
                    <Input
                      id="deb-company"
                      value={debriefForm.company}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, company: e.target.value }))
                      }
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-role" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.role}
                    </label>
                    <Input
                      id="deb-role"
                      value={debriefForm.role}
                      onChange={(e) => setDebriefForm((p) => ({ ...p, role: e.target.value }))}
                      placeholder="Product Designer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-round" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.round}
                    </label>
                    <Input
                      id="deb-round"
                      value={debriefForm.round}
                      onChange={(e) => setDebriefForm((p) => ({ ...p, round: e.target.value }))}
                      placeholder="Portfolio walkthrough"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-date" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.date}
                    </label>
                    <Input
                      id="deb-date"
                      type="date"
                      value={debriefForm.date}
                      onChange={(e) => setDebriefForm((p) => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="deb-q" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.questionsAsked}
                    </label>
                    <Textarea
                      id="deb-q"
                      value={debriefForm.questionsAsked}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, questionsAsked: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-claims" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.wordsOrClaimsDugInto}
                    </label>
                    <Textarea
                      id="deb-claims"
                      value={debriefForm.wordsOrClaimsDugInto}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, wordsOrClaimsDugInto: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-right" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.wentRight}
                    </label>
                    <Textarea
                      id="deb-right"
                      value={debriefForm.wentRight}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, wentRight: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-wrong" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.wentWrong}
                    </label>
                    <Textarea
                      id="deb-wrong"
                      value={debriefForm.wentWrong}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, wentWrong: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-idk" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.didNotKnowAndHowToFindOut}
                    </label>
                    <Textarea
                      id="deb-idk"
                      value={debriefForm.didNotKnowAndHowToFindOut}
                      onChange={(e) =>
                        setDebriefForm((p) => ({
                          ...p,
                          didNotKnowAndHowToFindOut: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="deb-change" className="text-sm font-medium">
                      {LOGS_CONTENT.debrief.fields.oneThingToChange}
                    </label>
                    <Textarea
                      id="deb-change"
                      value={debriefForm.oneThingToChange}
                      onChange={(e) =>
                        setDebriefForm((p) => ({ ...p, oneThingToChange: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="deb-result" className="text-sm font-medium">
                    {LOGS_CONTENT.debrief.fields.resultAndReason}
                  </label>
                  <Input
                    id="deb-result"
                    value={debriefForm.resultAndReason}
                    onChange={(e) =>
                      setDebriefForm((p) => ({ ...p, resultAndReason: e.target.value }))
                    }
                    placeholder="Pending / Next round / Rejected + reason if given"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {editingDebriefId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingDebriefId(null);
                        setDebriefForm(EMPTY_DEBRIEF_FORM);
                      }}
                    >
                      Cancel edit
                    </Button>
                  )}
                  <Button type="submit">
                    {editingDebriefId ? 'Update debrief' : 'Save debrief'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Saved Debriefs ({state.logs.debriefs.length})</CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52615a]" />
                  <Input
                    value={debriefSearch}
                    onChange={(e) => setDebriefSearch(e.target.value)}
                    placeholder={LOGS_CONTENT.debrief.searchPlaceholder}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDebriefs.length === 0 ? (
                <p className="text-sm text-[#52615a]">{LOGS_CONTENT.debrief.emptyList}</p>
              ) : (
                <div className="space-y-3">
                  {filteredDebriefs.map((entry) => {
                    const isOpen = openedDebriefId === entry.id;
                    return (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-[#0b3d2e]/12 bg-[#ffffff]"
                      >
                        <div className="flex items-center justify-between gap-2 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setOpenedDebriefId(isOpen ? null : entry.id)}
                            className="min-h-[44px] flex-1 text-left cursor-pointer"
                          >
                            <p className="font-semibold text-[#13221c]">
                              {entry.company || 'Untitled Company'} — {entry.role || 'Design Role'}
                            </p>
                            <p className="text-xs text-[#52615a]">
                              <span>{entry.round || 'Round'}</span>
                              <span className="mx-1.5" aria-hidden="true">·</span>
                              <span>{formatDisplayDate(entry.date)}</span>
                              {entry.resultAndReason && (
                                <>
                                  <span className="mx-1.5" aria-hidden="true">·</span>
                                  <span>{entry.resultAndReason}</span>
                                </>
                              )}
                            </p>
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Edit debrief for ${entry.company}`}
                              onClick={() => handleEditDebrief(entry)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete debrief for ${entry.company}`}
                              onClick={() => handleDeleteDebrief(entry.id)}
                              className="text-[#52615a] hover:text-[#b91c1c]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="grid grid-cols-1 gap-3 border-t border-[#0b3d2e]/10 p-4 text-sm sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold text-[#0b3d2e]">
                                {LOGS_CONTENT.debrief.fields.questionsAsked}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">{entry.questionsAsked || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#0b3d2e]">
                                {LOGS_CONTENT.debrief.fields.wordsOrClaimsDugInto}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">
                                {entry.wordsOrClaimsDugInto || '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#0b3d2e]">
                                {LOGS_CONTENT.debrief.fields.wentRight}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">{entry.wentRight || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#0b3d2e]">
                                {LOGS_CONTENT.debrief.fields.wentWrong}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">{entry.wentWrong || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#0b3d2e]">
                                {LOGS_CONTENT.debrief.fields.didNotKnowAndHowToFindOut}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">
                                {entry.didNotKnowAndHowToFindOut || '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#b45309]">
                                {LOGS_CONTENT.debrief.fields.oneThingToChange}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">
                                {entry.oneThingToChange || '—'}
                              </p>
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
        </div>
      )}

      {/* C) DAILY JOURNAL */}
      {view === 'journal' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingJournalId ? 'Edit Journal Entry' : 'New Daily Journal Entry'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveJournal} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="jr-date" className="text-sm font-medium">
                      {LOGS_CONTENT.journal.fields.date}
                    </label>
                    <Input
                      id="jr-date"
                      type="date"
                      value={journalForm.date}
                      onChange={(e) =>
                        setJournalForm((p) => ({ ...p, date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-sm font-medium">
                      {LOGS_CONTENT.journal.fields.energy}
                    </span>
                    <div className="flex items-center gap-2" role="radiogroup" aria-label="Energy 1 to 5">
                      {([1, 2, 3, 4, 5] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          role="radio"
                          aria-checked={journalForm.energy === lvl}
                          onClick={() => setJournalForm((p) => ({ ...p, energy: lvl }))}
                          className={cn(
                            'min-h-[44px] min-w-[44px] flex-1 rounded-xl border font-mono-num text-sm font-semibold transition-all active:scale-[0.97] cursor-pointer',
                            journalForm.energy === lvl
                              ? 'border-[#0b3d2e] bg-[#0b3d2e] text-[#fcfbf8]'
                              : 'border-[#0b3d2e]/15 bg-[#ffffff] text-[#52615a] hover:bg-[#ece7dc]/60'
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label htmlFor="jr-learned" className="text-sm font-medium">
                      {LOGS_CONTENT.journal.fields.learnedToday}
                    </label>
                    <Textarea
                      id="jr-learned"
                      value={journalForm.learnedToday}
                      onChange={(e) =>
                        setJournalForm((p) => ({ ...p, learnedToday: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="jr-idk" className="text-sm font-medium">
                      {LOGS_CONTENT.journal.fields.didNotKnow}
                    </label>
                    <Textarea
                      id="jr-idk"
                      value={journalForm.didNotKnow}
                      onChange={(e) =>
                        setJournalForm((p) => ({ ...p, didNotKnow: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="jr-find" className="text-sm font-medium">
                      {LOGS_CONTENT.journal.fields.howToFindOut}
                    </label>
                    <Textarea
                      id="jr-find"
                      value={journalForm.howToFindOut}
                      onChange={(e) =>
                        setJournalForm((p) => ({ ...p, howToFindOut: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {editingJournalId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingJournalId(null);
                        setJournalForm(EMPTY_JOURNAL_FORM);
                      }}
                    >
                      Cancel edit
                    </Button>
                  )}
                  <Button type="submit">
                    {editingJournalId ? 'Update entry' : 'Save entry'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Journal History ({sortedJournal.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedJournal.length === 0 ? (
                <p className="text-sm text-[#52615a]">{LOGS_CONTENT.journal.emptyList}</p>
              ) : (
                <div className="space-y-3">
                  {sortedJournal.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-[#0b3d2e]/12 bg-[#ffffff] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-medium text-[#52615a]">
                          <span className="font-semibold text-[#13221c]">
                            {formatDisplayDate(entry.date)}
                          </span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="font-mono-num">Energy {entry.energy}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit entry for ${entry.date}`}
                            onClick={() => handleEditJournal(entry)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete entry for ${entry.date}`}
                            onClick={() => handleDeleteJournal(entry.id)}
                            className="text-[#52615a] hover:text-[#b91c1c]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold text-[#0b3d2e]">
                            {LOGS_CONTENT.journal.fields.learnedToday}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap">{entry.learnedToday || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#0b3d2e]">
                            {LOGS_CONTENT.journal.fields.didNotKnow}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap">{entry.didNotKnow || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#0b3d2e]">
                            {LOGS_CONTENT.journal.fields.howToFindOut}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap">{entry.howToFindOut || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
