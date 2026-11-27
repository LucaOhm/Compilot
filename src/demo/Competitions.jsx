// Demo · Wettbewerbsübersicht mit Filtern und Sortierung
import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { DemoMark, FitRing, LevelPill, Meter, StatusPill } from '../components/ui.jsx';
import { COMPETITIONS, STATUSES } from '../data/competitions.js';
import { PROJECT_TYPES, REGIONS } from '../data/office.js';
import { PROCEDURES } from '../data/procedures.js';
import { formatDate, relativeDays, deadlineTone } from '../lib/format.js';
import { navigate } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { PageHead, effortLevel, deadlineLabel } from './common.jsx';

const DEFAULTS = { q: '', type: 'alle', region: 'alle', frist: 'alle', fit: '0', status: 'alle', sort: 'fit' };

const SORTS = {
  fit: ['Fit-Score', (a, b, ev) => ev[b.id].fit - ev[a.id].fit],
  frist: ['Frist', (a, b) => (a.deadlineInDays < 0) - (b.deadlineInDays < 0) || a.deadlineInDays - b.deadlineInDays],
  neu: ['Neueste', (a, b) => a.publishedDaysAgo - b.publishedDaysAgo],
  aufwand: ['Geringster Aufwand', (a, b) => a.effortHours - b.effortHours],
  chance: ['Chancen-Index', (a, b, ev) => ev[b.id].chance.index - ev[a.id].chance.index],
};

function Select({ label, value, onChange, options }) {
  return (
    <label className="fsel">
      <span className="fsel__label">{label}</span>
      <select className="select select--sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Competitions({ query = {} }) {
  const { evaluations, statuses } = useDemo();
  const [f, setF] = useState({ ...DEFAULTS, ...query });
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const active = Object.keys(DEFAULTS).some((k) => k !== 'sort' && f[k] !== DEFAULTS[k]);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return COMPETITIONS.filter((c) => {
      const ev = evaluations[c.id];
      const st = statuses[c.id];
      if (q && !`${c.title} ${c.city} ${c.client} ${PROJECT_TYPES[c.type]}`.toLowerCase().includes(q)) return false;
      if (f.type !== 'alle' && c.type !== f.type) return false;
      if (f.region !== 'alle' && c.region !== f.region) return false;
      if (f.frist !== 'alle' && (c.deadlineInDays < 0 || c.deadlineInDays > Number(f.frist))) return false;
      if (ev.fit < Number(f.fit)) return false;
      if (f.status === 'aktiv' && !['vorbereitung', 'abgegeben'].includes(st)) return false;
      if (f.status !== 'alle' && f.status !== 'aktiv' && st !== f.status) return false;
      return true;
    }).sort((a, b) => SORTS[f.sort][1](a, b, evaluations));
  }, [f, evaluations, statuses]);

  return (
    <div className="page">
      <PageHead
        eyebrow="Wettbewerbe & Vergaben"
        title="Wettbewerbe"
        actions={<DemoMark>20 fiktive Verfahren</DemoMark>}
      >
        Alle Verfahren, bewertet nach eurem Büroprofil. Klickt auf einen Wettbewerb, um Bewertung, Unterlagen und Vorbereitung zu sehen.
      </PageHead>

      <div className="filters">
        <label className="search">
          <Icon name="search" size={17} />
          <input
            className="search__input"
            placeholder="Suche nach Titel, Ort, Auslober …"
            value={f.q}
            onChange={(e) => set('q')(e.target.value)}
          />
        </label>
        <div className="filters__row">
          <Select label="Projekttyp" value={f.type} onChange={set('type')} options={[['alle', 'Alle Typen'], ...Object.entries(PROJECT_TYPES)]} />
          <Select label="Region" value={f.region} onChange={set('region')} options={[['alle', 'Alle Regionen'], ...Object.entries(REGIONS)]} />
          <Select
            label="Frist"
            value={f.frist}
            onChange={set('frist')}
            options={[['alle', 'Alle Fristen'], ['14', 'In 14 Tagen'], ['30', 'In 30 Tagen'], ['60', 'In 60 Tagen']]}
          />
          <Select
            label="Fit-Score"
            value={f.fit}
            onChange={set('fit')}
            options={[['0', 'Alle'], ['60', 'Ab 60 · interessant'], ['74', 'Ab 74 · sehr interessant']]}
          />
          <Select
            label="Status"
            value={f.status}
            onChange={set('status')}
            options={[['alle', 'Alle'], ['aktiv', 'In Bearbeitung'], ...Object.entries(STATUSES).map(([k, s]) => [k, s.label])]}
          />
          <Select label="Sortierung" value={f.sort} onChange={set('sort')} options={Object.entries(SORTS).map(([k, [l]]) => [k, l])} />
        </div>
      </div>

      <div className="results">
        <span>
          <strong className="num">{list.length}</strong> von {COMPETITIONS.length} Verfahren
        </span>
        {active && (
          <button className="results__reset" onClick={() => setF({ ...DEFAULTS, sort: f.sort })}>
            <Icon name="x" size={14} /> Filter zurücksetzen
          </button>
        )}
      </div>

      <div className="ctable" role="table" aria-label="Wettbewerbe">
        <div className="ctable__head" role="row">
          <span>Fit</span>
          <span>Wettbewerb</span>
          <span>Verfahren</span>
          <span>Frist</span>
          <span>Aufwand</span>
          <span title="Illustrativer Chancen-Index – keine statistische Prognose">Chance*</span>
          <span>Empfehlung</span>
          <span>Status</span>
        </div>
        {list.map((c) => {
          const ev = evaluations[c.id];
          const eff = effortLevel(c.effortHours);
          const st = statuses[c.id];
          return (
            <div
              key={c.id}
              role="row"
              tabIndex={0}
              className={`crow ${st === 'verworfen' ? 'crow--dim' : ''}`}
              onClick={() => navigate(`/demo/wettbewerbe/${c.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/demo/wettbewerbe/${c.id}`)}
            >
              <span className="crow__fit">
                <FitRing value={ev.fit} level={ev.level} size={44} stroke={4} />
              </span>
              <span className="crow__main">
                <span className="crow__title">
                  {c.title}
                  {c.publishedDaysAgo <= 7 && c.deadlineInDays >= 0 && <span className="crow__new">Neu</span>}
                </span>
                <span className="crow__meta">
                  {c.city} · {c.client}
                </span>
                <span className="crow__type">{PROJECT_TYPES[c.type]}</span>
              </span>
              <span className="crow__proc">
                <span>{PROCEDURES[c.procedure].label}</span>
                <span className="muted">{c.budget ? `${c.budget.toLocaleString('de-DE')} Mio € BK` : 'Rahmenplanung'}</span>
              </span>
              <span className={`crow__deadline deadline--${deadlineTone(c.deadlineInDays)}`}>
                <span className="crow__dl">{deadlineLabel(c)}</span>
                <strong className="num">{formatDate(c.deadlineInDays)}</strong>
                <span className="crow__rel">{relativeDays(c.deadlineInDays)}</span>
              </span>
              <span className="crow__effort">
                <span className={`dot dot--${eff.tone}`} />
                <span>
                  {eff.label}
                  <span className="muted num"> · {c.effortHours} h</span>
                </span>
              </span>
              <span className="crow__chance">
                <span className="crow__chancelabel">{ev.chance.label}</span>
                <Meter value={ev.chance.index} thin tone="neutral" />
              </span>
              <span className="crow__level">
                <LevelPill level={ev.level} small />
              </span>
              <span className="crow__status">
                <StatusPill status={st} />
              </span>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="empty">
            <Icon name="search" size={22} />
            <p>Keine Verfahren für diese Filter.</p>
            <button className="results__reset" onClick={() => setF({ ...DEFAULTS })}>
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
      <p className="footnote">
        * Der Chancen-Index ist eine illustrative Einschätzung des Demo-Produkts aus Erfahrung, Referenzfit, Anforderungen,
        geschätzter Konkurrenz und Kapazität. Er ist keine statistische Prognose und keine tatsächliche Erfolgsquote.
      </p>
    </div>
  );
}
