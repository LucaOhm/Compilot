// Dashboard: neue Treffer, Pipeline, Jahresbilanz.
import Icon from '../components/Icon.jsx';
import { FitRing } from '../components/ui.jsx';
import { Link } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { COMPETITIONS } from '../data/competitions.js';
import { ME, useD } from './checks.jsx';

const firstName = ME.name.split(' ')[0];

function YearStats() {
  const d = useD();
  const { statuses, analyzed, evaluations } = useDemo();
  // Ausgangslage des Jahres (fiktiv) + Entscheidungen in der Demo
  const decided = COMPETITIONS.filter((c) => statuses[c.id] !== 'neu' || analyzed[c.id]);
  const checked = 26 + decided.length;
  const entries = COMPETITIONS.filter((c) => statuses[c.id] === 'vorbereitung' || statuses[c.id] === 'abgegeben');
  const pastEntries = 1; // bereits 2026 abgegeben (fiktiv)
  const probs = [0.09, ...entries.map((c) => {
    const r = evaluations[c.id].chance.range;
    return (r.low + r.high) / 200;
  })];
  // Chance auf mind. einen Preis = 1 − Π(1 − p) über alle Teilnahmen
  const odds = Math.round(probs.reduce((acc, p) => 1 - (1 - acc) * (1 - p), 0) * 100);
  const saved = checked * 7;
  const items = [
    [d.dash.yChecked, String(checked)],
    [d.dash.yEntries, String(entries.length + pastEntries)],
    [d.dash.yOdds, d.pct(odds)],
    [d.dash.ySaved, d.h(saved)],
  ];
  return (
    <section className="year2">
      <div className="year2__head">
        <span className="label">{d.dash.year}</span>
      </div>
      <div className="year2__grid">
        {items.map(([k, v], i) => (
          <div key={k} className={`year2__item ${i === 2 ? 'is-hot' : ''}`}>
            <strong>{v}</strong>
            <span>{k}</span>
          </div>
        ))}
      </div>
      <p className="year2__note mono">{d.dash.yNote}</p>
    </section>
  );
}

export default function Overview() {
  const d = useD();
  const { evaluations, statuses } = useDemo();
  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0);
  const hits = open
    .filter((c) => statuses[c.id] === 'neu' && evaluations[c.id].fit >= 60 && !evaluations[c.id].knockout)
    .sort((a, b) => a.publishedDaysAgo - b.publishedDaysAgo)
    .slice(0, 4);
  const byStatus = (s) =>
    open
      .filter((c) => (s === 'vorbereitung' ? ['vorbereitung', 'abgegeben'].includes(statuses[c.id]) : statuses[c.id] === s))
      .sort((a, b) => evaluations[b.id].fit - evaluations[a.id].fit);

  return (
    <div className="page">
      <header className="dhero">
        <h1>{d.dash.hello(new Date().getHours(), firstName)}</h1>
        <p>{d.dash.sub(hits.length)}</p>
      </header>

      <YearStats />

      <section className="block">
        <div className="block__head">
          <div>
            <h2>
              <Icon name="bell" size={18} /> {d.dash.hits}
            </h2>
            <p>{d.dash.hitsHint}</p>
          </div>
        </div>
        {hits.length ? (
          <div className="hits">
            {hits.map((c) => {
              const ev = evaluations[c.id];
              const r = ev.chance.range;
              return (
                <Link key={c.id} to={`/demo/wettbewerbe/${c.id}`} className="hit">
                  <FitRing value={ev.fit} level={ev.level} size={44} stroke={4} />
                  <div className="hit__main">
                    <strong>{c.title}</strong>
                    <span>
                      {c.city} · {d.procs[c.procedure]}
                    </span>
                  </div>
                  <div className="hit__meta mono">
                    <span>{d.ago(c.publishedDaysAgo)}</span>
                    <span>
                      {d.chance.title}: {d.pct(`${r.low}–${r.high}`)}
                    </span>
                  </div>
                  <span className="hit__cta">
                    {d.dash.check} <Icon name="arrowRight" size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="empty2">{d.dash.noHits}</p>
        )}
      </section>

      <section className="block">
        <div className="block__head">
          <div>
            <h2>{d.dash.pipeline}</h2>
            <p>{d.dash.pipeHint}</p>
          </div>
          <Link to="/demo/wettbewerbe" className="block__link">
            {d.dash.all} <Icon name="arrowRight" size={14} />
          </Link>
        </div>
        <div className="pipe">
          {d.dash.cols.map(([key, label]) => {
            const list = byStatus(key);
            return (
              <div key={key} className={`pipe__col pipe__col--${key}`}>
                <div className="pipe__head">
                  <span>{label}</span>
                  <span className="mono">{list.length}</span>
                </div>
                {list.slice(0, 4).map((c) => (
                  <Link key={c.id} to={`/demo/wettbewerbe/${c.id}`} className="pipe__card">
                    <strong>{c.title}</strong>
                    <span className="mono">
                      {c.city} · {d.rel(c.deadlineInDays)}
                    </span>
                    <span className="pipe__fit mono">Fit {evaluations[c.id].fit}</span>
                  </Link>
                ))}
                {list.length > 4 && <span className="pipe__more mono">{d.dash.more(list.length - 4)}</span>}
                {!list.length && <span className="pipe__empty">{d.dash.empty}</span>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
