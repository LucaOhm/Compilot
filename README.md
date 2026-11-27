# Compilot – MVP (lokale Testversion)

**Compilot** ist ein KI-Check für Architekturwettbewerbe, gebaut für Büros mit 1–5 Personen.
Statt nur Wettbewerbe zu finden und zu verwalten, beantwortet Compilot drei Fragen:

1. **Dürfen wir?** – Eignung, Formalien, Referenz- und Umsatzhürden
2. **Können wir gewinnen?** – Bewertungskriterien, Preisgericht, konkrete Gewinnhebel
3. **Schaffen wir das zu dritt?** – Aufwand gegen echte Kapazität, Wochenplan

Dieser Prototyp ist eine **Sales- und Investoren-Demo**. Er läuft nur lokal und ist **nicht veröffentlicht**.

## Was enthalten ist

| Bereich | Adresse (lokal) | Inhalt |
|---|---|---|
| Landing Page | `#/` | Warum jetzt (belegte Zahlen), KI-Check, Case, Abgrenzung, Pilotformular |
| Geführter Case | `#/demo/case` | „Atelier Kranich“ (3 Personen) prüft eine Grundschul-Erweiterung in 5 Schritten |
| Tool | `#/demo` | Überblick, 21 fiktive Wettbewerbe mit Filtern, Detailansicht, Büroprofil mit Gewichtungen |

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) (Version 20 oder neuer).

```bash
npm install      # einmalig: Bausteine installieren
npm run dev      # startet die Seite unter http://localhost:5173
```

Mit `Strg + C` im Terminal wieder beenden. Die Adresse funktioniert nur auf dem eigenen Rechner.

## Texte und Daten ändern

| Was | Datei |
|---|---|
| Texte der Startseite | `src/landing/Landing.jsx` |
| Zahlen mit Quellen (FOMO, Case-Rechnung) | `src/data/facts.js` |
| Beispielbüro | `src/data/office.js` |
| Wettbewerbe (inkl. Case) | `src/data/competitions.js` |
| Kriterien und Gewichtungen | `src/data/criteria.js` |
| Kontakt-E-Mail / Formular-Dienst | `src/data/site.js` |

## Was simuliert ist

- Alle Wettbewerbe, das Büro und die Gewinnstrategie sind **fiktiv**.
- Die „KI-Analyse“ läuft nicht wirklich: Sie wird aus vordefinierten Daten zusammengesetzt (`src/lib/analysis.js`).
- Der Fit-Score ist eine nachvollziehbare, regelbasierte Berechnung (`src/lib/scoring.js`), keine Prognose.
- Das Kontaktformular sendet nichts selbst. Es öffnet nur einen E-Mail-Entwurf an die Platzhalter-Adresse aus `site.js`.

Die Zahlen auf der Landing Page sind recherchiert und mit Quelle belegt (BAK, HOAI 2021, RPW 2013), siehe `src/data/facts.js`.

## Veröffentlichen (erst auf ausdrücklichen Wunsch)

Eine Vorlage für GitHub Pages liegt in `.github/workflows/deploy.yml`. Sie startet **nie automatisch**, sondern nur, wenn sie in GitHub unter *Actions → Deploy to GitHub Pages → Run workflow* manuell ausgelöst wird. Zusätzlich muss unter *Settings → Pages → Source* die Option **„GitHub Actions“** gewählt sein. Hinweis: GitHub Pages für private Repositories erfordert einen kostenpflichtigen GitHub-Plan. Vorher Impressum, Datenschutz und Kontaktadresse ergänzen.

Weitere Details: [docs/DOKUMENTATION.md](docs/DOKUMENTATION.md)
