// Zentraler Demo-Zustand: Gewichtungen, Status, Vorbereitung.
// Wird im Browser (LocalStorage) gespeichert, damit Änderungen
// während einer Präsentation erhalten bleiben.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COMPETITIONS } from '../data/competitions.js';
import { OFFICE } from '../data/office.js';
import { DEFAULT_WEIGHTS } from '../data/criteria.js';
import { evaluateAll } from './scoring.js';

const KEY = 'compilot-demo-v3';

const initialState = () => ({
  weights: { ...DEFAULT_WEIGHTS },
  statuses: Object.fromEntries(COMPETITIONS.map((c) => [c.id, c.status])),
  prep: {
    'kita-erding': { refs: ['r2'], checks: { 'req-0': true, 'doc-0': true }, team: ['ms'] },
  },
  analyzed: { 'kita-erding': true },
  introDone: false,
  votes: {}, // { [wettbewerbId]: 'vorbereitung' | 'gemerkt' | 'verworfen' } – Ihre Stimme
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw);
    const base = initialState();
    return {
      ...base,
      ...parsed,
      weights: { ...base.weights, ...parsed.weights },
      statuses: { ...base.statuses, ...parsed.statuses },
    };
  } catch {
    return initialState();
  }
}

const Ctx = createContext(null);

export function DemoProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* Speichern nicht möglich (z. B. privater Modus) – Demo läuft trotzdem. */
    }
  }, [state]);

  const evaluations = useMemo(
    () => evaluateAll(COMPETITIONS, OFFICE, state.weights, state.statuses),
    [state.weights, state.statuses]
  );

  const setWeight = useCallback((key, value) => setState((s) => ({ ...s, weights: { ...s.weights, [key]: value } })), []);
  const setWeights = useCallback((weights) => setState((s) => ({ ...s, weights: { ...weights } })), []);
  const setStatus = useCallback((id, status) => setState((s) => ({ ...s, statuses: { ...s.statuses, [id]: status } })), []);
  const markAnalyzed = useCallback((id) => setState((s) => ({ ...s, analyzed: { ...s.analyzed, [id]: true } })), []);
  const setIntroDone = useCallback((v = true) => setState((s) => ({ ...s, introDone: v })), []);
  // Ihre Stimme = Entscheidung des Büros: setzt zugleich den Status in der Pipeline
  const decide = useCallback(
    (id, choice) =>
      setState((s) => ({
        ...s,
        votes: { ...s.votes, [id]: choice },
        statuses: { ...s.statuses, [id]: choice || 'neu' },
        analyzed: { ...s.analyzed, [id]: true },
      })),
    []
  );
  const updatePrep = useCallback(
    (id, fn) =>
      setState((s) => {
        const cur = s.prep[id] || { refs: [], checks: {}, team: [] };
        return { ...s, prep: { ...s.prep, [id]: fn(cur) } };
      }),
    []
  );
  const reset = useCallback(() => setState(initialState()), []);

  const value = {
    ...state,
    evaluations,
    setWeight,
    setWeights,
    setStatus,
    markAnalyzed,
    setIntroDone,
    decide,
    updatePrep,
    reset,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
