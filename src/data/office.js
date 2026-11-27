// ─────────────────────────────────────────────────────────────
//  Büroprofil des fiktiven Demo-Büros
//  Alle Angaben sind erfunden und dienen nur der Demonstration.
//  Werte von 0–100 beschreiben, wie stark das Büro in einem
//  Bereich ist bzw. wie gern es dort arbeitet.
// ─────────────────────────────────────────────────────────────

export const PROJECT_TYPES = {
  wohnen: 'Wohnungsbau',
  bildung: 'Schulbau',
  kita: 'Kita',
  sanierung: 'Sanierung & Transformation',
  kultur: 'Kultur',
  verwaltung: 'Verwaltung',
  staedtebau: 'Stadtentwicklung',
  sport: 'Sport & Freizeit',
};

export const REGIONS = {
  muenchen: 'München',
  oberbayern: 'Oberbayern',
  bayern: 'Bayern (übrige)',
  bw: 'Baden-Württemberg',
  deutschland: 'Übriges Deutschland',
};

export const OFFICE = {
  name: 'Atelier Kranich',
  initials: 'AK',
  tagline: 'Kleines Büro für Bildungsbau, Holzbau und Weiterbauen im Bestand.',
  location: 'Augsburg',
  founded: 2022,
  employees: 3,
  team: [
    { id: 'jk', name: 'Johanna Kranich', role: 'Gründerin, Architektin', roleEn: 'Founder, architect' },
    { id: 'ms', name: 'Malik Sommer', role: 'Gründer, Architekt', roleEn: 'Founder, architect' },
    { id: 'lp', name: 'Lea Pfister', role: 'Architektin', roleEn: 'Architect' },
  ],
  // Eignungsdaten, die bei VgV-Verfahren geprüft werden (fiktiv)
  revenue: 0.32, // Mio € Jahresumsatz
  insurance: '1,5 Mio € Personen- / 0,5 Mio € Sachschäden',

  // Kompetenz je Projekttyp (0–100)
  competences: {
    bildung: 85,
    kita: 82,
    sanierung: 80,
    wohnen: 70,
    kultur: 55,
    verwaltung: 45,
    staedtebau: 40,
    sport: 30,
  },

  focus: ['Holzbau', 'Lernlandschaften', 'Weiterbauen im Bestand', 'Partizipation'],

  strategicGoals: ['bildung', 'holzbau', 'oeffentlich', 'kreislauf'],
  strategicGoalLabels: {
    bildung: 'Erste gebaute Schule als Referenz',
    holzbau: 'Holzbau-Kompetenz sichtbar machen',
    oeffentlich: 'Erster öffentlicher Auftrag',
    kreislauf: 'Zirkuläres Bauen als Profil',
  },

  // Regionale Präferenz (0–100)
  regions: {
    bayern: 100, // Schwaben & übriges Bayern
    muenchen: 85,
    oberbayern: 85,
    bw: 65,
    deutschland: 20,
  },

  sizeRange: { min: 2, max: 15 },

  procedureExperience: {
    offen: 70,
    nichtoffen: 35,
    vgv: 20,
    einladung: 45,
    mehrfach: 20,
  },
  experience: {
    competitions: 6,
    prizes: 2,
    publicClients: 1,
  },

  // Kapazität für Wettbewerbe (Stunden pro Woche, gesamtes Team)
  capacity: {
    hoursPerWeek: 45,
    perActiveCompetition: 10,
  },

  references: [
    {
      id: 'r1',
      title: 'Grundschule Lechfeld – 2. Preis',
      city: 'Schwabmünchen',
      year: 2024,
      type: 'bildung',
      budget: null,
      facts: 'Offener Wettbewerb · Lernhauskonzept · Holzbau',
      tags: ['bildung', 'schule', 'holzbau', 'wettbewerb', 'oeffentlich'],
    },
    {
      id: 'r2',
      title: 'Umbau Pfarrhaus zum Kinderhaus',
      city: 'Friedberg',
      year: 2023,
      type: 'kita',
      budget: 1.9,
      facts: '2 Gruppen · Bestand · LPH 1–8',
      tags: ['kita', 'sanierung', 'bestand', 'umnutzung'],
    },
    {
      id: 'r3',
      title: 'Aufstockung Mehrfamilienhaus in Holz',
      city: 'Augsburg',
      year: 2024,
      type: 'wohnen',
      budget: 1.2,
      facts: '6 WE · Holzrahmenbau · LPH 1–9',
      tags: ['wohnen', 'holzbau', 'bestand', 'aufstockung', 'nachhaltig'],
    },
    {
      id: 'r4',
      title: 'Jugendtreff am Wertachufer – Anerkennung',
      city: 'Augsburg',
      year: 2023,
      type: 'kultur',
      budget: null,
      facts: 'Offener Wettbewerb · Re-Use-Konzept',
      tags: ['kultur', 'oeffentlich', 'kreislauf', 'wettbewerb'],
    },
  ],
};
