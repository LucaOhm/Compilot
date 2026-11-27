// Liste aller Wettbewerbe – bewusst schlank: Suche + vier Filter.
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { FitRing } from '../components/ui.jsx';
import { Link } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { COMPETITIONS } from '../data/competitions.js';
import { dateIn } from '../lib/format.js';
import { useD } from './checks.jsx';

export default function Competitions({ query = {} }) {
  const d = useD();
  const { evaluations, statuses } = useDemo();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(query.filter || 'alle');

  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0);
  const match = (c) => {
    const s = statuses[c.id];
    if (filter === 'passend') return evaluations[c.id].fit >= 74 && !evaluations[c.id].knockout;
    if (filter === 'neu') return s === 'neu';
    if (filter === 'vorbereitung') return s === 'vorbereitung' || s === 'abgegeben';
    return true;
  };
  const needle = q.trim().toLowerCase();
  const list = open
    .filter(match)
    .filter((c) => !needle || `${c.title} ${c.city}`.toLowerCase().includes(needle))
    .sort((a, b) => evaluations[b.id].fit - evaluations[a.id].fit);

  return (
    <div className="page">
      <header className="dhero">
        <h1>{d.list.title}</h1>
        <p>{d.list.sub(open.length)}</p>
      </header>

      <div className="lbar">
        <label className="lbar__search">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={d.list.search} />
        </label>
        <div className="lbar__chips" role="tablist">
          {d.list.filters.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="ltable">
        <div className="ltable__head mono">
          {d.list.cols.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        {list.map((c) => {
          const ev = evaluations[c.id];
          const r = ev.chance.range;
          const s = statuses[c.id];
          return (
            <Link key={c.id} to={`/demo/wettbewerbe/${c.id}`} className={`lrow ${ev.knockout ? 'is-dim' : ''}`}>
              <span className="lrow__main">
                <strong>{c.title}</strong>
                <span>
                  {c.city} · {d.procs[c.procedure]} · {d.types[c.type]}
                </span>
              </span>
              <span className="lrow__dl">
                <strong>{dateIn(c.deadlineInDays).toLocaleDateString(d.locale, { day: '2-digit', month: 'short' })}</strong>
                <span className="mono">{d.rel(c.deadlineInDays)}</span>
              </span>
              <span className="lrow__chance mono">{ev.knockout ? '–' : d.pct(`${r.low}–${r.high}`)}</span>
              <span className="lrow__fit">
                <FitRing value={ev.fit} level={ev.level} size={38} stroke={3.5} animate={false} />
              </span>
              <span className={`lrow__status st st--${s}`}>{d.status[s]}</span>
            </Link>
          );
        })}
        {!list.length && <p className="empty2">{d.list.none}</p>}
      </div>
    </div>
  );
}
