// ─────────────────────────────────────────────────────────────
//  Landing Page
//  Texte (DE/EN): src/i18n/landing.js · Zahlen: src/data/facts.js
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Avatar, Button, Eyebrow, FitRing, Logo, Reveal } from '../components/ui.jsx';
import { Compass, NorthScale, OfficeIllustration, PlanFragment, SetSquare, TitleBlock } from '../components/Drafting.jsx';
import { Link, navigate, scrollToId } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { LangToggle, useLang, useT } from '../lib/i18n.jsx';
import { LANDING } from '../i18n/landing.js';
import { CASE_ID, COMPETITIONS } from '../data/competitions.js';
import { FOMO_FACTS, POTENTIAL, PRICING, YEAR, atLeastOne } from '../data/facts.js';
import { OFFICE } from '../data/office.js';
import ContactForm from './ContactForm.jsx';

const CASE = COMPETITIONS.find((c) => c.id === CASE_ID);

function useFmt() {
  const { lang } = useLang();
  return {
    pct: (v) => (lang === 'en' ? `${Math.round(v * 100)}%` : `${Math.round(v * 100)} %`),
    num: (v) => v.toLocaleString(lang === 'en' ? 'en-GB' : 'de-DE'),
  };
}

function Nav() {
  const t = useT(LANDING).nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = [
    ['problem', t.problem],
    ['loesung', t.solution],
    ['gewinner', t.winner],
    ['preise', t.pricing],
    ['warum', t.about],
  ];
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Top">
          <Logo />
        </button>
        <nav className="nav__links" aria-label="Navigation">
          {items.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="nav__cta">
          <LangToggle />
          <button className="nav__contact" onClick={() => go('pilot')}>
            {t.cta}
          </button>
          <Button size="sm" icon="arrowRight" onClick={() => navigate('/demo')}>
            {t.demo}
          </Button>
          <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav__mobile">
          {items.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>
              {label}
            </button>
          ))}
          <button onClick={() => go('pilot')}>{t.cta}</button>
        </div>
      )}
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────
// Der Check läuft erst, wenn die Maus über die Fläche fährt (oder per Tippen).
function HeroFlow() {
  const t = useT(LANDING).hero;
  const { evaluations } = useDemo();
  const ev = evaluations[CASE_ID];
  const r = ev.chance.range;
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || phase >= 5) return;
    const id = setTimeout(() => setPhase((p) => p + 1), phase === 0 ? 200 : 900);
    return () => clearTimeout(id);
  }, [phase, running]);
  const start = () => setRunning(true);
  const stop = () => {
    setRunning(false);
    setPhase(0);
  };
  const checks = [
    [t.c1[0], t.c1[1], 'shield'],
    [t.c2[0], t.c2[1](r.low, r.high), 'compass'],
    [t.c3[0], t.c3[1](CASE.effortHours), 'matrix'],
  ];
  return (
    <div className={`flow2 ${running ? 'is-running' : ''}`} onMouseEnter={start} onMouseLeave={stop} onClick={start}>
      {phase === 0 && (
        <span className="flow2__hint mono">
          <Icon name="play" size={12} /> <span className="flow2__hint-mouse">{t.hint}</span>
          <span className="flow2__hint-touch">{t.hintTouch}</span>
        </span>
      )}
      <div className="flow2__box is-on">
        <span className="flow2__tag mono">{t.inbox}</span>
        <div className="flow2__doc">
          <Icon name="file" size={22} />
          <div>
            <strong>{t.doc(CASE.title)}</strong>
            <span>{t.docMeta(CASE.city)}</span>
          </div>
        </div>
      </div>
      <span className="flow2__arrow" aria-hidden="true" />
      <div className="flow2__box flow2__box--core">
        <span className="flow2__tag mono">{t.checks(OFFICE.name)}</span>
        {checks.map(([k, v, icon], i) => {
          const st = phase > i + 1 ? 'is-done' : phase === i + 1 ? 'is-on' : '';
          return (
            <div key={k} className={`flow2__check ${st}`}>
              <span className="flow2__ico">
                {st === 'is-done' ? <Icon name="check" size={14} stroke={2.6} /> : <Icon name={icon} size={14} />}
              </span>
              <strong>
                {String(i + 1).padStart(2, '0')} {k}
              </strong>
              <span>{st === 'is-done' ? v : st === 'is-on' ? t.analysing : ''}</span>
            </div>
          );
        })}
        <div className="flow2__score">
          <FitRing value={phase >= 4 ? ev.fit : 0} level={ev.level} size={40} stroke={4} />
          <span>{t.score}</span>
        </div>
      </div>
      <span className="flow2__arrow" aria-hidden="true" />
      <div className={`flow2__box ${phase >= 4 ? 'is-on' : ''}`}>
        <span className="flow2__tag mono">{t.team}</span>
        <div className="flow2__team">
          {OFFICE.team.map((m) => (
            <Avatar key={m.id} name={m.name} size={28} />
          ))}
        </div>
        <div className="flow2__choice">
          {t.choices.map((c, i) => (
            <span key={c} className={phase >= 5 && i === 0 ? 'is-picked' : ''}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const t = useT(LANDING).hero;
  return (
    <section className="hero">
      <div className="plan-grid" aria-hidden="true" />
      <div className="hero__draft" aria-hidden="true">
        <SetSquare className="hero__square" />
        <Compass className="hero__compass" />
        <PlanFragment className="hero__plan" />
      </div>
      <div className="container hero__inner">
        <div className="hero__copy">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="hero__title">
            {t.title1} <em>{t.title2}</em>
          </h1>
          <p className="hero__lead">{t.lead}</p>
          <div className="hero__ctas">
            <Button size="lg" icon="arrowRight" onClick={() => navigate('/demo')}>
              {t.ctaDemo}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToId('gewinner')}>
              {t.ctaCase}
            </Button>
          </div>
          <div className="hero__proof mono">
            <span>{t.proof(POTENTIAL.participationSmall, POTENTIAL.participationLarge)}</span>
            <span>{t.proofSrc}</span>
          </div>
        </div>
        <div className="hero__visual">
          <HeroFlow />
          <TitleBlock className="hero__block" rows={[t.block[0], [t.officeLabel, OFFICE.name], ...t.block.slice(1)]} />
        </div>
      </div>
    </section>
  );
}

// ── Problem ──────────────────────────────────────────────────
function Bars({ rows }) {
  const { pct } = useFmt();
  return rows.map(([l, v], i) => (
    <div key={l} className={`cmp__row ${i === 0 ? 'is-small' : 'is-large'}`}>
      <span className="cmp__who">{l}</span>
      <span className="cmp__track">
        <span className="cmp__bar" style={{ width: `${v}%` }} />
      </span>
      <span className="cmp__val">{pct(v / 100)}</span>
    </div>
  ));
}

// Karte dreht sich beim Darüberfahren (Maus) bzw. per Tippen/Tastatur um.
function FlipCard({ n, hot, front, back, flipLabel, backLabel, delay }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Reveal delay={delay} className="flipwrap">
      <div
        className={`flip ${flipped ? 'is-flipped' : ''} ${hot ? 'flip--hot' : ''}`}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlipped((f) => !f))}
      >
        <div className="flip__inner">
          <div className="flip__face flip__front" aria-hidden={flipped}>
            <span className="pain__n mono">{n}</span>
            {front}
            <span className="flip__more mono">
              <Icon name="refresh" size={13} /> {flipLabel}
            </span>
          </div>
          <div className="flip__face flip__back" aria-hidden={!flipped}>
            <span className="pain__n mono">
              {n} · {backLabel}
            </span>
            {back}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Problem() {
  const t = useT(LANDING).problem;
  const { pct } = useFmt();
  const { lang } = useLang();
  const share = lang === 'en' ? FOMO_FACTS[0].value.replace(' ', '') : FOMO_FACTS[0].value;
  const [c1, c2, c3] = t.cards;
  const bigs = [pct(POTENTIAL.participationSmall / 100), c2.big(), pct(POTENTIAL.aiSmall / 100)];
  const Front = ({ c, i }) => (
    <>
      <h3>{c.title}</h3>
      <strong className="flip__big">{bigs[i]}</strong>
      <p className="flip__claim">{c.claim}</p>
    </>
  );
  const Src = ({ c }) => <p className="flip__src mono">{c.src}</p>;
  return (
    <section className="section" id="problem">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="01">{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
          <p className="lead">{t.lead(share)}</p>
        </Reveal>
        <div className="pains">
          <FlipCard
            n="01"
            hot
            flipLabel={t.flip}
            backLabel={c1.title}
            front={<Front c={c1} i={0} />}
            back={
              <>
                <div className="cmp__label">{c1.label}</div>
                <Bars rows={[[c1.rows[0], POTENTIAL.participationSmall], [c1.rows[1], POTENTIAL.participationLarge]]} />
                <p className="pain__text">{c1.text}</p>
                <Src c={c1} />
              </>
            }
          />
          <FlipCard
            n="02"
            delay={90}
            flipLabel={t.flip}
            backLabel={c2.title}
            front={<Front c={c2} i={1} />}
            back={
              <>
                <div className="cmp__label">{c2.label}</div>
                <ul className="flip__points">
                  {c2.points.map((x) => (
                    <li key={x}>
                      <Icon name="plus" size={13} stroke={2.2} /> {x}
                    </li>
                  ))}
                </ul>
                <p className="pain__text pain__text--strong">{c2.text}</p>
                <Src c={c2} />
              </>
            }
          />
          <FlipCard
            n="03"
            delay={180}
            flipLabel={t.flip}
            backLabel={c3.title}
            front={<Front c={c3} i={2} />}
            back={
              <>
                <div className="cmp__label">{c3.label}</div>
                <Bars rows={[[c3.rows[0], POTENTIAL.aiSmall], [c3.rows[1], POTENTIAL.aiLarge]]} />
                <p className="pain__text">{c3.text}</p>
                <Src c={c3} />
              </>
            }
          />
        </div>
        <Reveal className="answer">
          <Logo light />
          <p>{t.answer}</p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Lösung: Roadmap, die sich beim Scrollen füllt ────────────
function Roadmap({ steps }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.6 - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  const n = steps.length;
  return (
    <ol className="road" ref={ref} style={{ '--p': progress }}>
      <span className="road__rail" aria-hidden="true">
        <span className="road__fill" />
      </span>
      {steps.map(([icon, tag, title, text, out], i) => {
        const active = progress >= (i + 0.35) / n;
        return (
          <li key={title} className={`road__step ${active ? 'is-on' : ''} ${i % 2 ? 'is-right' : 'is-left'} ${i === n - 1 ? 'is-last' : ''}`}>
            <span className="road__node">
              <Icon name={icon} size={20} stroke={1.5} />
            </span>
            <div className="road__card">
              <span className="road__tag mono">
                {String(i + 1).padStart(2, '0')} · {tag}
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="road__out mono">{out}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Solution() {
  const t = useT(LANDING).solution;
  return (
    <section className="section loesung" id="loesung">
      <Compass className="bg-draft bg-draft--compass" />
      <div className="container">
        <Reveal className="section__head section__head--center">
          <Eyebrow num="02">{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </Reveal>
        <Roadmap steps={t.steps} />
        <div className="usp2">
          <Reveal className="usp2__head">
            <h3>{t.uspTitle}</h3>
          </Reveal>
          <div className="usp2__grid">
            {t.usps.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80} className="usp2__item">
                <span className="usp2__icon">
                  <Icon name={icon} size={24} stroke={1.4} />
                </span>
                <h4>{title}</h4>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
          <p className="principles">
            {t.principles.map((p) => (
              <span key={p} className="principles__item">
                <Icon name="shield" size={14} /> {p}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Werde Gewinner: fiktives Beispielbüro ────────────────────
function Win() {
  const t = useT(LANDING).win;
  const { pct, num } = useFmt();
  const { lang } = useLang();
  const b = YEAR.before;
  const a = YEAR.after;
  const val = {
    before: { screened: b.screened, checkHours: b.screened * b.hoursPer, participations: b.participations, chance: b.chance },
    after: { screened: a.screened, checkHours: a.screened * a.hoursPer, participations: a.participations, chance: a.chance },
  };
  const pb = atLeastOne(b.chance, b.participations);
  const pa = atLeastOne(a.chance, a.participations);
  const plan = PRICING.find((p) => p.featured);
  const saved = (val.before.checkHours - val.after.checkHours) * YEAR.rate;
  const factor = (pa / pb).toFixed(1);
  return (
    <section className="section win" id="gewinner">
      <PlanFragment className="bg-draft bg-draft--plan" />
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="03">{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
        </Reveal>
        <div className="win__grid">
          <Reveal className="office">
            <div className="office__img">
              <OfficeIllustration />
              <span className="office__badge mono">{t.fictional}</span>
            </div>
            <div className="office__body">
              <div className="office__head">
                <span className="office__mark">{OFFICE.initials}</span>
                <div>
                  <h3>{OFFICE.name}</h3>
                  <span className="mono">{t.place(OFFICE.location, OFFICE.employees)}</span>
                </div>
              </div>
              <div className="office__team">
                {OFFICE.team.map((m) => (
                  <Avatar key={m.id} name={m.name} size={30} />
                ))}
                <span>{t.focus}</span>
              </div>
              <p>{t.story}</p>
            </div>
          </Reveal>
          <Reveal delay={100} className="ledger">
            <div className="ledger__cols mono">
              <span />
              <span>{t.before}</span>
              <span className="is-us">{t.after}</span>
            </div>
            {t.rows.map(([k, label, fmt]) => (
              <div key={k} className="ledger__row">
                <span>{label}</span>
                <span className="ledger__b">{fmt(val.before[k])}</span>
                <span className="ledger__a">{fmt(val.after[k])}</span>
              </div>
            ))}
            <div className="ledger__big">
              <span className="ledger__biglabel">{t.bigLabel}</span>
              <div className="ledger__bignums">
                <span className="ledger__from">{pct(pb)}</span>
                <Icon name="arrowRight" size={28} stroke={1.4} />
                <span className="ledger__to">{pct(pa)}</span>
                <span className="ledger__factor mono">{t.factor(lang === 'en' ? factor : factor)}</span>
              </div>
            </div>
            <p className="ledger__roi">
              <Icon name="euro" size={16} /> {t.roi(num(plan.price * 12), num(saved))}
            </p>
          </Reveal>
        </div>
        <Reveal className="stake">
          <span className="label">{t.stakeTitle}</span>
          <div className="stake__items">
            {t.stake.map(([v, l]) => (
              <div key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="src">{t.note(YEAR.rate)}</p>
      </div>
    </section>
  );
}

// ── Preise ───────────────────────────────────────────────────
function Pricing() {
  const t = useT(LANDING).pricing;
  return (
    <section className="section preise" id="preise">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="04">{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </Reveal>
        <div className="plans">
          {PRICING.map((p, i) => (
            <Reveal key={p.key} delay={i * 80} className={`plan ${p.featured ? 'plan--featured' : ''}`}>
              {p.featured && <span className="plan__badge mono">{t.featured}</span>}
              <h3>{t.plans[p.key][0]}</h3>
              <p className="plan__for">{t.plans[p.key][1]}</p>
              <div className="plan__price">
                <strong>{p.price}</strong>
                <span>{t.per}</span>
              </div>
              <p className="plan__users mono">{t.users(p.users)}</p>
              <ul>
                {t.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={15} stroke={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.featured ? 'primary' : 'secondary'} onClick={() => scrollToId('pilot')}>
                {t.cta}
              </Button>
            </Reveal>
          ))}
        </div>
        <div className="terms">
          {t.terms.map((x) => (
            <span key={x}>
              <Icon name="check" size={14} stroke={2.2} /> {x}
            </span>
          ))}
        </div>
        <p className="plans__note mono">{t.disclaimer}</p>
      </div>
    </section>
  );
}

// ── Warum wir: Mission, Team, Vorteilsvergleich ──────────────
const MARKS = [
  ['y', 'y', 'y'],
  ['p', 'y', 'y'],
  ['p', 'y', 'y'],
  ['n', 'n', 'y'],
  ['n', 'n', 'y'],
  ['p', 'n', 'y'],
];
const MARK_ICON = { y: 'check', p: 'minus', n: 'x' };

function About() {
  const t = useT(LANDING).about;
  return (
    <section className="section about" id="warum">
      <SetSquare className="bg-draft bg-draft--square" />
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="05">{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
        </Reveal>
        <div className="about__grid">
          <Reveal className="mv">
            {[t.mission, t.vision].map(([k, v]) => (
              <div key={k} className="mv__item">
                <span className="label">{k}</span>
                <p>{v}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={90} className="founders">
            <div className="founders__roles">
              {t.roles.map((r, i) => (
                <span key={r} className="founders__role">
                  <Icon name={i === 0 ? 'compass' : 'layers'} size={22} stroke={1.4} />
                  {r}
                </span>
              ))}
            </div>
            <p>{t.founders}</p>
          </Reveal>
        </div>
        <Reveal className="vt">
          <div className="vt__title">{t.compareTitle}</div>
          <div className="vt__row vt__head">
            <span />
            <span className="mono">{t.cols[0]}</span>
            <span className="mono">{t.cols[1]}</span>
            <span className="vt__us">
              <Logo light />
            </span>
          </div>
          {t.rows.map((l, r) => (
            <div key={l} className="vt__row">
              <span>{l}</span>
              {MARKS[r].map((v, i) => (
                <span key={i} className={i === 2 ? 'vt__us' : ''}>
                  <span className={`vmark vmark--${v}`} title={t.marks[v]}>
                    <Icon name={MARK_ICON[v]} size={15} stroke={2.2} />
                  </span>
                </span>
              ))}
            </div>
          ))}
        </Reveal>
        <p className="vt__note">{t.note}</p>
      </div>
    </section>
  );
}

// ── Aktion ───────────────────────────────────────────────────
function Cta() {
  const t = useT(LANDING).cta;
  return (
    <section className="cta" id="pilot">
      <NorthScale className="cta__north" />
      <div className="container cta__grid">
        <Reveal className="cta__copy">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="h2">{t.title}</h2>
          <p>{t.text}</p>
          <ul className="cta__list">
            {t.list.map((x) => (
              <li key={x}>
                <Icon name="check" size={16} stroke={2} /> {x}
              </li>
            ))}
          </ul>
          <Button variant="outline-light" icon="arrowRight" onClick={() => navigate('/demo')}>
            {t.demo}
          </Button>
        </Reveal>
        <Reveal delay={120} className="cta__form">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const t = useT(LANDING).footer;
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>{t.tag}</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/demo">{t.demo}</Link>
          <Link to="/impressum">{t.imprint}</Link>
          <Link to="/datenschutz">{t.privacy}</Link>
          <LangToggle />
        </nav>
        <p className="footer__note">
          {t.note} © {new Date().getFullYear()} Compilot
        </p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="landing">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Win />
        <Pricing />
        <About />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
