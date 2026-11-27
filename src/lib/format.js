// Formatierungs- und Datumshilfen. Alle Demo-Termine werden relativ
// zum heutigen Datum berechnet, damit die Demo nie veraltet wirkt.

const DAY = 24 * 60 * 60 * 1000;

export function today() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

export function dateIn(days) {
  return new Date(today().getTime() + days * DAY);
}

export function formatDate(days, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  return dateIn(days).toLocaleDateString('de-DE', opts);
}

export function formatDateShort(days) {
  return dateIn(days).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

export function relativeDays(days) {
  if (days === 0) return 'heute';
  if (days === 1) return 'morgen';
  if (days === -1) return 'gestern';
  if (days < 0) return `vor ${Math.abs(days)} Tagen`;
  if (days < 14) return `in ${days} Tagen`;
  return `in ${Math.round(days / 7)} Wochen`;
}

export function deadlineTone(days) {
  if (days < 0) return 'past';
  if (days <= 10) return 'urgent';
  if (days <= 21) return 'soon';
  return 'normal';
}

export function euro(n) {
  if (n == null) return '–';
  return n.toLocaleString('de-DE') + ' €';
}

export function mio(n) {
  if (n == null) return 'n. a.';
  return n.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' Mio €';
}

export function num(n) {
  return n == null ? '–' : n.toLocaleString('de-DE');
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

/** Kleine, deterministische Pseudo-Zufallszahl aus einem Text (für Seitenzahlen etc.). */
export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
