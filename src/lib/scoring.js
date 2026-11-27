// ─────────────────────────────────────────────────────────────
//  Compilot Demo-Bewertungslogik
//  Regelbasiert und vollständig nachvollziehbar – keine KI.
//  Jedes Kriterium ergibt einen Wert von 0–100. Der Fit-Score
//  ist der gewichtete Mittelwert dieser Werte.
// ─────────────────────────────────────────────────────────────
import { CRITERIA, RECOMMENDATION_THRESHOLDS } from '../data/criteria.js';
import { PROCEDURES } from '../data/procedures.js';
import { PROJECT_TYPES, REGIONS } from '../data/office.js';

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const round = (v) => Math.round(v);
const fmtInt = (n) => n.toLocaleString('de-DE');

const MET_VALUE = { ja: 1, teilweise: 0.5, nein: 0 };

export function normalizeWeights(weights) {
  const total = CRITERIA.reduce((s, c) => s + (Number(weights[c.key]) || 0), 0);
  const out = {};
  CRITERIA.forEach((c) => {
    out[c.key] = total > 0 ? (Number(weights[c.key]) || 0) / total : 1 / CRITERIA.length;
  });
  return out;
}

/** Freie Wettbewerbskapazität (h/Woche) abhängig von laufenden Bearbeitungen. */
export function freeCapacity(office, statuses, excludeId) {
  const active = Object.entries(statuses).filter(([id, s]) => s === 'vorbereitung' && id !== excludeId).length;
  const free = office.capacity.hoursPerWeek - active * office.capacity.perActiveCompetition;
  return { active, free: Math.max(10, free), base: office.capacity.hoursPerWeek };
}

/** Referenzen des Büros nach Übereinstimmung mit dem Wettbewerb sortiert. */
export function matchReferences(comp, office) {
  return office.references
    .map((ref) => {
      const shared = ref.tags.filter((t) => comp.tags.includes(t));
      let score = shared.length / Math.max(3, Math.min(comp.tags.length, 5));
      if (ref.type === comp.type) score += 0.25;
      return { ref, shared, match: clamp(round(score * 100)) };
    })
    .sort((a, b) => b.match - a.match);
}

function sizeFit(budget, range) {
  if (budget == null) return 70;
  if (budget >= range.min && budget <= range.max) return 100;
  if (budget < range.min) return clamp(100 - (range.min - budget) * 15);
  return clamp(100 - ((budget - range.max) / range.max) * 110);
}

/** Bewertet einen Wettbewerb für ein Büro. */
export function evaluate(comp, office, weights, statuses = {}) {
  const proc = PROCEDURES[comp.procedure];
  const refs = matchReferences(comp, office);
  const refFit = refs.length ? clamp(round(refs[0].match * 0.75 + (refs[1]?.match || 0) * 0.25)) : 0;
  const competence = office.competences[comp.type] ?? 30;
  const size = sizeFit(comp.budget, office.sizeRange);

  // 1 · Fachlicher Fit
  const fachlich = round(competence * 0.5 + refFit * 0.35 + size * 0.15);

  // 2 · Aufwand & Kapazität
  const cap = freeCapacity(office, statuses, comp.id);
  const daysToWork = Math.max(7, comp.deadlineInDays + proc.workDays);
  const availableHours = (daysToWork / 7) * cap.free;
  const capacityRatio = comp.effortHours / availableHours;
  const capacityScore = clamp(100 - (capacityRatio - 0.3) * 85);
  const absoluteScore = clamp(100 - (comp.effortHours - 100) / 7);
  const aufwand = round(capacityScore * 0.6 + absoluteScore * 0.4);

  // 3 · Wirtschaftlichkeit
  const expectedPrize = comp.prizeMoney / Math.max(4, comp.participants);
  const directReturn = comp.fee + expectedPrize;
  const costOfWork = comp.effortHours * 70; // interner Stundensatz der Demo
  const compensation = clamp((directReturn / costOfWork) * 160);
  const followUpScore = comp.followUp * 100 * (comp.budget == null ? 0.6 : size >= 60 ? 1 : 0.7);
  const wirtschaft = round(compensation * 0.4 + followUpScore * 0.6);

  // 4 · Gewinnchance (illustrativer Chancen-Index)
  const reqs = comp.refRequirements || [];
  const reqScore = reqs.length
    ? round((reqs.reduce((s, r) => s + MET_VALUE[r.met], 0) / reqs.length) * 100)
    : 85;
  const competitionScore = clamp(round(105 - 19 * Math.log(Math.max(1, comp.participants))));
  const chanceFactors = [
    { key: 'erfahrung', label: 'Erfahrung mit der Verfahrensart', value: office.procedureExperience[comp.procedure] ?? 50, weight: 0.2 },
    { key: 'referenz', label: 'Referenzfit', value: refFit, weight: 0.3 },
    { key: 'anforderungen', label: 'Erfüllung der Anforderungen', value: reqScore, weight: 0.2 },
    { key: 'konkurrenz', label: 'Konkurrenzintensität (geschätzt)', value: competitionScore, weight: 0.2, hint: `ca. ${comp.participants} Teilnehmende` },
    { key: 'kapazitaet', label: 'Verfügbare Kapazität', value: round(capacityScore), weight: 0.1 },
  ];
  let chance = round(chanceFactors.reduce((s, f) => s + f.value * f.weight, 0));
  if (comp.eligibility?.status === 'fail') chance = Math.min(chance, 10);

  // 5 · Strategischer Wert
  const goals = office.strategicGoals.filter((g) => comp.tags.includes(g) || comp.type === g);
  const goalScore = goals.length >= 2 ? 100 : goals.length === 1 ? 65 : 20;
  const strategie = round(goalScore * 0.55 + comp.visibility * 100 * 0.45);

  // 6 · Region
  const region = office.regions[comp.region] ?? 20;

  const criteria = { fachlich, wirtschaft, chance, aufwand, strategie, region };
  const w = normalizeWeights(weights);
  let fit = round(CRITERIA.reduce((s, c) => s + criteria[c.key] * w[c.key], 0));

  // K.-o.-Kriterium: Teilnahmevoraussetzung nicht erfüllt
  const knockout = comp.eligibility?.status === 'fail';
  if (knockout) fit = Math.min(fit, 35);

  const level = knockout
    ? 'gering'
    : fit >= RECOMMENDATION_THRESHOLDS.sehrInteressant
      ? 'hoch'
      : fit >= RECOMMENDATION_THRESHOLDS.interessant
        ? 'mittel'
        : 'gering';

  const ctx = {
    comp, office, proc, refs, refFit, competence, size, cap, daysToWork, availableHours,
    capacityRatio, goals, criteria, knockout, directReturn,
  };

  return {
    fit,
    level,
    criteria,
    weights: w,
    knockout,
    chance: { index: chance, label: chanceLabel(chance), factors: chanceFactors, range: chanceRange(comp, chance, knockout) },
    capacity: { ...cap, availableHours: round(availableHours), share: round(capacityRatio * 100), weeks: round(daysToWork / 7) },
    references: refs,
    goals,
    reasons: buildReasons(ctx),
    pros: buildPros(ctx),
    cons: buildCons(ctx),
  };
}

/**
 * Illustrative Chancen-Spanne in %. Rechenweg:
 *   Basisrate = Preisränge ÷ erwartete Teilnehmende
 *   Profil-Faktor = 0,6 + Chancen-Index/100 × 1,2  (0,6 – 1,8)
 *   Spanne = Basisrate × Profil-Faktor ± 15 %
 * Keine Statistik, sondern eine nachvollziehbare Schätzung.
 */
export function chanceRange(comp, index, knockout) {
  const slots = comp.procedure === 'vgv' || comp.procedure === 'mehrfach' ? 1 : comp.procedure === 'einladung' ? 2 : 4;
  const base = Math.min(1, slots / Math.max(1, comp.participants));
  const factor = 0.6 + (index / 100) * 1.2;
  const mid = knockout ? 0 : Math.min(0.6, base * factor);
  return {
    slots,
    base: Math.round(base * 1000) / 10,
    factor: Math.round(factor * 100) / 100,
    low: Math.round(mid * 0.85 * 100),
    high: Math.round(mid * 1.15 * 100),
    slotLabel: slots === 1 ? 'Auftrag' : slots === 2 ? 'Preise' : 'Preise und Anerkennungen',
  };
}

export function chanceLabel(v) {
  if (v >= 62) return 'gut';
  if (v >= 45) return 'mittel';
  return 'gering';
}

export const LEVELS = {
  hoch: { label: 'Hoher Fit', tone: 'accent', action: 'Hohe Passung zu Ihrem Profil' },
  mittel: { label: 'Mittlerer Fit', tone: 'warn', action: 'Passung mit Einschränkungen' },
  gering: { label: 'Geringer Fit', tone: 'muted', action: 'Geringe Passung zu Ihrem Profil' },
};

// ── Begründungstexte aus den konkreten Daten ─────────────────

function buildReasons(ctx) {
  const { comp, office, refs, criteria, capacityRatio, knockout, goals } = ctx;
  const typeLabel = PROJECT_TYPES[comp.type];
  const out = [];

  if (knockout) {
    out.push(`Eine zwingende Teilnahmevoraussetzung wird nicht erfüllt: ${comp.eligibility.note}`);
  }

  const best = refs[0];
  if (criteria.fachlich >= 80 && best?.match >= 50) {
    out.push(
      `Der Wettbewerb passt sehr gut zu Ihren Referenzen im Bereich ${typeLabel} – besonders zu „${best.ref.title}“ (${best.ref.year}).`
    );
  } else if (criteria.fachlich >= 62) {
    out.push(
      `Fachlich passt die Aufgabe zu Ihrem Profil${best?.match >= 40 ? `; als Referenz eignet sich vor allem „${best.ref.title}“` : ''}.`
    );
  } else {
    out.push(`Fachlich liegt die Aufgabe (${typeLabel}) außerhalb Ihrer Schwerpunkte.`);
  }

  if (comp.budget != null && comp.budget > office.sizeRange.max) {
    out.push(
      `Mit rund ${fmtInt(comp.budget)} Mio € Baukosten liegt das Projekt deutlich über Ihrer bevorzugten Größe (bis ${office.sizeRange.max} Mio €).`
    );
  }

  if (criteria.region >= 90) out.push(`Die Region entspricht Ihren Präferenzen – ${comp.city} ist gut vom Büro aus erreichbar.`);
  else if (criteria.region <= 40)
    out.push(`${comp.city} liegt außerhalb Ihrer bevorzugten Regionen; Ortstermine und Kolloquien bedeuten zusätzlichen Reiseaufwand.`);

  const pct = round(capacityRatio * 100);
  if (criteria.aufwand < 45) {
    const share =
      pct >= 100
        ? `übersteigt Ihre freie Wettbewerbskapazität bis zur Abgabe (ca. ${fmtInt(round(ctx.availableHours))} Std.)`
        : `bindet etwa ${pct} % Ihrer freien Wettbewerbskapazität bis zur Abgabe`;
    out.push(
      `Der geschätzte Aufwand ist mit rund ${fmtInt(comp.effortHours)} Stunden hoch und ${share}. Eine Teilnahme ist nur sinnvoll, wenn Sie diese Kapazität freihalten können.`
    );
  } else if (criteria.aufwand >= 72) {
    out.push(`Der Aufwand ist mit rund ${fmtInt(comp.effortHours)} Stunden überschaubar und gut mit Ihrer aktuellen Auslastung vereinbar.`);
  }

  if (comp.participants >= 40) {
    out.push(`Es ist mit einem großen Teilnehmerfeld zu rechnen (geschätzt ca. ${comp.participants} Arbeiten), entsprechend schwerer ist eine Platzierung.`);
  } else if (comp.participants <= 8) {
    out.push(`Das Teilnehmerfeld ist klein (ca. ${comp.participants} Büros) – das erhöht die Chancen deutlich.`);
  }

  if (comp.fee > 0) out.push(`Jedes teilnehmende Büro erhält ein Bearbeitungshonorar von ${fmtInt(comp.fee)} €.`);
  if (comp.followUp >= 0.9 && !knockout) out.push(`${comp.followUpText} – wirtschaftlich attraktiv.`);

  if (goals.length && !knockout) {
    out.push(`Strategisch zahlt das Projekt auf Ihr Ziel „${office.strategicGoalLabels[goals[0]]}“ ein.`);
  }

  if (comp.eligibility?.status === 'risk') out.push(`Achtung: ${comp.eligibility.note}`);

  return out.slice(0, 5);
}

function buildPros(ctx) {
  const { comp, criteria, refs, goals, office } = ctx;
  const pros = [];
  if (criteria.fachlich >= 75) pros.push(`Starker Referenzfit (${refs[0].ref.title})`);
  if (criteria.region >= 90) pros.push(`Wunschregion ${REGIONS[comp.region]}`);
  if (comp.participants <= 8) pros.push(`Kleines Teilnehmerfeld (ca. ${comp.participants})`);
  if (comp.fee > 0) pros.push(`Bearbeitungshonorar ${fmtInt(comp.fee)} €`);
  if (comp.followUp >= 0.9) pros.push('Folgeauftrag verbindlich in Aussicht');
  if (criteria.aufwand >= 72) pros.push('Überschaubarer Aufwand');
  goals.forEach((g) => pros.push(office.strategicGoalLabels[g]));
  return pros.slice(0, 4);
}

function buildCons(ctx) {
  const { comp, criteria, office } = ctx;
  const cons = [];
  if (comp.eligibility?.status === 'fail') cons.push('Teilnahmevoraussetzung nicht erfüllt');
  if (comp.eligibility?.status === 'risk') cons.push('Eignung nur teilweise gegeben');
  if (criteria.aufwand < 45) cons.push(`Hoher Aufwand (ca. ${fmtInt(comp.effortHours)} Std.)`);
  if (comp.participants >= 40) cons.push(`Großes Teilnehmerfeld (ca. ${comp.participants})`);
  if (criteria.region <= 55) cons.push('Außerhalb der Kernregion');
  if (comp.budget != null && comp.budget > office.sizeRange.max) cons.push('Projekt größer als bevorzugt');
  if (criteria.fachlich < 60) cons.push('Geringe fachliche Passung');
  if (comp.deadlineInDays >= 0 && comp.deadlineInDays <= 7) cons.push('Sehr kurze Frist');
  return cons.slice(0, 4);
}

/** Bewertet alle Wettbewerbe auf einmal. */
export function evaluateAll(competitions, office, weights, statuses) {
  const map = {};
  competitions.forEach((c) => {
    map[c.id] = evaluate(c, office, weights, statuses);
  });
  return map;
}
