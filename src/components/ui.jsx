// Wiederverwendbare UI-Bausteine für Landing Page und Demo.
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { LEVELS } from '../lib/scoring.js';
import { STATUSES } from '../data/competitions.js';
import { deadlineTone, formatDate, relativeDays } from '../lib/format.js';

export function Logo({ light = false, compact = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" className="logo__bg" />
        <path d="M42 22.5A13 13 0 1 0 42 41.5" fill="none" className="logo__arc" strokeWidth="5.5" strokeLinecap="square" />
        <rect x="38.5" y="29" width="7" height="7" className="logo__dot" />
      </svg>
      {!compact && <span className="logo__word">Compilot</span>}
    </span>
  );
}

export function FitRing({ value, size = 56, stroke = 5, level, label = true, animate = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) return setShown(value);
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value, animate]);
  const tone = level ? LEVELS[level].tone : value >= 74 ? 'accent' : value >= 60 ? 'warn' : 'muted';
  return (
    <span className={`ring ring--${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring__track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring__value"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && (
        <span className="ring__num" style={{ fontSize: size * 0.32 }}>
          {value}
        </span>
      )}
    </span>
  );
}

export function Meter({ value, tone, thin = false }) {
  const t = tone || (value >= 70 ? 'accent' : value >= 50 ? 'warn' : 'risk');
  return (
    <span className={`meter meter--${t} ${thin ? 'meter--thin' : ''}`}>
      <span className="meter__fill" style={{ width: `${Math.max(2, value)}%` }} />
    </span>
  );
}

export function LevelPill({ level, small = false }) {
  const l = LEVELS[level];
  return <span className={`pill pill--${l.tone} ${small ? 'pill--sm' : ''}`}>{l.label}</span>;
}

export function StatusPill({ status }) {
  const s = STATUSES[status] || STATUSES.neu;
  return (
    <span className={`status status--${s.tone}`}>
      <span className="status__dot" />
      {s.label}
    </span>
  );
}

export function DeadlineChip({ days, label, withDate = true }) {
  const tone = deadlineTone(days);
  return (
    <span className={`deadline deadline--${tone}`}>
      <Icon name="clock" size={14} />
      <span>
        {label && <span className="deadline__label">{label} </span>}
        {withDate && <strong>{formatDate(days)}</strong>}
        <span className="deadline__rel"> · {relativeDays(days)}</span>
      </span>
    </span>
  );
}

export function Tag({ children, tone = 'neutral', icon }) {
  return (
    <span className={`tag tag--${tone}`}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', icon, iconLeft, as = 'button', ...rest }) {
  const Comp = as;
  return (
    <Comp className={`btn btn--${variant} btn--${size}`} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={size === 'sm' ? 15 : 17} />}
      <span>{children}</span>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
    </Comp>
  );
}

export function Eyebrow({ children, num }) {
  return (
    <div className="eyebrow">
      {num && <span className="eyebrow__num">{num}</span>}
      <span>{children}</span>
    </div>
  );
}

/** Blendet Inhalte beim Scrollen sanft ein. */
export function Reveal({ children, delay = 0, as = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setVisible(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = as;
  return (
    <Comp ref={ref} className={`reveal ${visible ? 'reveal--in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Comp>
  );
}

export function DemoMark({ children = 'Beispieldaten' }) {
  return (
    <span className="demomark" title="Fiktive Demo-Daten – keine realen Ausschreibungen oder Prognosen">
      <Icon name="info" size={12} />
      {children}
    </span>
  );
}

export function Avatar({ name, size = 28 }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} title={name}>
      {initials}
    </span>
  );
}
