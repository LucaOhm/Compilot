// Die drei Prüfschritte + Team-Votum – genutzt im Einstieg und in der Detailansicht.
// Alle Zahlen kommen aus der regelbasierten Bewertung (src/lib/scoring.js).
import Icon from '../components/Icon.jsx';
import { Avatar } from '../components/ui.jsx';
import { useT } from '../lib/i18n.jsx';
import { useDemo } from '../lib/store.jsx';
import { hash } from '../lib/format.js';
import { DEMO } from '../i18n/demo.js';
import { OFFICE } from '../data/office.js';
import { COMPETITIONS } from '../data/competitions.js';

export const useD = () => useT(DEMO);
export const COMP_BY_ID = Object.fromEntries(COMPETITIONS.map((c) => [c.id, c]));
export const RATE = 70; // interner Stundensatz €/Std. (Annahme)
export const ME = OFFICE.team[0];
export const COLLEAGUES = OFFICE.team.slice(1);

/** Anzahl ausgewerteter vergleichbarer Verfahren (Demo, deterministisch). */
export const similarCount = (comp) => 9 + (hash(comp.id) % 14);

/** Honorar-Orientierung Folgeauftrag LPH 2–9 (grobe Näherung, Demo). Case: 6,0 Mio € → ca. 470.000 €. */
export function followFee(comp) {
  if (comp.budget == null || comp.followUp < 0.5) return null;
  return Math.round((comp.budget * 1e6 * 0.078) / 10000) * 10000;
}

export function eligItems(comp, d) {
  const e = d.elig;
  const items = [{ label: e.kammer[0], text: e.kammer[1], state: 'ok' }];
  if (!comp.refRequirements?.length) items.push({ label: e.refsNone[0], text: e.refsNone[1], state: 'ok' });
  else
    comp.refRequirements.forEach((r) =>
      items.push({ label: e.refs, text: r.text, state: r.met === 'ja' ? 'ok' : r.met === 'teilweise' ? 'risk' : 'fail', original: true })
    );
  items.push({ label: e.excl[0], text: e.excl[1], state: 'ok' });
  const st = comp.eligibility?.status || 'ok';
  items.push({ label: e.overall, text: comp.eligibility?.note, state: st, original: true, overall: true });
  return items;
}

/** Simulierte Stimmen der Kolleg:innen – nachvollziehbar aus Fit und Kapazität abgeleitet. */
export function colleagueVotes(comp, ev, d) {
  const r = d.vote.reasons;
  const share = ev.capacity.share;
  if (ev.knockout) return COLLEAGUES.map((m) => ({ m, choice: 'verworfen', reason: r.fail }));
  const a =
    ev.fit >= 74
      ? { choice: 'vorbereitung', reason: r.fitHigh(ev.references[0]?.ref.title) }
      : ev.fit >= 60
        ? { choice: 'gemerkt', reason: r.fitMid }
        : { choice: 'verworfen', reason: r.fitLow };
  const b =
    share <= 70 && ev.fit >= 60
      ? { choice: 'vorbereitung', reason: r.capOk(share) }
      : share > 70
        ? { choice: ev.fit >= 74 ? 'gemerkt' : 'verworfen', reason: r.capHigh(share) }
        : { choice: 'gemerkt', reason: r.capOk(share) };
  return [
    { m: COLLEAGUES[0], ...a },
    { m: COLLEAGUES[1], ...b },
  ];
}

export function StepHead({ n, title, q, result, tone = 'ok' }) {
  return (
    <div className="ck__head">
      <span className="ck__n mono">{String(n).padStart(2, '0')}</span>
      <div>
        <h3>{title}</h3>
        <p>{q}</p>
      </div>
      {result && <span className={`ck__result ck__result--${tone}`}>{result}</span>}
    </div>
  );
}

const STATE_ICON = { ok: 'check', risk: 'alert', fail: 'x' };

export function EligibilityBlock({ comp, n = 1, head = true }) {
  const d = useD();
  const st = comp.eligibility?.status || 'ok';
  return (
    <div className="ck">
      {head && <StepHead n={n} title={d.elig.title} q={d.elig.q} result={d.elig.results[st]} tone={st} />}
      <ul className="elig2">
        {eligItems(comp, d).map((it, i) => (
          <li key={i} className={`elig2__row elig2__row--${it.state} ${it.overall ? 'is-overall' : ''}`}>
            <span className="elig2__icon">
              <Icon name={STATE_ICON[it.state]} size={14} stroke={2.4} />
            </span>
            <span className="elig2__label">{it.label}</span>
            <span className="elig2__text">
              {it.text}
              {it.original && d.locale === 'en-GB' && <em className="elig2__orig mono"> · {d.elig.original}</em>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChanceBlock({ comp, ev, n = 2, head = true }) {
  const d = useD();
  const c = d.chance;
  const r = ev.chance.range;
  const fmtF = (v) => v.toLocaleString(d.locale, { minimumFractionDigits: 2 });
  const fmtB = (v) => v.toLocaleString(d.locale, { maximumFractionDigits: 1 });
  return (
    <div className="ck">
      {head && <StepHead n={n} title={c.title} q={c.q} result={ev.knockout ? '–' : d.pct(`${r.low}–${r.high}`)} tone={ev.knockout ? 'fail' : 'accent'} />}
      <div className="calc">
        <div className="calc__row">
          <span className="calc__k">{c.base}</span>
          <span className="calc__v">{c.baseCalc(r.slots, comp.participants, fmtB(r.base))}</span>
        </div>
        <div className="calc__row">
          <span className="calc__k">{c.factor}</span>
          <span className="calc__v">{c.factorCalc(fmtF(r.factor))}</span>
        </div>
        <div className="calc__factors">
          {ev.chance.factors.map((f) => (
            <div key={f.key} className="calc__f">
              <span>{c.factors[f.key]}</span>
              <span className="calc__bar">
                <span style={{ width: `${f.value}%` }} />
              </span>
              <span className="mono">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="calc__row">
          <span className="calc__k">{c.range}</span>
          <span className="calc__v">{c.rangeCalc}</span>
        </div>
        <div className="calc__total">
          <strong>{ev.knockout ? '0 %' : c.result(r.low, r.high, c.slotLabels[r.slots])}</strong>
        </div>
      </div>
      <p className="ck__foot mono">
        {c.sources(similarCount(comp))} · {c.note}
      </p>
    </div>
  );
}

export function MatrixBlock({ comp, ev, n = 3, head = true }) {
  const d = useD();
  const m = d.matrix;
  const fee = followFee(comp);
  const prize = comp.prizeMoney ? comp.prizeMoney * 0.4 : 0;
  const weeks = Math.max(1, ev.capacity.weeks);
  const perWeek = Math.round(comp.effortHours / weeks);
  const best = ev.references[0];
  const goals = ev.goals.map((g) => OFFICE.strategicGoalLabels[g]);
  const conds = [];
  if (ev.knockout) conds.push(m.condFail);
  else if (comp.eligibility?.status === 'risk') conds.push(m.condRisk(comp.eligibility.note));
  conds.push(m.condCap(perWeek, weeks));
  if (best?.match >= 40) conds.push(m.condRef(best.ref.title));
  if (comp.participants >= 20) conds.push(m.condField(comp.participants));
  return (
    <div className="ck">
      {head && <StepHead n={n} title={m.title} q={m.q} result={`${d.h(comp.effortHours)} ↔ ${fee ? d.eur(fee) : d.eur(prize + comp.fee)}`} tone="neutral" />}
      <div className="mx">
        <div className="mx__col">
          <span className="label">{m.stake}</span>
          <div className="mx__row">
            <span>{m.hours}</span>
            <strong>{d.h(comp.effortHours)}</strong>
          </div>
          <div className="mx__row">
            <span>{m.cost(RATE)}</span>
            <strong>{d.eur(comp.effortHours * RATE)}</strong>
          </div>
          <div className="mx__row">
            <span>{m.capacity}</span>
            <strong>{d.pct(Math.min(ev.capacity.share, 999))}</strong>
          </div>
          <div className="mx__row">
            <span>{m.period}</span>
            <strong>{m.weeks(weeks)}</strong>
          </div>
        </div>
        <span className="mx__vs" aria-hidden="true">
          ↔
        </span>
        <div className="mx__col mx__col--gain">
          <span className="label">{m.gain}</span>
          <div className="mx__row">
            <span>{m.prize}</span>
            <strong>{prize ? d.eur(prize) : m.none}</strong>
          </div>
          <div className="mx__row">
            <span>{m.fee}</span>
            <strong>{comp.fee ? d.eur(comp.fee) : m.none}</strong>
          </div>
          <div className="mx__row">
            <span>{m.follow}</span>
            <strong>{fee ? d.eur(fee) : m.none}</strong>
          </div>
          <div className="mx__row">
            <span>{m.ref}</span>
            <strong className="mx__goal">{goals[0] || m.none}</strong>
          </div>
        </div>
      </div>
      <div className="mx__cond">
        <span className="label">{m.conditions}</span>
        <ul>
          {conds.map((x) => (
            <li key={x}>
              <Icon name="chevronRight" size={14} /> {x}
            </li>
          ))}
        </ul>
      </div>
      {comp.strategy && (
        <div className="mx__levers">
          <span className="label">{m.levers}</span>
          <div className="mx__lgrid">
            {comp.strategy.levers.map(([t, x]) => (
              <div key={t}>
                <strong>{t}</strong>
                <p>{x}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function VoteBlock({ comp, ev, n = 4, head = true, onDecided }) {
  const d = useD();
  const { votes, decide } = useDemo();
  const mine = votes[comp.id];
  const others = colleagueVotes(comp, ev, d);
  const choose = (c) => {
    decide(comp.id, c);
    onDecided?.(c);
  };
  return (
    <div className="ck">
      {head && <StepHead n={n} title={d.vote.title} q={d.vote.q} result={mine ? d.vote.decided(d.choices[mine]) : null} tone="accent" />}
      <p className="vote__human">
        <Icon name="users" size={16} /> {d.vote.human}
      </p>
      <div className="vote__list">
        {others.map(({ m, choice, reason }) => (
          <div key={m.id} className="vote">
            <Avatar name={m.name} size={34} />
            <div>
              <div className="vote__who">
                <strong>{m.name}</strong>
                <span className={`vote__chip vote__chip--${choice}`}>{d.choices[choice]}</span>
              </div>
              <p>{reason}</p>
            </div>
          </div>
        ))}
        <div className="vote vote--me">
          <Avatar name={ME.name} size={34} />
          <div>
            <div className="vote__who">
              <strong>
                {d.vote.yours} · {ME.name}
              </strong>
            </div>
            <div className="vote__btns">
              {['vorbereitung', 'gemerkt', 'verworfen'].map((c) => (
                <button key={c} className={`vote__btn vote__btn--${c} ${mine === c ? 'is-on' : ''}`} onClick={() => choose(c)}>
                  {d.choices[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
