// Rahmen der Demo: beim ersten Besuch der spielerische Einstieg, danach Seitenleiste + Ansichten.
import Icon from '../components/Icon.jsx';
import { Avatar, Logo } from '../components/ui.jsx';
import { Link, navigate, parseQuery, scrollToId } from '../lib/router.jsx';
import { useDemo } from '../lib/store.jsx';
import { LangToggle } from '../lib/i18n.jsx';
import { OFFICE } from '../data/office.js';
import { COMPETITIONS } from '../data/competitions.js';
import Overview from './Overview.jsx';
import Competitions from './Competitions.jsx';
import CompetitionDetail from './CompetitionDetail.jsx';
import Profile from './Profile.jsx';
import Intro from './Intro.jsx';
import { ME, useD } from './checks.jsx';

export default function DemoApp({ path }) {
  const d = useD();
  const { statuses, introDone, reset } = useDemo();

  if (!introDone || path.startsWith('/demo/start')) return <Intro />;

  const toReview = COMPETITIONS.filter((c) => c.deadlineInDays >= 0 && statuses[c.id] === 'neu').length;
  const nav = [
    { to: '/demo', label: d.nav.dash, icon: 'grid', match: (p) => p === '/demo' || p === '/demo/' },
    { to: '/demo/wettbewerbe', label: d.nav.list, icon: 'list', match: (p) => p.startsWith('/demo/wettbewerbe'), badge: toReview },
    { to: '/demo/profil', label: d.nav.profile, icon: 'building', match: (p) => p.startsWith('/demo/profil') },
  ];

  let page;
  const query = parseQuery(path);
  const detail = path.match(/^\/demo\/wettbewerbe\/([^/?]+)/);
  if (detail) page = <CompetitionDetail key={detail[1]} id={decodeURIComponent(detail[1])} />;
  else if (path.startsWith('/demo/wettbewerbe')) page = <Competitions key={path} query={query} />;
  else if (path.startsWith('/demo/profil')) page = <Profile />;
  else page = <Overview />;

  const onReset = () => {
    if (window.confirm(d.resetConfirm)) {
      reset();
      navigate('/demo');
    }
  };

  return (
    <div className="demo">
      <div className="demo__banner">
        <span className="demo__bannertext">
          <Icon name="info" size={14} />
          <span>{d.banner}</span>
        </span>
        <Link to="/" className="demo__bannerlink" onClick={() => setTimeout(() => scrollToId('pilot'), 120)}>
          {d.bannerCta} <Icon name="arrowRight" size={13} />
        </Link>
      </div>

      <aside className="side">
        <Link to="/" className="side__logo" title={d.toSite}>
          <Logo />
        </Link>
        <div className="side__office">
          <span className="side__mark">{OFFICE.initials}</span>
          <div>
            <div className="side__officename">{OFFICE.name}</div>
            <div className="side__officemeta">
              {OFFICE.location} · {d.profile.people(OFFICE.employees)}
            </div>
          </div>
        </div>
        <nav className="side__nav">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`side__item ${n.match(path) ? 'is-active' : ''}`}>
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
              {n.badge ? <span className="side__badge mono">{n.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="side__foot">
          <div className="side__me">
            <Avatar name={ME.name} size={28} />
            <span>
              <small>{d.loggedIn}</small>
              {ME.name}
            </span>
          </div>
          <LangToggle />
          <Link to="/demo/start" className="side__small">
            <Icon name="play" size={14} /> {d.replay}
          </Link>
          <button className="side__small" onClick={onReset}>
            <Icon name="refresh" size={14} /> {d.reset}
          </button>
          <Link to="/" className="side__small">
            <Icon name="arrowLeft" size={14} /> {d.toSite}
          </Link>
        </div>
      </aside>

      <main className="demo__main">{page}</main>
    </div>
  );
}
