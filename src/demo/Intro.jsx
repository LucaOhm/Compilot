// Einstieg in die Demo: einmal spielerisch der komplette Check am Fallbeispiel.
// Benachrichtigung → Eignung → Chance → Matrix → Team-Votum → Dashboard.
import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button, FitRing, Logo } from '../components/ui.jsx';
import { LangToggle } from '../lib/i18n.jsx';
import { useDemo } from '../lib/store.jsx';
import { navigate } from '../lib/router.jsx';
import { CASE_ID } from '../data/competitions.js';
import { OFFICE } from '../data/office.js';
import { COMP_BY_ID, ChanceBlock, EligibilityBlock, MatrixBlock, VoteBlock, similarCount, useD } from './checks.jsx';

const COMP = COMP_BY_ID[CASE_ID];

/** „Denkt nach“: Arbeitsschritte erscheinen nacheinander, danach das Ergebnis. */
function Thinking({ lines, label, onDone }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i > lines.length) return;
    const id = setTimeout(() => (i === lines.length ? onDone() : setI(i + 1)), i === lines.length ? 350 : 650);
    return () => clearTimeout(id);
  }, [i, lines.length, onDone]);
  return (
    <div className="think">
      <div className="think__head">
        <span className="think__spin" aria-hidden="true" />
        <span className="mono">{label}</span>
      </div>
      <ul>
        {lines.map((l, k) => (
          <li key={l} className={k < i ? 'is-done' : k === i ? 'is-on' : ''}>
            <span className="think__dot">{k < i ? <Icon name="check" size={12} stroke={2.6} /> : null}</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckStep({ lines, label, children }) {
  const [done, setDone] = useState(false);
  return done ? <div className="intro__result">{children}</div> : <Thinking lines={lines} label={label} onDone={() => setDone(true)} />;
}

export default function Intro() {
  const d = useD();
  const t = d.intro;
  const { evaluations, setIntroDone } = useDemo();
  const ev = evaluations[CASE_ID];
  const [step, setStep] = useState(0); // 0 Benachrichtigung · 1–3 Prüfung · 4 Team · 5 fertig
  const [ready, setReady] = useState({});
  const [decided, setDecided] = useState(false);

  const finish = () => {
    setIntroDone(true);
    navigate('/demo');
  };
  const markReady = (k) => () => setReady((r) => ({ ...r, [k]: true }));

  const pages = {
    1: { lines: t.t1, node: <EligibilityBlock comp={COMP} n={1} /> },
    2: { lines: t.t2(similarCount(COMP)), node: <ChanceBlock comp={COMP} ev={ev} n={2} /> },
    3: { lines: t.t3, node: <MatrixBlock comp={COMP} ev={ev} n={3} /> },
  };

  return (
    <div className="intro">
      <div className="intro__top">
        <Logo />
        <ol className="intro__steps">
          {t.steps.map((s, i) => (
            <li key={s} className={i < step ? 'is-done' : i === step ? 'is-on' : ''}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span> {s}
            </li>
          ))}
        </ol>
        <div className="intro__actions">
          <LangToggle />
          <button className="intro__skip" onClick={finish}>
            {t.skip} <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      <div className="intro__stage">
        {step === 0 && (
          <div className="notify">
            <div className="notify__bell">
              <Icon name="bell" size={26} />
              <span className="notify__ping" />
            </div>
            <span className="notify__tag mono">{t.notifyTag}</span>
            <p className="notify__text">{t.notifyText(OFFICE.name)}</p>
            <div className="notify__card">
              <Icon name="file" size={22} />
              <div>
                <strong>{COMP.title}</strong>
                <span>
                  {COMP.city} · {d.procs[COMP.procedure]} · {d.ago(COMP.publishedDaysAgo)}
                </span>
              </div>
              <FitRing value={ev.fit} level={ev.level} size={46} stroke={4} />
            </div>
            <Button size="lg" icon="arrowRight" onClick={() => setStep(1)}>
              {t.start}
            </Button>
            <span className="notify__hint mono">{t.startHint}</span>
          </div>
        )}

        {step >= 1 && step <= 3 && (
          <div className="intro__panel" key={step}>
            <CheckStep lines={pages[step].lines} label={t.thinking}>
              {pages[step].node}
              <ReadyFlag onReady={markReady(step)} />
            </CheckStep>
            {ready[step] && (
              <div className="intro__next">
                <Button icon="arrowRight" onClick={() => setStep(step + 1)}>
                  {t.next}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="intro__panel" key="vote">
            <CheckStep lines={t.t4} label={t.thinking}>
              <VoteBlock comp={COMP} ev={ev} n={4} onDecided={() => setDecided(true)} />
            </CheckStep>
            {decided && (
              <div className="intro__done">
                <Icon name="check" size={20} stroke={2.4} />
                <div>
                  <strong>{t.doneTitle}</strong>
                  <p>{t.doneText}</p>
                </div>
                <Button icon="arrowRight" onClick={finish}>
                  {t.toDash}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReadyFlag({ onReady }) {
  useEffect(() => {
    onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
