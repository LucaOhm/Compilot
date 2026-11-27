// Demo · Wettbewerbsdetail: Bewertung, Unterlagen-Analyse, Vorbereitung
import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Avatar, Button, DeadlineChip, DemoMark, FitRing, LevelPill, Meter, StatusPill, Tag } from '../components/ui.jsx';
import { STATUSES } from '../data/competitions.js';
import { CRITERIA } from '../data/criteria.js';
import { OFFICE, PROJECT_TYPES, REGIONS } from '../data/office.js';
import { PROCEDURES } from '../data/procedures.js';
import { LEVELS } from '../lib/scoring.js';
import { buildAnalysis, getDocuments } from '../lib/analysis.js';
import { euro, formatDate, mio, num, relativeDays, deadlineTone } from '../lib/format.js';
import { Link, navigate } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { COMP_BY_ID, Panel, deadlineLabel, prepProgress } from './common.jsx';

const TABS = [
  ['bewertung', 'Bewertung', 'sliders'],
  ['analyse', 'Unterlagen-Analyse', 'scan'],
  ['vorbereitung', 'Vorbereitung', 'flag'],
];

export default function CompetitionDetail({ id, query = {} }) {
  const comp = COMP_BY_ID[id];
  const { evaluations, statuses, setStatus } = useDemo();
  const [tab, setTab] = useState(TABS.some(([k]) => k === query.tab) ? query.tab : 'bewertung');

  useEffect(() => {
    if (query.tab && TABS.some(([k]) => k === query.tab)) setTab(query.tab);
  }, [query.tab]);

  if (!comp) {
    return (
      <div className="page">
        <div className="empty">
          <p>Dieser Wettbewerb existiert nicht.</p>
          <Button variant="secondary" onClick={() => navigate('/demo/wettbewerbe')}>
            Zur Übersicht
          </Button>
        </div>
      </div>
    );
  }

  const ev = evaluations[comp.id];
  const proc = PROCEDURES[comp.procedure];
  const status = statuses[comp.id];
  const analysis = buildAnalysis(comp, ev);

  const facts = [
    [deadlineLabel(comp), formatDate(comp.deadlineInDays), relativeDays(comp.deadlineInDays), deadlineTone(comp.deadlineInDays)],
    ['Verfahren', proc.label, proc.rules],
    ['Baukosten', comp.budget ? mio(comp.budget) : 'n. a.', comp.gfa ? `BGF ca. ${num(comp.gfa)} m²` : 'Rahmenplanung'],
    [comp.fee ? 'Bearbeitungshonorar' : 'Preisgeld gesamt', comp.fee ? euro(comp.fee) : comp.prizeMoney ? euro(comp.prizeMoney) : '–', comp.fee ? 'je teilnehmendem Büro' : 'für alle Preisträger'],
    ['Teilnehmende', `ca. ${comp.participants}`, 'geschätzt'],
    ['Aufwand', `ca. ${num(comp.effortHours)} Std.`, 'geschätzt, gesamtes Verfahren'],
  ];

  return (
    <div className="page detail">
      <Link to="/demo/wettbewerbe" className="back">
        <Icon name="arrowLeft" size={15} /> Alle Wettbewerbe
      </Link>

      <header className="dhead">
        <div className="dhead__main">
          <div className="dhead__eyebrow">
            <span className="label">
              {PROJECT_TYPES[comp.type]} · {REGIONS[comp.region]}
            </span>
            <DemoMark>Fiktiver Wettbewerb</DemoMark>
          </div>
          <h1 className="dhead__title serif">{comp.title}</h1>
          <div className="dhead__meta">
            <span>
              <Icon name="pin" size={15} /> {comp.city}
            </span>
            <span>
              <Icon name="building" size={15} /> {comp.client}
            </span>
            <StatusPill status={status} />
          </div>
        </div>
        <div className="dhead__score">
          <FitRing value={ev.fit} level={ev.level} size={96} stroke={7} />
          <div>
            <div className="label">Fit-Score</div>
            <LevelPill level={ev.level} />
            <div className="dhead__action">{LEVELS[ev.level].action}</div>
          </div>
        </div>
      </header>

      <div className="facts">
        {facts.map(([k, v, h, tone]) => (
          <div key={k} className={`fact ${tone ? `fact--${tone}` : ''}`}>
            <span className="fact__k">{k}</span>
            <span className="fact__v num">{v}</span>
            <span className="fact__h">{h}</span>
          </div>
        ))}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map(([k, l, icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>
            <Icon name={icon} size={16} />
            {l}
          </button>
        ))}
        <div className="tabs__actions">
          {status !== 'vorbereitung' && status !== 'abgegeben' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                iconLeft="bookmark"
                onClick={() => setStatus(comp.id, status === 'gemerkt' ? 'neu' : 'gemerkt')}
              >
                {status === 'gemerkt' ? 'Gemerkt' : 'Merken'}
              </Button>
              <Button
                size="sm"
                icon="arrowRight"
                disabled={comp.deadlineInDays < 0}
                onClick={() => {
                  setStatus(comp.id, 'vorbereitung');
                  setTab('vorbereitung');
                }}
              >
                Teilnahme vorbereiten
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="tabpanel" key={tab}>
        {tab === 'bewertung' && <Evaluation comp={comp} ev={ev} />}
        {tab === 'analyse' && <Analysis comp={comp} ev={ev} analysis={analysis} />}
        {tab === 'vorbereitung' && <Preparation comp={comp} ev={ev} analysis={analysis} />}
      </div>
    </div>
  );
}

// ── Reiter: Bewertung ────────────────────────────────────────
function Evaluation({ comp, ev }) {
  return (
    <div className="dgrid">
      <div className="dgrid__main">
        <Panel className={`verdict verdict--${LEVELS[ev.level].tone}`}>
          <div className="verdict__head">
            <span className="verdict__icon">
              <Icon name={ev.level === 'hoch' ? 'check' : ev.level === 'mittel' ? 'info' : 'x'} size={20} stroke={2} />
            </span>
            <div>
              <div className="label">Empfehlung von Compilot</div>
              <h2 className="verdict__title serif">
                {LEVELS[ev.level].label}: {LEVELS[ev.level].action}
              </h2>
            </div>
          </div>
          <ul className="verdict__reasons">
            {ev.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="verdict__pc">
            <div>
              <div className="label">Spricht dafür</div>
              <div className="verdict__tags">
                {ev.pros.length ? ev.pros.map((p) => <Tag key={p} tone="accent" icon="check">{p}</Tag>) : <span className="muted">–</span>}
              </div>
            </div>
            <div>
              <div className="label">Zu bedenken</div>
              <div className="verdict__tags">
                {ev.cons.length ? ev.cons.map((p) => <Tag key={p} tone="warn" icon="alert">{p}</Tag>) : <span className="muted">Keine wesentlichen Einwände</span>}
              </div>
            </div>
          </div>
        </Panel>

        {comp.strategy && (
          <Panel title="Gewinnstrategie" hint="Aus Bewertungskriterien und Besetzung des Preisgerichts" className="strategy">
            <p className="dtext">{comp.strategy.jury}</p>
            <div className="scrit">
              {comp.strategy.criteria.map(([l, w], i) => (
                <div key={l}>
                  <span>{l}</span>
                  <Meter value={w * 3} thin tone={i === 0 ? 'accent' : 'neutral'} />
                  <span className="mono">{w} %</span>
                </div>
              ))}
            </div>
            {comp.strategy.levers.map(([h, d], i) => (
              <div key={h} className="slever">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{h}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </Panel>
        )}

        <Panel
          title="So setzt sich der Fit-Score zusammen"
          hint="Kriterienwert (0–100) × eure Gewichtung = Beitrag zum Fit-Score."
          action={
            <Button variant="ghost" size="sm" iconLeft="sliders" onClick={() => navigate('/demo/profil')}>
              Gewichtung ändern
            </Button>
          }
        >
          <div className="breakdown">
            {CRITERIA.map((c) => {
              const v = ev.criteria[c.key];
              const w = ev.weights[c.key];
              return (
                <div key={c.key} className="breakdown__row">
                  <div className="breakdown__label">
                    <strong>{c.label}</strong>
                    <span>{c.description}</span>
                  </div>
                  <div className="breakdown__bar">
                    <Meter value={v} />
                    <span className="num">{v}</span>
                  </div>
                  <div className="breakdown__w num">× {Math.round(w * 100)} %</div>
                  <div className="breakdown__pts num">{(v * w).toFixed(1).replace('.', ',')}</div>
                </div>
              );
            })}
            <div className="breakdown__total">
              <span>Fit-Score</span>
              <span className="num">
                {ev.knockout ? (
                  <>
                    {ev.fit} <small>(gedeckelt – Ausschlusskriterium)</small>
                  </>
                ) : (
                  ev.fit
                )}
              </span>
            </div>
          </div>
        </Panel>

        <Panel title="Projekt">
          <p className="dtext">{comp.description}</p>
          <dl className="scope">
            {comp.scope.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="dgrid__side">
        <Panel title="Chancen-Einschätzung" className="chance" action={<DemoMark>Illustrativ</DemoMark>}>
          <div className="chance__top">
            <span className="chance__idx num">{ev.chance.index}</span>
            <div>
              <div className="chance__label">Chancen-Index: {ev.chance.label}</div>
              <div className="muted chance__sub">von 100 · relative Einschätzung</div>
            </div>
          </div>
          <div className="chance__factors">
            {ev.chance.factors.map((f) => (
              <div key={f.key} className="chance__f">
                <div className="chance__fl">
                  <span>{f.label}</span>
                  <span className="num muted">{f.value}</span>
                </div>
                <Meter value={f.value} thin />
                {f.hint && <span className="chance__hint">{f.hint}</span>}
              </div>
            ))}
          </div>
          <p className="chance__note">
            Keine statistische Prognose. Der Index verdichtet die oben genannten Faktoren, um Verfahren untereinander vergleichbar zu
            machen – er sagt nichts über eine tatsächliche Gewinnwahrscheinlichkeit aus.
          </p>
        </Panel>

        <Panel title="Aufwand & Wirtschaftlichkeit">
          <dl className="kv">
            <div>
              <dt>Geschätzter Aufwand</dt>
              <dd className="num">ca. {num(comp.effortHours)} Std.</dd>
            </div>
            <div>
              <dt>Freie Kapazität bis Abgabe</dt>
              <dd className="num">
                ca. {num(ev.capacity.availableHours)} Std. ({ev.capacity.weeks} Wo.)
              </dd>
            </div>
            <div>
              <dt>Auslastung durch dieses Verfahren</dt>
              <dd className={`num ${ev.capacity.share > 80 ? 'is-risk' : ''}`}>{ev.capacity.share} %</dd>
            </div>
            <div>
              <dt>Preisgeld / Honorar</dt>
              <dd className="num">{comp.fee ? `${euro(comp.fee)} Honorar` : comp.prizeMoney ? `${euro(comp.prizeMoney)} gesamt` : 'keine'}</dd>
            </div>
            <div>
              <dt>Folgeauftrag</dt>
              <dd>{comp.followUpText}</dd>
            </div>
          </dl>
          <p className="kv__note">
            Kapazität: {OFFICE.capacity.hoursPerWeek} Std./Woche für Wettbewerbe, abzüglich {OFFICE.capacity.perActiveCompetition} Std. je laufender
            Bearbeitung ({ev.capacity.active} aktuell).
          </p>
        </Panel>

        <Panel title="Passende Referenzen">
          <div className="refmatch">
            {ev.references.slice(0, 3).map(({ ref, match }) => (
              <div key={ref.id} className="refmatch__row">
                <div>
                  <div className="refmatch__title">{ref.title}</div>
                  <div className="muted refmatch__meta">
                    {ref.city} · {ref.year}
                  </div>
                </div>
                <span className={`refmatch__pct num ${match >= 60 ? 'is-good' : ''}`}>{match} %</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ── Reiter: Unterlagen-Analyse (simuliert) ───────────────────
const ANALYSIS_STEPS = ['Unterlagen werden gelesen', 'Anforderungen und Fristen extrahieren', 'Abgleich mit eurem Büroprofil', 'Risiken bewerten'];

function Analysis({ comp, ev, analysis }) {
  const { analyzed, markAnalyzed } = useDemo();
  const done = !!analyzed[comp.id];
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const docs = getDocuments(comp);

  useEffect(() => {
    if (!running) return;
    if (step >= ANALYSIS_STEPS.length) {
      markAnalyzed(comp.id);
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [running, step, comp.id, markAnalyzed]);

  const start = () => {
    setStep(0);
    setRunning(true);
  };

  if (!done) {
    return (
      <div className="dgrid">
        <div className="dgrid__main">
          <Panel title="Wettbewerbsunterlagen" hint="Vom Auslober veröffentlichte Dokumente (Beispiel)">
            <div className="docs">
              {docs.map((d) => (
                <div key={d.name} className="doc">
                  <span className="doc__icon">{d.format}</span>
                  <div className="doc__main">
                    <div className="doc__name">{d.name}</div>
                    <div className="muted doc__meta">
                      {d.pages ? `${d.pages} Seiten · ` : ''}
                      {d.size}
                    </div>
                  </div>
                  <Icon name="check" size={16} className="doc__ok" />
                </div>
              ))}
            </div>
            {running ? (
              <div className="scan">
                {ANALYSIS_STEPS.map((s, i) => (
                  <div key={s} className={`scan__step ${i < step ? 'is-done' : i === step ? 'is-on' : ''}`}>
                    <span className="scan__dot">{i < step ? <Icon name="check" size={12} stroke={2.4} /> : null}</span>
                    {s}
                  </div>
                ))}
              </div>
            ) : (
              <div className="analyze">
                <Button size="lg" iconLeft="scan" onClick={start}>
                  Unterlagen analysieren
                </Button>
                <p className="muted">Simulation: Das Ergebnis basiert auf vordefinierten Beispieldaten.</p>
              </div>
            )}
          </Panel>
        </div>
        <div className="dgrid__side">
          <Panel title="Eigene Unterlagen">
            <button className="drop" onClick={() => inputRef.current?.click()}>
              <Icon name="upload" size={22} />
              <strong>Datei auswählen</strong>
              <span>PDF, DOCX, XLSX</span>
            </button>
            <input ref={inputRef} type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name || null)} />
            {file && (
              <p className="drop__note">
                <Icon name="info" size={14} /> „{file}“ ausgewählt. In dieser Demo werden Dateien weder hochgeladen noch
                verarbeitet – die Analyse zeigt vordefinierte Beispielergebnisse.
              </p>
            )}
            {!file && <p className="drop__note muted">In der Demo werden hochgeladene Dateien nicht verarbeitet.</p>}
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis">
      <div className="analysis__banner">
        <Icon name="info" size={15} />
        <span>
          <strong>Simulierte Analyse.</strong> Im Produkt würden die Unterlagen automatisch ausgewertet. Hier sind die Ergebnisse
          vordefinierte Beispieldaten; Seitenangaben sind illustrativ.
        </span>
      </div>

      <div className={`action action--${LEVELS[ev.level].tone}`}>
        <div className="label">Handlungsempfehlung</div>
        <p>{analysis.recommendation}</p>
      </div>

      <div className="dgrid">
        <div className="dgrid__main">
          <div className="asections">
            {analysis.sections.map((s) => (
              <Panel key={s.key} title={s.title} className={`asec asec--${s.key}`}>
                <ul className="asec__list">
                  {s.items.map((it) => (
                    <li key={it.text}>
                      <span className={`asec__mark ${it.met ? `is-${it.met}` : ''}`}>
                        {it.met === 'ja' && <Icon name="check" size={12} stroke={2.4} />}
                        {it.met === 'teilweise' && <Icon name="minus" size={12} stroke={2.4} />}
                        {it.met === 'nein' && <Icon name="x" size={12} stroke={2.4} />}
                      </span>
                      <div>
                        <span>{it.text}</span>
                        {it.met && <span className={`asec__met is-${it.met}`}>{it.met === 'ja' ? 'erfüllt' : it.met === 'teilweise' ? 'teilweise erfüllt' : 'nicht erfüllt'}</span>}
                        <span className="asec__src">{it.source}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </div>
        <div className="dgrid__side">
          <Panel title="Fristen & Termine">
            <ol className="mstones">
              {analysis.milestones.map((m) => (
                <li key={m.label} className={`mstone ${m.past ? 'is-past' : ''} ${m.main ? 'is-main' : ''}`}>
                  <span className="mstone__dot" />
                  <div>
                    <div className="mstone__label">{m.label}</div>
                    <div className="mstone__date num">
                      {m.date} · {relativeDays(m.days)}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel title="Eignung">
            <div className={`elig elig--${comp.eligibility.status}`}>
              <Icon name={comp.eligibility.status === 'ok' ? 'shield' : 'alert'} size={18} />
              <div>
                <strong>
                  {comp.eligibility.status === 'ok' ? 'Voraussetzungen erfüllt' : comp.eligibility.status === 'risk' ? 'Eignung mit Einschränkungen' : 'Voraussetzung nicht erfüllt'}
                </strong>
                <p>{comp.eligibility.note}</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ── Reiter: Vorbereitung ─────────────────────────────────────
function Check({ checked, onChange, children, sub }) {
  return (
    <label className={`chk ${checked ? 'is-on' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="chk__box">{checked && <Icon name="check" size={12} stroke={2.6} />}</span>
      <span className="chk__text">
        {children}
        {sub && <span className="chk__sub">{sub}</span>}
      </span>
    </label>
  );
}

function Step({ n, title, done, children, hint }) {
  return (
    <div className={`pstep ${done ? 'is-done' : ''}`}>
      <div className="pstep__rail">
        <span className="pstep__num">{done ? <Icon name="check" size={14} stroke={2.4} /> : n}</span>
      </div>
      <div className="pstep__body">
        <h3 className="pstep__title">{title}</h3>
        {hint && <p className="pstep__hint">{hint}</p>}
        <div className="pstep__content">{children}</div>
      </div>
    </div>
  );
}

function Preparation({ comp, ev, analysis }) {
  const { statuses, setStatus, prep, updatePrep } = useDemo();
  const status = statuses[comp.id];
  const p = prep[comp.id] || { refs: [], checks: {}, team: [] };
  const proc = PROCEDURES[comp.procedure];
  const progress = prepProgress(comp, p, status);
  const decided = status === 'vorbereitung' || status === 'abgegeben';

  const toggle = (field, key) =>
    updatePrep(comp.id, (cur) => {
      const list = cur[field] || [];
      return { ...cur, [field]: list.includes(key) ? list.filter((x) => x !== key) : [...list, key] };
    });
  const check = (key, v) => updatePrep(comp.id, (cur) => ({ ...cur, checks: { ...cur.checks, [key]: v } }));

  // Interner Zeitplan: rückwärts von der Abgabe der Arbeit geplant
  const workDeadline = comp.deadlineInDays + proc.workDays;
  const internal = [
    { label: 'Entscheidung im Team', days: Math.min(comp.deadlineInDays - 3, 3) },
    ...analysis.milestones.filter((m) => !m.past).map((m) => ({ label: m.label, days: m.days, ext: true, main: m.main })),
    { label: 'Interner Review der Arbeit', days: workDeadline - 7 },
    { label: 'Plot, Modell & Versand', days: workDeadline - 2 },
  ]
    .filter((m) => m.days >= 0)
    .sort((a, b) => a.days - b.days);

  const reqChecks = comp.requirements.map((t, i) => ['req-' + i, t]);
  const docChecks = proc.documents.map((t, i) => ['doc-' + i, t]);

  return (
    <div className="dgrid">
      <div className="dgrid__main">
        <Panel className="prep">
          <div className="prep__head">
            <div>
              <div className="label">Fortschritt der Vorbereitung</div>
              <div className="prep__pct num">{progress} %</div>
            </div>
            <DeadlineChip days={comp.deadlineInDays} label={deadlineLabel(comp)} />
          </div>
          <Meter value={progress} />

          <div className="psteps">
            <Step n={1} title="Teilnahmeentscheidung" done={decided || status === 'verworfen'} hint={`Compilot-Empfehlung: ${LEVELS[ev.level].label} (${ev.fit})`}>
              <div className="decide">
                {[
                  ['vorbereitung', 'Teilnehmen', 'check'],
                  ['gemerkt', 'Beobachten', 'bookmark'],
                  ['verworfen', 'Nicht teilnehmen', 'x'],
                ].map(([k, l, icon]) => (
                  <button
                    key={k}
                    className={`decide__btn ${status === k || (k === 'vorbereitung' && status === 'abgegeben') ? 'is-on' : ''} decide__btn--${k}`}
                    onClick={() => setStatus(comp.id, k)}
                    disabled={status === 'abgegeben'}
                  >
                    <Icon name={icon} size={15} /> {l}
                  </button>
                ))}
              </div>
              {status === 'abgegeben' && <p className="pstep__hint">Die Arbeit wurde bereits abgegeben.</p>}
            </Step>

            <Step n={2} title="Referenzen auswählen" done={p.refs.length > 0} hint="Nach Übereinstimmung mit dem Wettbewerb sortiert.">
              <div className="refs">
                {ev.references.slice(0, 5).map(({ ref, match }, i) => (
                  <Check key={ref.id} checked={p.refs.includes(ref.id)} onChange={() => toggle('refs', ref.id)} sub={`${ref.city} · ${ref.year} · ${ref.facts}`}>
                    <span className="refs__title">
                      {ref.title}
                      {i < 2 && match >= 50 && <span className="refs__rec">Empfohlen</span>}
                      <span className="refs__match num">{match} %</span>
                    </span>
                  </Check>
                ))}
              </div>
            </Step>

            <Step n={3} title="Anforderungen prüfen" done={reqChecks.every(([k]) => p.checks[k])}>
              {comp.refRequirements.length > 0 && (
                <div className="reqmet">
                  {comp.refRequirements.map((r) => (
                    <div key={r.text} className={`reqmet__row is-${r.met}`}>
                      <Icon name={r.met === 'ja' ? 'check' : r.met === 'teilweise' ? 'minus' : 'x'} size={14} stroke={2.2} />
                      {r.text}
                    </div>
                  ))}
                </div>
              )}
              {reqChecks.map(([k, t]) => (
                <Check key={k} checked={!!p.checks[k]} onChange={(v) => check(k, v)}>
                  {t}
                </Check>
              ))}
            </Step>

            <Step n={4} title="Unterlagen vorbereiten" done={docChecks.every(([k]) => p.checks[k])}>
              {docChecks.map(([k, t]) => (
                <Check key={k} checked={!!p.checks[k]} onChange={(v) => check(k, v)}>
                  {t}
                </Check>
              ))}
            </Step>

            <Step n={5} title="Team abstimmen" done={p.team.length > 0} hint="Wer bearbeitet den Wettbewerb?">
              <div className="team">
                {OFFICE.team.map((m) => (
                  <button key={m.id} className={`member ${p.team.includes(m.id) ? 'is-on' : ''}`} onClick={() => toggle('team', m.id)}>
                    <Avatar name={m.name} size={30} />
                    <span>
                      <strong>{m.name}</strong>
                      <span>{m.role}</span>
                    </span>
                    {p.team.includes(m.id) && <Icon name="check" size={14} stroke={2.4} className="member__ok" />}
                  </button>
                ))}
              </div>
            </Step>
          </div>
        </Panel>
      </div>

      <div className="dgrid__side">
        <Panel title="Zeitplan" hint="Termine des Verfahrens und interne Meilensteine">
          <ol className="mstones">
            {internal.map((m) => (
              <li key={m.label} className={`mstone ${m.main ? 'is-main' : ''} ${m.ext ? '' : 'is-internal'}`}>
                <span className="mstone__dot" />
                <div>
                  <div className="mstone__label">
                    {m.label}
                    {!m.ext && <span className="mstone__tag">intern</span>}
                  </div>
                  <div className="mstone__date num">
                    {formatDate(m.days)} · {relativeDays(m.days)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Status">
          <div className="statuslist">
            {Object.entries(STATUSES).map(([k, s]) => (
              <button key={k} className={`statuslist__item ${status === k ? 'is-on' : ''}`} onClick={() => setStatus(comp.id, k)}>
                <StatusPill status={k} />
                {status === k && <Icon name="check" size={14} />}
                <span className="sr-only">{s.label}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
