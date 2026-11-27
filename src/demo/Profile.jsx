// Profil & Team: Daran misst Compilot jede Auslobung.
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Avatar } from '../components/ui.jsx';
import { useDemo } from '../lib/store.jsx';
import { normalizeWeights } from '../lib/scoring.js';
import { CRITERIA, WEIGHT_PRESETS } from '../data/criteria.js';
import { OFFICE } from '../data/office.js';
import { ME, useD } from './checks.jsx';

export default function Profile() {
  const d = useD();
  const p = d.profile;
  const { weights, setWeight, setWeights } = useDemo();
  const norm = normalizeWeights(weights);
  const [notify, setNotify] = useState([true, true, true]);
  const [minFit, setMinFit] = useState(60);
  const activePreset = WEIGHT_PRESETS.find((pr) => CRITERIA.every((c) => pr.weights[c.key] === weights[c.key]))?.key;

  return (
    <div className="page">
      <header className="dhero">
        <h1>{p.title}</h1>
        <p>{p.sub}</p>
      </header>

      <div className="pf">
        <section className="card2 pf__office">
          <div className="pf__ohead">
            <span className="pf__mark">{OFFICE.initials}</span>
            <div>
              <h2>{OFFICE.name}</h2>
              <span className="mono">
                {OFFICE.location} · {p.people(OFFICE.employees)} · {p.founded(OFFICE.founded)}
              </span>
            </div>
          </div>
          <p className="pf__tag">{OFFICE.tagline}</p>
          <div className="pf__chips">
            {OFFICE.focus.map((f) => (
              <span key={f} className="chip2">
                {f}
              </span>
            ))}
          </div>

          <h3>{p.comp}</h3>
          <div className="fitb">
            {Object.entries(OFFICE.competences)
              .slice(0, 6)
              .map(([k, v]) => (
                <div key={k} className="fitb__row fitb__row--3">
                  <span>{d.types[k]}</span>
                  <span className="fitb__bar">
                    <span style={{ width: `${v}%` }} />
                  </span>
                  <span className="mono">{v}</span>
                </div>
              ))}
          </div>

          <h3>{p.refs}</h3>
          <ul className="refs2">
            {OFFICE.references.map((r) => (
              <li key={r.id}>
                <strong>{r.title}</strong>
                <span className="mono">
                  {r.city} · {r.year}
                </span>
              </li>
            ))}
          </ul>

          <h3>{p.goals}</h3>
          <div className="pf__chips">
            {OFFICE.strategicGoals.map((g) => (
              <span key={g} className="chip2 chip2--accent">
                {OFFICE.strategicGoalLabels[g]}
              </span>
            ))}
          </div>
        </section>

        <div className="pf__col">
          <section className="card2">
            <div className="card2__head">
              <h3>{p.team}</h3>
              <button className="btn btn--secondary btn--sm" type="button" disabled title="Demo">
                <Icon name="plus" size={14} />
                <span>{p.invite}</span>
              </button>
            </div>
            <p className="card2__hint">{p.teamHint}</p>
            <ul className="team2">
              {OFFICE.team.map((m) => (
                <li key={m.id}>
                  <Avatar name={m.name} size={36} />
                  <div>
                    <strong>
                      {m.name} {m.id === ME.id && <span className="team2__you mono">{p.you}</span>}
                    </strong>
                    <span>{d.locale === 'en-GB' ? m.roleEn : m.role}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pf__cap">
              <Icon name="clock" size={16} />
              <span>
                {p.capacity}: <strong>{p.capacityVal(OFFICE.capacity.hoursPerWeek)}</strong>
              </span>
            </div>
          </section>

          <section className="card2">
            <h3>{p.weights}</h3>
            <p className="card2__hint">{p.weightsHint}</p>
            <div className="presets2">
              {WEIGHT_PRESETS.map((pr) => (
                <button key={pr.key} className={activePreset === pr.key ? 'is-on' : ''} onClick={() => setWeights(pr.weights)}>
                  {p.presets[pr.key]}
                </button>
              ))}
            </div>
            <div className="sliders">
              {CRITERIA.map((c) => (
                <label key={c.key} className="slider">
                  <span className="slider__top">
                    <span>{d.criteria[c.key][0]}</span>
                    <span className="mono">{Math.round(norm[c.key] * 100)} %</span>
                  </span>
                  <input type="range" min="0" max="50" step="5" value={weights[c.key]} onChange={(e) => setWeight(c.key, Number(e.target.value))} />
                  <span className="slider__hint">{d.criteria[c.key][1]}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="card2">
            <h3>
              <Icon name="bell" size={16} /> {p.notify}
            </h3>
            <ul className="toggles">
              {p.notifyItems.map((label, i) => (
                <li key={label}>
                  <span>{label}</span>
                  <button
                    role="switch"
                    aria-checked={notify[i]}
                    className={`switch ${notify[i] ? 'is-on' : ''}`}
                    onClick={() => setNotify(notify.map((v, k) => (k === i ? !v : v)))}
                  >
                    <span />
                  </button>
                </li>
              ))}
              <li>
                <span>{p.minFit}</span>
                <select className="select select--sm" value={minFit} onChange={(e) => setMinFit(Number(e.target.value))}>
                  {[50, 60, 70, 80].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </section>

          <section className="card2 card2--dark">
            <h3>
              <Icon name="shield" size={16} /> {p.privacy}
            </h3>
            <ul className="priv">
              {p.privacyItems.map((x) => (
                <li key={x}>
                  <Icon name="check" size={14} stroke={2.2} /> {x}
                </li>
              ))}
            </ul>
            <p className="mono priv__note">{p.privacyNote}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
