// Detailansicht: Eignung → Chance → Matrix → Team-Entscheidung.
// Rechts: Eckdaten, Termine, ausgewertete Unterlagen, Aufschlüsselung des Fits.
import Icon from '../components/Icon.jsx';
import { FitRing } from '../components/ui.jsx';
import { Link } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { buildAnalysis, getDocuments } from '../lib/analysis.js';
import { dateIn } from '../lib/format.js';
import { CRITERIA } from '../data/criteria.js';
import { COMP_BY_ID, ChanceBlock, EligibilityBlock, MatrixBlock, VoteBlock, useD } from './checks.jsx';

export default function CompetitionDetail({ id }) {
  const d = useD();
  const { evaluations, statuses } = useDemo();
  const comp = COMP_BY_ID[id];
  if (!comp) {
    return (
      <div className="page">
        <Link to="/demo/wettbewerbe" className="back">
          <Icon name="arrowLeft" size={15} /> {d.detail.back}
        </Link>
        <p className="empty2">{d.detail.notFound}</p>
      </div>
    );
  }
  const ev = evaluations[comp.id];
  const r = ev.chance.range;
  const { milestones } = buildAnalysis(comp, ev);
  const docs = getDocuments(comp);
  const st = comp.eligibility?.status || 'ok';
  const date = (days) => dateIn(days).toLocaleDateString(d.locale, { day: '2-digit', month: 'short', year: 'numeric' });
  const facts = [
    [d.detail.client, comp.client],
    [d.detail.budget, comp.budget != null ? `${comp.budget.toLocaleString(d.locale)} Mio €` : '–'],
    [d.detail.prize, comp.prizeMoney ? d.eur(comp.prizeMoney) : '–'],
    [d.detail.participants, `~ ${comp.participants}`],
  ];

  return (
    <div className="page page--detail">
      <Link to="/demo/wettbewerbe" className="back">
        <Icon name="arrowLeft" size={15} /> {d.detail.back}
      </Link>

      <header className="dt">
        <div className="dt__main">
          <span className="mono dt__eyebrow">
            {d.procs[comp.procedure]} · {d.types[comp.type]} · {d.ago(comp.publishedDaysAgo)}
          </span>
          <h1>{comp.title}</h1>
          <p className="dt__meta">
            <Icon name="pin" size={15} /> {comp.city}
            <span>·</span>
            <Icon name="clock" size={15} /> {d.deadline[comp.procedure]} {date(comp.deadlineInDays)} ({d.rel(comp.deadlineInDays)})
            <span>·</span>
            <span className={`st st--${statuses[comp.id]}`}>{d.status[statuses[comp.id]]}</span>
          </p>
        </div>
        <div className="dt__score">
          <FitRing value={ev.fit} level={ev.level} size={64} stroke={5} />
          <span>{d.levels[ev.level]}</span>
        </div>
      </header>

      <div className="dt__summary">
        <span className="label">{d.detail.summary}</span>
        <p>
          {d.detail.summaryFn(st === 'fail' ? d.detail.sumFail : st === 'risk' ? d.detail.sumRisk : d.detail.sumOk, r.low, r.high, comp.effortHours)}
        </p>
      </div>

      <div className="dt__grid">
        <div className="dt__checks">
          <EligibilityBlock comp={comp} n={1} />
          <ChanceBlock comp={comp} ev={ev} n={2} />
          <MatrixBlock comp={comp} ev={ev} n={3} />
          <VoteBlock comp={comp} ev={ev} n={4} />
        </div>

        <aside className="dt__side">
          <section className="side2">
            <h3>{d.detail.facts}</h3>
            <dl>
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="side2__desc">{comp.summary}</p>
          </section>

          <section className="side2">
            <h3>{d.detail.dates}</h3>
            <ul className="ms2">
              {milestones.map((m) => (
                <li key={m.label} className={`${m.past ? 'is-past' : ''} ${m.main ? 'is-main' : ''}`}>
                  <span className="mono">{dateIn(m.days).toLocaleDateString(d.locale, { day: '2-digit', month: 'short' })}</span>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="side2">
            <h3>{d.detail.docs}</h3>
            <ul className="docs2">
              {docs.map((doc) => (
                <li key={doc.name}>
                  <Icon name="file" size={15} />
                  <span>{doc.name}</span>
                  <span className="mono">
                    {doc.format}
                    {doc.pages ? ` · ${d.detail.pages(doc.pages)}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="side2">
            <h3>{d.detail.fit}</h3>
            <div className="fitb">
              {CRITERIA.map((c) => (
                <div key={c.key} className="fitb__row">
                  <span>{d.criteria[c.key][0]}</span>
                  <span className="fitb__bar">
                    <span style={{ width: `${ev.criteria[c.key]}%` }} />
                  </span>
                  <span className="mono">{ev.criteria[c.key]}</span>
                  <span className="mono fitb__w">{Math.round(ev.weights[c.key] * 100)} %</span>
                </div>
              ))}
            </div>
            <Link to="/demo/profil" className="side2__link">
              {d.detail.fitHint} <Icon name="arrowRight" size={13} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
