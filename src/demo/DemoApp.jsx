// Rahmen der interaktiven Demo: Seitenleiste, Demo-Hinweis, Routing.
import Icon from '../components/Icon.jsx';
import { Avatar, Logo } from '../components/ui.jsx';
import { Link, navigate, parseQuery, scrollToId } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { OFFICE } from '../data/office.js';
import { COMPETITIONS } from '../data/competitions.js';
import Overview from './Overview.jsx';
import Competitions from './Competitions.jsx';
import CompetitionDetail from './CompetitionDetail.jsx';
import Profile from './Profile.jsx';
import CaseStory from './CaseStory.jsx';

const NAV = [
  { to: '/demo/case', label: 'Case', icon: 'route', match: (p) => p.startsWith('/demo/case') },
  { to: '/demo', label: 'Überblick', icon: 'grid', match: (p) => p === '/demo' || p === '/demo/' },
  { to: '/demo/wettbewerbe', label: 'Wettbewerbe', icon: 'list', match: (p) => p.startsWith('/demo/wettbewerbe') },
  { to: '/demo/profil', label: 'Büroprofil', icon: 'building', match: (p) => p.startsWith('/demo/profil') },
];

export default function DemoApp({ path }) {
  const { evaluations, statuses, reset } = useDemo();
  const relevant = COMPETITIONS.filter(
    (c) => evaluations[c.id].fit >= 60 && c.deadlineInDays >= 0 && statuses[c.id] !== 'verworfen'
  ).length;

  let page;
  const query = parseQuery(path);
  const detail = path.match(/^\/demo\/wettbewerbe\/([^/?]+)/);
  if (detail) page = <CompetitionDetail key={detail[1]} id={decodeURIComponent(detail[1])} query={query} />;
  else if (path.startsWith('/demo/wettbewerbe')) page = <Competitions key={path} query={query} />;
  else if (path.startsWith('/demo/profil')) page = <Profile />;
  else if (path.startsWith('/demo/case')) page = <CaseStory />;
  else page = <Overview />;

  const onReset = () => {
    if (window.confirm('Demo auf den Ausgangszustand zurücksetzen? Gewichtungen, Status und Vorbereitung werden zurückgesetzt.')) {
      reset();
      navigate('/demo');
    }
  };

  return (
    <div className="demo">
      <div className="demo__banner">
        <span className="demo__bannertext">
          <Icon name="info" size={14} />
          <strong>Demo-Umgebung.</strong>
          <span className="demo__bannerlong">
            Büro, Wettbewerbe und Unterlagen sind fiktiv. Bewertungen werden regelbasiert berechnet und sind illustrativ.
          </span>
        </span>
        <Link to="/" className="demo__bannerlink" onClick={() => setTimeout(() => scrollToId('kontakt'), 120)}>
          Pilotprojekt anfragen <Icon name="arrowRight" size={13} />
        </Link>
      </div>

      <aside className="side">
        <Link to="/" className="side__logo" title="Zur Website">
          <Logo />
        </Link>
        <div className="side__office">
          <Avatar name={OFFICE.name} size={34} />
          <div>
            <div className="side__officename">{OFFICE.name}</div>
            <div className="side__officemeta">
              {OFFICE.location} · {OFFICE.employees} Personen
            </div>
          </div>
        </div>
        <nav className="side__nav">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`side__item ${n.match(path) ? 'is-active' : ''}`}>
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
              {n.label === 'Wettbewerbe' && <span className="side__badge num">{relevant}</span>}
            </Link>
          ))}
        </nav>
        <div className="side__foot">
          <button className="side__small" onClick={onReset}>
            <Icon name="refresh" size={15} /> Demo zurücksetzen
          </button>
          <Link to="/" className="side__small">
            <Icon name="arrowLeft" size={15} /> Zur Website
          </Link>
        </div>
      </aside>

      <main className="demo__main">{page}</main>
    </div>
  );
}
