# Compilot – Technische Kurzdokumentation

## Tech Stack
- React 19 + Vite. Keine weiteren Laufzeit-Abhängigkeiten außer lokal gebündelten Schriften (Inter Tight, IBM Plex Mono).
- Hash-Routing (`#/demo/...`), damit die Seite auf GitHub Pages ohne Server-Konfiguration läuft (`src/lib/router.jsx`).
- Sprache DE/EN über `src/lib/i18n.jsx` (`useT(dict)`), Auswahl im LocalStorage (`compilot-lang`).
- Demo-Zustand (Gewichtungen, Status, Stimmen, Einstieg gesehen) liegt im LocalStorage (`src/lib/store.jsx`, Schlüssel `compilot-demo-v3`). „Demo zurücksetzen“ stellt den Ausgangszustand wieder her.
- Deployment: `.github/workflows/deploy.yml` baut bei jedem Push auf `main` und veröffentlicht auf GitHub Pages.

## Projektstruktur
```
src/
  i18n/        landing.js, demo.js – alle Texte DE/EN
  data/        office, competitions (inkl. CASE_ID + strategy), criteria, procedures, facts (Zahlen + Quellen), site
  lib/         scoring.js (Bewertung), analysis.js (simulierte Unterlagen), store, router, i18n, format
  components/  UI-Bausteine (FitRing, Button, Reveal …), Icons, Drafting (Zeichenelemente, Büro-Illustration)
  landing/     Landing Page + Kontaktformular
  demo/        Intro (geführter Erst-Check), Overview (Dashboard), Competitions, CompetitionDetail, Profile,
               checks.jsx (Prüfschritte Eignung / Chance / Matrix / Team-Votum, gemeinsam genutzt)
  pages/       Impressum/Datenschutz (Platzhalter)
  styles/      base.css (Farben/Tokens), landing.css, demo.css
```

## Ablauf der Demo
1. Beim ersten Besuch: Benachrichtigung → Eignung → Chance → Matrix → Team-Votum (je mit „denkt nach“-Effekt). Wiederholbar über „Ersten Check wiederholen“.
2. Danach Dashboard (Jahresbilanz, neue Treffer, Pipeline), Wettbewerbsliste, Detailprüfung, Profil & Team.
3. Compilot gibt keine Empfehlung. Die Stimmen der Kolleg:innen werden aus Fit und Kapazität abgeleitet; Ihre Stimme setzt den Status.

## Bewertungslogik (`src/lib/scoring.js`)
Sechs Kriterien, je 0–100: Fachlicher Fit, Wirtschaftlichkeit, Gewinnchance, Aufwand & Kapazität, Strategischer Wert, Region.
- **Fit-Score** = gewichteter Mittelwert (Gewichtungen im Profil, automatisch auf 100 % normalisiert).
- **K.-o.:** Eignung `fail` deckelt den Score bei 35.
- **Stufen:** ab 74 „Hoher Fit“, ab 60 „Mittlerer Fit“.
- **Chance in %** (`chanceRange`): Basisrate = Preisränge ÷ erwartete Teilnehmende; × Profilfaktor (0,6 + Index/100 × 1,2); Spanne ± 15 %. Illustrativ, keine Prognose.
- **Matrix:** Einsatz = Stunden × 70 €/Std., Anteil freier Kapazität; Ertrag = 1. Preis (40 % der Preissumme), Bearbeitungshonorar, Honorar-Orientierung Folgeauftrag (Näherung 7,8 % der Baukosten).

## Zahlen und Quellen (`src/data/facts.js`)
- 78 % der Büros haben weniger als 5 Personen: BAK Facts & Figures 2026 (Destatis 2023).
- 11 % der Büros mit 2–4 Personen nahmen 2023 an einem Wettbewerb teil, ab 10 Personen 57 %: BAK Strukturbefragung 2024.
- 240 Std. / 11.000 € Wettbewerbsaufwand pro Jahr (Median, Büros mit 2–4 Personen): BAK Strukturbefragung 2024.
- 19 % der Inhaber:innen kleiner Büros nutzen KI, ab 50 Personen 67 %: BAK Berufspolitische Befragung 2025.
- Fallbeispiel-Honorar: HOAI 2021 § 35, Zone III, Basissatz, 5 Mio € anrechenbar = 478.207 € (LPH 1–9), LPH 2–9 ≈ 470.000 € netto.
- Jahres-Hochrechnung: 1 − (1 − Chance je Teilnahme)^Teilnahmen; 2,5 Teilnahmen ohne Compilot laut BAK 2024, übrige Werte sind markierte Annahmen.

## Offene Punkte
- Echte Kontaktadresse oder Formular-Dienst in `src/data/site.js` eintragen.
- Impressum und Datenschutz ausfüllen.
- Gründerteam-Angaben unter „Warum wir“ bei Bedarf ergänzen (`src/i18n/landing.js`, Abschnitt `about`).
- Unterlagen-Analyse, Datenpunkte und Team-Stimmen sind simuliert. Für die Pilotphase braucht es eine echte Dokumentenverarbeitung.
