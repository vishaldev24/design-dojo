export type TabId =
  | 'today'
  | 'checklists'
  | 'practice'
  | 'logs'
  | 'export'
  | 'plan'
  | 'fact-sheet';

export interface DailyRoutineEntry {
  oneJob: string;
  morningTicks: Record<string, boolean>;
  nightTicks: Record<string, boolean>;
}

export interface WeeklyTargetsProgress {
  applications: number;
  messages: number;
  drills: number;
}

export interface AssessmentHistoryItem {
  id: string;
  name: string;
  date: string;
  completionPercent: number;
  checkedCount: number;
  totalCount: number;
  ticks: Record<string, boolean>;
}

export type ScorecardValue = 0 | 1 | 2;

export interface PracticeAttempt {
  id: string;
  challengeName: string;
  date: string;
  timeTaken: string;
  whatWentRight: string;
  whatWentWrong: string;
  oneFixNextTime: string;
  rulesTicks: Record<string, boolean>;
  scores: Record<string, ScorecardValue>;
  totalScore: number;
  createdAt: string;
}

export interface DecisionLogRow {
  id: string;
  screenOrDecision: string;
  optionsConsidered: string;
  whatIChose: string;
  why: string;
  riskNotValidated: string;
}

export interface DecisionProject {
  id: string;
  name: string;
  rows: DecisionLogRow[];
}

export interface InterviewDebriefEntry {
  id: string;
  company: string;
  role: string;
  round: string;
  date: string;
  questionsAsked: string;
  wordsOrClaimsDugInto: string;
  wentRight: string;
  wentWrong: string;
  didNotKnowAndHowToFindOut: string;
  oneThingToChange: string;
  resultAndReason: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  learnedToday: string;
  didNotKnow: string;
  howToFindOut: string;
  energy: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

export interface FactSheetData {
  fields: Record<string, string>;
  flaggedWordsChecked: Record<string, boolean>;
  claimsAudit: Record<string, boolean>;
}

export interface DesignDojoState {
  version: number;
  daily: Record<string, DailyRoutineEntry>;
  weeklyTargets: Record<string, WeeklyTargetsProgress>;
  checklists: {
    assessmentName: string;
    mandatoryTicks: Record<string, boolean>;
    assessmentHistory: AssessmentHistoryItem[];
    drillTrackerTicks: Record<string, boolean>;
  };
  practice: {
    activeRulesTicks: Record<string, boolean>;
    activeScores: Record<string, ScorecardValue>;
    challengeName: string;
    date: string;
    timeTaken: string;
    whatWentRight: string;
    whatWentWrong: string;
    oneFixNextTime: string;
    attempts: PracticeAttempt[];
  };
  logs: {
    selectedProjectId: string;
    projects: DecisionProject[];
    debriefs: InterviewDebriefEntry[];
    journal: JournalEntry[];
  };
  plan: {
    blockTicks: Record<string, boolean>;
  };
  factSheet: FactSheetData;
}
