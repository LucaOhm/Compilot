// Gemeinsame Bausteine der Demo-Ansichten.
import { COMPETITIONS } from '../data/competitions.js';
import { PROCEDURES } from '../data/procedures.js';

export const COMP_BY_ID = Object.fromEntries(COMPETITIONS.map((c) => [c.id, c]));

export function effortLevel(hours) {
  if (hours <= 200) return { label: 'gering', tone: 'accent' };
  if (hours <= 400) return { label: 'mittel', tone: 'warn' };
  return { label: 'hoch', tone: 'risk' };
}

export function deadlineLabel(comp) {
  return PROCEDURES[comp.procedure].deadlineLabel;
}

export function PageHead({ eyebrow, title, children, actions }) {
  return (
    <div className="phead">
      <div>
        {eyebrow && <div className="label phead__eyebrow">{eyebrow}</div>}
        <h1 className="phead__title serif">{title}</h1>
        {children && <p className="phead__sub">{children}</p>}
      </div>
      {actions && <div className="phead__actions">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, action, className = '', hint }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <div className="panel__head">
          <div>
            <h2 className="panel__title">{title}</h2>
            {hint && <p className="panel__hint">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Fortschritt der Vorbereitung (0–100) aus dem gespeicherten Zustand. */
export function prepProgress(comp, prep, status) {
  const p = prep || { refs: [], checks: {}, team: [] };
  const proc = PROCEDURES[comp.procedure];
  const totalChecks = comp.requirements.length + proc.documents.length;
  const doneChecks = Object.values(p.checks || {}).filter(Boolean).length;
  const parts = [
    status === 'vorbereitung' || status === 'abgegeben' ? 1 : 0,
    p.refs?.length ? 1 : 0,
    totalChecks ? doneChecks / totalChecks : 0,
    p.team?.length ? 1 : 0,
  ];
  if (status === 'abgegeben') return 100;
  return Math.round((parts[0] * 0.2 + parts[1] * 0.2 + parts[2] * 0.45 + parts[3] * 0.15) * 100);
}
