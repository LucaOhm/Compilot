// Rechtliche Platzhalterseiten. Vor einer öffentlichen Nutzung
// müssen hier vollständige, geprüfte Angaben ergänzt werden.
import { Logo } from '../components/ui.jsx';
import { Link } from '../lib/router.jsx';
import { Footer } from '../landing/Landing.jsx';
import Icon from '../components/Icon.jsx';

const CONTENT = {
  impressum: {
    title: 'Impressum',
    sections: [
      ['Angaben gemäß § 5 DDG', '[Name / Firma]\n[Straße und Hausnummer]\n[PLZ Ort]'],
      ['Kontakt', 'E-Mail: [E-Mail-Adresse]\nTelefon: [optional]'],
      ['Verantwortlich für den Inhalt', '[Name, Anschrift]'],
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    sections: [
      ['Verantwortliche Stelle', '[Name / Firma, Anschrift, E-Mail]'],
      [
        'Hosting',
        '[Angaben zum Hosting über GitHub Pages (GitHub Inc.) inkl. Verarbeitung von Server-Logdaten ergänzen]',
      ],
      [
        'Lokale Speicherung in der Demo',
        'Die Demo speichert Einstellungen (z. B. Gewichtungen) ausschließlich lokal im Browser (LocalStorage). Es werden dabei keine Daten an einen Server übertragen.',
      ],
      ['Kontaktanfragen', '[Beschreibung des Versandwegs, Rechtsgrundlage, Speicherdauer ergänzen]'],
      ['Rechte der Betroffenen', '[Auskunft, Berichtigung, Löschung, Widerspruch, Beschwerderecht ergänzen]'],
    ],
  },
};

export default function Legal({ kind }) {
  const c = CONTENT[kind];
  return (
    <div className="legal">
      <header className="nav nav--scrolled">
        <div className="container nav__inner">
          <Link to="/">
            <Logo />
          </Link>
          <div className="nav__cta" style={{ marginLeft: 'auto' }}>
            <Link to="/" className="btn btn--ghost btn--sm">
              <Icon name="arrowLeft" size={15} />
              <span>Zur Startseite</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="legal__main">
        <div className="container">
          <h1 className="h2 serif">{c.title}</h1>
          <div className="legal__box">
            <h3>Platzhalter – noch keine gültigen Angaben</h3>
            <p>
              Diese Seite ist ein Platzhalter des Prototyps. Vor einer öffentlichen Nutzung müssen vollständige und rechtlich
              geprüfte Angaben ergänzt werden. Die Texte in eckigen Klammern sind auszufüllen.
            </p>
          </div>
          <div className="legal__body">
            {c.sections.map(([h, t]) => (
              <div key={h}>
                <h2>{h}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
