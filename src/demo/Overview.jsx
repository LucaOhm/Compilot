// Demo · Überblick
import Icon from '../components/Icon.jsx';
import { Button, FitRing, LevelPill, Meter, Tag, StatusPill } from '../components/ui.jsx';
import { COMPETITIONS } from '../data/competitions.js';
import { CRITERIA } from '../data/criteria.js';
import { OFFICE, PROJECT_TYPES } from '../data/office.js';
import { PROCEDURES } from '../data/procedures.js';
import { formatDate, formatDateShort, greeting, relativeDays, deadlineTone } from '../lib/format.js';
import { Link, navigate } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { PageHead, Panel, prepProgress, deadlineLabel } from './common.jsx';

function Guide({ onClose, topId }) {
  const steps = [
    ['Case durchspielen', 'Ein Wettbewerb in fünf Schritten – vom Fund bis zur Entscheidung.', '/demo/case'],
    ['Unterlagen analysieren', 'Im Wettbewerb den Reiter „Unterlagen-Analyse“ öffnen.', `/demo/wettbewerbe/${topId}?tab=analyse`],
    ['Gewichtung verändern', 'Im Büroprofil Prioritäten anpassen und die Rangfolge beobachten.', '/demo/profil'],
  ];
  return (
    <div className="guide">
      <div className="guide__intro">
        <span className="guide__icon">
          <Icon name="route" size={18} />
        </span>
        <div>
          <div className="guide__title">Demo-Rundgang in drei Schritten</div>
          <div className="guide__sub">Ihr seht Compilot aus Sicht des fiktiven Büros {OFFICE.name}.</div>
        </div>
      </div>
      <ol className="guide__steps">
        {steps.map(([t, d, to], i) => (
          <li key={t}>
            <Link to={to} className="guide__step">
              <span className="guide__num mono">{i + 1}</span>
              <span>
                <strong>{t}</strong>
                <span>{d}</span>
              </span>
              <Icon name="arrowRight" size={15} />
            </Link>
          </li>
        ))}
      </ol>
      <button className="guide__close" onClick={onClose} aria-label="Rundgang ausblenden">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

export default function Overview() {
  const { evaluations, statuses, prep, guideDismissed, dismissGuide } = useDemo();
  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0 && !['verworfen', 'abgegeben'].includes(statuses[c.id]));
  const relevant = open.filter((c) => evaluations[c.id].fit >= 60);
  const fresh = open.filter((c) => c.publishedDaysAgo <= 7);
  const soon = relevant.filter((c) => c.deadlineInDays <= 14);
  const inPrep = COMPETITIONS.filter((c) => ['vorbereitung', 'abgegeben'].includes(statuses[c.id]));

  const top = [...open]
    .filter((c) => statuses[c.id] !== 'vorbereitung')
    .sort((a, b) => evaluations[b.id].fit - evaluations[a.id].fit)
    .slice(0, 3);

  // Kommende Termine aller relevanten Verfahren
  const upcoming = COMPETITIONS.filter(
    (c) => statuses[c.id] !== 'verworfen' && (evaluations[c.id].fit >= 60 || ['vorbereitung', 'gemerkt', 'abgegeben'].includes(statuses[c.id]))
  )
    .flatMap((c) =>
      PROCEDURES[c.procedure].milestones.map((m) => ({ comp: c, label: m.label, days: c.deadlineInDays + m.offset, main: m.main }))
    )
    .filter((m) => m.days >= 0 && m.days <= 60)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const w = evaluations[COMPETITIONS[0].id].weights;
  const topWeights = [...CRITERIA].sort((a, b) => w[b.key] - w[a.key]);
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  const stats = [
    ['Relevante Wettbewerbe', relevant.length, 'Fit-Score ≥ 60', '/demo/wettbewerbe?fit=60'],
    ['Neu in den letzten 7 Tagen', fresh.length, 'seit letzter Woche veröffentlicht', '/demo/wettbewerbe?sort=neu'],
    ['Fristen in 14 Tagen', soon.length, 'relevante Verfahren', '/demo/wettbewerbe?frist=14'],
    ['In Bearbeitung', inPrep.length, 'vorbereitet oder abgegeben', '/demo/wettbewerbe?status=aktiv'],
  ];

  return (
    <div className="page">
      <PageHead eyebrow={today} title={`${greeting()}, ${OFFICE.name}.`}>
        Diese Woche gibt es {fresh.length} neue Verfahren. {soon.length > 0 && `Bei ${soon.length} relevanten läuft die Frist in den nächsten zwei Wochen ab.`}
      </PageHead>

      {!guideDismissed && <Guide onClose={dismissGuide} topId={top[0]?.id} />}

      <div className="stats">
        {stats.map(([label, value, hint, to]) => (
          <Link key={label} to={to} className="stat">
            <span className="stat__label">{label}</span>
            <span className="stat__value num">{value}</span>
            <span className="stat__hint">{hint}</span>
          </Link>
        ))}
      </div>

      <div className="ov">
        <div className="ov__main">
          <Panel
            title="Empfehlungen für euch"
            hint="Die drei offenen Verfahren mit dem höchsten Fit-Score nach eurer aktuellen Gewichtung."
            action={
              <Button variant="ghost" size="sm" icon="arrowRight" onClick={() => navigate('/demo/wettbewerbe')}>
                Alle Wettbewerbe
              </Button>
            }
          >
            <div className="recs">
              {top.map((c, i) => {
                const ev = evaluations[c.id];
                return (
                  <Link key={c.id} to={`/demo/wettbewerbe/${c.id}`} className={`rec ${i === 0 ? 'rec--first' : ''}`}>
                    <div className="rec__head">
                      <FitRing value={ev.fit} level={ev.level} size={58} stroke={5} />
                      <div className="rec__titles">
                        <div className="rec__meta">
                          {PROJECT_TYPES[c.type]} · {PROCEDURES[c.procedure].label}
                        </div>
                        <h3 className="rec__title">{c.title}</h3>
                        <div className="rec__place">
                          <Icon name="pin" size={13} /> {c.city} · {c.client}
                        </div>
                      </div>
                      <LevelPill level={ev.level} />
                    </div>
                    <p className="rec__reason">{ev.reasons[0]}</p>
                    <div className="rec__foot">
                      <div className="rec__tags">
                        {ev.pros.slice(0, 3).map((p) => (
                          <Tag key={p} tone="accent">
                            {p}
                          </Tag>
                        ))}
                        {ev.cons.slice(0, 1).map((p) => (
                          <Tag key={p} tone="warn">
                            {p}
                          </Tag>
                        ))}
                      </div>
                      <span className={`rec__deadline deadline--${deadlineTone(c.deadlineInDays)}`}>
                        <Icon name="clock" size={13} /> {deadlineLabel(c)} {relativeDays(c.deadlineInDays)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Panel>

          <Panel
            title="In Bearbeitung"
            action={
              <Button variant="ghost" size="sm" icon="arrowRight" onClick={() => navigate('/demo/wettbewerbe?status=aktiv')}>
                Alle anzeigen
              </Button>
            }
          >
            <div className="work">
              {inPrep.map((c) => {
                const pr = prepProgress(c, prep[c.id], statuses[c.id]);
                const after = PROCEDURES[c.procedure].milestones.find((m) => c.deadlineInDays + m.offset >= 0);
                return (
                  <Link key={c.id} to={`/demo/wettbewerbe/${c.id}${statuses[c.id] === 'vorbereitung' ? '?tab=vorbereitung' : ''}`} className="work__row">
                    <div className="work__main">
                      <div className="work__title">{c.title}</div>
                      <div className="work__meta">
                        {c.city} ·{' '}
                        {after ? `${after.label}: ${formatDate(c.deadlineInDays + after.offset)}` : 'Verfahren abgeschlossen'}
                      </div>
                    </div>
                    <StatusPill status={statuses[c.id]} />
                    <div className="work__progress">
                      <Meter value={pr} thin tone={pr === 100 ? 'neutral' : 'accent'} />
                      <span className="num">{pr} %</span>
                    </div>
                  </Link>
                );
              })}
              {inPrep.length === 0 && <p className="muted">Noch keine Bewerbung in Vorbereitung.</p>}
            </div>
          </Panel>
        </div>

        <div className="ov__side">
          <Panel title="Nächste Termine" hint="Relevante, gemerkte und laufende Verfahren">
            <ol className="timeline">
              {upcoming.map((m) => (
                <li key={m.comp.id + m.label} className={`timeline__item timeline__item--${deadlineTone(m.days)}`}>
                  <span className="timeline__date">
                    <span className="num">{formatDateShort(m.days)}</span>
                    <span>{relativeDays(m.days)}</span>
                  </span>
                  <Link to={`/demo/wettbewerbe/${m.comp.id}`} className="timeline__body">
                    <span className="timeline__label">{m.label}</span>
                    <span className="timeline__comp">{m.comp.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Warum diese Empfehlungen?" className="why">
            <p className="why__text">
              Compilot bewertet jedes Verfahren nach sechs Kriterien – gewichtet nach euren Prioritäten. Aktuell zählen für euch
              am meisten:
            </p>
            <div className="why__bars">
              {topWeights.map((c) => (
                <div key={c.key} className="why__bar">
                  <span>{c.label}</span>
                  <span className="why__track">
                    <span style={{ width: `${(w[c.key] / Math.max(...Object.values(w))) * 100}%` }} />
                  </span>
                  <span className="num">{Math.round(w[c.key] * 100)} %</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" iconLeft="sliders" onClick={() => navigate('/demo/profil')}>
              Gewichtung anpassen
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
