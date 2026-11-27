// Demo · Büroprofil mit individuellen Gewichtungen und Onboarding-Vorschau
import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Avatar, Button, DemoMark, FitRing, Meter, Tag } from '../components/ui.jsx';
import { COMPETITIONS } from '../data/competitions.js';
import { CRITERIA, DEFAULT_WEIGHTS, WEIGHT_PRESETS } from '../data/criteria.js';
import { OFFICE, PROJECT_TYPES, REGIONS } from '../data/office.js';
import { PROCEDURES } from '../data/procedures.js';
import { evaluateAll, freeCapacity, normalizeWeights } from '../lib/scoring.js';
import { Link } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { PageHead, Panel } from './common.jsx';

const SEGMENT_COLORS = ['#23392d', '#5c7b67', '#a87a30', '#c9a66b', '#3e5a73', '#999b95'];

function Weights() {
  const { weights, setWeight, setWeights, evaluations, statuses } = useDemo();
  const norm = normalizeWeights(weights);
  const activePreset = WEIGHT_PRESETS.find((p) => CRITERIA.every((c) => p.weights[c.key] === weights[c.key]));

  const baseline = useMemo(() => evaluateAll(COMPETITIONS, OFFICE, DEFAULT_WEIGHTS, statuses), [statuses]);
  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0 && statuses[c.id] !== 'verworfen');
  const rank = (ev) => [...open].sort((a, b) => ev[b.id].fit - ev[a.id].fit).map((c) => c.id);
  const now = rank(evaluations);
  const before = rank(baseline);

  return (
    <div className="weights">
      <Panel
        title="Eure Prioritäten"
        hint="Wie wichtig ist euch was? Die Gewichtungen werden automatisch auf 100 % umgerechnet."
        className="weights__panel"
      >
        <div className="presets">
          {WEIGHT_PRESETS.map((p) => (
            <button key={p.key} className={`preset ${activePreset?.key === p.key ? 'is-on' : ''}`} onClick={() => setWeights(p.weights)}>
              <strong>{p.label}</strong>
              <span>{p.hint}</span>
            </button>
          ))}
        </div>

        <div className="wbar" aria-hidden="true">
          {CRITERIA.map((c, i) => (
            <span key={c.key} style={{ flexGrow: norm[c.key] || 0.0001, background: SEGMENT_COLORS[i] }} title={c.label} />
          ))}
        </div>

        <div className="wlist">
          {CRITERIA.map((c, i) => (
            <div key={c.key} className="wrow">
              <div className="wrow__label">
                <span className="wrow__swatch" style={{ background: SEGMENT_COLORS[i] }} />
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.description}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights[c.key]}
                style={{ '--p': `${(weights[c.key] / 50) * 100}%` }}
                onChange={(e) => setWeight(c.key, Number(e.target.value))}
                aria-label={`Gewichtung ${c.label}`}
              />
              <span className="wrow__pct num">{Math.round(norm[c.key] * 100)} %</span>
            </div>
          ))}
        </div>
        <div className="weights__foot">
          <span className="muted">Änderungen wirken sofort auf alle Fit-Scores und Empfehlungen.</span>
          <Button variant="ghost" size="sm" iconLeft="refresh" onClick={() => setWeights(DEFAULT_WEIGHTS)}>
            Standard
          </Button>
        </div>
      </Panel>

      <Panel title="Auswirkung auf die Rangfolge" hint="Offene Verfahren, Vergleich zur Standardgewichtung" className="ranking">
        <ol className="rank">
          {now.slice(0, 8).map((id, i) => {
            const c = COMPETITIONS.find((x) => x.id === id);
            const ev = evaluations[id];
            const delta = before.indexOf(id) - i;
            const fitDelta = ev.fit - baseline[id].fit;
            return (
              <li key={id} className="rank__row">
                <span className="rank__pos num">{i + 1}</span>
                <FitRing value={ev.fit} level={ev.level} size={38} stroke={3.5} />
                <Link to={`/demo/wettbewerbe/${id}`} className="rank__main">
                  <span className="rank__title">{c.title}</span>
                  <span className="rank__meta">
                    {c.city}
                    {fitDelta !== 0 && (
                      <span className={`rank__fit ${fitDelta > 0 ? 'is-up' : 'is-down'}`}>
                        {fitDelta > 0 ? '+' : ''}
                        {fitDelta} Punkte
                      </span>
                    )}
                  </span>
                </Link>
                <span className={`rank__delta ${delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''}`}>
                  {delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${-delta}` : '–'}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

function Onboarding({ onClose }) {
  const { setWeights } = useDemo();
  const [step, setStep] = useState(0);
  const [types, setTypes] = useState(['wohnen', 'sanierung', 'kita', 'bildung']);
  const [regions, setRegions] = useState(['muenchen', 'oberbayern', 'bayern']);
  const [preset, setPreset] = useState('ausgewogen');
  const toggle = (list, set, k) => set(list.includes(k) ? list.filter((x) => x !== k) : [...list, k]);
  const steps = ['Büro', 'Schwerpunkte', 'Regionen', 'Prioritäten'];

  const finish = () => {
    setWeights(WEIGHT_PRESETS.find((p) => p.key === preset).weights);
    onClose();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Onboarding-Vorschau" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <div className="label">Onboarding-Vorschau</div>
            <h2 className="serif modal__title">Büroprofil einrichten</h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Schließen">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="ob__steps">
          {steps.map((s, i) => (
            <span key={s} className={`ob__step ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`}>
              <span className="num">{i + 1}</span> {s}
            </span>
          ))}
        </div>

        <div className="ob__body" key={step}>
          {step === 0 && (
            <div className="ob__grid">
              <label className="field">
                <span>Büroname</span>
                <input className="input" defaultValue={OFFICE.name} />
              </label>
              <label className="field">
                <span>Standort</span>
                <input className="input" defaultValue="München" />
              </label>
              <label className="field">
                <span>Mitarbeitende</span>
                <input className="input" type="number" defaultValue={OFFICE.employees} />
              </label>
              <label className="field">
                <span>Stunden pro Woche für Wettbewerbe</span>
                <input className="input" type="number" defaultValue={OFFICE.capacity.hoursPerWeek} />
              </label>
              <p className="ob__hint">Im Produkt würden hier auch Referenzen importiert, z. B. aus eurer Website oder Projektliste.</p>
            </div>
          )}
          {step === 1 && (
            <>
              <p className="ob__q">In welchen Bereichen arbeitet ihr – oder wollt ihr arbeiten?</p>
              <div className="ob__chips">
                {Object.entries(PROJECT_TYPES).map(([k, l]) => (
                  <button key={k} className={`ob__chip ${types.includes(k) ? 'is-on' : ''}`} onClick={() => toggle(types, setTypes, k)}>
                    {types.includes(k) && <Icon name="check" size={14} stroke={2.2} />} {l}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="ob__q">Wo nehmt ihr bevorzugt an Wettbewerben teil?</p>
              <div className="ob__chips">
                {Object.entries(REGIONS).map(([k, l]) => (
                  <button key={k} className={`ob__chip ${regions.includes(k) ? 'is-on' : ''}`} onClick={() => toggle(regions, setRegions, k)}>
                    {regions.includes(k) && <Icon name="check" size={14} stroke={2.2} />} {l}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="ob__q">Was beschreibt eure aktuelle Situation am besten?</p>
              <div className="presets presets--col">
                {WEIGHT_PRESETS.map((p) => (
                  <button key={p.key} className={`preset ${preset === p.key ? 'is-on' : ''}`} onClick={() => setPreset(p.key)}>
                    <strong>{p.label}</strong>
                    <span>{p.hint}</span>
                  </button>
                ))}
              </div>
              <p className="ob__hint">Diese Auswahl wird in der Demo als Gewichtung übernommen.</p>
            </>
          )}
        </div>

        <div className="modal__foot">
          <Button variant="ghost" onClick={() => (step ? setStep(step - 1) : onClose())}>
            {step ? 'Zurück' : 'Abbrechen'}
          </Button>
          {step < steps.length - 1 ? (
            <Button icon="arrowRight" onClick={() => setStep(step + 1)}>
              Weiter
            </Button>
          ) : (
            <Button icon="check" onClick={finish}>
              Profil übernehmen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { statuses } = useDemo();
  const [onboarding, setOnboarding] = useState(false);
  const cap = freeCapacity(OFFICE, statuses);

  return (
    <div className="page">
      <PageHead
        eyebrow="Büroprofil"
        title={OFFICE.name}
        actions={
          <>
            <DemoMark>Fiktives Büro</DemoMark>
            <Button variant="secondary" size="sm" iconLeft="play" onClick={() => setOnboarding(true)}>
              Onboarding-Vorschau
            </Button>
          </>
        }
      >
        {OFFICE.tagline} Aus diesen Angaben berechnet Compilot jeden Fit-Score.
      </PageHead>

      <div className="pfacts">
        {[
          ['Standort', OFFICE.location],
          ['Mitarbeitende', OFFICE.employees],
          ['Gegründet', OFFICE.founded],
          ['Wettbewerbe (5 J.)', `${OFFICE.experience.competitions} Teilnahmen`],
          ['Preise & Anerkennungen', OFFICE.experience.prizes],
          ['Öffentliche Auftraggeber', `${OFFICE.experience.publicClients} Projekte`],
        ].map(([k, v]) => (
          <div key={k} className="fact">
            <span className="fact__k">{k}</span>
            <span className="fact__v num">{v}</span>
          </div>
        ))}
      </div>

      <Weights />

      <div className="pgrid">
        <Panel title="Kompetenzen nach Projekttyp" hint="Fließt in den fachlichen Fit ein">
          <div className="bars">
            {Object.entries(OFFICE.competences)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <div key={k} className="bars__row">
                  <span>{PROJECT_TYPES[k]}</span>
                  <Meter value={v} thin />
                  <span className="num muted">{v}</span>
                </div>
              ))}
          </div>
        </Panel>
        <Panel title="Regionen" hint="Bevorzugte Wettbewerbsregionen">
          <div className="bars">
            {Object.entries(OFFICE.regions).map(([k, v]) => (
              <div key={k} className="bars__row">
                <span>{REGIONS[k]}</span>
                <Meter value={v} thin />
                <span className="num muted">{v}</span>
              </div>
            ))}
          </div>
          <div className="pnote">
            Bevorzugte Projektgröße: {OFFICE.sizeRange.min}–{OFFICE.sizeRange.max} Mio € Baukosten
          </div>
        </Panel>
        <Panel title="Kapazität" hint="Fließt in Aufwand & Gewinnchance ein">
          <div className="capacity">
            <div className="capacity__big num">
              {cap.free}
              <span> Std./Woche frei</span>
            </div>
            <Meter value={(cap.free / cap.base) * 100} />
            <p className="muted">
              {cap.base} Std./Woche stehen für Wettbewerbe zur Verfügung. {cap.active} laufende Bearbeitung
              {cap.active === 1 ? '' : 'en'} binden je {OFFICE.capacity.perActiveCompetition} Std. Startet ihr eine weitere
              Vorbereitung, sinkt die freie Kapazität – und damit die Bewertung aufwendiger Verfahren.
            </p>
          </div>
        </Panel>
        <Panel title="Erfahrung mit Verfahrensarten" hint="Fließt in den Chancen-Index ein">
          <div className="bars">
            {Object.entries(OFFICE.procedureExperience).map(([k, v]) => (
              <div key={k} className="bars__row">
                <span>{PROCEDURES[k].label}</span>
                <Meter value={v} thin />
                <span className="num muted">{v}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Strategische Ziele & Schwerpunkte" hint="Verfahren, die auf diese Ziele einzahlen, erhalten strategischen Wert">
        <div className="goals">
          {OFFICE.strategicGoals.map((g) => (
            <div key={g} className="goal">
              <Icon name="target" size={16} />
              {OFFICE.strategicGoalLabels[g]}
            </div>
          ))}
        </div>
        <div className="focus">
          {OFFICE.focus.map((f) => (
            <Tag key={f} tone="outline">
              {f}
            </Tag>
          ))}
        </div>
      </Panel>

      <Panel title="Referenzen" hint="Werden automatisch mit den Anforderungen jedes Wettbewerbs abgeglichen">
        <div className="refgrid">
          {OFFICE.references.map((r) => (
            <div key={r.id} className="refcard">
              <div className="refcard__top">
                <span className="label">{PROJECT_TYPES[r.type]}</span>
                <span className="num muted">{r.year}</span>
              </div>
              <h3>{r.title}</h3>
              <p className="muted">{r.city}</p>
              <p className="refcard__facts">{r.facts}</p>
              {r.budget && <span className="refcard__budget num">{r.budget.toLocaleString('de-DE')} Mio € BK</span>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Team">
        <div className="teamlist">
          {OFFICE.team.map((m) => (
            <div key={m.id} className="teamlist__m">
              <Avatar name={m.name} size={36} />
              <div>
                <strong>{m.name}</strong>
                <span className="muted">{m.role}</span>
              </div>
            </div>
          ))}
          <div className="teamlist__m muted">+ {OFFICE.employees - OFFICE.team.length} weitere</div>
        </div>
      </Panel>

      {onboarding && <Onboarding onClose={() => setOnboarding(false)} />}
    </div>
  );
}
