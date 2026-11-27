// ─────────────────────────────────────────────────────────────
//  Landing Page – alle Texte stehen direkt in dieser Datei.
//  Zahlen mit Quellen: src/data/facts.js
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button, Eyebrow, FitRing, Logo, Reveal } from '../components/ui.jsx';
import { Link, navigate, scrollToId } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { CASE_ID, COMPETITIONS } from '../data/competitions.js';
import { FOMO_FACTS, CASE_MATH, HURDLES, YEARLY_EFFORT } from '../data/facts.js';
import { OFFICE } from '../data/office.js';
import ContactForm from './ContactForm.jsx';

const NAV = [
  ['kosten', 'Warum jetzt'],
  ['check', 'KI-Check'],
  ['case', 'Case'],
  ['vergleich', 'Vergleich'],
];
const CASE = COMPETITIONS.find((c) => c.id === CASE_ID);

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
        <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Nach oben">
          <Logo />
        </button>
        <nav className="nav__links" aria-label="Hauptnavigation">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="nav__cta">
          <button className="nav__contact" onClick={() => go('pilot')}>
            Pilotbüro werden
          </button>
          <Button size="sm" icon="arrowRight" onClick={() => navigate('/demo/case')}>
            Case ansehen
          </Button>
          <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="Menü" aria-expanded={open}>
            <Icon name={open ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav__mobile">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>
              {label}
            </button>
          ))}
          <button onClick={() => go('pilot')}>Pilotbüro werden</button>
        </div>
      )}
    </header>
  );
}

/** Maßkette wie im Plan: |←— Text —→| */
function Dim({ children, className = '' }) {
  return (
    <span className={`dim ${className}`} aria-hidden="true">
      <span className="dim__line" />
      <span className="dim__label mono">{children}</span>
      <span className="dim__line" />
    </span>
  );
}

// ── Hero mit laufendem KI-Check ──────────────────────────────
const CHECKS = [
  ['Dürfen wir?', 'Offenes Verfahren · keine Referenzhürde', 'ok'],
  ['Können wir gewinnen?', 'Hebel: Schulhof (30 %) + Holzbau-Jury', 'ok'],
  ['Schaffen wir das zu dritt?', 'ca. 200 Std. in 7 Wochen · machbar', 'ok'],
];

function HeroCheck() {
  const { evaluations } = useDemo();
  const ev = evaluations[CASE_ID];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step > CHECKS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : 900);
    return () => clearTimeout(t);
  }, [step]);
  const done = step > CHECKS.length - 1;
  return (
    <div className="hcheck">
      <div className="hcheck__head">
        <span className="label">KI-Check · {CASE.city}</span>
        <span className="hcheck__live">
          <span className={done ? '' : 'pulse'} /> {done ? 'geprüft' : 'prüft Auslobung …'}
        </span>
      </div>
      <h3 className="hcheck__title">{CASE.title}</h3>
      <div className="hcheck__meta mono">
        Offener Wettbewerb · {CASE.budget.toLocaleString('de-DE')} Mio € BK · Preisgeld {CASE_MATH.prizeMoney.value}
      </div>
      <ol className="hcheck__list">
        {CHECKS.map(([q, a], i) => (
          <li key={q} className={i < step ? 'is-done' : i === step ? 'is-on' : ''}>
            <span className="hcheck__dot">{i < step ? <Icon name="check" size={13} stroke={2.6} /> : String(i + 1).padStart(2, '0')}</span>
            <div>
              <strong>{q}</strong>
              <span>{i < step ? a : i === step ? 'wird geprüft …' : '—'}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className={`hcheck__verdict ${done ? 'is-in' : ''}`}>
        <FitRing value={done ? ev.fit : 0} level={ev.level} size={58} stroke={5} />
        <div>
          <span className="label">Empfehlung</span>
          <strong>Machen – mit Fokus.</strong>
        </div>
      </div>
      <Dim className="hcheck__dim">eine Auslobung · drei Fragen · ein Urteil</Dim>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="plan-grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <Eyebrow>Für Architekturbüros mit 1–5 Personen</Eyebrow>
          <h1 className="hero__title">
            Klein antreten.
            <br />
            <em>Gezielt gewinnen.</em>
          </h1>
          <p className="hero__lead">
            Jeder Wettbewerb, den ihr auslasst, gewinnt ein anderes Büro. Compilot liest die Auslobung für euch und beantwortet
            drei Fragen: <strong>Dürfen wir? Können wir gewinnen? Schaffen wir das zu dritt?</strong> So fließen eure knappen
            Stunden in die Verfahren, die sich lohnen.
          </p>
          <div className="hero__ctas">
            <Button size="lg" icon="arrowRight" onClick={() => navigate('/demo/case')}>
              Case in 2 Minuten ansehen
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToId('check')}>
              So funktioniert der Check
            </Button>
          </div>
        </div>
        <div className="hero__visual">
          <HeroCheck />
        </div>
      </div>
    </section>
  );
}

// ── Warum jetzt / FOMO ───────────────────────────────────────
function Kosten() {
  return (
    <section className="section kosten" id="kosten">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="01">Warum jetzt</Eyebrow>
          <h2 className="h2">Die Großen haben eine Akquise-Abteilung. Ihr habt den Freitagabend.</h2>
          <p className="lead">
            Auslobung lesen, Eignung prüfen, Aufwand schätzen – das kostet kleine Büros Abende, die sie nicht haben. Also wird
            ausgesiebt, bevor überhaupt geprüft ist, oder gar nicht erst teilgenommen. In VgV-Verfahren scheitern{' '}
            {HURDLES.referenzen} der Teilnehmenden an fehlenden Referenzen, {HURDLES.umsatz} am geforderten Umsatz (
            {HURDLES.source}). Das Projekt gewinnt dann ein anderes Büro.
          </p>
        </Reveal>
        <div className="facts-grid">
          {FOMO_FACTS.map((f, i) => (
            <Reveal key={f.key} delay={i * 80} className="fomo">
              <span className={`fomo__value ${f.value ? '' : 'is-empty'}`}>{f.value || 'Zahl folgt'}</span>
              <p className="fomo__label">{f.label}</p>
              <a className={`fomo__src ${f.verified ? '' : 'is-open'}`} href={f.url || undefined} target="_blank" rel="noreferrer">
                {f.verified ? `Quelle: ${f.source}` : `Quelle wird geprüft · ${f.source}`}
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="kosten__punch">
          <p>
            Büros mit 2–4 Personen stecken im Median {YEARLY_EFFORT.hours} und {YEARLY_EFFORT.cost} pro Jahr in Wettbewerbe.
            Ein einziger Gewinn wie im Case bedeutet <strong>{CASE_MATH.fee.value}</strong> Honorar für den Folgeauftrag – und
            die erste gebaute Schule im Portfolio. Die Frage ist nicht, ob ihr euch Wettbewerbe leisten könnt. Sondern welche.
          </p>
          <span className="mono kosten__note">
            Quellen: BAK Strukturbefragung 2024 · {CASE_MATH.fee.label}.
          </span>
        </Reveal>
      </div>
    </section>
  );
}

// ── KI-Check: die drei Fragen ────────────────────────────────
const QUESTIONS = [
  {
    n: '01',
    q: 'Dürfen wir?',
    what: 'Eignung, Formalien, Ausschlussgründe, Referenz- und Umsatzhürden – abgeglichen mit eurem Büroprofil.',
    out: 'Klares Ja, Nein oder „nur mit Partner“.',
    tag: 'Basis',
  },
  {
    n: '02',
    q: 'Können wir gewinnen?',
    what: 'Bewertungskriterien, Gewichtung, Preisgericht und Aufgabe werden gelesen. Wo kann ein kleines Büro punkten, wo nicht?',
    out: 'Zwei bis drei konkrete Hebel für euren Entwurf.',
    tag: 'Kern',
  },
  {
    n: '03',
    q: 'Schaffen wir das zu dritt?',
    what: 'Leistungsumfang gegen eure echte Kapazität – neben dem Tagesgeschäft und laufenden Verfahren.',
    out: 'Wochenplan und was ihr bewusst weglasst.',
    tag: 'Realität',
  },
];

function Check() {
  return (
    <section className="section check" id="check">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="02">Der KI-Check</Eyebrow>
          <h2 className="h2">Finden können viele. Entscheiden müsst ihr.</h2>
          <p className="lead">
            Wettbewerbsportale zeigen euch, was es gibt. Compilot sagt euch, wofür sich eure Zeit lohnt – mit Begründung, die
            ihr nachprüfen könnt. Die KI liest. Ihr entscheidet und entwerft.
          </p>
        </Reveal>
        <div className="qgrid">
          {QUESTIONS.map((x, i) => (
            <Reveal key={x.n} delay={i * 90} className={`q ${x.tag === 'Kern' ? 'q--core' : ''}`}>
              <div className="q__top">
                <span className="q__n mono">{x.n}</span>
                <span className="q__tag mono">{x.tag}</span>
              </div>
              <h3 className="q__q">{x.q}</h3>
              <p className="q__what">{x.what}</p>
              <div className="q__out">
                <Icon name="arrowRight" size={15} />
                {x.out}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="check__note">
          <Icon name="info" size={15} />
          Compilot entwirft nicht für euch. Es sorgt dafür, dass ihr an den richtigen Wettbewerben entwerft.
        </Reveal>
      </div>
    </section>
  );
}

// ── Case als Scroll-Story ────────────────────────────────────
function CaseSection() {
  const { evaluations } = useDemo();
  const ev = evaluations[CASE_ID];
  const s = CASE.strategy;
  const open = COMPETITIONS.filter((c) => c.deadlineInDays >= 0);
  const blocked = open.filter((c) => c.eligibility.status === 'fail').length;
  const weeks = [
    ['Wo 1', 'Auslobung, Ort, Konzeptidee', 20],
    ['Wo 2', 'Städtebau & Schulhof festlegen', 30],
    ['Wo 3–4', 'Lernhaus, Grundrisse, Holzraster', 70],
    ['Wo 5', 'Schnitte, Kennwerte, eine Perspektive', 40],
    ['Wo 6–7', 'Pläne, Modell, Abgabe', 40],
  ];
  const steps = [
    {
      k: 'Das Büro',
      t: `${OFFICE.name}, ${OFFICE.location}. Drei Leute, zwei Wettbewerbspreise, noch keine gebaute Schule.`,
      body: (
        <div className="cs-office">
          {OFFICE.team.map((m) => (
            <div key={m.id}>
              <strong>{m.name}</strong>
              <span>{m.role}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      k: 'Finden',
      t: `${open.length} offene Verfahren in der Region. ${blocked} scheiden sofort aus – Mindestumsatz und Personal, die ein 3-Personen-Büro nie erreicht.`,
      body: (
        <div className="cs-funnel mono">
          <span style={{ width: '100%' }}>{open.length} Verfahren</span>
          <span style={{ width: '70%' }}>{open.length - blocked} teilnahmefähig</span>
          <span style={{ width: '32%' }} className="is-hot">3 empfohlen</span>
        </div>
      ),
    },
    {
      k: 'Dürfen wir?',
      t: 'Offener Realisierungswettbewerb nach RPW. Kammereintragung genügt – keine Referenz, kein Mindestumsatz. Die Stadt wünscht ausdrücklich Beiträge junger Büros.',
      body: <div className="cs-ok"><Icon name="check" size={18} stroke={2.4} /> Teilnahme ohne Hürde möglich</div>,
    },
    {
      k: 'Können wir gewinnen?',
      t: s.jury,
      body: (
        <div className="cs-strat">
          {s.criteria.map(([l, w]) => (
            <div key={l} className="cs-crit">
              <span>{l}</span>
              <span className="cs-crit__bar">
                <span style={{ width: `${w * 3}%` }} />
              </span>
              <span className="mono">{w} %</span>
            </div>
          ))}
          <ul className="cs-levers">
            {s.levers.map(([h, d]) => (
              <li key={h}>
                <strong>{h}</strong>
                {d}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      k: 'Schaffen wir das zu dritt?',
      t: `Rund ${CASE.effortHours} Stunden in 7 Wochen – bei 45 Wettbewerbsstunden pro Woche im Team machbar, wenn ihr bewusst weglasst.`,
      body: (
        <div className="cs-weeks">
          {weeks.map(([w, d, h]) => (
            <div key={w} className="cs-week">
              <span className="mono">{w}</span>
              <span className="cs-week__bar" style={{ width: `${h * 1.2}%` }} />
              <span>{d}</span>
            </div>
          ))}
          <p className="cs-skip">Weglassen: {s.notToDo.join(' · ')}</p>
        </div>
      ),
    },
    {
      k: 'Entscheidung',
      t: 'Machen – mit Fokus auf Schulhof und Holzraster.',
      body: (
        <div className="cs-math">
          <FitRing value={ev.fit} level={ev.level} size={64} stroke={5} />
          {Object.values(CASE_MATH).map((m) => (
            <div key={m.label} className="cs-math__item">
              <strong>{m.value}</strong>
              <span>
                {m.label}
                {!m.verified && ' · Quelle wird geprüft'}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="section case" id="case">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="03">Der Case</Eyebrow>
          <h2 className="h2">Drei Leute. Eine Schule. Sieben Wochen.</h2>
          <p className="lead">
            Ein fiktives, aber realistisch gerechnetes Beispiel: Wie ein kleines Büro mit Compilot einen Wettbewerb findet,
            prüft und sich bewusst dafür entscheidet.
          </p>
        </Reveal>
        <ol className="cs">
          {steps.map((st, i) => (
            <Reveal as="li" key={st.k} className="cs__step">
              <div className="cs__rail">
                <span className="cs__num mono">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="cs__text">
                <h3>{st.k}</h3>
                <p>{st.t}</p>
              </div>
              <div className="cs__visual">{st.body}</div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="case__cta">
          <p>Den Case Schritt für Schritt selbst durchklicken – mit allen Daten.</p>
          <Button icon="arrowRight" onClick={() => navigate('/demo/case')}>
            Interaktiven Case starten
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

// ── Abgrenzung ───────────────────────────────────────────────
const ROWS = [
  ['Wettbewerbe und Vergaben finden', 'y', 'y', 'y'],
  ['Fristen und Unterlagen verwalten', 'p', 'y', 'y'],
  ['Eignung mit Büroprofil abgleichen', 'p', 'y', 'y'],
  ['Gewinnhebel aus Kriterien und Preisgericht', 'n', 'n', 'y'],
  ['Aufwandsplan für Teams mit 1–5 Personen', 'n', 'n', 'y'],
  ['Gebaut für Architekturwettbewerbe kleiner Büros', 'p', 'n', 'y'],
];
const MARK = { y: ['check', 'ja'], p: ['minus', 'teilweise'], n: ['x', 'nein'] };

function Vergleich() {
  return (
    <section className="section vergleich" id="vergleich">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow num="04">Abgrenzung</Eyebrow>
          <h2 className="h2">Andere sortieren Ausschreibungen. Compilot sortiert eure Zeit.</h2>
        </Reveal>
        <Reveal className="vtable">
          <div className="vtable__row vtable__head mono">
            <span />
            <span>Wettbewerbs­portale</span>
            <span>Vergabe­software</span>
            <span className="is-us">Compilot</span>
          </div>
          {ROWS.map(([l, ...vals]) => (
            <div key={l} className="vtable__row">
              <span>{l}</span>
              {vals.map((v, i) => (
                <span key={i} className={`vmark vmark--${v} ${i === 2 ? 'is-us' : ''}`} title={MARK[v][1]}>
                  <Icon name={MARK[v][0]} size={15} stroke={2.2} />
                </span>
              ))}
            </div>
          ))}
        </Reveal>
        <p className="vtable__note">Eigene Einschätzung anhand öffentlicher Produktbeschreibungen, Stand November 2026.</p>
      </div>
    </section>
  );
}

// ── Ermutigung + Pilot ───────────────────────────────────────
function Pilot() {
  return (
    <section className="cta" id="pilot">
      <div className="container cta__grid">
        <Reveal className="cta__copy">
          <Eyebrow>Pilotbüros gesucht</Eyebrow>
          <h2 className="h2">Ihr seid kleiner. Nicht chancenloser.</h2>
          <p>
            Ihr habt euch bisher nicht an Wettbewerbe getraut, weil die Zeit fehlt? Genau dafür bauen wir Compilot. Wir suchen
            Büros mit 1–5 Personen, die das Werkzeug in der Pilotphase mit uns schärfen.
          </p>
          <ul className="cta__list">
            <li>
              <Icon name="check" size={16} stroke={2} /> KI-Check für eure nächsten Wettbewerbe
            </li>
            <li>
              <Icon name="check" size={16} stroke={2} /> Persönliche Einrichtung eures Büroprofils
            </li>
            <li>
              <Icon name="check" size={16} stroke={2} /> Kostenfrei in der Pilotphase
            </li>
          </ul>
          <p className="cta__model">Geplant (Hypothese): Abo pro Büro, gestaffelt nach Teamgröße – wird mit Pilotbüros validiert.</p>
        </Reveal>
        <Reveal delay={120} className="cta__form">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>Wettbewerbe prüfen. Gezielt teilnehmen.</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/demo/case">Case</Link>
          <Link to="/demo">Tool</Link>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </nav>
        <p className="footer__note">
          Prototyp · Büro, Wettbewerbe und Bewertungen in Case und Tool sind fiktive Beispieldaten. © {new Date().getFullYear()}{' '}
          Compilot
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
        <Kosten />
        <Check />
        <CaseSection />
        <Vergleich />
        <Pilot />
      </main>
      <Footer />
    </div>
  );
}
