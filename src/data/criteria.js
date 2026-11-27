// ─────────────────────────────────────────────────────────────
//  Bewertungskriterien & Gewichtungen
//  Hier lassen sich Namen, Erklärungen und Standard-Gewichtungen
//  der sechs Kriterien anpassen. Gewichtungen werden automatisch
//  auf 100 % normalisiert – die Summe muss also nicht stimmen.
// ─────────────────────────────────────────────────────────────

export const CRITERIA = [
  {
    key: 'fachlich',
    label: 'Fachlicher Fit',
    short: 'Fachlich',
    description: 'Passung zu euren Kompetenzen, Referenzen und der bevorzugten Projektgröße.',
  },
  {
    key: 'wirtschaft',
    label: 'Wirtschaftlichkeit',
    short: 'Wirtschaft',
    description: 'Preisgeld, Bearbeitungshonorar und Folgeauftrag im Verhältnis zum Aufwand.',
  },
  {
    key: 'chance',
    label: 'Gewinnchance',
    short: 'Chance',
    description: 'Illustrativer Chancen-Index aus Erfahrung, Referenzfit, Anforderungen und Konkurrenz.',
  },
  {
    key: 'aufwand',
    label: 'Aufwand & Kapazität',
    short: 'Aufwand',
    description: 'Je geringer der Aufwand im Verhältnis zu eurer freien Kapazität, desto höher der Wert.',
  },
  {
    key: 'strategie',
    label: 'Strategischer Wert',
    short: 'Strategie',
    description: 'Referenzpotenzial, Sichtbarkeit und Passung zu euren strategischen Zielen.',
  },
  {
    key: 'region',
    label: 'Region',
    short: 'Region',
    description: 'Nähe zu euren bevorzugten Regionen – wichtig für Ortstermine und Projektbetreuung.',
  },
];

export const DEFAULT_WEIGHTS = {
  fachlich: 25,
  wirtschaft: 20,
  chance: 20,
  aufwand: 15,
  strategie: 10,
  region: 10,
};

// Voreinstellungen, die im Büroprofil per Klick gewählt werden können.
export const WEIGHT_PRESETS = [
  {
    key: 'ausgewogen',
    label: 'Ausgewogen',
    hint: 'Standardprofil des Büros',
    weights: DEFAULT_WEIGHTS,
  },
  {
    key: 'auslastung',
    label: 'Volle Auftragsbücher',
    hint: 'Wenig Kapazität – nur Lohnendes',
    weights: { fachlich: 20, wirtschaft: 20, chance: 20, aufwand: 30, strategie: 5, region: 5 },
  },
  {
    key: 'profil',
    label: 'Profil schärfen',
    hint: 'Sichtbarkeit & neue Felder',
    weights: { fachlich: 15, wirtschaft: 10, chance: 15, aufwand: 10, strategie: 40, region: 10 },
  },
  {
    key: 'wirtschaftlich',
    label: 'Wirtschaftlich',
    hint: 'Honorar & Folgeauftrag zuerst',
    weights: { fachlich: 20, wirtschaft: 40, chance: 20, aufwand: 10, strategie: 5, region: 5 },
  },
];

// Schwellenwerte für die Empfehlung
export const RECOMMENDATION_THRESHOLDS = {
  sehrInteressant: 74,
  interessant: 60,
};
