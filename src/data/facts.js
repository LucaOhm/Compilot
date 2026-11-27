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

// Beispielrechnung für den Case (fiktiver Wettbewerb)
// Honorar: HOAI 2021 § 35, Honorarzone III, Basissatz, 5,0 Mio € anrechenbare Kosten
// = 478.207 € für LPH 1–9; LPH 2–9 = 98 % ≈ 468.600 €. Orientierungswert, netto.
export const CASE_MATH = {
  prizeMoney: { value: '72.000 €', label: 'Wettbewerbssumme laut Auslobung (fiktiv) – RPW: mind. Honorar der Vorplanung', verified: true },
  fee: {
    value: 'ca. 470.000 €',
    label: 'Honorar-Orientierung LPH 2–9 nach HOAI 2021 (Zone III, Basissatz, 5 Mio € anrechenbare Kosten, netto)',
    verified: true,
  },
  effort: { value: 'ca. 200 Std.', label: 'Aufwand für die Wettbewerbsarbeit (Schätzung für 3 Personen)', verified: true },
  reference: {
    value: 'Erste Schule',
    label: 'als gebaute Referenz – öffnet künftig Verfahren mit Referenzhürde',
    verified: true,
  },
};
