// Minimaler Hash-Router (#/demo, #/demo/wettbewerbe/…).
// Hash-Routing funktioniert auf GitHub Pages ohne Server-Konfiguration.
import { useEffect, useState } from 'react';

function currentPath() {
  const h = window.location.hash.replace(/^#/, '');
  return h.startsWith('/') ? h : '/';
}

export function useRoute() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const on = () => setPath(currentPath());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return path;
}

export function navigate(to) {
  if (currentPath() === to) return;
  window.location.hash = to;
}

export function Link({ to, children, className, onClick, ...rest }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Scrollt auf der Landing Page zu einer Sektion (ohne den Hash zu verändern). */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/** Liest Parameter aus dem Hash, z. B. #/demo/wettbewerbe?fit=60 */
export function parseQuery(path) {
  const q = path.split('?')[1] || '';
  return Object.fromEntries(new URLSearchParams(q));
}
