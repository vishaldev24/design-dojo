import { LOGS_CONTENT, TODAY_CONTENT } from '../data/content';
import type { DesignDojoState } from '../types/dojo';
import { toDateKey } from './utils';

const STORAGE_KEY = 'design_dojo_state_v1';

export function createDefaultState(): DesignDojoState {
  const todayKey = toDateKey();
  return {
    version: 1,
    daily: {},
    weeklyTargets: {},
    checklists: {
      assessmentName: '',
      mandatoryTicks: {},
      assessmentHistory: [],
      drillTrackerTicks: {},
    },
    practice: {
      activeRulesTicks: {},
      activeScores: {},
      challengeName: '',
      date: todayKey,
      timeTaken: '',
      whatWentRight: '',
      whatWentWrong: '',
      oneFixNextTime: '',
      attempts: [],
    },
    logs: {
      selectedProjectId: LOGS_CONTENT.decisionLog.defaultProjects[0].id,
      projects: LOGS_CONTENT.decisionLog.defaultProjects.map((p) => ({
        id: p.id,
        name: p.name,
        rows: [],
      })),
      debriefs: [],
      journal: [],
    },
    plan: {
      blockTicks: {},
    },
    factSheet: {
      fields: {},
      flaggedWordsChecked: {},
      claimsAudit: {},
    },
  };
}

export function loadDojoState(): DesignDojoState {
  const fallback = createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DesignDojoState>;
    return mergeWithDefaults(parsed, fallback);
  } catch {
    return fallback;
  }
}

export function saveDojoState(state: DesignDojoState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearDojoState(): DesignDojoState {
  const fresh = createDefaultState();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // ignore storage errors
  }
  return fresh;
}

export function mergeWithDefaults(
  parsed: Partial<DesignDojoState> | null | undefined,
  fallback: DesignDojoState = createDefaultState()
): DesignDojoState {
  if (!parsed || typeof parsed !== 'object') return fallback;
  return {
    version: 1,
    daily: parsed.daily && typeof parsed.daily === 'object' ? parsed.daily : fallback.daily,
    weeklyTargets:
      parsed.weeklyTargets && typeof parsed.weeklyTargets === 'object'
        ? parsed.weeklyTargets
        : fallback.weeklyTargets,
    checklists: {
      assessmentName:
        typeof parsed.checklists?.assessmentName === 'string'
          ? parsed.checklists.assessmentName
          : fallback.checklists.assessmentName,
      mandatoryTicks:
        parsed.checklists?.mandatoryTicks && typeof parsed.checklists.mandatoryTicks === 'object'
          ? parsed.checklists.mandatoryTicks
          : fallback.checklists.mandatoryTicks,
      assessmentHistory: Array.isArray(parsed.checklists?.assessmentHistory)
        ? parsed.checklists.assessmentHistory
        : fallback.checklists.assessmentHistory,
      drillTrackerTicks:
        parsed.checklists?.drillTrackerTicks && typeof parsed.checklists.drillTrackerTicks === 'object'
          ? parsed.checklists.drillTrackerTicks
          : fallback.checklists.drillTrackerTicks,
    },
    practice: {
      activeRulesTicks:
        parsed.practice?.activeRulesTicks && typeof parsed.practice.activeRulesTicks === 'object'
          ? parsed.practice.activeRulesTicks
          : fallback.practice.activeRulesTicks,
      activeScores:
        parsed.practice?.activeScores && typeof parsed.practice.activeScores === 'object'
          ? parsed.practice.activeScores
          : fallback.practice.activeScores,
      challengeName:
        typeof parsed.practice?.challengeName === 'string'
          ? parsed.practice.challengeName
          : fallback.practice.challengeName,
      date:
        typeof parsed.practice?.date === 'string' ? parsed.practice.date : fallback.practice.date,
      timeTaken:
        typeof parsed.practice?.timeTaken === 'string'
          ? parsed.practice.timeTaken
          : fallback.practice.timeTaken,
      whatWentRight:
        typeof parsed.practice?.whatWentRight === 'string'
          ? parsed.practice.whatWentRight
          : fallback.practice.whatWentRight,
      whatWentWrong:
        typeof parsed.practice?.whatWentWrong === 'string'
          ? parsed.practice.whatWentWrong
          : fallback.practice.whatWentWrong,
      oneFixNextTime:
        typeof parsed.practice?.oneFixNextTime === 'string'
          ? parsed.practice.oneFixNextTime
          : fallback.practice.oneFixNextTime,
      attempts: Array.isArray(parsed.practice?.attempts)
        ? parsed.practice.attempts
        : fallback.practice.attempts,
    },
    logs: {
      selectedProjectId:
        typeof parsed.logs?.selectedProjectId === 'string'
          ? parsed.logs.selectedProjectId
          : fallback.logs.selectedProjectId,
      projects:
        Array.isArray(parsed.logs?.projects) && parsed.logs.projects.length > 0
          ? parsed.logs.projects
          : fallback.logs.projects,
      debriefs: Array.isArray(parsed.logs?.debriefs)
        ? parsed.logs.debriefs
        : fallback.logs.debriefs,
      journal: Array.isArray(parsed.logs?.journal)
        ? parsed.logs.journal
        : fallback.logs.journal,
    },
    plan: {
      blockTicks:
        parsed.plan?.blockTicks && typeof parsed.plan.blockTicks === 'object'
          ? parsed.plan.blockTicks
          : fallback.plan.blockTicks,
    },
    factSheet: {
      fields:
        parsed.factSheet?.fields && typeof parsed.factSheet.fields === 'object'
          ? parsed.factSheet.fields
          : fallback.factSheet.fields,
      flaggedWordsChecked:
        parsed.factSheet?.flaggedWordsChecked &&
        typeof parsed.factSheet.flaggedWordsChecked === 'object'
          ? parsed.factSheet.flaggedWordsChecked
          : fallback.factSheet.flaggedWordsChecked,
      claimsAudit:
        parsed.factSheet?.claimsAudit && typeof parsed.factSheet.claimsAudit === 'object'
          ? parsed.factSheet.claimsAudit
          : fallback.factSheet.claimsAudit,
    },
  };
}

export function isDayRoutineComplete(
  entry: DesignDojoState['daily'][string] | undefined,
  part: 'morning' | 'night' | 'both'
): boolean {
  if (!entry) return false;
  const morningDone = TODAY_CONTENT.morningItems.every((item) => Boolean(entry.morningTicks?.[item.id]));
  const nightDone = TODAY_CONTENT.nightItems.every((item) => Boolean(entry.nightTicks?.[item.id]));
  if (part === 'morning') return morningDone;
  if (part === 'night') return nightDone;
  return morningDone && nightDone;
}

export function calculateStreak(daily: DesignDojoState['daily'], referenceDate: Date = new Date()): number {
  const todayKey = toDateKey(referenceDate);
  let streak = 0;

  // Check if today is already fully completed
  const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  if (isDayRoutineComplete(daily[todayKey], 'both')) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    // Otherwise check consecutive days ending yesterday
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let i = 0; i < 3650; i++) {
    const key = toDateKey(cursor);
    if (isDayRoutineComplete(daily[key], 'both')) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
