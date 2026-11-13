import type { TabId } from '../types/dojo';

export const APP_META = {
  title: 'Design Dojo',
  subtitle: 'Small, every day. Never give up.',
  savedLabel: 'Saved',
  doneLabel: 'Done',
  footerQuote: 'Stop at 6 focused hours. Sleep counts as work. NEVER GIVE UP.',
};

export interface NavTabMeta {
  id: TabId;
  label: string;
  mobileLabel: string;
  description: string;
}

export const NAV_TABS: NavTabMeta[] = [
  {
    id: 'today',
    label: 'Today',
    mobileLabel: 'Today',
    description: 'Daily routines, streak, one job, and weekly targets',
  },
  {
    id: 'checklists',
    label: 'Checklists',
    mobileLabel: 'Checks',
    description: 'Mandatory deliverables and interview drill sheet',
  },
  {
    id: 'practice',
    label: 'Practice',
    mobileLabel: 'Practice',
    description: '5 rules, 12-point scorecard, attempt log, and sources',
  },
  {
    id: 'logs',
    label: 'Logs',
    mobileLabel: 'Logs',
    description: 'Decision log, interview debriefs, and daily journal',
  },
  {
    id: 'export',
    label: 'Export',
    mobileLabel: 'Export',
    description: 'PDF/PNG exports, JSON backup, restore, and reset',
  },
  {
    id: 'plan',
    label: 'Plan',
    mobileLabel: 'Plan',
    description: '3-day structured reset and execution blocks',
  },
  {
    id: 'fact-sheet',
    label: 'Fact Sheet',
    mobileLabel: 'Facts',
    description: 'Verified truths, word check, and claims audit grid',
  },
];

// ==========================================
// TAB 1: TODAY
// ==========================================
export const TODAY_CONTENT = {
  oneJobLabel: 'My one job today',
  oneJobPlaceholder: 'Write the single most important outcome for today...',
  streakLabel: 'Day streak',
  streakSubtext: 'Consecutive days with both Morning and Night routines complete',
  morningTitle: 'Morning routine (15 min)',
  morningItems: [
    {
      id: 'm1',
      text: 'Say one project aloud: problem, decision, solution.',
    },
    {
      id: 'm2',
      text: 'Pick one screen from any app. What is it, why is it there, how do I get there?',
    },
    {
      id: 'm3',
      text: 'Write my one job for today.',
    },
  ],
  nightTitle: 'Night routine (15 min)',
  nightItems: [
    {
      id: 'n1',
      text: 'Add one row to my decision log.',
    },
    {
      id: 'n2',
      text: 'Check one number or claim I made today.',
    },
    {
      id: 'n3',
      text: 'Write one thing I did not know today, and how I will find out.',
    },
    {
      id: 'n4',
      text: 'Tick today. Close the laptop.',
    },
  ],
  weeklyTargetsTitle: 'Weekly targets',
  weeklyTargetsSubtitle: 'Resets every Monday',
  weeklyTargets: [
    {
      key: 'applications' as const,
      label: 'Tailored applications',
      target: 5,
    },
    {
      key: 'messages' as const,
      label: 'Messages to designers',
      target: 3,
    },
    {
      key: 'drills' as const,
      label: 'Timed practice drill',
      target: 1,
    },
  ],
  weekGridTitle: 'This week (Mon to Sun)',
  weekGridLegendMorning: 'Morning',
  weekGridLegendNight: 'Night',
};

// ==========================================
// TAB 2: CHECKLISTS
// ==========================================
export interface ChecklistGroup {
  id: string;
  title: string;
  items: { id: string; text: string }[];
}

export const CHECKLISTS_CONTENT = {
  segmentedTabs: [
    { id: 'deliverables' as const, label: 'Mandatory Deliverables' },
    { id: 'drills' as const, label: 'Interview Drill Sheet' },
  ],
  ruleBanner: 'Edge cases and error states are built BEFORE I polish anything.',
  assessmentNameLabel: 'Assessment name',
  assessmentNamePlaceholder: 'e.g. Fintech Checkout Take-Home',
  startNewButton: 'Start new assessment',
  historyTitle: 'Saved assessments',
  historyEmpty: 'No saved assessments yet. Enter a name and click "Start new assessment" to archive the current checklist and begin fresh.',
  deliverableGroups: [
    {
      id: 'before-figma',
      title: 'Before I open Figma (15 minutes)',
      items: [
        { id: 'bf1', text: 'The problem in my own words, in one sentence' },
        { id: 'bf2', text: '3 or 4 assumptions written down' },
        { id: 'bf3', text: 'Mandatory deliverables copied from the brief' },
        { id: 'bf4', text: 'Edge case chosen BEFORE I design the happy path' },
        { id: 'bf5', text: 'One hard-moment (negative) microcopy line identified' },
        { id: 'bf6', text: 'What I will NOT copy from any reference material' },
        { id: 'bf7', text: 'Entry point decided, and why' },
      ],
    },
    {
      id: 'while-build',
      title: 'While I build',
      items: [
        { id: 'wb1', text: 'User flow drawn, with at least one failure path' },
        { id: 'wb2', text: 'Screens built, each with a one-sentence "why"' },
        { id: 'wb3', text: 'Edge case designed as a real screen, not just described' },
        { id: 'wb4', text: 'Error state built: what happened, what to do next, no blame' },
        { id: 'wb5', text: 'Microcopy written: success, empty, error (plus one negative)' },
        { id: 'wb6', text: 'Prototype covers the main journey' },
        { id: 'wb7', text: 'Decision log filled in as I go, one row per screen' },
      ],
    },
    {
      id: 'before-submit',
      title: 'Before I submit',
      items: [
        { id: 'bs1', text: 'Every number recalculated by hand' },
        { id: 'bs2', text: 'Numbers and labels match across all screens' },
        { id: 'bs3', text: 'Every claim is true and I can show it' },
        { id: 'bs4', text: 'AI use stated: what for, where it stops, what if it is wrong, output checked' },
        { id: 'bs5', text: 'One-page rationale: problem, assumptions, approach, what I left out and why' },
        { id: 'bs6', text: 'Prototype link opened in a private window and it works' },
        { id: 'bs7', text: 'I can present it in 10 minutes without notes' },
      ],
    },
  ] as ChecklistGroup[],
  drillCards: [
    {
      id: 'thinking',
      title: '1. THINKING',
      subtitle: 'why / what / how, problem-solving, approach, decision log',
      drills: [
        'Take 5 screens from an app I use; for each say what it is, why it exists, how the user gets there; repeat for 5 of my own screens.',
        'Decision log table, 5 rows per project: Decision, Options, Chosen, Why, Risk.',
      ],
      gotItWhen: 'I can explain any of my screens in 20 seconds without looking.',
    },
    {
      id: 'mapping',
      title: '2. MAPPING',
      subtitle: 'user flow, user journey',
      drills: [
        'Draw a flow for "pay an electricity bill" with start, steps, decision points, a failure path, end.',
        'Then a journey map: stages, actions, pain points, opportunities; mark anything based on an assumption.',
      ],
      gotItWhen: 'every flow I draw has at least one failure path.',
    },
    {
      id: 'resilience',
      title: '3. RESILIENCE',
      subtitle: 'edge cases, error states, microcopy',
      drills: [
        'For each screen write 5 QA-style "what if" lines: empty, loading, offline, error, interrupted or permission denied.',
        'Error message = what happened + what to do next + no blame.',
        'Rewrite 10 vague labels (for example "Submit" to "Pay Rs 1,245").',
        'Write one success, one empty and one error message per project.',
      ],
      gotItWhen: 'I add these before anyone asks.',
    },
    {
      id: 'discipline',
      title: '4. DISCIPLINE',
      subtitle: 'mandatory checklist, AI verification, resume and project claims',
      drills: [
        'Write my deliverables checklist once and reuse it.',
        'Take an AI-written paragraph and find 3 things to verify: numbers, claims, reasons I cannot explain.',
        'Re-read my fact sheet before every interview.',
      ],
      gotItWhen: 'every number and claim passes my own check.',
    },
  ],
  drillTrackerTitle: '12-Item Skill Tracker',
  drillTrackerItems: [
    { id: 'dt1', text: 'Why / What / How' },
    { id: 'dt2', text: 'Problem-solving' },
    { id: 'dt3', text: 'Approach + creativity' },
    { id: 'dt4', text: 'Decision log' },
    { id: 'dt5', text: 'User flow mapping' },
    { id: 'dt6', text: 'User journey mapping' },
    { id: 'dt7', text: 'Edge cases' },
    { id: 'dt8', text: 'Error states + reasoning' },
    { id: 'dt9', text: 'Microcopy' },
    { id: 'dt10', text: 'Deliverables checklist' },
    { id: 'dt11', text: 'AI content verification' },
    { id: 'dt12', text: 'Resume + project claims' },
  ],
};

// ==========================================
// TAB 3: PRACTICE
// ==========================================
export const PRACTICE_CONTENT = {
  rulesTitle: 'The 5 Rules',
  rules: [
    { id: 'pr1', text: 'A failure path in the flow' },
    { id: 'pr2', text: 'An edge case and an error state designed as screens' },
    { id: 'pr3', text: 'One negative or hard-moment microcopy line' },
    { id: 'pr4', text: 'A decision log row (what I chose, what I rejected, why)' },
    { id: 'pr5', text: 'A 2-minute spoken explanation, recorded, no notes' },
  ],
  scorecardTitle: 'Practice Scorecard',
  scoreLegend: [
    { value: 0 as const, label: '0 missed' },
    { value: 1 as const, label: '1 partly' },
    { value: 2 as const, label: '2 done' },
  ],
  scorecardRows: [
    { id: 'sc1', label: 'Problem written in my own words' },
    { id: 'sc2', label: 'Flow includes a failure path' },
    { id: 'sc3', label: 'Edge case and error state designed' },
    { id: 'sc4', label: 'Microcopy includes a negative line' },
    { id: 'sc5', label: 'Every number and claim checked' },
    { id: 'sc6', label: 'Explained aloud in 2 minutes, no notes' },
  ],
  attemptFormTitle: 'Log Practice Attempt',
  fields: {
    challengeName: 'Challenge name',
    challengeNamePlaceholder: 'e.g. Electricity bill payment flow',
    date: 'Date',
    timeTaken: 'Time taken',
    timeTakenPlaceholder: 'e.g. 45 min',
    whatWentRight: 'What went right',
    whatWentRightPlaceholder: 'What held together clearly under time pressure?',
    whatWentWrong: 'What went wrong',
    whatWentWrongPlaceholder: 'Where did I hesitate, guess, or skip a step?',
    oneFixNextTime: 'One fix for next time',
    oneFixNextTimePlaceholder: 'Single concrete adjustment for the next drill...',
  },
  saveAttemptButton: 'Save attempt',
  historyTitle: 'Saved Attempts',
  historyEmpty: 'No practice attempts saved yet. Score a session above and save it to track your trajectory.',
  nextFocusTitle: 'Next focus',
  nextFocusPrefix: 'Scored 0 or 1 in each of the last 3 saved attempts:',
  freeSourcesTitle: 'Free Practice Sources',
  freeSources: [
    {
      name: 'Product Design Interview, weekly exercise',
      url: 'https://productdesigninterview.com/weekly-ux-product-design-exercise',
    },
    {
      name: 'Designercize generator',
      url: 'https://uiuxshowcase.com/resources/designercize/',
    },
    {
      name: 'Daily UI',
      url: 'https://uiuxshowcase.com/resources/daily-ui/',
    },
    {
      name: 'FakeClients daily UX challenge',
      url: 'https://fakeclients.com/blog/daily-ux-challenge',
    },
  ],
  weeklyRhythmTitle: 'Weekly Rhythm',
  weeklyRhythm: [
    {
      days: 'Mon & Wed',
      detail: 'A Daily UI prompt with the 5 rules (45 min).',
    },
    {
      days: 'Tue & Thu',
      detail: 'A 30-minute whiteboard challenge: 5 min problem, 10 min flow, 15 min key screen plus edge case, then present aloud.',
    },
    {
      days: 'Fri',
      detail: 'One timed full brief.',
    },
    {
      days: 'Weekend',
      detail: 'Replay recordings and update the decision log.',
    },
  ],
};

// ==========================================
// TAB 4: LOGS
// ==========================================
export const LOGS_CONTENT = {
  segmentedTabs: [
    { id: 'decision' as const, label: 'Decision Log' },
    { id: 'debrief' as const, label: 'Interview Debrief' },
    { id: 'journal' as const, label: 'Daily Journal' },
  ],
  decisionLog: {
    banner: 'If I cannot fill the Why column, I do not own that decision yet.',
    exampleHint:
      'Example: Cost entry on the job screen | Text field, stepper, numpad | Numpad | Large keys, no keyboard | Tested with only a few people',
    columns: [
      'Screen / decision',
      'Options I considered',
      'What I chose',
      'Why',
      'Risk / not validated',
    ],
    defaultProjects: [
      { id: 'proj-repairo', name: 'Repairo' },
      { id: 'proj-aurakshan', name: 'Aurakshan' },
      { id: 'proj-tarang', name: 'Tarang' },
    ],
    addProjectLabel: 'Add project',
    addRowLabel: 'Add row',
    emptyRows: 'No decisions logged for this project yet. Add your first decision row.',
  },
  debrief: {
    hint: 'Not told why? Send a short, polite email asking for one piece of feedback.',
    searchPlaceholder: 'Search by company, role, round, or keyword...',
    emptyList: 'No interview debriefs logged yet.',
    fields: {
      company: 'Company',
      role: 'Role',
      round: 'Round',
      date: 'Date',
      questionsAsked: 'Questions I was asked',
      wordsOrClaimsDugInto: 'Words or claims they dug into',
      wentRight: 'Went right (and why)',
      wentWrong: 'Went wrong (and why)',
      didNotKnowAndHowToFindOut: 'Something I did not know and how I will find out',
      oneThingToChange: 'The one thing I will change',
      resultAndReason: 'Result and any reason given',
    },
  },
  journal: {
    emptyList: 'No journal entries yet. Record what you learned and what you will investigate next.',
    fields: {
      date: 'Date',
      learnedToday: 'What I learned today',
      didNotKnow: 'What I did not know',
      howToFindOut: 'How I will find out',
      energy: 'Energy (1 to 5)',
    },
  },
};

// ==========================================
// TAB 5: EXPORT AND BACKUP
// ==========================================
export const EXPORT_CONTENT = {
  title: 'Export & Backup',
  subtitle: 'Download snapshots for portfolios, review, or offline safekeeping.',
  pdfPngTitle: 'Export Current View & Full Dojo',
  downloadTabPdfLabel: 'Download this tab as PDF',
  downloadTabPngLabel: 'Download this tab as image (PNG)',
  downloadAllPdfLabel: 'Download everything as one PDF',
  selectTabLabel: 'Select tab to export',
  backupTitle: 'Backup & Restore Data',
  backupDescription:
    'Everything lives in your browser localStorage. Download a JSON backup regularly before clearing browser data.',
  backupButton: 'Backup data',
  restoreButton: 'Restore',
  resetTitle: 'Danger Zone',
  resetDescription: 'Erase all local Design Dojo data and reset everything to factory defaults.',
  resetButton: 'Reset all data',
  resetConfirmTitle: 'Reset all Design Dojo data?',
  resetConfirmBody:
    'This permanently deletes all daily ticks, checklists, practice attempts, decision logs, interview debriefs, journal entries, plan progress, and fact sheet notes. Download a JSON backup first if you want to keep a copy.',
  resetConfirmAction: 'Yes, reset everything',
  resetCancelAction: 'Cancel',
};

// ==========================================
// TAB 6: PLAN
// ==========================================
export interface PlanBlock {
  id: string;
  title: string;
  duration?: string;
  description: string;
}

export interface PlanDay {
  id: string;
  dayLabel: string;
  headline: string;
  blocks: PlanBlock[];
  doneWhen?: string;
}

export const PLAN_CONTENT: { days: PlanDay[] } = {
  days: [
    {
      id: 'day-1',
      dayLabel: 'Day 1',
      headline: 'Make every fact true everywhere.',
      doneWhen:
        'Done when: every number is the same on my resume, case studies and LinkedIn, and I can say each project\'s sentence without looking.',
      blocks: [
        {
          id: 'd1-b1',
          title: 'Block 1, Fact sheet',
          duration: '1 hour',
          description:
            'QA role dates, team size, people trained, the defect-rate result and its period, best inspector recognition; Aurakshan: how many people I spoke to; Repairo: participant count, who they were, what the tests showed, one change I made; Tarang: what it is and that it is not tested with users; certificates and dates.',
        },
        {
          id: 'd1-b2',
          title: 'Block 2, Resume',
          duration: '1 hour',
          description:
            'Fill the [N] brackets and the main-finding line; merge the career-transition bullets and fix spacing; download as PDF and check the page break.',
        },
        {
          id: 'd1-b3',
          title: 'Block 3, Make every page match',
          duration: '2 hours',
          description:
            'Check these against the fact sheet: Aurakshan case study, Repairo case study, Tarang case study, Portfolio site, LinkedIn.',
        },
        {
          id: 'd1-b4',
          title: 'Block 4, Decision log',
          duration: '1.5 hours',
          description:
            'At least 5 Repairo rows including rejected options; one honest Problem / Decision / Solution sentence per project, saying what already exists and what I changed.',
        },
        {
          id: 'd1-b5',
          title: 'Block 5, Close out',
          duration: '30 min',
          description: 'Say one project aloud, do the night routine, tick today.',
        },
      ],
    },
    {
      id: 'day-2',
      dayLabel: 'Day 2',
      headline:
        'Pick one project. Draw its flows, a journey map, edge cases, error states and microcopy.',
      blocks: [
        {
          id: 'd2-b1',
          title: '1. Pick the project & entry point',
          description: 'Choose one core project and state the entry point and user goal in one sentence.',
        },
        {
          id: 'd2-b2',
          title: '2. Draw user flows with failure paths',
          description: 'Map start, steps, decision points, at least one failure path, and end.',
        },
        {
          id: 'd2-b3',
          title: '3. Build the journey map',
          description: 'Stages, actions, pain points, opportunities; clearly mark anything based on an assumption.',
        },
        {
          id: 'd2-b4',
          title: '4. Design edge cases, error states & microcopy',
          description: 'Build real screens for empty, loading, offline, error, and interrupted states plus one hard-moment line.',
        },
      ],
    },
    {
      id: 'day-3',
      dayLabel: 'Day 3',
      headline:
        'One timed practice assessment with the full checklist. Grade it on the scorecard, then present it aloud.',
      blocks: [
        {
          id: 'd3-b1',
          title: '1. Run a timed practice assessment',
          description: 'Use the Mandatory Deliverables Checklist from Tab 2 from Before I open Figma through Before I submit.',
        },
        {
          id: 'd3-b2',
          title: '2. Grade it on the 12-point scorecard',
          description: 'Log the attempt in Tab 3 with honest 0 / 1 / 2 scores and write one fix for next time.',
        },
        {
          id: 'd3-b3',
          title: '3. Present it aloud',
          description: 'Record a 2-minute spoken explanation without notes and review it.',
        },
      ],
    },
  ],
};

// ==========================================
// TAB 7: FACT SHEET
// ==========================================
export const FACT_SHEET_CONTENT = {
  banner: 'Only write what I can defend. If I cannot prove it, it does not go on any page.',
  sections: [
    {
      id: 'qaRole',
      label: 'QA role',
      prompt: 'Dates, team size, people trained, defect-rate result and period, best inspector recognition.',
      placeholder: 'Write only exact, provable facts about your QA role...',
    },
    {
      id: 'aurakshan',
      label: 'Aurakshan',
      prompt: 'How many people I spoke to, noting it was informal conversation, not formal interviews.',
      placeholder: 'Exact count and context (informal conversations, not formal interviews)...',
    },
    {
      id: 'repairo',
      label: 'Repairo',
      prompt: 'Number of participants, who they were, what the tests showed, one thing I changed.',
      placeholder: 'Exact participant count, profile, test findings, and concrete UI/flow change...',
    },
    {
      id: 'tarang',
      label: 'Tarang',
      prompt: 'What it is, what Shield does, validated with users yes or no.',
      placeholder: 'Clear summary of Tarang, Shield feature, and honest user validation status...',
    },
    {
      id: 'certificates',
      label: 'Certificates and dates',
      prompt: 'Exact certificate titles, issuing organizations, and completion dates.',
      placeholder: 'List certificates with exact dates...',
    },
    {
      id: 'careerTransition',
      label: 'Career transition in one line',
      prompt: 'Clear, honest one-line bridge from QA into product design.',
      placeholder: 'One grounded sentence explaining your career transition...',
    },
  ],
  searchWordsTitle: 'Search these words on every page',
  searchWordsSubtitle: 'Tap a word once you have verified or removed it across every public page.',
  searchWords: [
    'interviews',
    'testers',
    '7/10',
    'contextual',
    'pivot',
    'production-level',
    'shipped',
    'solved',
    'expert',
  ],
  claimsAuditTitle: 'Claims Audit Grid',
  claimsAuditCheckboxLabel: 'Matches my fact sheet',
  claimsAuditRows: [
    { id: 'audit-resume', label: 'Resume' },
    { id: 'audit-aurakshan', label: 'Aurakshan case study' },
    { id: 'audit-repairo', label: 'Repairo case study' },
    { id: 'audit-tarang', label: 'Tarang case study' },
    { id: 'audit-portfolio', label: 'Portfolio site' },
    { id: 'audit-linkedin', label: 'LinkedIn' },
  ],
};
