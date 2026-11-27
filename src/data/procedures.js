// ─────────────────────────────────────────────────────────────
//  Verfahrensarten
//  Jede Verfahrensart bringt Standard-Teilnahmebedingungen,
//  benötigte Unterlagen und typische Termine mit. Einzelne
//  Wettbewerbe ergänzen diese Angaben in competitions.js.
//  Termine sind in Tagen relativ zur angezeigten Frist angegeben
//  (negativ = davor, positiv = danach). Die Frist ist jeweils der
//  Zeitpunkt, an dem das Büro über die Teilnahme entscheiden muss.
// ─────────────────────────────────────────────────────────────

export const PROCEDURES = {
  offen: {
    label: 'Offener Wettbewerb',
    short: 'Offen',
    deadlineLabel: 'Abgabe',
    workDays: 0, // Tage von der Frist bis zur Abgabe der eigentlichen Arbeit
    rules: 'RPW 2013, anonym, einstufig',
    description:
      'Alle teilnahmeberechtigten Büros können ohne Vorauswahl teilnehmen. Hohe Teilnehmerzahl, kein Bearbeitungshonorar.',
    eligibility: [
      'Berufsbezeichnung „Architekt/in“ nach Landesrecht (Kammereintragung)',
      'Teilnahme als Einzelperson, Partnerschaft oder Arbeitsgemeinschaft möglich',
      'Anonymität bis zum Abschluss des Preisgerichts',
    ],
    documents: [
      'Präsentationspläne (Anzahl und Format laut Auslobung)',
      'Erläuterungsbericht',
      'Flächen- und Kubaturnachweis (Formblatt)',
      'Verfassererklärung im verschlossenen Umschlag',
      'Einsatzmodell',
    ],
    milestones: [
      { offset: -38, label: 'Rückfragen schriftlich bis' },
      { offset: -30, label: 'Rückfragenkolloquium' },
      { offset: 0, label: 'Abgabe Pläne & Unterlagen', main: true },
      { offset: 7, label: 'Abgabe Modell' },
      { offset: 42, label: 'Preisgericht' },
    ],
  },
  nichtoffen: {
    label: 'Nichtoffener Wettbewerb',
    short: 'Nichtoffen',
    deadlineLabel: 'Bewerbungsschluss',
    workDays: 84, // Tage von der Frist bis zur Abgabe der eigentlichen Arbeit
    rules: 'RPW 2013 mit vorgeschaltetem Bewerbungsverfahren',
    description:
      'Bewerbung mit Referenzen, danach Auswahl bzw. Losverfahren. Begrenzte Teilnehmerzahl, teils mit Bearbeitungshonorar.',
    eligibility: [
      'Kammereintragung als Architekt/in',
      'Nachweis vergleichbarer Referenzprojekte (Bewerbungsphase)',
      'Eigenerklärungen zu Ausschlussgründen nach §§ 123, 124 GWB',
    ],
    documents: [
      'Bewerbungsbogen mit Eigenerklärungen',
      'Referenzblätter (je Projekt 1 Seite DIN A3)',
      'Nachweis Berufshaftpflichtversicherung',
      'Wettbewerbspläne und Erläuterungsbericht (2. Phase)',
      'Flächennachweis (Formblatt)',
    ],
    milestones: [
      { offset: 0, label: 'Bewerbungsschluss Teilnahmeantrag', main: true },
      { offset: 14, label: 'Bekanntgabe Teilnehmerfeld' },
      { offset: 35, label: 'Rückfragenkolloquium' },
      { offset: 84, label: 'Abgabe Wettbewerbsarbeit' },
      { offset: 120, label: 'Preisgericht' },
    ],
  },
  vgv: {
    label: 'VgV-Verhandlungsverfahren',
    short: 'VgV',
    deadlineLabel: 'Teilnahmeantrag',
    workDays: 56, // Tage von der Frist bis zur Abgabe der eigentlichen Arbeit
    rules: 'Verhandlungsverfahren mit Teilnahmewettbewerb, § 17 VgV',
    description:
      'Teilnahmeantrag mit Eignungsnachweisen, anschließend Angebot, Lösungsskizze und Verhandlungsgespräch.',
    eligibility: [
      'Kammereintragung als Architekt/in',
      'Mindestanforderungen an Umsatz, Personal und Referenzen laut Bekanntmachung',
      'Eigenerklärungen zu Ausschlussgründen nach §§ 123, 124 GWB',
    ],
    documents: [
      'Teilnahmeantrag (Formblätter der Vergabestelle)',
      'Eignungsnachweise: Umsatz, Personal, Referenzen',
      'Nachweis Berufshaftpflichtversicherung',
      'Honorarangebot (2. Stufe)',
      'Lösungsskizze und Präsentation (2. Stufe)',
    ],
    milestones: [
      { offset: 0, label: 'Abgabe Teilnahmeantrag', main: true },
      { offset: 21, label: 'Auswahl der Bieter' },
      { offset: 56, label: 'Abgabe Angebot & Lösungsskizze' },
      { offset: 70, label: 'Verhandlungsgespräche' },
    ],
  },
  einladung: {
    label: 'Eingeladener Wettbewerb',
    short: 'Einladung',
    deadlineLabel: 'Teilnahmezusage',
    workDays: 70, // Tage von der Frist bis zur Abgabe der eigentlichen Arbeit
    rules: 'Einladungswettbewerb nach RPW, nicht anonym in der Vorphase',
    description:
      'Der Auslober lädt ausgewählte Büros direkt ein. Kleines Teilnehmerfeld, in der Regel mit Bearbeitungshonorar.',
    eligibility: [
      'Persönliche Einladung durch den Auslober',
      'Kammereintragung als Architekt/in',
      'Verbindliche Teilnahmezusage bis zum genannten Termin',
    ],
    documents: [
      'Teilnahmezusage',
      'Präsentationspläne',
      'Erläuterungsbericht',
      'Flächen- und Kostenkennwerte (Formblatt)',
      'Arbeitsmodell',
    ],
    milestones: [
      { offset: 0, label: 'Teilnahmezusage bis', main: true },
      { offset: 12, label: 'Auftaktgespräch vor Ort' },
      { offset: 70, label: 'Abgabe Wettbewerbsarbeit' },
      { offset: 91, label: 'Präsentation & Jurysitzung' },
    ],
  },
  mehrfach: {
    label: 'Mehrfachbeauftragung',
    short: 'Mehrfach',
    deadlineLabel: 'Interessensbekundung',
    workDays: 130, // Tage von der Frist bis zur Abgabe der eigentlichen Arbeit
    rules: 'Kooperatives Verfahren mit Zwischenpräsentation',
    description:
      'Mehrere Büros werden parallel und vergütet beauftragt. Dialog mit Auslober und Bürgerschaft, nicht anonym.',
    eligibility: [
      'Auswahl durch den Auftraggeber anhand von Referenzen',
      'Kammereintragung als Architekt/in oder Stadtplaner/in',
      'Bereitschaft zur Teilnahme an Zwischen- und Abschlusspräsentation',
    ],
    documents: [
      'Interessensbekundung mit Büroprofil',
      'Referenzen Städtebau / Quartiersentwicklung',
      'Zwischenpräsentation (Konzept)',
      'Abschlusspräsentation mit Plänen und Kennwerten',
    ],
    milestones: [
      { offset: 0, label: 'Interessensbekundung bis', main: true },
      { offset: 21, label: 'Auswahl der Büros' },
      { offset: 45, label: 'Auftaktworkshop mit Bürgerschaft' },
      { offset: 90, label: 'Zwischenpräsentation' },
      { offset: 130, label: 'Abschlusspräsentation' },
    ],
  },
};
