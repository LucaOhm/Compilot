# Compilot

## 🔗 Link zum Weiterleiten

```
https://lucaohm.github.io/Compilot/
```

👉 **[Seite direkt öffnen](https://lucaohm.github.io/Compilot/)** · Direkt zur Demo: [lucaohm.github.io/Compilot/#/demo](https://lucaohm.github.io/Compilot/#/demo)

---

**Wettbewerbsprüfung für kleine Architekturbüros – klickbares MVP / Mockup.**

**Das Problem:** Kleine Büros verlieren selten am Entwurf, sondern an der falschen Wahl: Sie treten zu selten an oder in Verfahren, die nicht zu ihnen passen.

**Die Lösung:** Compilot prüft jede Auslobung in vier Schritten und gibt dem Team eine klare Entscheidungsgrundlage. Entscheiden tut das Büro.

1. **Sofort informiert:** Ein passender Wettbewerb erscheint.
2. **Eignung:** Darf das Büro teilnehmen?
3. **Chance & Matrix:** Wie realistisch ist ein Preis, was steht Einsatz gegen Ertrag?
4. **Team entscheidet:** Alle stimmen auf derselben Grundlage ab.

**Was man auf der Seite sieht:**
- Landing Page: Problem, Lösung, Fallbeispiel, Preise, Warum wir
- Interaktive Demo: Ein kurzer geführter Check, danach Dashboard, Wettbewerbe, Detailprüfung, Profil & Team
- Oben rechts zwischen Deutsch und Englisch umschaltbar

> Hinweis: Büro, Wettbewerbe und Analysen sind fiktiv, die KI-Prüfung ist simuliert. Marktzahlen stammen aus belegten Quellen (BAK, HOAI 2021, RPW 2013, siehe `src/data/facts.js`). Es werden keine Daten gesendet oder gespeichert, außer lokal im eigenen Browser.

---

## Für Entwickler:innen

```bash
npm install
npm run dev      # http://localhost:5173
```

| Was ändern | Datei |
|---|---|
| Texte Landing Page (DE/EN) | `src/i18n/landing.js` |
| Texte Demo (DE/EN) | `src/i18n/demo.js` |
| Zahlen, Fallbeispiel, Preise | `src/data/facts.js` |
| Beispielbüro / Wettbewerbe | `src/data/office.js`, `src/data/competitions.js` |
| Kontaktadresse | `src/data/site.js` |

**Veröffentlichung:** Jeder Push auf `main` aktualisiert die Seite automatisch (GitHub Actions → GitHub Pages). Einmalig nötig: Repository auf *Public* stellen und unter *Settings → Pages → Source* „GitHub Actions“ wählen.

Technische Details: [docs/DOKUMENTATION.md](docs/DOKUMENTATION.md)
