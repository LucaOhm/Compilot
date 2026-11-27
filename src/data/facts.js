// ─────────────────────────────────────────────────────────────
//  Zahlen & Fakten für die Landing Page
//  Nur belegte Zahlen mit Quelle. Recherche-Stand: 27.11.2026.
//  verified: false → wird auf der Seite als „Quelle wird geprüft“ markiert.
// ─────────────────────────────────────────────────────────────

export const FOMO_FACTS = [
  {
    key: 'kleineBueros',
    value: '78 %',
    label: 'der knapp 35.000 Architekturbüros in Deutschland haben weniger als 5 tätige Personen.',
    source: 'BAK, Facts & Figures 2026 (Destatis, Berichtsjahr 2023)',
    url: 'https://bak.de/wp-content/uploads/2026/06/BAK_Die_Vermessung_der_Branche_200426.pdf',
    verified: true,
  },
  {
    key: 'wettbewerbsteilnahme',
    value: '11 %',
    label: 'der Büros mit 2–4 Personen haben 2023 an einem Wettbewerb teilgenommen. Ab 10 Personen: 57 %.',
    source: 'BAK Strukturbefragung 2024, Selbstständige',
    url: 'https://bak.de/wp-content/uploads/2024/12/2024_BAK_Strukturbefragung_Bericht_Selbststaendige.pdf',
    verified: true,
  },
  {
    key: 'kiNutzung',
    value: '19 %',
    label: 'der Inhaber:innen kleiner Büros nutzen KI im Arbeitsalltag. In Büros ab 50 Personen: 67 %.',
    source: 'BAK, Berufspolitische Befragung 2025 – Einsatz von KI',
    url: 'https://bak.de/wp-content/uploads/2025/11/2025_BAK_BpB_8_KI_Bericht.pdf',
    verified: true,
  },
];

// Hürden in VgV-/EU-Verfahren (BAK Strukturbefragung 2024)
export const HURDLES = {
  referenzen: '62 %',
  umsatz: '34 %',
  source: 'BAK Strukturbefragung 2024',
};

// Aufwand pro Jahr, Büros mit 2–4 Personen (Median, BAK Strukturbefragung 2024)
export const YEARLY_EFFORT = { hours: '240 Std.', cost: '11.000 €' };

// Kernthese: Kleine Büros gewinnen fast so oft wie der Durchschnitt – nehmen aber selten teil.
export const POTENTIAL = {
  successSmall: '32 %', // Erfolgsquote Büros 2–4 Personen
  successAll: '33 %', // Erfolgsquote alle teilnehmenden Büros
  participationSmall: 11, // % der Büros mit 2–4 Personen, die 2023 teilgenommen haben
  participationLarge: 57, // % der Büros ab 10 Personen
  aiSmall: 19,
  aiLarge: 67,
  source: 'BAK Strukturbefragung 2024 (Berichtsjahr 2023) · BAK Berufspolitische Befragung 2025',
};

// Case: Erweiterung Grundschule (fiktiv), offenes Verfahren, ca. 45 Arbeiten
// Honorar: HOAI 2021 § 35, Zone III, Basissatz, 5,0 Mio € anrechenbare Kosten = 478.207 € (LPH 1–9),
// LPH 2–9 = 98 % ≈ 470.000 €, netto, Orientierungswert.
// Preisgeld: Wettbewerbssumme 72.000 € (fiktiv), 1. Preis 40 % nach RPW-Beispielverteilung.
export const CASE_MATH = {
  fee: { value: 'ca. 470.000 €', label: 'Honorar-Orientierung Folgeauftrag LPH 2–9 (HOAI 2021, Zone III, 5 Mio € anrechenbar, netto)' },
  prize: { value: 'ca. 29.000 €', label: '1. Preis (40 % der Wettbewerbssumme von 72.000 €, RPW-Beispielverteilung)' },
};

// Jahres-Hochrechnung (fiktives 3-Personen-Büro). Rechenweg:
//   Chance auf mind. einen Preis/Jahr = 1 − (1 − Chance je Teilnahme) ^ Teilnahmen
// Quellen/Typen: participations.before = BAK 2024 (Ø 2,48 bei 2–4 Personen),
// chance.before = Rechnung (4 Preisränge ÷ ca. 45 Arbeiten), alle übrigen Werte = Annahmen (werden im Pilot gemessen).
export const YEAR = {
  rate: 70, // interner Stundensatz €/Std. (Annahme)
  before: { screened: 10, hoursPer: 8, participations: 2.5, chance: 0.09 },
  after: { screened: 40, hoursPer: 1, participations: 5, chance: 0.13 },
};
export const atLeastOne = (p, n) => 1 - Math.pow(1 - p, n);

// Einführungspreise (Stand Pilot, nicht validiert), netto pro Monat
export const PRICING = [
  { key: 'solo', price: 39, users: 1, featured: false },
  { key: 'buero', price: 89, users: 5, featured: true },
  { key: 'team', price: 169, users: 12, featured: false },
];
