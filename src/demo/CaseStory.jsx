// Demo · Geführter Case: ein Wettbewerb in fünf Schritten
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button, DemoMark, FitRing, LevelPill, Meter } from '../components/ui.jsx';
import { CASE_ID, COMPETITIONS } from '../data/competitions.js';
import { CASE_MATH } from '../data/facts.js';
import { OFFICE, PROJECT_TYPES } from '../data/office.js';
import { PROCEDURES } from '../data/procedures.js';
import { buildAnalysis } from '../lib/analysis.js';
import { LEVELS } from '../lib/scoring.js';
import { navigate } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';

const CASE = COMPETITIONS.find((c) => c.id === CASE_ID);
const STEPS = ['Finden', 'Dürfen wir?', 'Können wir gewinnen?', 'Schaffen wir das?', 'Entscheidung'];
const WEEKS = [
  ['Woche 1', 'Auslobung, Ortsbesuch, Leitidee', 20],
  ['Woche 2', 'Städtebau und Schulhof festlegen', 30],
  ['Woche 3–4', 'Lernhaus, Grundrisse, Holzraster', 70],
  ['Woche 5', 'Schnitte, Kennwerte, eine Perspektive', 40],
  ['Woche 6–7', 'Pläne, Einsatzmodell, Abgabe', 40],
];

export default function CaseStory() {
  const { evaluations, statuses, setStatus } = useDemo();
  const [step, setStep] = useState(0);
  const ev = evaluations[CASE_ID];
  const analysis = buildAnalysis(CASE, ev);
  const s = CASE.strategy;

  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0 && statuses[c.id] !== 'abgegeben');
  const blocked = open.filter((c) => c.eligibility.status === 'fail');
  const top = open
    .filter((c) => c.eligibility.status !== 'fail' && statuses[c.id] !== 'vorbereitung')
    .sort((a, b) => evaluations[b.id].fit - evaluations[a.id].fit)
    .slice(0, 3);

  const start = () => {
    setStatus(CASE_ID, 'vorbereitung');
    navigate(`/demo/wettbewerbe/${CASE_ID}?tab=vorbereitung`);
  };

  return (
    <div className="page story">
      <div className="story__head">
        <div>
          <div className="label">Geführter Case · {OFFICE.name}, {OFFICE.location}</div>
          <h1 className="story__title">Drei Leute. Eine Schule. Sieben Wochen.</h1>
          <p className="story__sub">
            {OFFICE.name}: {OFFICE.employees} Personen, {OFFICE.experience.prizes} Wettbewerbspreise, noch keine gebaute Schule.
            So entscheidet das Büro mit Compilot über den nächsten Wettbewerb.
          </p>
        </div>
        <DemoMark>Fiktives Beispiel</DemoMark>
      </div>

      <ol className="stepper">
        {STEPS.map((t, i) => (
          <li key={t}>
            <button className={`stepper__item ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`} onClick={() => setStep(i)}>
              <span className="stepper__n mono">{i < step ? <Icon name="check" size={12} stroke={2.6} /> : String(i + 1).padStart(2, '0')}</span>
              {t}
            </button>
          </li>
        ))}
      </ol>

      <div className="story__body" key={step}>
        {step === 0 && (
          <div className="sgrid">
            <div className="stext">
              <h2>Aus {open.length} Verfahren bleiben drei.</h2>
              <p>
                Compilot prüft alle offenen Verfahren gegen euer Profil. {blocked.length} scheiden sofort aus: Mindestumsatz,
                Mindestpersonal oder Referenzen, die ein 3-Personen-Büro nicht erfüllen kann. Diese Abende spart ihr euch.
              </p>
              <ul className="sblocked">
                {blocked.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Icon name="x" size={13} stroke={2.2} /> {c.title}, {c.city}
                    <span>{c.eligibility.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="spanel">
              <div className="label">Empfohlen für euch</div>
              {top.map((c) => (
                <div key={c.id} className={`srec ${c.id === CASE_ID ? 'is-case' : ''}`}>
                  <FitRing value={evaluations[c.id].fit} level={evaluations[c.id].level} size={46} stroke={4} />
                  <div>
                    <strong>{c.title}</strong>
                    <span>
                      {c.city} · {PROCEDURES[c.procedure].label} · {PROJECT_TYPES[c.type]}
                    </span>
                  </div>
                  {c.id === CASE_ID && <span className="srec__tag mono">Case</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="sgrid">
            <div className="stext">
              <h2>Ja, ihr dürft – ohne Umweg über eine ARGE.</h2>
              <p>{CASE.eligibility.note} Die Stadt wünscht ausdrücklich Beiträge junger Büros.</p>
              <div className="sok">
                <Icon name="shield" size={18} /> Teilnahme ohne Hürde möglich
              </div>
            </div>
            <div className="spanel">
              <div className="label">Aus der Auslobung</div>
              {analysis.sections
                .filter((x) => ['teilnahme', 'ausschluss', 'dokumente'].includes(x.key))
                .map((sec) => (
                  <div key={sec.key} className="ssec">
                    <strong>{sec.title}</strong>
                    <ul>
                      {sec.items.slice(0, 3).map((it) => (
                        <li key={it.text}>
                          {it.text} <span className="mono">{it.source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="sgrid">
            <div className="stext">
              <h2>Hier könnt ihr gegen große Büros punkten.</h2>
              <p>{s.jury}</p>
              <div className="scrit">
                {s.criteria.map(([l, w], i) => (
                  <div key={l}>
                    <span>{l}</span>
                    <Meter value={w * 3} thin tone={i === 0 ? 'accent' : 'neutral'} />
                    <span className="mono">{w} %</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="spanel">
              <div className="label">Eure Gewinnhebel</div>
              {s.levers.map(([h, d], i) => (
                <div key={h} className="slever">
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{h}</strong>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="sgrid">
            <div className="stext">
              <h2>Ja – wenn ihr bewusst weglasst.</h2>
              <p>
                Rund {CASE.effortHours} Stunden in 7 Wochen. Bei {OFFICE.capacity.hoursPerWeek} Wettbewerbsstunden pro Woche im Team und
                einer laufenden Bearbeitung bleiben ca. {ev.capacity.availableHours} Stunden – das Verfahren bindet etwa{' '}
                {ev.capacity.share} % davon.
              </p>
              <div className="sskip">
                <div className="label">Was ihr weglasst</div>
                {s.notToDo.map((t) => (
                  <div key={t}>
                    <Icon name="minus" size={14} stroke={2.2} /> {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="spanel">
              <div className="label">Wochenplan für drei Personen</div>
              {WEEKS.map(([w, d, h]) => (
                <div key={w} className="sweek">
                  <span className="mono">{w}</span>
                  <div>
                    <span className="sweek__bar" style={{ width: `${(h / 70) * 100}%` }} />
                    <span>
                      {d} · {h} Std.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="sgrid">
            <div className="stext">
              <div className="sverdict">
                <FitRing value={ev.fit} level={ev.level} size={88} stroke={7} />
                <div>
                  <LevelPill level={ev.level} />
                  <h2>Machen – mit Fokus auf Schulhof und Holzraster.</h2>
                </div>
              </div>
              <ul className="sreasons">
                {ev.reasons.slice(0, 4).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="spanel">
              <div className="label">Was auf dem Spiel steht</div>
              {Object.values(CASE_MATH).map((m) => (
                <div key={m.label} className="smath">
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
              <p className="snote">{LEVELS[ev.level].action}. Fit-Score nach eurer aktuellen Gewichtung im Büroprofil.</p>
            </div>
          </div>
        )}
      </div>

      <div className="story__nav">
        <Button variant="secondary" iconLeft="arrowLeft" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Zurück
        </Button>
        {step < STEPS.length - 1 ? (
          <Button icon="arrowRight" onClick={() => setStep(step + 1)}>
            Weiter: {STEPS[step + 1]}
          </Button>
        ) : (
          <div className="story__end">
            <Button variant="secondary" onClick={() => navigate('/demo')}>
              Tool frei erkunden
            </Button>
            <Button icon="arrowRight" onClick={start}>
              Vorbereitung starten
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
