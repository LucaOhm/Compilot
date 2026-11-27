# Compilot – Technische Kurzdokumentation

## Tech Stack
- React 19 + Vite. Keine weiteren Laufzeit-Abhängigkeiten.
- Hash-Routing (`#/demo/...`), damit die Seite auf GitHub Pages ohne Server-Konfiguration funktioniert (`src/lib/router.jsx`).
- Schriften lokal gebündelt (Inter Tight, IBM Plex Mono). Es werden keine externen Dienste geladen.
- Demo-Zustand (Gewichtungen, Status, Vorbereitung) liegt im LocalStorage des Browsers (`src/lib/store.jsx`, Schlüssel `compilot-demo-v2`). „Demo zurücksetzen“ in der Seitenleiste stellt den Ausgangszustand wieder her.

## Projektstruktur
```
src/
  data/        Demo-Daten: office, competitions (inkl. CASE_ID + strategy), criteria, procedures, facts, site
  lib/         scoring.js (Bewertung), analysis.js (simulierte Unterlagen-Analyse), store, router, format
  components/  UI-Bausteine (FitRing, Meter, Pills, Button, Reveal …) und Icons
  landing/     Landing Page + Kontaktformular
  demo/        CaseStory (geführter Case), Overview, Competitions, CompetitionDetail, Profile
  pages/       Impressum/Datenschutz (Platzhalter)
  styles/      base.css (Farben/Tokens), landing.css, demo.css
```

## Bewertungslogik (`src/lib/scoring.js`)
Sechs Kriterien, je 0–100:

| Kriterium | Berechnung |
|---|---|
| Fachlicher Fit | Kompetenz je Projekttyp, Referenzabgleich über Tags, Projektgröße |
| Wirtschaftlichkeit | Bearbeitungshonorar und anteiliges Preisgeld im Verhältnis zum Aufwand, plus Verbindlichkeit des Folgeauftrags |
| Gewinnchance | Illustrativer Index aus Erfahrung mit der Verfahrensart, Referenzfit, erfüllten Anforderungen, Teilnehmerzahl und Kapazität |
| Aufwand & Kapazität | Aufwand gegen freie Stunden bis zur Abgabe (40/45 Std./Woche abzüglich laufender Bearbeitungen) |
| Strategischer Wert | Passung zu den strategischen Zielen des Büros, Sichtbarkeit des Projekts |
| Region | Regionale Präferenz |

- Der **Fit-Score** ist der gewichtete Mittelwert. Die Gewichtungen werden automatisch auf 100 % normalisiert.
- **K.-o.:** Eignung `fail` deckelt den Score bei 35.
- **Schwellen:** ab 74 „Sehr interessant“, ab 60 „Interessant“.
- **Begründungstexte** entstehen aus den konkreten Daten von Wettbewerb und Büro.

## Zahlen und Quellen (`src/data/facts.js`)
- 78 % der Büros haben weniger als 5 Personen: BAK Facts & Figures 2026 (Destatis 2023).
- 11 % der Büros mit 2–4 Personen nahmen 2023 an einem Wettbewerb teil, ab 10 Personen 57 %: BAK Strukturbefragung 2024.
- 19 % der Inhaber:innen kleiner Büros nutzen KI, ab 50 Personen 67 %: BAK Berufspolitische Befragung 2025.
- VgV-Hürden: 62 % fehlende Referenzen, 34 % Umsatz: BAK Strukturbefragung 2024.
- Case-Honorar: HOAI 2021 § 35, Zone III, Basissatz, 5 Mio € anrechenbare Kosten = 478.207 € (LPH 1–9). Für LPH 2–9 (98 %) ergeben sich ca. 470.000 €. Das ist ein Orientierungswert, netto.
- RPW 2013 § 7 Abs. 2: Wettbewerbssumme in der Regel mindestens das Honorar der Vorplanung.

## Offene Punkte
- Echte Kontaktadresse oder Formular-Dienst in `src/data/site.js` eintragen.
- Impressum und Datenschutz ausfüllen, bevor die Seite veröffentlicht wird.
- Gewinnstrategie, Unterlagen-Analyse und Aufwandsplan sind simuliert. Für die Pilotphase braucht es eine echte Dokumentenverarbeitung.
- Ein Browsertest der neuen Version (v2) steht noch aus.
