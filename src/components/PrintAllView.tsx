import React from 'react';
import {
  APP_META,
  CHECKLISTS_CONTENT,
  FACT_SHEET_CONTENT,
  LOGS_CONTENT,
  PLAN_CONTENT,
  PRACTICE_CONTENT,
  TODAY_CONTENT,
} from '../data/content';
import { calculateStreak } from '../lib/storage';
import { formatDisplayDate, getMondayDateKey, toDateKey } from '../lib/utils';
import type { DesignDojoState } from '../types/dojo';

interface PrintAllViewProps {
  state: DesignDojoState;
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function PrintAllView({ state, sectionRefs }: PrintAllViewProps) {
  const todayKey = toDateKey();
  const mondayKey = getMondayDateKey();
  const todayEntry = state.daily[todayKey];
  const weekly = state.weeklyTargets[mondayKey] ?? { applications: 0, messages: 0, drills: 0 };
  const streak = calculateStreak(state.daily);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        width: '820px',
        backgroundColor: '#ffffff',
        color: '#13221c',
        pointerEvents: 'none',
      }}
    >
      {/* Section 0: Today */}
      <div
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        style={{ padding: '28px', backgroundColor: '#ffffff', color: '#13221c' }}
      >
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0b3d2e', marginBottom: '4px' }}>
          {APP_META.title} — Today ({formatDisplayDate(todayKey)})
        </h1>
        <p style={{ fontSize: '13px', color: '#52615a', marginBottom: '16px' }}>
          {APP_META.subtitle} · Streak: {streak} days
        </p>
        <div style={{ marginBottom: '14px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
          <strong>{TODAY_CONTENT.oneJobLabel}:</strong>{' '}
          {todayEntry?.oneJob?.trim() || 'Not set'}
        </div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginTop: '12px', marginBottom: '6px' }}>
          {TODAY_CONTENT.morningTitle}
        </h2>
        <ul style={{ fontSize: '13px', lineHeight: 1.6, paddingLeft: '18px' }}>
          {TODAY_CONTENT.morningItems.map((i) => (
            <li key={i.id}>
              [{todayEntry?.morningTicks?.[i.id] ? 'x' : ' '}] {i.text}
            </li>
          ))}
        </ul>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginTop: '12px', marginBottom: '6px' }}>
          {TODAY_CONTENT.nightTitle}
        </h2>
        <ul style={{ fontSize: '13px', lineHeight: 1.6, paddingLeft: '18px' }}>
          {TODAY_CONTENT.nightItems.map((i) => (
            <li key={i.id}>
              [{todayEntry?.nightTicks?.[i.id] ? 'x' : ' '}] {i.text}
            </li>
          ))}
        </ul>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginTop: '12px', marginBottom: '6px' }}>
          {TODAY_CONTENT.weeklyTargetsTitle}
        </h2>
        <ul style={{ fontSize: '13px', lineHeight: 1.6, paddingLeft: '18px' }}>
          {TODAY_CONTENT.weeklyTargets.map((t) => (
            <li key={t.key}>
              {t.label}: {weekly[t.key] ?? 0}/{t.target}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 1: Checklists */}
      <div
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        style={{ padding: '28px', backgroundColor: '#ffffff', color: '#13221c' }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0b3d2e', marginBottom: '8px' }}>
          Checklists — {state.checklists.assessmentName || 'Current Assessment'}
        </h1>
        {CHECKLISTS_CONTENT.deliverableGroups.map((g) => (
          <div key={g.id} style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{g.title}</h2>
            <ul style={{ fontSize: '12px', lineHeight: 1.55, paddingLeft: '16px' }}>
              {g.items.map((item) => (
                <li key={item.id}>
                  [{state.checklists.mandatoryTicks[item.id] ? 'x' : ' '}] {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginTop: '12px', marginBottom: '4px' }}>
          {CHECKLISTS_CONTENT.drillTrackerTitle}
        </h2>
        <ul style={{ fontSize: '12px', lineHeight: 1.55, paddingLeft: '16px' }}>
          {CHECKLISTS_CONTENT.drillTrackerItems.map((item) => (
            <li key={item.id}>
              [{state.checklists.drillTrackerTicks[item.id] ? 'x' : ' '}] {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: Practice */}
      <div
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        style={{ padding: '28px', backgroundColor: '#ffffff', color: '#13221c' }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0b3d2e', marginBottom: '8px' }}>
          Practice Attempts ({state.practice.attempts.length})
        </h1>
        {state.practice.attempts.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#52615a' }}>No practice attempts saved yet.</p>
        ) : (
          state.practice.attempts.map((a) => (
            <div
              key={a.id}
              style={{
                marginBottom: '12px',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {a.challengeName} — {a.totalScore}/12 ({a.date}, {a.timeTaken})
              </div>
              <div style={{ marginTop: '4px' }}>Right: {a.whatWentRight || '—'}</div>
              <div>Wrong: {a.whatWentWrong || '—'}</div>
              <div>One fix: {a.oneFixNextTime || '—'}</div>
            </div>
          ))
        )}
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginTop: '12px', marginBottom: '4px' }}>
          {PRACTICE_CONTENT.rulesTitle}
        </h2>
        <ul style={{ fontSize: '12px', lineHeight: 1.5, paddingLeft: '16px' }}>
          {PRACTICE_CONTENT.rules.map((r) => (
            <li key={r.id}>{r.text}</li>
          ))}
        </ul>
      </div>

      {/* Section 3: Logs */}
      <div
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        style={{ padding: '28px', backgroundColor: '#ffffff', color: '#13221c' }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0b3d2e', marginBottom: '8px' }}>
          Logs — Decision Log, Debriefs & Journal
        </h1>
        {state.logs.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              Project: {proj.name} ({proj.rows.length} decisions)
            </h2>
            {proj.rows.map((r) => (
              <div
                key={r.id}
                style={{
                  fontSize: '11px',
                  padding: '6px 8px',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <strong>{r.screenOrDecision || 'Decision'}:</strong> Chose{' '}
                {r.whatIChose || '—'} (Options: {r.optionsConsidered || '—'}) · Why:{' '}
                {r.why || '—'} · Risk: {r.riskNotValidated || '—'}
              </div>
            ))}
          </div>
        ))}

        <h2 style={{ fontSize: '14px', fontWeight: 700, marginTop: '12px', marginBottom: '4px' }}>
          Interview Debriefs ({state.logs.debriefs.length})
        </h2>
        {state.logs.debriefs.map((d) => (
          <div key={d.id} style={{ fontSize: '12px', marginBottom: '8px' }}>
            <strong>
              {d.company} — {d.role}
            </strong>{' '}
            ({d.round}, {d.date}) · Result: {d.resultAndReason || '—'} · Change:{' '}
            {d.oneThingToChange || '—'}
          </div>
        ))}

        <h2 style={{ fontSize: '14px', fontWeight: 700, marginTop: '12px', marginBottom: '4px' }}>
          Daily Journal ({state.logs.journal.length})
        </h2>
        {state.logs.journal.map((j) => (
          <div key={j.id} style={{ fontSize: '12px', marginBottom: '8px' }}>
            <strong>{j.date}</strong> (Energy {j.energy}/5): Learned: {j.learnedToday || '—'} ·
            Unknown: {j.didNotKnow || '—'} · Next: {j.howToFindOut || '—'}
          </div>
        ))}
      </div>

      {/* Section 4: Plan & Fact Sheet */}
      <div
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        style={{ padding: '28px', backgroundColor: '#ffffff', color: '#13221c' }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0b3d2e', marginBottom: '8px' }}>
          3-Day Plan
        </h1>
        {PLAN_CONTENT.days.map((day) => (
          <div key={day.id} style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700 }}>
              {day.dayLabel}: {day.headline}
            </h2>
            <ul style={{ fontSize: '12px', lineHeight: 1.5, paddingLeft: '16px' }}>
              {day.blocks.map((b) => (
                <li key={b.id}>
                  [{state.plan.blockTicks[b.id] ? 'x' : ' '}] {b.title}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0b3d2e', marginTop: '16px', marginBottom: '8px' }}>
          Fact Sheet & Claims Audit
        </h1>
        {FACT_SHEET_CONTENT.sections.map((sec) => (
          <div key={sec.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
            <strong>{sec.label}:</strong> {state.factSheet.fields[sec.id] || '—'}
          </div>
        ))}
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <strong>{FACT_SHEET_CONTENT.claimsAuditTitle}:</strong>{' '}
          {FACT_SHEET_CONTENT.claimsAuditRows
            .map((r) => `${r.label}: ${state.factSheet.claimsAudit[r.id] ? 'Verified' : 'Pending'}`)
            .join(' · ')}
        </div>
        <div style={{ marginTop: '6px', fontSize: '12px', color: '#52615a' }}>
          {LOGS_CONTENT.decisionLog.banner}
        </div>
      </div>
    </div>
  );
}
